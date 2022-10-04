import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../store/reducer";
import { PopUpType } from "../../store/types/popUpType";
import { CardsActions } from "../../store/actions/cardsActions";
import { PopUpActions } from "../../store/actions/popUpActions";
import { firebase } from "../../utils/firebase";
import { useAlertDispatcher } from "../../utils/useAlertDispatcher";
import CardsWrapper from "./CardsWrapper";
import { OperationBtn, CloseBtn } from "../GlobalStyles/button";
interface DialogWrapperProps {
  show: boolean;
}
const DialogWrapper = styled.div<DialogWrapperProps>`
  width: 500px;
  height: 500px;
  background: #fddba9;
  padding: 30px 15px;
  position: fixed;
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
  font-weight: 500;
  margin: 30px auto 0px;
  background: #fff;
  border: 1px solid #6a5125;
  color: #fff;
  background: #6a5125;
  transition: 0.25s;
  &:hover {
    color: #fff;
    transform: scale(1.1);
    transition: 0.25s;
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
  font-size: 16px;
  letter-spacing: 1px;
  line-height: 22px;
`;
const OverflowWrapper = styled.div`
  width: 100%;
  height: 360px;
  overflow-y: auto;
`;
const CardSelectDialog = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const alertDispatcher = useAlertDispatcher();
  const userInfo = useSelector((state: RootState) => state.userInfo);
  const cardList = useSelector((state: RootState) => state.cards);
  const popUp: PopUpType = useSelector((state: RootState) => state.popUp);
  const [confirm, setConfirm] = useState<string>();
  const [menuSelect, setMenuSelect] = useState<Record<string, boolean>>({});
  const [cardListDisplay, setCardListDisplay] = useState<boolean>(true);
  const [btnWrapperDisplay, setBtnWrapperDisplay] = useState<boolean>(true);
  const selfId = userInfo.userId;
  const targetId = popUp.target.id;
  const targetName = popUp.target.name;
  function confirmTradeItems() {
    if (!targetId) return;
    if (Object.values(menuSelect).every((select) => select === false)) {
      alertDispatcher("fail", "Choose at least one plant !");
      return;
    }
    setCardListDisplay(false);
    const selected = cardList.filter(
      (card) => menuSelect[card.cardId!] === true
    );
    const nameList = selected.map((card) => {
      return card.plantName;
    });
    const msg = `Are you sure to send ${nameList.join(
      " & "
    )} to ${targetName}?`;
    setBtnWrapperDisplay(true);
    setConfirm(msg);
  }

  async function tradePlants() {
    if (!targetId || !selfId) return;
    const selected = cardList.filter(
      (card) => menuSelect[card.cardId!] === true
    );
    const idList = selected.map((card) => {
      return card.cardId;
    });
    const nameList = selected.map((card) => {
      return card.plantName;
    });
    const newOwnerId = targetId;
    const promises = idList.map((cardId) => {
      return firebase.changePlantOwner(cardId!, newOwnerId);
    });
    await Promise.all(promises);
    if (id === selfId) {
      dispatch({
        type: CardsActions.DELETE_PLANT_CARDS,
        payload: { cardIds: idList },
      });
    }
    const usersTarget = [targetId!, selfId!];
    const data = {
      userId: selfId,
      msg: `${nameList.join(" & ")} has been sent to your space`,
    };
    await firebase.storeChatroomData(usersTarget, data);
    setBtnWrapperDisplay(false);
    setCardListDisplay(true);
    dispatch({
      type: PopUpActions.HIDE_ALL,
    });
    alertDispatcher("success", "Send out success !");
    return;
  }
  function resetCheck() {
    const menuCheck = {} as Record<string, boolean>;
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
      <DialogWrapper show={popUp.cardSelect}>
        <DialogCloseBtn
          onClick={() => {
            resetCheck();
            setCardListDisplay(true);
            dispatch({
              type: PopUpActions.HIDE_ALL,
            });
          }}
        >
          &#215;
        </DialogCloseBtn>
        <OverflowWrapper>
          <CardsWrapper
            cardList={cardList}
            cardListDisplay={cardListDisplay}
            menuSelect={menuSelect}
            setMenuSelect={setMenuSelect}
          ></CardsWrapper>
        </OverflowWrapper>
        {!cardListDisplay && (
          <ConfirmWrapper>
            <ConfirmPanel>{confirm}</ConfirmPanel>
            {btnWrapperDisplay && (
              <BtnWrapper>
                <CardSelectBtn onClick={() => setCardListDisplay(true)}>
                  Back
                </CardSelectBtn>
                <CardSelectBtn onClick={tradePlants}>Sure</CardSelectBtn>
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
