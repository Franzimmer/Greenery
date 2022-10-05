import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useSelector } from "react-redux";
import { RootState } from "../../../store/reducer";
import { PlantCard } from "../../../store/types/plantCardType";
import { UserInfo } from "../../../store/types/userInfoType";
import { firebase } from "../../../utils/firebase";
import { SectionLoader } from "../../../components/GlobalStyles/PageLoader";
import DiaryEditor from "../../../components/Diary/DiaryEditor";
import DetailedCard from "../../../components/DetailCard/DetailedCard";
import FavGrids from "./FavGrids";

const SectionWrapper = styled.div`
  width: 100%;
`;
interface FavoritesProps {
  id: string | undefined;
}
const Favorites = ({ id }: FavoritesProps) => {
  const userInfo = useSelector((state: RootState) => state.userInfo);
  const favoriteCards = userInfo.favoriteCards;
  const [favCards, setFavCards] = useState<PlantCard[]>([]);
  const [ownerData, setOwnerData] = useState<UserInfo[]>([]);
  const [detailData, setDetailData] = useState<PlantCard>();
  const [diaryId, setDiaryId] = useState<string | null>(null);
  const [ownerId, setOwnerId] = useState<string>("");
  const [diariesExist, setDiariesExist] = useState<boolean[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

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
        const docSnapshot = await firebase.getUserInfo(id);
        favorites = docSnapshot.data()?.favoriteCards!;
      }
      if (favorites.length !== 0) {
        const queryData = await firebase.getCardsByIds(favorites);
        if (!queryData?.empty) {
          const cards: PlantCard[] = [];
          const cardIds: string[] = [];
          const ownerIds: string[] = [];
          const ownerInfo: UserInfo[] = [];
          queryData?.forEach((doc) => {
            cards.push(doc.data());
            cardIds.push(doc.data().cardId!);
            if (!ownerIds.includes(doc.data().ownerId))
              ownerIds.push(doc.data().ownerId);
          });
          const usersQueryData = firebase.getUsers(ownerIds);
          const checkResult = firebase.checkDiariesExistence(cardIds);
          const renderData = await Promise.all([usersQueryData, checkResult]);
          renderData[0]?.forEach((doc) => {
            ownerInfo.push(doc.data());
          });
          setFavCards(cards);
          setOwnerData(ownerInfo);
          setDiariesExist(renderData[1]);
        }
      }
      setTimeout(() => {
        setIsLoading(false);
      }, 500);
    }
    getFavCards();
  }, [id, favoriteCards]);
  return (
    <SectionWrapper>
      {isLoading && <SectionLoader></SectionLoader>}
      <FavGrids
        isLoading={isLoading}
        diariesExist={diariesExist}
        favCards={favCards}
        setDetailData={setDetailData}
        setDiaryId={setDiaryId}
        setOwnerId={setOwnerId}
        findOwnerName={findOwnerName}
      />
      <DetailedCard detailData={detailData!} setDetailData={setDetailData} />
      <DiaryEditor
        ownerId={ownerId}
        diaryId={diaryId!}
        setDiaryId={setDiaryId}
      />
    </SectionWrapper>
  );
};

export default Favorites;
