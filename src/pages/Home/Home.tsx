import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { UserInfo } from "../../store/types/userInfoType";
import { PlantCard } from "../../store/types/plantCardType";
import { firebase } from "../../utils/firebase";
import MainVisual from "./MainVisual";
import Quote from "./Quote";
import FeatureSection from "./FeatureSection";
import PopularCards from "./PopularCards";
import DiaryEditor from "../../components/Diary/DiaryEditor";
import DetailedCard from "../../components/DetailCard/DetailedCard";
import PageLoader from "../../components/GlobalStyles/PageLoader";

interface WrapperProps {
  isLoading: boolean;
}
const Wrapper = styled.div<WrapperProps>`
  width: 80vw;
  margin: 150px auto 50px;
  opacity: ${(props) => (props.isLoading ? "0" : "1")};
`;
export const SectionTitle = styled.p`
  margin-bottom: 16px;
  color: #6a5125;
  font-size: 26px;
  letter-spacing: 2px;
  line-height: 30px;
  font-weight: 500;
`;

const Home = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [detailData, setDetailData] = useState<PlantCard>();
  const [diaryId, setDiaryId] = useState<string | null>(null);
  const [ownerId, setOwnerId] = useState<string>("");
  const [diariesExist, setDiariesExist] = useState<boolean[]>([]);
  const [ownerInfos, setOwnerInfos] = useState<UserInfo[]>([]);
  const [favCards, setFavCards] = useState<PlantCard[]>([]);
  useEffect(() => {
    async function getHomePageData() {
      const queryData = await firebase.getPopularCards();
      if (!queryData.empty) {
        const favCards: PlantCard[] = [];
        const favCardsIds: string[] = [];
        const ownerIds: string[] = [];
        const ownerInfo: UserInfo[] = [];
        queryData.forEach((doc) => {
          favCards.push(doc.data());
          favCardsIds.push(doc.data().cardId!);
          if (!ownerIds.includes(doc.data().ownerId))
            ownerIds.push(doc.data().ownerId);
        });
        const diariesCheck = firebase.checkDiariesExistence(favCardsIds);
        const ownerData = firebase.getUsers(ownerIds);
        const renderData = await Promise.all([diariesCheck, ownerData]);
        setDiariesExist(renderData[0]);
        renderData[1]?.forEach((doc) => {
          ownerInfo.push(doc.data());
        });
        setOwnerInfos(ownerInfo);
        setFavCards(favCards);
      }
      setTimeout(() => setIsLoading(false), 1000);
    }
    getHomePageData();
  }, []);
  return (
    <>
      {isLoading && <PageLoader />}
      <Wrapper isLoading={isLoading}>
        <MainVisual />
        <Quote />
        <FeatureSection />
        <PopularCards
          ownerInfos={ownerInfos}
          favCards={favCards}
          setDetailData={setDetailData}
          diariesExist={diariesExist}
          setDiaryId={setDiaryId}
          setOwnerId={setOwnerId}
        ></PopularCards>
        <DetailedCard detailData={detailData!} setDetailData={setDetailData} />
        <DiaryEditor
          ownerId={ownerId}
          diaryId={diaryId!}
          setDiaryId={setDiaryId}
        />
      </Wrapper>
    </>
  );
};

export default Home;
