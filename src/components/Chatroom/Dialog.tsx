import React, { useState } from "react";
import styled from "styled-components";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../reducer/index";
import { firebase } from "../../utils/firebase";
import { CardsActions } from "../../actions/cardsActions";
import { OperationBtn } from "../../pages/Profile/cards/CardsGrid";
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
const CardListWrapper = styled.div<DialogWrapperProps>`
  display: ${(props) => (props.show ? "block" : "none")};
`;
const CardWrapper = styled.div`
  display: flex;
  border: 1px solid #000;
  align-items: center;
  justify-content: space-between;
  padding: 5px;
  background: #fff;
  width: 90%;
`;
interface CardPhotoProps {
  path: string | undefined;
}
const CardPhoto = styled.div<CardPhotoProps>`
  background-image: url(${(props) => (props.path ? props.path : "")});
  background-size: cover;
  background-repeat: no-repeat;
  width: 100px;
  height: 75px;
`;
const CardText = styled.div``;
const CardCheck = styled.input``;
const ConfirmPanel = styled.div`
  background: #fff;
  text-align: center;
  padding: 8px;
`;
interface DialogProps {
  userID: string | undefined;
  selfID: string | null;
  dialogDisplay: boolean;
  cardListDisplay: boolean;
  menuSelect: Record<string, boolean>;
  setDialogDisplay: React.Dispatch<React.SetStateAction<boolean>>;
  setCardListDisplay: React.Dispatch<React.SetStateAction<boolean>>;
  setMenuSelect: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
}
const Dialog = ({
  userID,
  selfID,
  dialogDisplay,
  cardListDisplay,
  menuSelect,
  setDialogDisplay,
  setCardListDisplay,
  setMenuSelect,
}: DialogProps) => {
  const cardList = useSelector((state: RootState) => state.cards);
  const [confirm, setConfirm] = useState<string>();
  const dispatch = useDispatch();

  function switchOneCheck(cardId: string): void {
    let newObj = { ...menuSelect };
    newObj[cardId] ? (newObj[cardId] = false) : (newObj[cardId] = true);
    setMenuSelect(newObj);
  }
  function confirmTradeItems() {
    if (!userID) return;
    setCardListDisplay(false);
    let selected = cardList.filter((card) => menuSelect[card.cardId] === true);
    let nameList = selected.map((card) => {
      return card.plantName;
    });
    let msg = `要將${nameList.join(" & ")}送給新主人${userID}嗎?`;
    setConfirm(msg);
  }
  async function tradePlants() {
    if (!userID || !selfID) return;
    let selected = cardList.filter((card) => menuSelect[card.cardId] === true);
    let idList = selected.map((card) => {
      return card.cardId;
    });
    let nameList = selected.map((card) => {
      return card.plantName;
    });
    const newOwnerId = userID;
    let promises = idList.map((cardId) => {
      return firebase.changePlantOwner(cardId, newOwnerId);
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
      <CardListWrapper show={cardListDisplay}>
        {cardList.map((card) => {
          return (
            <CardWrapper key={`${card.cardId}_menu`}>
              <CardPhoto path={card.plantPhoto}></CardPhoto>
              <CardText>{card.plantName}</CardText>
              <CardText>{card.species}</CardText>
              <CardCheck
                type="checkbox"
                id={`${card.cardId}_check`}
                checked={menuSelect[card.cardId]}
                onClick={() => {
                  switchOneCheck(card.cardId);
                }}
              ></CardCheck>
            </CardWrapper>
          );
        })}
      </CardListWrapper>
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

export default Dialog;
