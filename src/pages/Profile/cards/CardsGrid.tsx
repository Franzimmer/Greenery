import React, { ReactHTMLElement, useState } from "react";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBook,
  faPenToSquare,
  faBookBookmark,
} from "@fortawesome/free-solid-svg-icons";
import { useSelector } from "react-redux";
import { RootState } from "../../../reducer";
import { PlantCard } from "../../../types/plantCardType";
import { PlantImg, Tag, TagsWrapper, FavoriteButton } from "./Cards";
import { IconButton } from "../../../components/GlobalStyles/button";
import { LabelText } from "../../../components/GlobalStyles/text";
import defaultImg from "../../../assets/default.jpg";

interface GridWrapperProps {
  mode: "grid" | "list";
}
const GridWrapper = styled.div<GridWrapperProps>`
  display: ${(props) => (props.mode === "grid" ? "grid" : "flex")};
  grid-template-columns: repeat(4, 1fr);
  grid-gap: 20px;
  margin-top: 20px;
  flex-direction: column;
`;
interface CardProps {
  show?: boolean;
  mode: "grid" | "list";
}
const Card = styled.div<CardProps>`
  width: ${(props) => (props.mode === "grid" ? "280px" : "80vw")};
  display: ${(props) => (props.show ? "flex" : "none")};
  flex-direction: ${(props) => (props.mode === "grid" ? "column" : "row")};
  justify-content: center;
  align-items: ${(props) => (props.mode === "grid" ? "flex-start" : "center")};
  border: 1.5px solid #5c836f;
  border-radius: 15px;
  padding: 15px;
  cursor: pointer;
  position: relative;
`;
const CardMask = styled.div`
  display: none;
  position: absolute;
  border-radius: 13px;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  ${Card}:hover & {
    display: block;
  }
`;
const NameText = styled(LabelText)`
  font-size: 20px;
  color: #5c836f;
`;
const SpeciesText = styled.div`
  font-size: 14px;
  letter-spacing: 1px;
  font-style: italic;
  color: #999;
`;
const EditIconBtn = styled(IconButton)`
  display: none;
  position: absolute;
  right: 10px;
  bottom: 150px;
  background: rgba(0, 0, 0, 0);
  margin: 5px;
  transition: 0.25s;
  ${Card}:hover & {
    display: block;
  }
  &:hover {
    transform: scale(1.1);
    transition: 0.25s;
  }
`;
const DiaryIconBtn = styled(EditIconBtn)`
  bottom: 90px;
  right: 12px;
`;
interface BookMarkIconBtnProps {
  show?: boolean;
}
const BookMarkIconBtn = styled(EditIconBtn)<BookMarkIconBtnProps>`
  bottom: 30px;
  right: 12px;
  & * {
    color: ${(props) => (props.show ? "#FDDBA9" : "#fff")};
  }
`;
const StyledFontAwesomeIcon = styled(FontAwesomeIcon)`
  background: rgba(0, 0, 0, 0);
  z-index: 1;
  display: none;
  color: #fff;
  width: 30px;
  height: 30px;
  ${Card}:hover & {
    display: block;
  }
`;
const CheckBox = styled.input``;
type CheckList = Record<string, boolean>;

interface CardsGridProps {
  isSelf: boolean;
  viewMode: "grid" | "list";
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
  viewMode,
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
    <GridWrapper mode={viewMode}>
      {cardList &&
        cardList.map((card) => {
          return (
            <Card
              key={card.cardId}
              mode={viewMode}
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
              <CardMask />
              <PlantImg path={card.plantPhoto || defaultImg} />
              <NameText>{card.plantName}</NameText>
              <SpeciesText>{card.species}</SpeciesText>
              <TagsWrapper>
                {card?.tags?.length !== 0 &&
                  card.tags?.map((tag: string) => {
                    return <Tag key={`${card.cardId}-${tag}`}>{tag}</Tag>;
                  })}
              </TagsWrapper>
              {isSelf && (
                <EditIconBtn
                  onClick={(e: React.MouseEvent<HTMLElement>) => {
                    setEditCardId(card.cardId);
                    editorToggle();
                    e.stopPropagation();
                  }}
                >
                  <StyledFontAwesomeIcon icon={faPenToSquare} />
                </EditIconBtn>
              )}
              <DiaryIconBtn
                onClick={(e: React.MouseEvent<HTMLElement>) => {
                  setDiaryDisplay(true);
                  setDiaryId(card.cardId);
                  e.stopPropagation();
                }}
              >
                <StyledFontAwesomeIcon icon={faBook} />
              </DiaryIconBtn>
              <BookMarkIconBtn
                show={userInfo.favoriteCards.includes(card.cardId!)}
                onClick={(e: React.MouseEvent<HTMLElement>) => {
                  favoriteToggle(card.cardId!);
                  e.stopPropagation();
                }}
              >
                <StyledFontAwesomeIcon icon={faBookBookmark} />
              </BookMarkIconBtn>
            </Card>
          );
        })}
    </GridWrapper>
  );
};

export default CardsGrid;
