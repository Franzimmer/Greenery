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
  const [detailDisplay, setDetailDisplay] = useState<boolean>(false);
  const [detailData, setDetailData] = useState<PlantCard>();
  const [diaryDisplay, setDiaryDisplay] = useState<boolean>(false);
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
        let docSnapshot = await firebase.getUserInfo(id);
        favorites = docSnapshot.data()?.favoriteCards!;
      }
      if (favorites.length !== 0) {
        let queryData = await firebase.getCards(favorites);
        if (!queryData?.empty) {
          let cards: PlantCard[] = [];
          let cardIds: string[] = [];
          let ownerIds: string[] = [];
          let ownerInfo: UserInfo[] = [];
          queryData?.forEach((doc) => {
            cards.push(doc.data());
            cardIds.push(doc.data().cardId!);
            if (!ownerIds.includes(doc.data().ownerId))
              ownerIds.push(doc.data().ownerId);
          });
          let usersQueryData = firebase.getUsers(ownerIds);
          let checkResult = firebase.checkDiariesExistence(cardIds);
          let renderData = await Promise.all([usersQueryData, checkResult]);
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
        setDetailDisplay={setDetailDisplay}
        setDiaryDisplay={setDiaryDisplay}
        setDiaryId={setDiaryId}
        setOwnerId={setOwnerId}
        findOwnerName={findOwnerName}
      />
      <DetailedCard
        detailDisplay={detailDisplay}
        setDetailDisplay={setDetailDisplay}
        detailData={detailData!}
      />
      <DiaryEditor
        ownerId={ownerId}
        diaryDisplay={diaryDisplay}
        setDiaryDisplay={setDiaryDisplay}
        diaryId={diaryId!}
        setDiaryId={setDiaryId}
      />
    </SectionWrapper>
  );
};

export default Favorites;
