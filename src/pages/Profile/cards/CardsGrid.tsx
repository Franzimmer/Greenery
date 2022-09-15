import React from "react";
import { useSelector } from "react-redux";
import styled from "styled-components";
import { RootState } from "../../../reducer";
import { PlantCard } from "../../../types/plantCardType";
import {
  GridWrapper,
  Card,
  PlantImg,
  Text,
  Tag,
  TagsWrapper,
  OperationBtn,
  FavoriteButton,
} from "./Cards";
import defaultImg from "../../../assets/default.jpg";

const CheckBox = styled.input``;
type CheckList = Record<string, boolean>;

interface CardsGridProps {
  isSelf: boolean;
  cardList: PlantCard[];
  checkList: CheckList;
  filterCard: (tagList: string[]) => boolean;
  setDetailDisplay: React.Dispatch<React.SetStateAction<boolean>>;
  setDetailData: React.Dispatch<React.SetStateAction<PlantCard | undefined>>;
  setDiaryDisplay: React.Dispatch<React.SetStateAction<boolean>>;
  setDiaryId: React.Dispatch<React.SetStateAction<string | null>>;
  setEditCardId: React.Dispatch<React.SetStateAction<string | null>>;
  switchOneCheck: (cardId: string) => void;
  editorToggle: () => void;
  favoriteToggle: (cardId: string) => Promise<void>;
}
const CardsGrid = ({
  isSelf,
  cardList,
  checkList,
  filterCard,
  setDetailDisplay,
  setDetailData,
  setDiaryDisplay,
  setDiaryId,
  setEditCardId,
  switchOneCheck,
  editorToggle,
  favoriteToggle,
}: CardsGridProps) => {
  const userInfo = useSelector((state: RootState) => state.userInfo);
  return (
    <GridWrapper>
      {cardList &&
        cardList.map((card) => {
          return (
            <Card
              key={card.cardId}
              show={filterCard(card.tags || [])}
              onClick={(e) => {
                setDetailDisplay(true);
                setDetailData(card);
              }}
            >
              {isSelf && (
                <CheckBox
                  type="checkbox"
                  checked={checkList[card.cardId!]}
                  onClick={(event) => {
                    switchOneCheck(card.cardId!);
                    event.stopPropagation();
                  }}
                />
              )}
              <PlantImg path={card.plantPhoto || defaultImg} />
              <Text>名字: {card.plantName}</Text>
              <Text>品種: {card.species}</Text>
              <TagsWrapper>
                {card?.tags?.length !== 0 &&
                  card.tags?.map((tag: string) => {
                    return <Tag key={`${card.cardId}-${tag}`}>{tag}</Tag>;
                  })}
              </TagsWrapper>
              <OperationBtn
                onClick={(e) => {
                  setDiaryDisplay(true);
                  setDiaryId(card.cardId);
                  e.stopPropagation();
                }}
              >
                Diary
              </OperationBtn>
              {isSelf && (
                <OperationBtn
                  onClick={(e: React.MouseEvent<HTMLElement>) => {
                    let button = e.target as HTMLButtonElement;
                    setEditCardId(button.parentElement!.id);
                    editorToggle();
                    e.stopPropagation();
                  }}
                >
                  Edit
                </OperationBtn>
              )}
              <FavoriteButton
                show={userInfo.favoriteCards.includes(card.cardId!)}
                onClick={(e: React.MouseEvent<HTMLElement>) => {
                  favoriteToggle(card.cardId!);
                  e.stopPropagation();
                }}
              >
                Favorite
              </FavoriteButton>
            </Card>
          );
        })}
    </GridWrapper>
  );
};

export default CardsGrid;
