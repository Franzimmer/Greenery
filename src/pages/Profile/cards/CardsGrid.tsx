import React, { useState } from "react";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBook,
  faPenToSquare,
  faBookmark,
  faEllipsis,
} from "@fortawesome/free-solid-svg-icons";
import { useSelector } from "react-redux";
import { RootState } from "../../../reducer";
import { popUpActions } from "../../../reducer/popUpReducer";
import { PlantCard } from "../../../types/plantCardType";
import { PlantImg, Tag, TagsWrapper } from "./Cards";
import { IconButton } from "../../../components/GlobalStyles/button";
import { LabelText } from "../../../components/GlobalStyles/text";
import defaultImg from "../../../assets/default.jpg";
import { useDispatch } from "react-redux";

interface GridWrapperProps {
  mode: "grid" | "list";
}
const GridWrapper = styled.div<GridWrapperProps>`
  display: ${(props) => (props.mode === "grid" ? "grid" : "flex")};
  grid-template-columns: repeat(auto-fill, 280px);
  gap: 20px;
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
  padding: 30px 15px 15px;
  cursor: pointer;
  position: relative;
  transition: 0.25s;
  &:hover {
    transition: 0.25s;
    transform: translateX(5px) translateY(5px);
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
interface MaskAndIconBtnProps {
  show?: boolean;
  fav?: boolean;
}
const EditIconBtn = styled(IconButton)<MaskAndIconBtnProps>`
  display: ${(props) => (props.show ? "block" : "none")};
  background: rgba(0, 0, 0, 0);
  margin: 5px;
  transition: 0.25s;
  &:hover {
    transform: scale(1.1);
    transition: 0.25s;
  }
`;
const DiaryIconBtn = styled(EditIconBtn)<MaskAndIconBtnProps>``;
const BookMarkIconBtn = styled(EditIconBtn)<MaskAndIconBtnProps>`
  & * {
    color: ${(props) => (props.fav ? "#FDDBA9" : "#fff")};
  }
`;
const CardMenuIcon = styled.div<MaskAndIconBtnProps>`
  width: 40px;
  height: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0);
  box-shadow: ${(props) => props.show && "0px 0px 10px #aaa"};
`;
const CardMask = styled.div<MaskAndIconBtnProps>`
  position: absolute;
  display: ${(props) => (props.show ? "block" : "none")};
  border-radius: 13px;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
`;
const StyledMenuIcon = styled(FontAwesomeIcon)<MaskAndIconBtnProps>`
  background: rgba(0, 0, 0, 0);
  color: ${(props) => (props.show ? "#fff" : "#5c836f")};
  width: 30px;
  height: 30px;
  transition: 0.25s;
  ${CardMenuIcon}:hover & {
    transform: scale(1.1);
    transition: 0.25s;
  }
`;
const StyledFontAwesomeIcon = styled(FontAwesomeIcon)<MaskAndIconBtnProps>`
  display: ${(props) => props.show && "block"};
  background: rgba(0, 0, 0, 0);
  z-index: 1;
  color: #fff;
  width: 30px;
  height: 30px;
  transition: height 0.25s;
`;
const CardCheck = styled.input`
  position: absolute;
  top: 8px;
  right: 15px;
  cursor: pointer;
  height: 20px;
  width: 20px;
  &:checked {
    accent-color: #6a5125;
  }
`;
const IconWrapper = styled.div<MaskAndIconBtnProps>`
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
  width: 40px;
  height: ${(props) => (props.show ? "60%" : "30px")};
  padding: 5px;
  border-radius: 15px;
  position: absolute;
  bottom: ${(props) => (props.show ? "15px" : "65px")};
  right: 20px;
  background: rgba(0, 0, 0, 0);
  box-shadow: ${(props) => props.show && "0px 0px 10px #aaa"};
  transition: 0.25s height;
`;
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
  const dispatch = useDispatch();
  const userInfo = useSelector((state: RootState) => state.userInfo);
  const [cardMaskDisplay, setCardMaskDisplay] = useState<boolean>(false);

  function toggleMask() {
    if (cardMaskDisplay) setCardMaskDisplay(false);
    else if (!cardMaskDisplay) setCardMaskDisplay(true);
  }
  return (
    <GridWrapper mode={viewMode}>
      {cardList &&
        cardList.map((card) => {
          return (
            <Card
              key={card.cardId}
              mode={viewMode}
              show={filterCard(card.tags || [])}
              onClick={() => {
                dispatch({
                  type: popUpActions.SHOW_MASK,
                });
                setDetailDisplay(true);
                setDetailData(card);
              }}
            >
              {isSelf && (
                <CardCheck
                  type="checkbox"
                  checked={checkList[card.cardId!]}
                  onClick={(event) => {
                    switchOneCheck(card.cardId!);
                    event.stopPropagation();
                  }}
                />
              )}
              <CardMask show={cardMaskDisplay} />
              <PlantImg path={card.plantPhoto || defaultImg} />
              <NameText>{card.plantName}</NameText>
              <SpeciesText>{card.species}</SpeciesText>
              <TagsWrapper>
                {card?.tags?.length !== 0 &&
                  card.tags?.map((tag: string) => {
                    return <Tag key={`${card.cardId}-${tag}`}>{tag}</Tag>;
                  })}
              </TagsWrapper>
              <IconWrapper show={cardMaskDisplay}>
                <DiaryIconBtn
                  show={cardMaskDisplay}
                  onClick={(e: React.MouseEvent<HTMLElement>) => {
                    dispatch({
                      type: popUpActions.SHOW_MASK,
                    });
                    setDiaryDisplay(true);
                    setDiaryId(card.cardId);
                    toggleMask();
                    e.stopPropagation();
                  }}
                >
                  <StyledFontAwesomeIcon icon={faBook} />
                </DiaryIconBtn>
                <BookMarkIconBtn
                  show={cardMaskDisplay}
                  fav={userInfo.favoriteCards.includes(card.cardId!)}
                  onClick={(e: React.MouseEvent<HTMLElement>) => {
                    favoriteToggle(card.cardId!);
                    e.stopPropagation();
                  }}
                >
                  <StyledFontAwesomeIcon icon={faBookmark} />
                </BookMarkIconBtn>
                <CardMenuIcon
                  show={cardMaskDisplay}
                  onClick={(e) => {
                    toggleMask();
                    e.stopPropagation();
                  }}
                >
                  <StyledMenuIcon icon={faEllipsis} show={cardMaskDisplay} />
                </CardMenuIcon>
                {isSelf && (
                  <EditIconBtn
                    show={cardMaskDisplay}
                    onClick={(e: React.MouseEvent<HTMLElement>) => {
                      dispatch({
                        type: popUpActions.SHOW_MASK,
                      });
                      setEditCardId(card.cardId);
                      toggleMask();
                      editorToggle();
                      e.stopPropagation();
                    }}
                  >
                    <StyledFontAwesomeIcon icon={faPenToSquare} />
                  </EditIconBtn>
                )}
              </IconWrapper>
            </Card>
          );
        })}
    </GridWrapper>
  );
};

export default CardsGrid;
