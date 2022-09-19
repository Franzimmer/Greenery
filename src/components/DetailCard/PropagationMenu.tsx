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
  position: absolute;
  top: 50vh;
  left: 50vw;
  transform: translateX(-50%) translateY(-50%);
  z-index: 101;
  display: ${(props) => (props.$display ? "flex" : "none")};
  flex-direction: column;
  justify-content: center;
  width: 300px;
  height: 300px;
  padding: 15px;
`;

const Text = styled.p`
  font-size: 16px;
  white-space: nowrap;
  margin-right: 8px;
`;
const Input = styled.input`
  width: 180px;
  height: 30px;
  padding-left: 15px;
  border-radius: 15px;
  border: 1px solid #6a5125;
`;
const ParentInput = styled(Input)`
  width: 150px;
`;
const DropDown = styled.select`
  width: 180px;
  height: 30px;
  border: 1px solid #6a5125;
  color: #6a5125;
  cursor: pointer;
`;
const DropDownOptions = styled.option``;
interface PropagationMenuProps {
  propagateDisplay: boolean;
  setPropagateDisplay: React.Dispatch<React.SetStateAction<boolean>>;
  propagateParentData: PlantCard;
}
const FlexWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 28px;
`;
const ParentPanel = styled.div`
  max-height: auto;
`;
const PropageOperationBtn = styled(OperationBtn)`
  width: 120px;
  transition: 0.25s;
  &:hover {
    transform: translateY(5px);
    transition: 0.25s;
  }
`;
const PropagationMenu = ({
  propagateDisplay,
  setPropagateDisplay,
  propagateParentData,
}: PropagationMenuProps) => {
  const numberRef = useRef<HTMLInputElement>(null);
  const typeRef = useRef<HTMLSelectElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [type, setType] = useState<string>("Asexual");
  const dispatch = useDispatch();

  async function addDocPromise(data: PlantCard) {
    let cardId = await firebase.addCard(data);
    const uploadData = { ...data, cardId };
    dispatch({
      type: CardsActions.ADD_NEW_PLANT_CARD,
      payload: { newCard: uploadData },
    });
  }

  function propagate() {
    if (!numberRef.current?.value) {
      alert("Please fill the number you want to propagate");
      return;
    } else if (
      typeRef.current?.value === "Seedling" &&
      !inputRef.current?.value
    ) {
      alert("Please fill the parent info");
      return;
    }
    let parents = [propagateParentData.plantName];
    if (typeRef.current?.value === "Seedling") {
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
    Promise.all(promises).then(() => alert("Propagate success!"));
  }
  return (
    <DialogWrapper $display={propagateDisplay}>
      <FlexWrapper>
        <LabelText>Number</LabelText>
        <Input type="number" min="1" ref={numberRef} />
      </FlexWrapper>
      <FlexWrapper>
        <LabelText>Type</LabelText>
        <DropDown
          ref={typeRef}
          onChange={() => setType(typeRef.current!.value)}
        >
          <DropDownOptions>Asexual</DropDownOptions>
          <DropDownOptions>Seedling</DropDownOptions>
        </DropDown>
      </FlexWrapper>
      {type === "Seedling" && (
        <ParentPanel>
          <LabelText>Parents</LabelText>
          <FlexWrapper>
            <Text>{propagateParentData.plantName} &#38; </Text>
            <ParentInput ref={inputRef} placeholder="Parent Name" />
          </FlexWrapper>
        </ParentPanel>
      )}
      <FlexWrapper>
        <PropageOperationBtn onClick={propagate}>Propagate</PropageOperationBtn>
        <PropageOperationBtn
          onClick={() => {
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
