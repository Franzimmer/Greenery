import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useSelector, useDispatch } from "react-redux";
import { firebase } from "../../utils/firebase";
import { CardsActions } from "../../actions/cardsActions";
import { popUpActions } from "../../reducer/popUpReducer";
import { OperationBtn } from "../../pages/Profile/cards/Cards";
import CardsWrapper from "./CardsWrapper";
import { RootState } from "../../reducer";
interface DialogWrapperProps {
  show: boolean;
}
const DialogWrapper = styled.div<DialogWrapperProps>`
  padding: 15px 10px;
  position: absolute;
  z-index: 101;
  left: 30vw;
  display: ${(props) => (props.show ? "flex" : "none")};
  flex-direction: column;
  background: #f5a263;
  width: 500px;
`;
const DialogCloseBtn = styled(OperationBtn)`
  position: absolute;
  top: 0px;
  right: 0px;
`;
const ConfirmPanel = styled.div`
  background: #fff;
  text-align: center;
  padding: 8px;
`;
interface DialogProps {
  dialogDisplay: boolean;
  cardListDisplay: boolean;
  setDialogDisplay: React.Dispatch<React.SetStateAction<boolean>>;
  setCardListDisplay: React.Dispatch<React.SetStateAction<boolean>>;
}
const CardSelectDialog = () => {
  const dispatch = useDispatch();
  const cardList = useSelector((state: RootState) => state.cards);
  const userInfo = useSelector((state: RootState) => state.userInfo);
  const popUpDisplay = useSelector((state: RootState) => state.popUp);
  const [confirm, setConfirm] = useState<string>();
  const [menuSelect, setMenuSelect] = useState<Record<string, boolean>>({});
  const [cardListDisplay, setCardListDisplay] = useState<boolean>(true);
  const selfId = userInfo.userId;
  const targetId = popUpDisplay.target.id;
  const targetName = popUpDisplay.target.name;
  function confirmTradeItems() {
    if (!targetId) return;
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
    firebase.storeChatroomData(usersTarget, data);
  }
  useEffect(() => {
    let menuCheck = {} as Record<string, boolean>;
    cardList.forEach((card) => {
      menuCheck[card.cardId!] = false;
    });
    setMenuSelect(menuCheck);
  }, []);
  return (
    <DialogWrapper show={popUpDisplay.cardSelect}>
      <DialogCloseBtn
        onClick={() => {
          dispatch({
            type: popUpActions.HIDE_ALL,
          });
        }}
      >
        x
      </DialogCloseBtn>
      <CardsWrapper
        cardList={cardList}
        cardListDisplay={cardListDisplay}
        menuSelect={menuSelect}
        setMenuSelect={setMenuSelect}
      ></CardsWrapper>
      {!cardListDisplay && (
        <>
          <ConfirmPanel>{confirm}</ConfirmPanel>
          <OperationBtn onClick={() => setCardListDisplay(true)}>
            Back
          </OperationBtn>
          <OperationBtn onClick={tradePlants}>Next</OperationBtn>
        </>
      )}
      {cardListDisplay && (
        <OperationBtn onClick={confirmTradeItems}>Next</OperationBtn>
      )}
    </DialogWrapper>
  );
};

export default CardSelectDialog;
