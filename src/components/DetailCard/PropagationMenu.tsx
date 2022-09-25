import React, { useRef, useState } from "react";
import styled from "styled-components";
import { firebase } from "../../utils/firebase";
import { useDispatch } from "react-redux";
import { popUpActions } from "../../reducer/popUpReducer";
import { CardsActions } from "../../actions/cardsActions";
import { PlantCard } from "../../types/plantCardType";
import { OperationBtn } from "../../components/GlobalStyles/button";
import { LabelText } from "../../components/GlobalStyles/text";
interface DialogWrapperProps {
  $display: boolean;
}
const DialogWrapper = styled.div<DialogWrapperProps>`
  position: fixed;
  top: 50vh;
  left: 50vw;
  transform: translateX(-50%) translateY(-50%);
  z-index: 101;
  display: ${(props) => (props.$display ? "flex" : "none")};
  flex-direction: column;
  justify-content: space-evenly;
  width: 300px;
  height: 300px;
  padding: 16px;
  background: #f5f0ec;
`;

const Text = styled.p`
  font-size: 16px;
  white-space: nowrap;
  margin-right: 8px;
`;
const Input = styled.input`
  width: 180px;
  height: 30px;
  padding: 15px;
  border-radius: 15px;
  border: 1px solid #6a5125;
`;
const ParentInput = styled(Input)`
  width: 150px;
  margin-top: 8px;
`;
const RadioWrapper = styled.div`
  display: flex;
  width: 180px;
  justify-content: space-around;
`;
const TypeBtn = styled.div`
  font-size: 14px;
  letter-spacing: 0.5px;
  margin: 0 6px;
  color: #fff;
  background: #6a5125;
  padding: 4px 8px;
  border: 1px solid #6a5125;
  border-radius: 4px;
  cursor: pointer;
`;
const TypeBtnInactive = styled(TypeBtn)`
  background: none;
  color: #6a5125;
`;
interface PropagationMenuProps {
  propagateDisplay: boolean;
  setPropagateDisplay: React.Dispatch<React.SetStateAction<boolean>>;
  propagateParentData: PlantCard;
}
const FlexWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
`;
const FlexColumnWrapper = styled(FlexWrapper)`
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  margin-top: 8px;
`;
const ParentPanel = styled.div`
  max-height: auto;
`;
const PropageOperationBtn = styled(OperationBtn)`
  margin-top: 12px;
  background: #6a5125;
  border: 1px solid #6a5125;
  width: 120px;
  transition: 0.25s;
  &:hover {
    transform: scale(1.1);
    transition: 0.25s;
  }
`;
const PropagationMenu = ({
  propagateDisplay,
  setPropagateDisplay,
  propagateParentData,
}: PropagationMenuProps) => {
  const numberRef = useRef<HTMLInputElement>(null);
  const typeRef = useRef("seedling");
  const inputRef = useRef<HTMLInputElement>(null);
  const [type, setType] = useState<string>("asexual");
  const dispatch = useDispatch();

  async function addDocPromise(data: PlantCard) {
    let cardId = await firebase.addCard(data);
    const uploadData = { ...data, cardId };
    dispatch({
      type: CardsActions.ADD_NEW_PLANT_CARD,
      payload: { newCard: uploadData },
    });
  }
  function emitAlert(type: string, msg: string) {
    dispatch({
      type: popUpActions.SHOW_ALERT,
      payload: {
        type,
        msg,
      },
    });
    setTimeout(() => {
      dispatch({
        type: popUpActions.CLOSE_ALERT,
      });
    }, 2000);
  }
  async function propagate() {
    if (!numberRef.current?.value) {
      emitAlert("fail", "Please fill the number you want to propagate.");
      return;
    } else if (typeRef.current === "seedling" && !inputRef.current?.value) {
      emitAlert("fail", "Please fill out parent info.");
      return;
    }
    let parents = [propagateParentData.plantName];
    if (typeRef.current === "seedling") {
      parents.push(inputRef.current!.value);
    }
    const data = {
      ...propagateParentData,
      parents: parents,
      birthday: Date.now(),
      plantPhoto: "",
      cardId: "",
      plantName: `Baby ${propagateParentData.species}`,
    };
    const targets = Array(Number(numberRef.current.value)).fill(data);
    let promises = targets.map((target) => addDocPromise(target));
    await Promise.all(promises);
    setPropagateDisplay(false);
    dispatch({
      type: popUpActions.HIDE_ALL,
    });
    emitAlert("success", "Propagate success!");
    numberRef.current!.value = "";
    inputRef.current!.value = "";
  }
  return (
    <DialogWrapper $display={propagateDisplay}>
      <FlexWrapper>
        <LabelText>Number</LabelText>
        <Input type="number" min="1" ref={numberRef} />
      </FlexWrapper>
      <FlexWrapper>
        <LabelText>Type</LabelText>
        <RadioWrapper>
          {type === "asexual" && (
            <>
              <TypeBtn onClick={() => setType("asexual")}>Asexual</TypeBtn>
              <TypeBtnInactive onClick={() => setType("seedling")}>
                Seedling
              </TypeBtnInactive>
            </>
          )}
          {type === "seedling" && (
            <>
              <TypeBtnInactive onClick={() => setType("asexual")}>
                Asexual
              </TypeBtnInactive>
              <TypeBtn onClick={() => setType("seedling")}>Seedling</TypeBtn>
            </>
          )}
        </RadioWrapper>
      </FlexWrapper>
      {type === "seedling" && (
        <ParentPanel>
          <LabelText>Parents</LabelText>
          <FlexColumnWrapper>
            <Text>{propagateParentData.plantName} &#38; </Text>
            <ParentInput ref={inputRef} placeholder="Parent Name" />
          </FlexColumnWrapper>
        </ParentPanel>
      )}
      <FlexWrapper>
        <PropageOperationBtn onClick={propagate}>Propagate</PropageOperationBtn>
        <PropageOperationBtn
          onClick={() => {
            numberRef.current!.value = "";
            if (inputRef.current) inputRef.current!.value = "";
            setPropagateDisplay(false);
            dispatch({
              type: popUpActions.HIDE_ALL,
            });
          }}
        >
          Close
        </PropageOperationBtn>
      </FlexWrapper>
    </DialogWrapper>
  );
};

export default PropagationMenu;
