import React, { useState, useEffect } from "react";
import styled, { keyframes } from "styled-components";
import { useSelector, useDispatch } from "react-redux";
import { firebase } from "../../utils/firebase";
import { CardsActions } from "../../actions/cardsActions";
import { popUpActions, PopUpDisplayType } from "../../reducer/popUpReducer";
import { OperationBtn, CloseBtn } from "../GlobalStyles/button";
import CardsWrapper from "./CardsWrapper";
import { RootState } from "../../reducer";
interface DialogWrapperProps {
  show: boolean;
}
const DialogWrapper = styled.div<DialogWrapperProps>`
  width: 500px;
  height: 500px;
  background: #fddba9;
  padding: 30px 15px;
  position: absolute;
  z-index: 101;
  top: 50vh;
  left: 50vw;
  transform: translate(-50%, -50%);
  display: ${(props) => (props.show ? "flex" : "none")};
  flex-direction: column;
`;
const DialogCloseBtn = styled(CloseBtn)`
  width: 20px;
  height: 20px;
  line-height: 20px;
  position: absolute;
  top: 10px;
  right: 10px;
  color: #fddba9;
  background-color: #6a5125;
  border: 1px solid #6a5125;
  transition: 0.25s;
  &:hover {
    color: #fddba9;
    background-color: #6a5125;
    border: 1px solid #6a5125;
    transform: scale(1.1);
    transition: 0.25s;
  }
`;
const BtnWrapper = styled.div`
  width: 100%;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 100px;
  background: none;
`;
const CardSelectBtn = styled(OperationBtn)`
  display: inline-block;
  width: 100px;
  letter-spacing: 1px;
  font-weight: 700;
  margin: 30px auto 0px;
  background: #fff;
  border: 1px solid #6a5125;
  color: #fff;
  background: #6a5125;
  &:hover {
    color: #fff;
    background-color: #5c836f;
    border: 1px solid #5c836f;
  }
`;
const ConfirmWrapper = styled.div`
  background: none;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: absolute;
  top: 250px;
  left: 250px;
  transform: translate(-50%, -50%);
`;
const ConfirmPanel = styled.div`
  background: none;
  text-align: center;
  padding: 8px;
`;
const scale = keyframes`
  from {
    transform: scale(0)
  }
  to {
    transform: scale(1)
  }
`;
const Alert = styled.div`
  position: absolute;
  top: -50px;
  left: 100px;
  width: 300px;
  height: 30px;
  font-size: 16px;
  line-height: 30px;
  text-align: center;
  color: #6a5125;
  background: #f5f0ec;
  border-radius: 15px;
  animation: 0.5s ${scale};
`;
const CardSelectDialog = () => {
  const dispatch = useDispatch();
  const cardList = useSelector((state: RootState) => state.cards);
  const userInfo = useSelector((state: RootState) => state.userInfo);
  const popUpDisplay: PopUpDisplayType = useSelector(
    (state: RootState) => state.popUp
  );
  const [confirm, setConfirm] = useState<string>();
  const [menuSelect, setMenuSelect] = useState<Record<string, boolean>>({});
  const [cardListDisplay, setCardListDisplay] = useState<boolean>(true);
  const [alertDisplay, setAlertDisplay] = useState<boolean>(false);
  const [btnWrapperDisplay, setBtnWrapperDisplay] = useState<boolean>(true);
  const selfId = userInfo.userId;
  const targetId = popUpDisplay.target.id;
  const targetName = popUpDisplay.target.name;
  function confirmTradeItems() {
    if (!targetId) return;
    if (Object.values(menuSelect).every((select) => select === false)) {
      setAlertDisplay(true);
      setTimeout(() => setAlertDisplay(false), 2000);
      return;
    }
    setCardListDisplay(false);
    let selected = cardList.filter((card) => menuSelect[card.cardId!] === true);
    let nameList = selected.map((card) => {
      return card.plantName;
    });
    let msg = `要將 ${nameList.join(" & ")} 送給新主人 ${targetName} 嗎?`;
    setConfirm(msg);
  }
  async function tradePlants() {
    if (!targetId || !selfId) return;
    let selected = cardList.filter((card) => menuSelect[card.cardId!] === true);
    let idList = selected.map((card) => {
      return card.cardId;
    });
    let nameList = selected.map((card) => {
      return card.plantName;
    });
    const newOwnerId = targetId;
    let promises = idList.map((cardId) => {
      return firebase.changePlantOwner(cardId!, newOwnerId);
    });
    await Promise.all(promises);
    dispatch({
      type: CardsActions.DELETE_PLANT_CARDS,
      payload: { cardIds: idList },
    });
    const usersTarget = [targetId!, selfId!];
    const data = {
      userId: selfId,
      msg: `已經將${nameList.join(" & ")}交給你了，要好好照顧喔！`,
    };
    await firebase.storeChatroomData(usersTarget, data);
    setConfirm("Send out Success!");
    setBtnWrapperDisplay(false);
    setTimeout(() => {
      dispatch({
        type: popUpActions.HIDE_ALL,
      });
      setCardListDisplay(true);
    }, 1000);
    return;
  }
  function resetCheck() {
    let menuCheck = {} as Record<string, boolean>;
    cardList.forEach((card) => {
      menuCheck[card.cardId!] = false;
    });
    setMenuSelect(menuCheck);
  }
  useEffect(() => {
    resetCheck();
  }, [cardList]);
  return (
    <>
      <DialogWrapper show={popUpDisplay.cardSelect}>
        {alertDisplay && <Alert>Please select at least one plant!</Alert>}
        <DialogCloseBtn
          onClick={() => {
            resetCheck();
            setCardListDisplay(true);
            dispatch({
              type: popUpActions.HIDE_ALL,
            });
          }}
        >
          &#215;
        </DialogCloseBtn>
        <CardsWrapper
          cardList={cardList}
          cardListDisplay={cardListDisplay}
          menuSelect={menuSelect}
          setMenuSelect={setMenuSelect}
        ></CardsWrapper>
        {!cardListDisplay && (
          <ConfirmWrapper>
            <ConfirmPanel>{confirm}</ConfirmPanel>
            {btnWrapperDisplay && (
              <BtnWrapper>
                <CardSelectBtn onClick={() => setCardListDisplay(true)}>
                  Back
                </CardSelectBtn>
                <CardSelectBtn onClick={tradePlants}>Next</CardSelectBtn>
              </BtnWrapper>
            )}
          </ConfirmWrapper>
        )}
        {cardListDisplay && (
          <CardSelectBtn onClick={confirmTradeItems}>Next</CardSelectBtn>
        )}
      </DialogWrapper>
    </>
  );
};

export default CardSelectDialog;
