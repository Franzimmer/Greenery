import React, { useRef } from "react";
import { useDispatch } from "react-redux";
import { CardsActions } from "../../../actions/cardsActions";
import styled from "styled-components";
import { OperationBtn } from "./CardsGrid";
import { doc, setDoc } from "firebase/firestore";
import { cards } from "../../../utils/firebase";
interface DialogWrapperProps {
  $display: boolean;
}
export const DialogWrapper = styled.div<DialogWrapperProps>`
  padding: 10px;
  width: 200px;
  border: 1px solid #000;
  flex-direction: column;
  display: ${(props) => (props.$display ? "flex" : "none")};
`;
const DialogInput = styled.input`
  height: 30px;
  margin-top: 10px;
`;

interface DialogProps {
  tradeDisplay: boolean;
  setTradeDisplay: React.Dispatch<React.SetStateAction<boolean>>;
  tradeId: string;
  detailToggle: () => void;
}
const Dialog = ({
  tradeDisplay,
  setTradeDisplay,
  tradeId,
  detailToggle,
}: DialogProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const dispatch = useDispatch();

  async function sendCard(tradeId: string) {
    if (!inputRef.current?.value) return;
    if (!tradeId) return;
    const newOwnerId = inputRef.current.value;
    const docRef = doc(cards, tradeId);
    await setDoc(docRef, { ownerId: newOwnerId }, { merge: true });
    dispatch({
      type: CardsActions.DELETE_PLANT_CARD,
      payload: { cardId: tradeId },
    });
    setTradeDisplay(false);
    detailToggle();
  }
  return (
    <DialogWrapper $display={tradeDisplay}>
      <OperationBtn>去論壇區發文</OperationBtn>
      <DialogInput placeholder="輸入新主人ID" ref={inputRef} />
      <OperationBtn onClick={() => sendCard(tradeId)}>
        向指定使用者發送
      </OperationBtn>
      <OperationBtn onClick={() => setTradeDisplay(false)}>Close</OperationBtn>
    </DialogWrapper>
  );
};

export default Dialog;
