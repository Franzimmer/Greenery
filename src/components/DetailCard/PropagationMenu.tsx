import React, { useRef, useState, Dispatch, SetStateAction } from "react";
import styled from "styled-components";
import { useDispatch } from "react-redux";
import { PopUpActions } from "../../store/actions/popUpActions";
import { CardsActions } from "../../store/actions/cardsActions";
import { PlantCard } from "../../store/types/plantCardType";
import { firebase } from "../../utils/firebase";
import { useAlertDispatcher } from "../../utils/useAlertDispatcher";
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
  border: 1px solid ${(props) => props.theme.colors.button};
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
  background: ${(props) => props.theme.colors.button};
  padding: 4px 8px;
  border: 1px solid ${(props) => props.theme.colors.button};
  border-radius: 4px;
  cursor: pointer;
`;
const TypeBtnInactive = styled(TypeBtn)`
  background: none;
  color: ${(props) => props.theme.colors.button};
`;
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
  background: ${(props) => props.theme.colors.button};
  border: 1px solid ${(props) => props.theme.colors.button};
  width: 120px;
  transition: 0.25s;
  &:hover {
    transform: scale(1.1);
    transition: 0.25s;
  }
`;
interface PropagationMenuProps {
  propagateDisplay: boolean;
  setPropagateDisplay: Dispatch<SetStateAction<boolean>>;
  propagateParentData: PlantCard;
  setDetailData: Dispatch<SetStateAction<PlantCard | undefined>>;
}
const PropagationMenu = ({
  propagateDisplay,
  setPropagateDisplay,
  propagateParentData,
  setDetailData,
}: PropagationMenuProps) => {
  const dispatch = useDispatch();
  const alertDispatcher = useAlertDispatcher();
  const numberRef = useRef<HTMLInputElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [type, setType] = useState<string>("asexual");

  async function addDocPromise(data: PlantCard) {
    const cardId = await firebase.addCard(data);
    const uploadData = { ...data, cardId };
    dispatch({
      type: CardsActions.ADD_NEW_PLANT_CARD,
      payload: { newCard: uploadData },
    });
  }
  function propagateInputCheck() {
    if (!numberRef.current?.value) {
      alertDispatcher("fail", "Please fill the number you want to propagate.");
      return false;
    } else if (type === "seedling" && !inputRef.current?.value) {
      alertDispatcher("fail", "Please fill out parent info.");
      return false;
    } else return true;
  }
  function preparePropagateData() {
    const parents = [propagateParentData.plantName];
    if (type === "seedling") parents.push(inputRef.current!.value);
    const data = {
      ...propagateParentData,
      parents: parents,
      birthday: Date.now(),
      plantPhoto: "",
      cardId: "",
      plantName: `Baby ${propagateParentData.species}`,
    };
    return data;
  }
  function propagate() {
    if (!propagateInputCheck()) return;
    const data = preparePropagateData();
    const targets = Array(Number(numberRef.current!.value)).fill(data);
    const promises = targets.map((target) => addDocPromise(target));
    Promise.all(promises)
      .then(() => {
        dispatch({
          type: PopUpActions.HIDE_ALL,
        });
        setPropagateDisplay(false);
        setDetailData(undefined);
        alertDispatcher("success", "Propagate success!");
        if (numberRef.current) numberRef.current!.value = "";
        if (inputRef.current) inputRef.current!.value = "";
      })
      .catch((error: Error) => {
        alertDispatcher("fail", error.message);
      });
  }
  function handleCloseClick() {
    numberRef.current!.value = "";
    if (inputRef.current) inputRef.current!.value = "";
    setPropagateDisplay(false);
    setDetailData(undefined);
    dispatch({
      type: PopUpActions.HIDE_ALL,
    });
  }
  return (
    <DialogWrapper $display={propagateDisplay}>
      <FlexWrapper>
        <LabelText>Number</LabelText>
        <Input
          type="number"
          min="1"
          max="10"
          ref={numberRef}
          placeholder={"choose from 1-10"}
        />
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
            <Text>{propagateParentData?.plantName} &#38; </Text>
            <ParentInput ref={inputRef} placeholder="Parent Name" />
          </FlexColumnWrapper>
        </ParentPanel>
      )}
      <FlexWrapper>
        <PropageOperationBtn onClick={propagate}>Propagate</PropageOperationBtn>
        <PropageOperationBtn onClick={handleCloseClick}>
          Close
        </PropageOperationBtn>
      </FlexWrapper>
    </DialogWrapper>
  );
};

export default PropagationMenu;
