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
  background: ${(props) => props.theme.colors.second};
  padding: 30px 15px;
  position: fixed;
  z-index: 101;
  top: 50vh;
  left: 50vw;
  transform: translate(-50%, -50%);
  display: ${(props) => (props.show ? "flex" : "none")};
  flex-direction: column;
  @media (max-width: 600px) {
    transform: translate(-50%, -50%) scale(0.9);
  }
  @media (max-width: 500px) {
    transform: translate(-50%, -50%) scale(0.8);
  }
  @media (max-width: 450px) {
    transform: translate(-50%, -50%) scale(0.7);
  }
`;
const DialogCloseBtn = styled(CloseBtn)`
  width: 20px;
  height: 20px;
  line-height: 20px;
  position: absolute;
  top: 10px;
  right: 10px;
  color: ${(props) => props.theme.colors.second};
  background-color: ${(props) => props.theme.colors.button};
  border: 1px solid ${(props) => props.theme.colors.button};
  transition: 0.25s;
  &:hover {
    color: ${(props) => props.theme.colors.second};
    background-color: ${(props) => props.theme.colors.button};
    border: 1px solid ${(props) => props.theme.colors.button};
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
  border: 1px solid ${(props) => props.theme.colors.button};
  color: #fff;
  background: ${(props) => props.theme.colors.button};
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
  const selfId = useSelector((state: RootState) => state.userInfo.userId);
  const cardList = useSelector((state: RootState) => state.cards);
  const popUp: PopUpType = useSelector((state: RootState) => state.popUp);
  const { target } = useSelector((state: RootState) => state.popUp);
  const [confirm, setConfirm] = useState<string>();
  const [menuSelect, setMenuSelect] = useState<Record<string, boolean>>({});
  const [cardListDisplay, setCardListDisplay] = useState<boolean>(true);
  const [btnWrapperDisplay, setBtnWrapperDisplay] = useState<boolean>(true);

  function checkCardSelect() {
    if (Object.values(menuSelect).every((select) => select === false)) {
      alertDispatcher("fail", "Choose at least one plant !");
      return false;
    } else return true;
  }
  function setConfirmMsg() {
    const selected = cardList.filter(
      (card) => menuSelect[card.cardId!] === true
    );
    const nameList = selected.map((card) => {
      return card.plantName;
    });
    const msg = `Are you sure to send ${nameList.join(" & ")} to ${
      target.name
    }?`;
    setConfirm(msg);
  }
  function confirmTradeItems() {
    if (!target.id) return;
    if (!checkCardSelect()) return;
    setConfirmMsg();
    setCardListDisplay(false);
    setBtnWrapperDisplay(true);
  }
  function filterTagetPlants() {
    const idList: string[] = [];
    const nameList: string[] = [];
    const selected = cardList.filter(
      (card) => menuSelect[card.cardId!] === true
    );
    selected.forEach((card) => {
      idList.push(card.cardId!);
      nameList.push(card.plantName);
    });
    return { idList, nameList };
  }
  function removeTradePlants(idList: string[]) {
    if (id === selfId) {
      dispatch({
        type: CardsActions.DELETE_PLANT_CARDS,
        payload: { cardIds: idList },
      });
    }
  }
  async function sendTradeMsg(nameList: string[]) {
    const usersTarget = [target.id!, selfId!];
    const data = {
      userId: selfId,
      msg: `${nameList.join(" & ")} has been sent to your space`,
    };
    await firebase.storeChatroomData(usersTarget, data);
  }
  function tradePlants() {
    if (!target.id || !selfId) return;
    const { idList, nameList } = filterTagetPlants();
    const newOwnerId = target.id;
    const promises = idList.map((cardId) => {
      return firebase.changePlantOwner(cardId!, newOwnerId);
    });
    Promise.all(promises)
      .then(() => {
        removeTradePlants(idList!);
        sendTradeMsg(nameList);
      })
      .then(() => {
        dispatch({
          type: PopUpActions.HIDE_ALL,
        });
        alertDispatcher("success", "Send out success !");
      })
      .catch((error: Error) => {
        alertDispatcher("fail", error.message);
      })
      .finally(() => {
        setBtnWrapperDisplay(false);
        setCardListDisplay(true);
      });
    return;
  }
  function resetCheck() {
    const menuCheck = {} as Record<string, boolean>;
    cardList.forEach((card) => {
      menuCheck[card.cardId!] = false;
    });
    setMenuSelect(menuCheck);
  }
  function handleDialogCloseClick() {
    resetCheck();
    setCardListDisplay(true);
    dispatch({
      type: PopUpActions.HIDE_ALL,
    });
  }
  useEffect(() => {
    resetCheck();
  }, [cardList]);
  return (
    <>
      <DialogWrapper show={popUp.cardSelect}>
        <DialogCloseBtn onClick={handleDialogCloseClick}>&#215;</DialogCloseBtn>
        <OverflowWrapper>
          <CardsWrapper
            cardList={cardList}
            cardListDisplay={cardListDisplay}
            menuSelect={menuSelect}
            setMenuSelect={setMenuSelect}
          />
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
