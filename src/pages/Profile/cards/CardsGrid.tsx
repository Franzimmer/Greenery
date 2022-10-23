import React, { Dispatch, SetStateAction, MouseEvent } from "react";
import styled from "styled-components";
import { faBook, faBookmark } from "@fortawesome/free-solid-svg-icons";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../../store/reducer";
import { PopUpActions } from "../../../store/actions/popUpActions";
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
  row-gap: 12px;
  margin-top: 36px;
  flex-direction: column;
`;
interface CardProps {
  $show?: boolean;
  $mode: "grid" | "list";
}
interface DisplayProps {
  $show: boolean;
}
const CardWrapper = styled.div<DisplayProps>`
  display: ${(props) => (props.$show ? "flex" : "none")};
  flex-direction: row;
`;
export const Card = styled.div<CardProps>`
  width: ${(props) => (props.$mode === "grid" ? "280px" : "75vw")};
  min-height: ${(props) => props.$mode === "grid" && "290px"};
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
  @media (max-width: 1000px) {
    padding-top: ${(props) => props.$mode === "list" && "35px"};
  }
`;
export const NameText = styled(LabelText)<GridWrapperProps>`
  font-weight: 600;
  font-size: 20px;
  color: ${(props) => props.theme.colors.main};
  margin-right: 8px;
  margin-left: ${(props) => props.$mode === "list" && "32px"};
  width: 200px;
  word-wrap: break-word;
  @media (max-width: 600px) {
    width: ${(props) => props.$mode === "list" && "100px"};
    font-weight: 500;
    font-size: 18px;
    letter-spacing: 0;
  }
  @media (max-width: 400px) {
    font-size: 16px;
  }
`;
interface SpeciesTextProps {
  $mode?: "grid" | "list";
}
export const SpeciesText = styled.div<SpeciesTextProps>`
  font-size: 14px;
  letter-spacing: 1px;
  font-style: italic;
  color: #999;
  margin-right: 10px;
  width: 200px;
  word-wrap: break-word;
  @media (max-width: 600px) {
    font-size: ${(props) => props.$mode === "list" && "12"};
    width: ${(props) => props.$mode === "list" && "100px"};
  }
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
    accent-color: ${(props) => props.theme.colors.button};
  }
  @media (max-width: 1000px) {
    transform: ${(props) => props.$mode === "list" && "unset"};
  }
`;
const ListIcon = styled(StyledFontAwesomeIcon)`
  @media (max-width: 1000px) {
    width: 22px;
    height: 24px;
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
const IconWrapper = styled.div<CardGridIcon>`
  display: flex;
  align-items: center;
  @media (max-width: 1000px) {
    position: ${(props) => props.$mode === "list" && "absolute"};
    top: ${(props) => props.$mode === "list" && "20px"};
    right: ${(props) => props.$mode === "list" && "0"};
  }
`;
const InfoWrapper = styled.div<CardGridIcon>`
  display: ${(props) => (props.$mode === "list" ? "flex" : "block")};
  align-items: center;
  @media (max-width: 900px) {
    flex-direction: ${(props) => props.$mode === "list" && "column"};
    align-items: ${(props) => props.$mode === "list" && "flex-end"};
  }
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
  setDetailData: Dispatch<SetStateAction<PlantCard | undefined>>;
  setDiaryId: Dispatch<SetStateAction<string | null>>;
  setOwnerId: Dispatch<SetStateAction<string>>;

  setEditorDisplay: Dispatch<SetStateAction<boolean>>;
  switchOneCheck: (cardId: string) => void;
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
  setDetailData,
  setDiaryId,
  setOwnerId,
  setEditorDisplay,
  switchOneCheck,
  favoriteToggle,
}: CardsGridProps) => {
  const dispatch = useDispatch();
  const userInfo = useSelector((state: RootState) => state.userInfo);
  function handleDiaryClick(card: PlantCard) {
    dispatch({
      type: PopUpActions.SHOW_MASK,
    });
    setDiaryId(card.cardId);
    setOwnerId(card.ownerId);
  }
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
                      type: PopUpActions.SHOW_MASK,
                    });
                    setDetailData(card);
                  }}
                >
                  {isSelf && (
                    <CardCheck
                      type="checkbox"
                      $mode={viewMode}
                      checked={checkList[card.cardId!]}
                      onChange={(e) => {
                        switchOneCheck(card.cardId!);
                        e.stopPropagation();
                      }}
                    />
                  )}
                  {viewMode === "grid" && (
                    <PlantImg $path={card.plantPhoto || defaultImg} />
                  )}
                  <InfoWrapper $mode={viewMode}>
                    <NameText $mode={viewMode}>{card.plantName}</NameText>
                    <SpeciesText $mode={viewMode}>{card.species}</SpeciesText>
                  </InfoWrapper>
                  <TagsWrapper $viewMode={viewMode}>
                    {card?.tags?.length !== 0 &&
                      card.tags?.map((tag: string) => {
                        return (
                          <Tag
                            key={`${card.cardId}-${tag}`}
                            $viewMode={viewMode}
                          >
                            {tag}
                          </Tag>
                        );
                      })}
                  </TagsWrapper>
                  <IconWrapper $mode={viewMode}>
                    <CardGridDiaryIcon
                      $show={isSelf || (!isSelf && diariesExist[index])}
                      $mode={viewMode}
                      onClick={(e: MouseEvent<HTMLElement>) => {
                        handleDiaryClick(card);
                        e.stopPropagation();
                      }}
                    >
                      <ListIcon icon={faBook} />
                    </CardGridDiaryIcon>
                    <CardGridFavIcon
                      $show={userInfo.favoriteCards.includes(card.cardId!)}
                      $mode={viewMode}
                      onClick={(e) => {
                        favoriteToggle(card.cardId!);
                        e.stopPropagation();
                      }}
                    >
                      <ListIcon icon={faBookmark} />
                    </CardGridFavIcon>
                  </IconWrapper>
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
                  setEditorDisplay(true);
                  dispatch({
                    type: PopUpActions.SHOW_MASK,
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
