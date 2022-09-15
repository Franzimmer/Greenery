import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import defaultImg from "./default.jpg";
import DetailedCard from "../../../components/DetailCard/DetailedCard";
import { RootState } from "../../../reducer";
import { PlantCard } from "../../../types/plantCardType";
import { UserInfo } from "../../../types/userInfoType";
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
} from "../cards/CardsGrid";

interface FavoritesProps {
  id: string | undefined;
  isSelf: boolean;
  setTabDisplay: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
}
const Favorites = ({ id, isSelf, setTabDisplay }: FavoritesProps) => {
  const { favoriteCards } = useSelector((state: RootState) => state.userInfo);
  const userInfo = useSelector((state: RootState) => state.userInfo);
  const [favCards, setFavCards] = useState<PlantCard[]>([]);
  const [ownerData, setOwnerData] = useState<UserInfo[]>([]);
  const [detailDisplay, setDetailDisplay] = useState<boolean>(false);
  const [detailData, setDetailData] = useState<PlantCard>();
  function findOwnerName(ownerId: string) {
    let target = ownerData.find((owner) => owner.userId === ownerId);
    return target?.userName;
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
  }, [id]);
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
                // onClick={(e) => {
                // diaryToggle(e);
                //   e.stopPropagation();
                // }}
                >
                  Diary
                </OperationBtn>
                {isSelf && (
                  <FavoriteButton show={true}>Favorite</FavoriteButton>
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
    </>
  );
};

export default Favorites;
