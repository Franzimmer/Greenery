import React, { useState } from "react";
import styled from "styled-components";
import { useDispatch } from "react-redux";
import { firebase } from "../../utils/firebase";
import { CardsActions } from "../../actions/cardsActions";
import { OperationBtn } from "../../pages/Profile/cards/CardsGrid";
import { PlantCard } from "../../types/plantCardType";
import CardsWrapper from "./CardsWrapper";
interface DialogWrapperProps {
  show: boolean;
}
const DialogWrapper = styled.div<DialogWrapperProps>`
  padding: 15px 10px;
  position: relative;
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
  cardList: PlantCard[];
  userID: string | undefined;
  selfID: string | null;
  dialogDisplay: boolean;
  cardListDisplay: boolean;
  menuSelect: Record<string, boolean>;
  setDialogDisplay: React.Dispatch<React.SetStateAction<boolean>>;
  setCardListDisplay: React.Dispatch<React.SetStateAction<boolean>>;
  setMenuSelect: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
}
const CardSelectDialog = ({
  cardList,
  userID,
  selfID,
  dialogDisplay,
  cardListDisplay,
  menuSelect,
  setDialogDisplay,
  setCardListDisplay,
  setMenuSelect,
}: DialogProps) => {
  const [confirm, setConfirm] = useState<string>();
  const dispatch = useDispatch();
  function confirmTradeItems() {
    if (!userID) return;
    setCardListDisplay(false);
    let selected = cardList.filter((card) => menuSelect[card.cardId!] === true);
    let nameList = selected.map((card) => {
      return card.plantName;
    });
    let msg = `要將${nameList.join(" & ")}送給新主人${userID}嗎?`;
    setConfirm(msg);
  }
  async function tradePlants() {
    if (!userID || !selfID) return;
    let selected = cardList.filter((card) => menuSelect[card.cardId!] === true);
    let idList = selected.map((card) => {
      return card.cardId;
    });
    let nameList = selected.map((card) => {
      return card.plantName;
    });
    const newOwnerId = userID;
    let promises = idList.map((cardId) => {
      return firebase.changePlantOwner(cardId!, newOwnerId);
    });
    await Promise.all(promises);
    dispatch({
      type: CardsActions.DELETE_PLANT_CARDS,
      payload: { cardIds: idList },
    });
    const usersTarget = [userID!, selfID!];
    const data = {
      userId: selfID,
      msg: `已經將${nameList.join(" & ")}交給你了，要好好照顧喔！`,
    };
    firebase.storeChatroomData(usersTarget, data);
  }

  return (
    <DialogWrapper show={dialogDisplay}>
      <DialogCloseBtn
        onClick={() => {
          setDialogDisplay(false);
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
