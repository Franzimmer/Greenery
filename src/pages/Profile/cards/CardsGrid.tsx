import React from "react";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBook,
  faPenToSquare,
  faBookmark,
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
  $mode?: "grid" | "list";
}
export const GridWrapper = styled.div<GridWrapperProps>`
  display: ${(props) => (props.$mode === "grid" ? "grid" : "flex")};
  grid-template-columns: repeat(auto-fill, 280px);
  gap: 24px 64px;
  margin-top: 36px;
  flex-direction: column;
`;
interface CardProps {
  $show?: boolean;
  $mode: "grid" | "list";
}
const CardWrapper = styled.div<GridWrapperProps>`
  display: flex;
  flex-direction: row;
`;
export const Card = styled.div<CardProps>`
  width: ${(props) => (props.$mode === "grid" ? "280px" : "75vw")};
  display: ${(props) => (props.$show ? "flex" : "none")};
  flex-direction: ${(props) => (props.$mode === "grid" ? "column" : "row")};
  justify-content: flex-start;
  align-items: ${(props) => (props.$mode === "grid" ? "flex-start" : "center")};
  background: #fff;
  border-radius: 15px;
  padding: ${(props) => (props.$mode === "list" ? "15px" : "30px 15px 15px")};
  cursor: pointer;
  position: relative;
  transition: 1s;
  // box-shadow: 6px 6px 4px 4px rgba(150, 150, 150, 0.4);
`;
export const NameText = styled(LabelText)<GridWrapperProps>`
  font-weight: 600;
  font-size: 20px;
  color: #5c836f;
  margin-right: 8px;
  margin-left: ${(props) => props.$mode === "list" && "32px"};
  width: 200px;
  word-wrap: break-word;
`;
export const SpeciesText = styled.div`
  font-size: 14px;
  letter-spacing: 1px;
  font-style: italic;
  color: #999;
  margin-right: 10px;
  width: 200px;
  word-wrap: break-word;
`;
const EditIconBtn = styled(IconButton)`
  width: 100%;
  background: rgba(0, 0, 0, 0);
  margin: 0 0 16px 0;
  transition: 0.25s;
  &:hover {
    transform: scale(1.1);
    transition: 0.25s;
  }
  & * {
    color: #5c836f;
  }
`;
interface DiaryBtnProps {
  $show?: boolean;
}
const DiaryIconBtn = styled(EditIconBtn)<DiaryBtnProps>`
  display: ${(props) => (props.$show ? "block" : "none")};
`;
interface FavBtnProps {
  $fav?: boolean;
}
const BookMarkIconBtn = styled(EditIconBtn)<FavBtnProps>`
  & * {
    color: ${(props) => (props.$fav ? "#5c836f" : "#bbb")};
  }
`;
const StyledFontAwesomeIcon = styled(FontAwesomeIcon)`
  display: block;
  background: rgba(0, 0, 0, 0);
  width: 28px;
  height: 28px;
`;
const BookmarkIcon = styled(StyledFontAwesomeIcon)`
  width: 28px;
  height: 28px;
`;
const CardCheck = styled.input<GridWrapperProps>`
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
const IconWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  border-radius: 15px;
  background: rgba(0, 0, 0, 0);
  margin: 4px 0 0 8px;
`;

type CheckList = Record<string, boolean>;
interface CardsGridProps {
  isSelf: boolean;
  isLoading: boolean;
  diariesExist: boolean[];
  viewMode: "grid" | "list";
  cardItems: PlantCard[];
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
  isLoading,
  diariesExist,
  viewMode,
  cardItems,
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
  console.log(diariesExist);
  return (
    <>
      <GridWrapper $mode={viewMode}>
        {cardItems.length !== 0 &&
          cardItems.map((card, index) => {
            return (
              <CardWrapper $mode={viewMode} key={card.cardId}>
                <Card
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
                </Card>
                <IconWrapper>
                  {isSelf && (
                    <EditIconBtn
                      onClick={(e: React.MouseEvent<HTMLElement>) => {
                        dispatch({
                          type: popUpActions.SHOW_MASK,
                        });
                        setEditCardId(card.cardId);
                        editorToggle();
                        e.stopPropagation();
                      }}
                    >
                      <StyledFontAwesomeIcon icon={faPenToSquare} />
                    </EditIconBtn>
                  )}
                  <DiaryIconBtn
                    $show={isSelf || (!isSelf && diariesExist[index])}
                    onClick={(e: React.MouseEvent<HTMLElement>) => {
                      dispatch({
                        type: popUpActions.SHOW_MASK,
                      });
                      setDiaryDisplay(true);
                      setDiaryId(card.cardId);
                      e.stopPropagation();
                    }}
                  >
                    <StyledFontAwesomeIcon icon={faBook} />
                  </DiaryIconBtn>
                  <BookMarkIconBtn
                    $fav={userInfo.favoriteCards.includes(card.cardId!)}
                    onClick={(e: React.MouseEvent<HTMLElement>) => {
                      favoriteToggle(card.cardId!);
                      e.stopPropagation();
                    }}
                  >
                    <BookmarkIcon icon={faBookmark} />
                  </BookMarkIconBtn>
                </IconWrapper>
              </CardWrapper>
            );
          })}
      </GridWrapper>
      {cardItems.length === 0 && !isLoading && (
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
