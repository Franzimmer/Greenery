import { useState, useEffect } from "react";
import { useParams, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../store/reducer/index";
import { PlantCard } from "../store/types/plantCardType";
import { QuerySnapshot } from "firebase/firestore";
import { firebase } from "./firebase";
import useGetFavCards from "./useGetFavCardsData";

const useFavCards = () => {
  const { id } = useParams();
  const location = useLocation();
  const userInfo = useSelector((state: RootState) => state.userInfo);
  const { favoriteCards } = useSelector((state: RootState) => state.userInfo);
  const [queryData, setQueryData] = useState<QuerySnapshot<PlantCard>>();
  const { favCards, ownerInfos, diariesExist, isLoading } = useGetFavCards(
    queryData
  );
  useEffect(() => {
    async function getUserFavorites() {
      if (!id) return;
      let favorites: string[];
      if (userInfo.userId === id) favorites = favoriteCards;
      else {
        const docSnapshot = await firebase.getUserInfo(id);
        favorites = docSnapshot.data()?.favoriteCards!;
      }
      const queryData = await firebase.getCardsByIds(favorites);
      if (queryData?.empty || !queryData) return;
      setQueryData(queryData);
    }
    getUserFavorites();
  }, [id, favoriteCards]);
  useEffect(() => {
    async function getHomepageData() {
      if (location.pathname === "/") {
        const queryData = await firebase.getPopularCards();
        setQueryData(queryData);
      } else return;
    }
    getHomepageData();
  }, [location]);
  return { favCards, ownerInfos, diariesExist, isLoading };
};

export default useFavCards;
