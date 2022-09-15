import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import defaultImg from "./default.jpg";
import DiaryEditor from "../../../components/Diary/DiaryEditor";
import DetailedCard from "../../../components/DetailCard/DetailedCard";
import { RootState } from "../../../reducer";
import { PlantCard } from "../../../types/plantCardType";
import { UserInfo } from "../../../types/userInfoType";
import { UserInfoActions } from "../../../actions/userInfoActions";
import { firebase } from "../../../utils/firebase";
import { Link } from "react-router-dom";
import { defaultState } from "../Profile";
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

interface FavoritesProps {
  id: string | undefined;
  isSelf: boolean;
  setTabDisplay: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
}
const Favorites = ({ id, isSelf, setTabDisplay }: FavoritesProps) => {
  const userInfo = useSelector((state: RootState) => state.userInfo);
  const favoriteCards = userInfo.favoriteCards;
  const dispatch = useDispatch();
  const [favCards, setFavCards] = useState<PlantCard[]>([]);
  const [ownerData, setOwnerData] = useState<UserInfo[]>([]);
  const [detailDisplay, setDetailDisplay] = useState<boolean>(false);
  const [detailData, setDetailData] = useState<PlantCard>();
  const [diaryDisplay, setDiaryDisplay] = useState<boolean>(false);
  const [diaryId, setDiaryId] = useState<string | null>(null);
  function findOwnerName(ownerId: string) {
    let target = ownerData.find((owner) => owner.userId === ownerId);
    return target?.userName;
  }
  async function removeFavorite(cardId: string) {
    let userId = userInfo.userId;
    dispatch({
      type: UserInfoActions.DELETE_FAVORITE_PLANT,
      payload: { cardId },
    });
    await firebase.removeFavCard(userId, cardId);
    alert("已取消收藏！");
  }
  useEffect(() => {
    async function getFavCards() {
      if (!id) return;
      let favorites: string[];
      if (userInfo.userId === id) {
        favorites = favoriteCards;
      } else {
        let docSnapshot = await firebase.getUserInfo(id);
        favorites = docSnapshot.data()?.favoriteCards!;
      }
      if (favorites.length !== 0) {
        let queryData = await firebase.getCards(favorites);
        if (!queryData?.empty) {
          let docData: PlantCard[] = [];
          let ownerIds: string[] = [];
          let ownerInfo: UserInfo[] = [];
          queryData?.forEach((doc) => {
            docData.push(doc.data());
            if (!ownerIds.includes(doc.data().ownerId))
              ownerIds.push(doc.data().ownerId);
          });
          let usersQueryData = await firebase.getUsers(ownerIds);
          usersQueryData?.forEach((doc) => {
            ownerInfo.push(doc.data());
          });
          console.log(docData);
          setFavCards(docData);
          setOwnerData(ownerInfo);
        }
      } else {
        setFavCards([]);
        setOwnerData([]);
      }
    }
    getFavCards();
  }, [id, favoriteCards, favCards]);
  return (
    <>
      <GridWrapper>
        {favCards &&
          favCards.map((card) => {
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
      <DetailedCard
        isSelf={isSelf}
        detailDisplay={detailDisplay}
        setDetailDisplay={setDetailDisplay}
        detailData={detailData!}
      />
      <DiaryEditor
        isSelf={isSelf}
        diaryDisplay={diaryDisplay}
        setDiaryDisplay={setDiaryDisplay}
        diaryId={diaryId!}
        setDiaryId={setDiaryId}
      />
    </>
  );
};

export default Favorites;
