import React from "react";
import styled from "styled-components";
import { LabelText } from "../../components/GlobalStyles/text";
import { PlantCard } from "../../types/plantCardType";
interface CardListWrapperProps {
  show: boolean;
}
const CardListWrapper = styled.div<CardListWrapperProps>`
  display: ${(props) => (props.show ? "flex" : "none")};
  background: none;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  & * {
    background: #fff;
  }
`;
const CardWrapper = styled.div`
  width: 90%;
  display: flex;
  border: 1px solid #6a5125;
  align-items: center;
  justify-content: start;
  padding: 8px;
  position: relative;
`;
interface CardPhotoProps {
  path: string | undefined;
}
const CardPhoto = styled.div<CardPhotoProps>`
  width: 100px;
  height: 100px;
  background-image: url(${(props) => (props.path ? props.path : "")});
  border-radius: 10px;
  background-size: cover;
  background-position: center center;
  background-repeat: no-repeat;
  margin-right: 12px;
`;
const CardTextWrapper = styled.div`
  width: 100px;
`;
const CardText = styled.div`
  font-size: 14px;
  color: #aaa;
  font-style: italic;
`;
const CardCheck = styled.input`
  position: absolute;
  right: 15px;
  cursor: pointer;
  height: 22px;
  width: 22px;
  &:checked {
    accent-color: #6a5125;
  }
`;
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
            <CardTextWrapper>
              <LabelText>{card.plantName}</LabelText>
              <CardText>{card.species}</CardText>
            </CardTextWrapper>
            <CardCheck
              type="checkbox"
              id={`${card.cardId}_check`}
              checked={menuSelect[card.cardId!]}
              onClick={() => {
                switchOneCheck(card.cardId!);
              }}
            ></CardCheck>
          </CardWrapper>
        );
      })}
    </CardListWrapper>
  );
};

export default CardsWrapper;
