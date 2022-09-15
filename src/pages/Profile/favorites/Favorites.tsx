import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../../reducer";
import { PlantCard } from "../../../types/plantCardType";
import { UserInfo } from "../../../types/userInfoType";
import { firebase } from "../../../utils/firebase";
import DiaryEditor from "../../../components/Diary/DiaryEditor";
import DetailedCard from "../../../components/DetailCard/DetailedCard";
import FavGrids from "./FavGrids";

interface FavoritesProps {
  id: string | undefined;
  isSelf: boolean;
  setTabDisplay: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
}
const Favorites = ({ id, isSelf, setTabDisplay }: FavoritesProps) => {
  const userInfo = useSelector((state: RootState) => state.userInfo);
  const favoriteCards = userInfo.favoriteCards;
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
      } else {
        setFavCards([]);
        setOwnerData([]);
      }
    }
    getFavCards();
  }, [id, userInfo.userId, favoriteCards, favCards]);
  return (
    <>
      <FavGrids
        isSelf={isSelf}
        favCards={favCards}
        setDetailData={setDetailData}
        setDetailDisplay={setDetailDisplay}
        setDiaryDisplay={setDiaryDisplay}
        setDiaryId={setDiaryId}
        setTabDisplay={setTabDisplay}
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
    </>
  );
};

export default Favorites;
