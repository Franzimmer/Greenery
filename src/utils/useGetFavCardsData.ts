import { useState, useEffect } from "react";
import { UserInfo } from "../store/types/userInfoType";
import { PlantCard } from "../store/types/plantCardType";
import { QuerySnapshot } from "firebase/firestore";
import { firebase } from "./firebase";
const useGetFavCardsData = (
  queryData: QuerySnapshot<PlantCard> | undefined
) => {
  const [favCards, setFavCards] = useState<PlantCard[]>([]);
  const [ownerInfos, setOwnerInfos] = useState<UserInfo[]>([]);
  const [diariesExist, setDiariesExist] = useState<boolean[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  useEffect(() => {
    async function checkDiary(favCardsIds: string[]) {
      const diariesCheck = await firebase.checkDiariesExistence(favCardsIds);
      setDiariesExist(diariesCheck);
    }
    async function getOwnerData(ownerIds: string[]) {
      const ownerInfo: UserInfo[] = [];
      const ownerData = await firebase.getUsers(ownerIds);
      ownerData?.forEach((doc) => {
        ownerInfo.push(doc.data());
      });
      setOwnerInfos(ownerInfo);
    }
    if (!queryData) {
      setTimeout(() => setIsLoading(false), 500);
      return;
    }
    const favCards: PlantCard[] = [];
    const favCardsIds: string[] = [];
    const ownerIds: string[] = [];
    if (!queryData.empty) {
      queryData.forEach((doc) => {
        favCards.push(doc.data());
        favCardsIds.push(doc.data().cardId!);
        if (!ownerIds.includes(doc.data().ownerId))
          ownerIds.push(doc.data().ownerId);
      });
    }
    Promise.all([checkDiary(favCardsIds), getOwnerData(ownerIds)]).then(() => {
      setFavCards(favCards);
      setTimeout(() => setIsLoading(false), 500);
    });
  }, [queryData]);

  return { favCards, ownerInfos, diariesExist, isLoading };
};

export default useGetFavCardsData;
