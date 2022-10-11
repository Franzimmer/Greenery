import React, { Dispatch, SetStateAction } from "react";
import styled from "styled-components";
import { useDispatch } from "react-redux";
import { PopUpActions } from "../../../store/actions/popUpActions";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { PlantImg, Tag, TagsWrapper } from "../../Profile/cards/Cards";
import { Card, NameText, SpeciesText } from "../../Profile/cards/CardsGrid";
import { DiaryIconBtn } from "../../Profile/favorites/FavGrids";
import { faBook } from "@fortawesome/free-solid-svg-icons";
import { PlantCard } from "../../../store/types/plantCardType";
const OverflowWrapper = styled.div`
  min-width: fit-content;
  flex-basis: 300px;
  overflow-x: scroll;
  &::-webkit-scrollbar {
    -webkit-appearance: none;
    width: 4px;
    height: 6px;
  }

  &::-webkit-scrollbar-thumb {
    border-radius: 4px;
    background-color: rgba(0, 0, 0, 0.5);
    box-shadow: 0 0 1px rgba(255, 255, 255, 0.5);
  }
`;
const TradeCardWrapper = styled.div`
  width: 300px;
  display: flex;
  flex-direction: row;
`;
const TradeCard = styled(Card)`
  margin: 12px;
`;
const BookFontAwesomeIcon = styled(FontAwesomeIcon)`
  color: ${(props) => props.theme.colors.main};
  width: 26px;
  height: 26px;
`;
interface TradeCardSectionProps {
  cards: PlantCard[];
  setDetailData: Dispatch<SetStateAction<PlantCard | undefined>>;
  setDiaryId: Dispatch<SetStateAction<string | null>>;
  setOwnerId: Dispatch<SetStateAction<string>>;
}
const TradeCardSection = ({
  cards,
  setDetailData,
  setDiaryId,
  setOwnerId,
}: TradeCardSectionProps) => {
  const dispatch = useDispatch();
  function handleDiaryClick(card: PlantCard) {
    setDiaryId(card.cardId!);
    setOwnerId(card.ownerId!);
    dispatch({
      type: PopUpActions.SHOW_MASK,
    });
  }
  function handleDetailClick(card: PlantCard) {
    setDetailData(card);
    dispatch({
      type: PopUpActions.SHOW_MASK,
    });
  }
  return (
    <OverflowWrapper>
      <TradeCardWrapper>
        {cards.map((card) => {
          return (
            <TradeCard
              key={card.cardId}
              $show={true}
              $mode={"grid"}
              onClick={() => handleDetailClick(card)}
            >
              <PlantImg $path={card.plantPhoto} />
              <NameText>{card.plantName}</NameText>
              <SpeciesText>{card.species}</SpeciesText>
              <TagsWrapper>
                {card?.tags?.length !== 0 &&
                  card.tags?.map((tag) => {
                    return <Tag key={`${card.cardId}-${tag}`}>{tag}</Tag>;
                  })}
              </TagsWrapper>
              <DiaryIconBtn
                onClick={async (e) => {
                  handleDiaryClick(card);
                  e.stopPropagation();
                }}
              >
                <BookFontAwesomeIcon icon={faBook} />
              </DiaryIconBtn>
            </TradeCard>
          );
        })}
      </TradeCardWrapper>
    </OverflowWrapper>
  );
};

export default TradeCardSection;
