import React, { useRef, useState } from "react";
import styled from "styled-components";
import { DialogWrapper } from "./Dialog";
import { OperationBtn } from "./CardsGrid";
import { PlantCard } from "../../types/plantCardType";
import { cards } from "../../utils/firebase";
import { doc, setDoc } from "firebase/firestore";
import { useDispatch } from "react-redux";
import { CardsActions } from "../../actions/cardsActions";

const Text = styled.p``;
const Input = styled.input`
  height: 30px;
`;
const DropDown = styled.select`
  margin: 0px 0px 10px 0px;
`;
const DropDownOptions = styled.option``;
interface PropagationMenu {
  propagateDisplay: boolean;
  setPropagateDisplay: React.Dispatch<React.SetStateAction<boolean>>;
  propagateParentData: PlantCard;
}
const PropagationMenu = ({
  propagateDisplay,
  setPropagateDisplay,
  propagateParentData,
}: PropagationMenu) => {
  const numberRef = useRef<HTMLInputElement>(null);
  const typeRef = useRef<HTMLSelectElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [type, setType] = useState<string>("Asexual");
  const dispatch = useDispatch();

  async function addDocPromise(data: PlantCard) {
    const document = doc(cards);
    const uploadData = { ...data, cardId: document.id };
    dispatch({
      type: CardsActions.ADD_NEW_PLANT_CARD,
      payload: { newCard: uploadData },
    });
    await setDoc(document, uploadData);
  }

  function propagate() {
    if (!numberRef.current?.value) {
      alert("請填寫數量");
      return;
    } else if (
      typeRef.current?.value === "Seedling" &&
      !inputRef.current?.value
    ) {
      alert("請完整填寫親本植物");
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
      plantName: `${propagateParentData.species}寶寶`,
    };
    const targets = Array(Number(numberRef.current.value)).fill(data);
    let promises = targets.map((target) => addDocPromise(target));
    Promise.all(promises).then(() => alert("新增成功！"));
  }
  return (
    <DialogWrapper $display={propagateDisplay}>
      <Text>數量</Text>
      <Input placeholder="輸入繁殖數量" type="number" min="0" ref={numberRef} />
      <Text>Type</Text>
      <DropDown ref={typeRef} onChange={() => setType(typeRef.current!.value)}>
        <DropDownOptions>Asexual</DropDownOptions>
        <DropDownOptions>Seedling</DropDownOptions>
      </DropDown>
      {type === "Seedling" && (
        <>
          <Text>親本</Text>
          <Text>{propagateParentData.plantName} & </Text>
          <Input ref={inputRef} />
        </>
      )}
      <OperationBtn onClick={propagate}>Generate Baby</OperationBtn>
      <OperationBtn onClick={() => setPropagateDisplay(false)}>
        Close
      </OperationBtn>
    </DialogWrapper>
  );
};

export default PropagationMenu;
