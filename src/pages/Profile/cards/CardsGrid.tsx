import React, { useState } from "react";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBook,
  faPenToSquare,
  faBookmark,
  faEllipsis,
} from "@fortawesome/free-solid-svg-icons";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../../store/reducer";
import { popUpActions } from "../../../store/reducer/popUpReducer";
import { PlantCard } from "../../../store/types/plantCardType";
import { PlantImg, Tag, TagsWrapper } from "./Cards";
import { IconButton } from "../../../components/GlobalStyles/button";
import { LabelText } from "../../../components/GlobalStyles/text";
import {
  NoDataSection,
  NoDataText,
  NoDataBtn,
} from "../../../components/GlobalStyles/NoDataLayout";
import defaultImg from "../../../assets/default.jpg";

interface GridWrapperProps {
  $mode: "grid" | "list";
}
export const GridWrapper = styled.div<GridWrapperProps>`
  display: ${(props) => (props.$mode === "grid" ? "grid" : "flex")};
  grid-template-columns: repeat(auto-fill, 280px);
  gap: 20px;
  margin-top: 20px;
  flex-direction: column;
`;
interface CardProps {
  $show?: boolean;
  $mode: "grid" | "list";
}
export const Card = styled.div<CardProps>`
  width: ${(props) => (props.$mode === "grid" ? "280px" : "60vw")};
  display: ${(props) => (props.$show ? "flex" : "none")};
  flex-direction: ${(props) => (props.$mode === "grid" ? "column" : "row")};
  justify-content: flex-start;
  align-items: ${(props) => (props.$mode === "grid" ? "flex-start" : "center")};
  background: #fff;
  border-radius: 15px;
  padding: ${(props) => (props.$mode === "list" ? "15px" : "30px 15px 15px")};
  cursor: pointer;
  position: relative;
  transition: 0.25s;
`;
export const NameText = styled(LabelText)<MaskAndIconBtnProps>`
  font-weight: 600;
  font-size: 20px;
  color: #5c836f;
  margin-right: 8px;
  margin-left: ${(props) => props.$mode === "list" && "32px"};
  width: 220px;
`;
export const SpeciesText = styled.div`
  font-size: 14px;
  letter-spacing: 1px;
  font-style: italic;
  color: #999;
  margin-right: 10px;
`;
interface MaskAndIconBtnProps {
  $show?: boolean;
  $fav?: boolean;
  $mode?: "grid" | "list";
}
const EditIconBtn = styled(IconButton)<MaskAndIconBtnProps>`
  display: ${(props) => (props.$show ? "block" : "none")};
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
    color: ${(props) => (props.$fav ? "#FDDBA9" : "#fff")};
  }
`;
const CardMenuIcon = styled.div<MaskAndIconBtnProps>`
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0);
`;
const CardMask = styled.div<MaskAndIconBtnProps>`
  position: absolute;
  display: ${(props) => (props.$show ? "block" : "none")};
  border-radius: 13px;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  cursor-pointer: text;
`;
const StyledMenuIcon = styled(FontAwesomeIcon)<MaskAndIconBtnProps>`
  background: rgba(0, 0, 0, 0);
  color: ${(props) => (props.$show ? "#fff" : "#5c836f")};
  width: 30px;
  height: 30px;
  transition: 0.25s;
  ${CardMenuIcon}:hover & {
    transform: scale(1.1);
    transition: 0.25s;
  }
`;
const StyledFontAwesomeIcon = styled(FontAwesomeIcon)<MaskAndIconBtnProps>`
  display: ${(props) => props.$show && "block"};
  background: rgba(0, 0, 0, 0);
  z-index: 1;
  color: #fff;
  width: 30px;
  height: 30px;
  transition: height 0.25s;
`;
const CardCheck = styled.input<MaskAndIconBtnProps>`
  position: absolute;
  top: ${(props) => (props.$mode === "list" ? "50%" : "8px")};
  transform: ${(props) => props.$mode === "list" && "translateY(-50%)"};
  left: 15px;
  cursor: pointer;
  height: 20px;
  width: 20px;
  &:checked {
    accent-color: #6a5125;
  }
`;
const IconWrapper = styled.div<MaskAndIconBtnProps>`
  display: flex;
  flex-direction: ${(props) => (props.$mode === "list" ? "row" : "column")};
  justify-content: space-around;
  align-items: center;
  width: ${(props) => (props.$mode === "list" ? "200px" : "40px")};
  height: ${(props) => (props.$show ? "90%" : "30px")};
  padding: 5px;
  border-radius: 15px;
  position: absolute;
  top: ${(props) =>
    props.$mode === "grid" && !props.$show
      ? "195px"
      : props.$mode === "grid" && props.$show && "15px"};
  right: 20px;
  ${(props) =>
    props.$mode === "grid" ? "20px" : !props.$show ? "-50px" : "65px"};
  background: rgba(0, 0, 0, 0);
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
    <>
      <GridWrapper $mode={viewMode}>
        {cardList.length !== 0 &&
          cardList.map((card) => {
            return (
              <Card
                key={card.cardId}
                $mode={viewMode}
                $show={filterCard(card.tags || [])}
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
                    $mode={viewMode}
                    checked={checkList[card.cardId!]}
                    onClick={(e) => {
                      switchOneCheck(card.cardId!);
                      e.stopPropagation();
                    }}
                  />
                )}
                <CardMask
                  $show={cardMaskDisplay}
                  onClick={(e) => e.stopPropagation()}
                />
                {viewMode === "grid" && (
                  <PlantImg path={card.plantPhoto || defaultImg} />
                )}
                <NameText $mode={viewMode}>{card.plantName}</NameText>
                <SpeciesText>{card.species}</SpeciesText>
                <TagsWrapper viewMode={viewMode}>
                  {card?.tags?.length !== 0 &&
                    card.tags?.map((tag: string) => {
                      return <Tag key={`${card.cardId}-${tag}`}>{tag}</Tag>;
                    })}
                </TagsWrapper>
                <IconWrapper $show={cardMaskDisplay} $mode={viewMode}>
                  <DiaryIconBtn
                    $show={cardMaskDisplay}
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
                    $show={cardMaskDisplay}
                    $fav={userInfo.favoriteCards.includes(card.cardId!)}
                    onClick={(e: React.MouseEvent<HTMLElement>) => {
                      favoriteToggle(card.cardId!);
                      e.stopPropagation();
                    }}
                  >
                    <StyledFontAwesomeIcon icon={faBookmark} />
                  </BookMarkIconBtn>
                  <CardMenuIcon
                    $show={cardMaskDisplay}
                    onClick={(e) => {
                      toggleMask();
                      e.stopPropagation();
                    }}
                  >
                    <StyledMenuIcon icon={faEllipsis} $show={cardMaskDisplay} />
                  </CardMenuIcon>
                  {isSelf && (
                    <EditIconBtn
                      $show={cardMaskDisplay}
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
      {cardList.length === 0 && (
        <NoDataSection>
          {isSelf && (
            <>
              <NoDataText>
                You haven't had a plant card. Write one for your plant!
              </NoDataText>
              <NoDataBtn
                onClick={() => {
                  setEditCardId(null);
                  editorToggle();
                  dispatch({
                    type: popUpActions.SHOW_MASK,
                  });
                }}
              >
                Add a new card
              </NoDataBtn>
            </>
          )}
          {!isSelf && <NoDataText>User has no card.</NoDataText>}
        </NoDataSection>
      )}
    </>
  );
};

export default CardsGrid;
