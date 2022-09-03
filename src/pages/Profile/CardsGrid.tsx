import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../reducer/index";
import { CardsActions } from "../../actions/cardsActions";
import { cards } from "../../utils/firebase";
import { getDocs, query, where, DocumentData } from "firebase/firestore";
import CardEditor from "./Cardeditor";

const OperationMenu = styled.div`
  display: flex;
`;
export const OperationBtn = styled.button`
  margin-right: 5px;
  padding: 5px;
  cursor: pointer;

  &:hover {
    background: #000;
    color: #fff;
  }
`;
const GridWrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-gap: 20px;
  margin-top: 20px;
`;
const Card = styled.div`
  display: flex;
  flex-direction: column;
  border: 1px solid black;
  padding: 10px;
`;
const PlantImg = styled.div`
  border-radius: 10px;
  margin: 8px;
  background-color: #ddd;
  width: 150px;
  height: 100px;
`;
const Text = styled.p`
  margin-bottom: 10px;
`;
const CardsGrid = () => {
  const cardList = useSelector((state: RootState) => state.cards);
  const dispatch = useDispatch();
  const [editorDisplay, setEditorDisplay] = useState<boolean>(false);

  function editorToggle() {
    editorDisplay ? setEditorDisplay(false) : setEditorDisplay(true);
  }
  useEffect(() => {
    async function getCards() {
      let results: DocumentData[] = [];
      const q = query(cards, where("ownerId", "==", "test"));
      const querySnapshot = await getDocs(q);
      if (querySnapshot.empty) {
        alert("User not existed!");
        return;
      }
      querySnapshot.forEach((doc) => {
        results.push(doc.data());
      });
      dispatch({
        type: CardsActions.SET_CARDS_DATA,
        payload: { data: results },
      });
    }
    getCards();
  }, []);
  return (
    <>
      <OperationMenu>
        <OperationBtn onClick={editorToggle}>新增卡片</OperationBtn>
        <OperationBtn>Filter</OperationBtn>
        <OperationBtn>選取</OperationBtn>
        <OperationBtn>切換檢視</OperationBtn>
      </OperationMenu>
      <GridWrapper>
        {cardList &&
          cardList.map((card) => {
            return (
              <Card key={card.cardId}>
                <PlantImg />
                <Text>名字: {card.plantName}</Text>
                <Text>品種: {card.species}</Text>
                <OperationBtn>Diary</OperationBtn>
              </Card>
            );
          })}
      </GridWrapper>
      <CardEditor editorDisplay={editorDisplay} editorToggle={editorToggle} />
    </>
  );
};

export default CardsGrid;
