import React from "react";
import styled from "styled-components";
import { PlantCard } from "../../types/plantCardType";
interface CardListWrapperProps {
  show: boolean;
}
const CardListWrapper = styled.div<CardListWrapperProps>`
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

interface CardsWrapperProps {
  cardListDisplay: boolean;
  cardList: PlantCard[];
  menuSelect: Record<string, boolean>;
  setMenuSelect: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
}
const CardsWrapper = ({
  cardListDisplay,
  cardList,
  menuSelect,
  setMenuSelect,
}: CardsWrapperProps) => {
  function switchOneCheck(cardId: string): void {
    let newObj = { ...menuSelect };
    newObj[cardId] ? (newObj[cardId] = false) : (newObj[cardId] = true);
    setMenuSelect(newObj);
  }
  return (
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
  );
};

export default CardsWrapper;
