import React from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../../reducer";
import { PlantCard } from "../../../types/plantCardType";
import { UserInfoActions } from "../../../actions/userInfoActions";
import { firebase } from "../../../utils/firebase";
import {
  GridWrapper,
  Card,
  PlantImg,
  Text,
  Tag,
  TagsWrapper,
  OperationBtn,
  FavoriteButton,
} from "../cards/Cards";
import { defaultState } from "../Profile";
import defaultImg from "../../../assets/default.jpg";

interface FavGridsProps {
  isSelf: boolean;
  favCards: PlantCard[];
  setDetailData: React.Dispatch<React.SetStateAction<PlantCard | undefined>>;
  setDetailDisplay: React.Dispatch<React.SetStateAction<boolean>>;
  setDiaryDisplay: React.Dispatch<React.SetStateAction<boolean>>;
  setDiaryId: React.Dispatch<React.SetStateAction<string | null>>;
  setTabDisplay: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
  findOwnerName: (ownerId: string) => string | undefined;
}
const FavGrids = ({
  isSelf,
  favCards,
  setDetailData,
  setDetailDisplay,
  setDiaryDisplay,
  setDiaryId,
  setTabDisplay,
  findOwnerName,
}: FavGridsProps) => {
  const userInfo = useSelector((state: RootState) => state.userInfo);
  const dispatch = useDispatch();
  async function removeFavorite(cardId: string) {
    let userId = userInfo.userId;
    dispatch({
      type: UserInfoActions.DELETE_FAVORITE_PLANT,
      payload: { cardId },
    });
    await firebase.removeFavCard(userId, cardId);
    alert("已取消收藏！");
  }
  return (
    <GridWrapper>
      {favCards &&
        favCards.map((card: PlantCard) => {
          return (
            <Card
              key={card.cardId}
              id={card.cardId!}
              show={true}
              onClick={(e) => {
                setDetailDisplay(true);
                setDetailData(card);
              }}
            >
              <PlantImg path={card.plantPhoto || defaultImg} />
              <Text>
                <Link
                  to={`/profile/${card.ownerId}`}
                  onClick={() => {
                    setTabDisplay(defaultState);
                  }}
                >
                  {findOwnerName(card.ownerId)}
                </Link>
                的{card.plantName}
              </Text>
              <Text>品種: {card.species}</Text>
              <TagsWrapper>
                {card?.tags?.length !== 0 &&
                  card.tags?.map((tag) => {
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
                <FavoriteButton
                  show={true}
                  onClick={(e) => {
                    removeFavorite(card.cardId!);
                    e.stopPropagation();
                  }}
                >
                  Favorite
                </FavoriteButton>
              )}
            </Card>
          );
        })}
    </GridWrapper>
  );
};

export default FavGrids;
