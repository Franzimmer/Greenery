import React from "react";
import styled from "styled-components";
import { getCards } from "../../utils/firebase";
import { useSelector } from "react-redux";
import { RootState } from "../../reducer/index";

const OperationMenu = styled.div`
  display: flex;
`;
const OperationBtn = styled.button`
  margin-right: 5px;
  padding: 5px;
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
  console.log(cardList);
  return (
    <>
      <OperationMenu>
        <OperationBtn>新增卡片</OperationBtn>
        <OperationBtn>Filter</OperationBtn>
        <OperationBtn>選取</OperationBtn>
        <OperationBtn>切換檢視</OperationBtn>
      </OperationMenu>
      <GridWrapper>
        <Card>
          <PlantImg />
          <Text>My Plant</Text>
          <Text>品種</Text>
          <OperationBtn>Diary</OperationBtn>
        </Card>
        <Card>
          <PlantImg />
          <Text>My Plant2</Text>
          <Text>品種</Text>
          <OperationBtn>Diary</OperationBtn>
        </Card>
      </GridWrapper>
      <OperationBtn onClick={() => getCards("test")}>
        Firebase data
      </OperationBtn>
    </>
  );
};

export default CardsGrid;
