import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useSelector } from "react-redux";
import { RootState } from "../../../store/reducer";
import { PlantCard } from "../../../store/types/plantCardType";
import { UserInfo } from "../../../store/types/userInfoType";
import { firebase } from "../../../utils/firebase";
import { TabDisplayType } from "../Profile";
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
  const { isSelf } = useSelector((state: RootState) => state.authority);
  const userInfo = useSelector((state: RootState) => state.userInfo);
  const favoriteCards = userInfo.favoriteCards;
  const [favCards, setFavCards] = useState<PlantCard[]>([]);
  const [ownerData, setOwnerData] = useState<UserInfo[]>([]);
  const [detailDisplay, setDetailDisplay] = useState<boolean>(false);
  const [detailData, setDetailData] = useState<PlantCard>();
  const [diaryDisplay, setDiaryDisplay] = useState<boolean>(false);
  const [diaryId, setDiaryId] = useState<string | null>(null);
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
          setFavCards(docData);
          setOwnerData(ownerInfo);
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
        isSelf={isSelf}
        isLoading={isLoading}
        favCards={favCards}
        setDetailData={setDetailData}
        setDetailDisplay={setDetailDisplay}
        setDiaryDisplay={setDiaryDisplay}
        setDiaryId={setDiaryId}
        findOwnerName={findOwnerName}
      />
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
    </SectionWrapper>
  );
};

export default Favorites;
