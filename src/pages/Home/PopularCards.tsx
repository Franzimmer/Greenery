import React, { Dispatch, SetStateAction } from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../store/reducer";
import { UserInfo } from "../../store/types/userInfoType";
import { PlantCard } from "../../store/types/plantCardType";
import { UserInfoActions } from "../../store/actions/userInfoActions";
import { PopUpActions } from "../../store/actions/popUpActions";
import { firebase } from "../../utils/firebase";
import { useAlertDispatcher } from "../../utils/useAlertDispatcher";
import { PlantImg, Tag, TagsWrapper } from "../Profile/cards/Cards";
import { Card, NameText, SpeciesText } from "../Profile/cards/CardsGrid";
import defaultImg from "../../assets/default.jpg";
import { SectionTitle } from "./FeatureSection";
import {
  FavIconButton,
  DiaryIconBtn,
  StyledFontAwesomeIcon,
} from "../Profile/favorites/FavGrids";
import { faBook, faBookmark } from "@fortawesome/free-solid-svg-icons";

const CardsWrapper = styled.div``;
const CardsFlexWrpper = styled.div`
  width: 80vw;
  padding: 24px;
  overflow-x: auto;
  display: flex;
  border-radius: 8px;
  box-shadow: inset 25px 0px 20px -30px rgba(0, 0, 0, 0.45),
    inset -25px 0px 20px -30px rgba(0, 0, 0, 0.45);
  & ${Card} {
    margin-right: 24px;
  }
  &::-webkit-scrollbar {
    display: none;
  }
`;
const UserLink = styled(Link)`
  text-decoration: none;
  color: ${(props) => props.theme.colors.main};
  &:hover {
    text-decoration: underline;
  }
`;
interface PopularCardsProps {
  ownerInfos: UserInfo[];
  favCards: PlantCard[];
  diariesExist: boolean[];
  setDetailData: Dispatch<SetStateAction<PlantCard | undefined>>;
  setDiaryId: Dispatch<SetStateAction<string | null>>;
  setOwnerId: Dispatch<SetStateAction<string>>;
}
const PopularCards = ({
  ownerInfos,
  favCards,
  diariesExist,
  setDetailData,
  setDiaryId,
  setOwnerId,
}: PopularCardsProps) => {
  const dispatch = useDispatch();
  const alertDispatcher = useAlertDispatcher();
  const userInfo = useSelector((state: RootState) => state.userInfo);
  const { isLoggedIn } = useSelector((state: RootState) => state.authority);

  async function favoriteToggle(cardId: string) {
    const userId = userInfo.userId;
    if (userInfo.favoriteCards.includes(cardId)) {
      dispatch({
        type: UserInfoActions.DELETE_FAVORITE_PLANT,
        payload: { cardId },
      });
      await firebase.removeFavCard(userId, cardId);
      alertDispatcher("success", "Remove from your Favorites.");
    } else {
      dispatch({
        type: UserInfoActions.ADD_FAVORITE_PLANT,
        payload: { cardId },
      });
      await firebase.addFavCard(userId, cardId);
      alertDispatcher("success", "Add to Favorites!");
    }
  }
  function findOwnerName(ownerId: string) {
    const target = ownerInfos.find((owner) => owner.userId === ownerId);
    return target?.userName;
  }
  function handleDiaryclick(card: PlantCard) {
    setDiaryId(card.cardId);
    setOwnerId(card.ownerId);
    dispatch({
      type: PopUpActions.SHOW_MASK,
    });
  }
  return (
    <CardsWrapper>
      <SectionTitle>Our Most Beloved Plants</SectionTitle>
      <CardsFlexWrpper>
        {favCards.length !== 0 &&
          favCards.map((card, index) => {
            return (
              <Card
                key={card.cardId}
                $mode={"grid"}
                $show={true}
                onClick={() => {
                  setDetailData(card);
                  dispatch({
                    type: PopUpActions.SHOW_MASK,
                  });
                }}
              >
                <PlantImg $path={card.plantPhoto || defaultImg} />
                <NameText>
                  <UserLink
                    to={`/profile/${card.ownerId}`}
                    onClick={(e) => {
                      dispatch({
                        type: PopUpActions.HIDE_ALL,
                      });
                      e.stopPropagation();
                    }}
                  >
                    {findOwnerName(card.ownerId)}
                  </UserLink>
                  's {card.plantName}
                </NameText>
                <SpeciesText>{card.species}</SpeciesText>
                <TagsWrapper>
                  {card?.tags?.length !== 0 &&
                    card.tags?.map((tag: string) => {
                      return <Tag key={`${card.cardId}-${tag}`}>{tag}</Tag>;
                    })}
                </TagsWrapper>
                <DiaryIconBtn
                  $show={diariesExist[index]}
                  onClick={(e) => {
                    handleDiaryclick(card);
                    e.stopPropagation();
                  }}
                >
                  <StyledFontAwesomeIcon icon={faBook} />
                </DiaryIconBtn>
                {isLoggedIn && (
                  <FavIconButton
                    $show={
                      userInfo?.favoriteCards.includes(card.cardId!) || false
                    }
                    onClick={(e: React.MouseEvent<HTMLElement>) => {
                      favoriteToggle(card.cardId!);
                      e.stopPropagation();
                    }}
                  >
                    <StyledFontAwesomeIcon icon={faBookmark} />
                  </FavIconButton>
                )}
              </Card>
            );
          })}
      </CardsFlexWrpper>
    </CardsWrapper>
  );
};

export default PopularCards;
