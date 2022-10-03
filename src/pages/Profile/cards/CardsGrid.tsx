import React from "react";
import styled from "styled-components";
import { faBook, faBookmark } from "@fortawesome/free-solid-svg-icons";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../../store/reducer";
import { popUpActions } from "../../../store/reducer/popUpReducer";
import { PlantCard } from "../../../store/types/plantCardType";
import { PlantImg, Tag, TagsWrapper } from "./Cards";
import { LabelText } from "../../../components/GlobalStyles/text";
import {
  NoDataSection,
  NoDataText,
  NoDataBtn,
} from "../../../components/GlobalStyles/noDataLayout";
import {
  FavIconButton,
  DiaryIconBtn,
  StyledFontAwesomeIcon,
} from "../favorites/FavGrids";
import defaultImg from "../../../assets/default.jpg";

interface GridWrapperProps {
  $mode?: "grid" | "list";
}
export const GridWrapper = styled.div<GridWrapperProps>`
  display: ${(props) => (props.$mode === "grid" ? "grid" : "flex")};
  grid-template-columns: repeat(auto-fill, 280px);
  gap: 24px 36px;
  margin-top: 36px;
  flex-direction: column;
`;
interface CardProps {
  $show?: boolean;
  $mode: "grid" | "list";
}
interface CardWrapperProps {
  $show: boolean;
}
const CardWrapper = styled.div<CardWrapperProps>`
  display: ${(props) => (props.$show ? "flex" : "none")};
  flex-direction: row;
`;
export const Card = styled.div<CardProps>`
  width: ${(props) => (props.$mode === "grid" ? "280px" : "75vw")};
  min-height: 290px;
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
interface CardGridIcon {
  $mode: "grid" | "list";
}
const CardGridFavIcon = styled(FavIconButton)<CardGridIcon>`
  top: ${(props) => (props.$mode === "grid" ? "195px" : "initial")};
`;
const CardGridDiaryIcon = styled(DiaryIconBtn)<CardGridIcon>`
  bottom: ${(props) => (props.$mode === "grid" ? "8px" : "initial")};
  right: ${(props) => (props.$mode === "grid" ? "8px" : "48px")};
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
  setOwnerId: React.Dispatch<React.SetStateAction<string>>;
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
  setOwnerId,
  setEditCardId,
  switchOneCheck,
  editorToggle,
  favoriteToggle,
}: CardsGridProps) => {
  const dispatch = useDispatch();
  const userInfo = useSelector((state: RootState) => state.userInfo);
  return (
    <>
      <GridWrapper $mode={viewMode}>
        {cardItems.length !== 0 &&
          cardItems.map((card, index) => {
            return (
              <CardWrapper
                key={card.cardId}
                $show={filterCard(card.tags || [])}
              >
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
                  <CardGridDiaryIcon
                    $show={isSelf || (!isSelf && diariesExist[index])}
                    $mode={viewMode}
                    onClick={(e: React.MouseEvent<HTMLElement>) => {
                      dispatch({
                        type: popUpActions.SHOW_MASK,
                      });
                      setDiaryDisplay(true);
                      setDiaryId(card.cardId);
                      setOwnerId(card.ownerId);
                      e.stopPropagation();
                    }}
                  >
                    <StyledFontAwesomeIcon icon={faBook} />
                  </CardGridDiaryIcon>
                  <CardGridFavIcon
                    $show={userInfo.favoriteCards.includes(card.cardId!)}
                    $mode={viewMode}
                    onClick={(e) => {
                      favoriteToggle(card.cardId!);
                      e.stopPropagation();
                    }}
                  >
                    <StyledFontAwesomeIcon icon={faBookmark} />
                  </CardGridFavIcon>
                </Card>
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
