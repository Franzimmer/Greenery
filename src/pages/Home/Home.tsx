import React, { useState } from "react";
import styled from "styled-components";
import { PlantCard } from "../../store/types/plantCardType";
import useFavCards from "../../utils/useFavCards";
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
  margin: 100px 0 50px;
  opacity: ${(props) => (props.isLoading ? "0" : "1")};
`;
const ContentWrapper = styled.div`
  width: 80vw;
  margin: 50px auto;
`;
const Home = () => {
  const { favCards, ownerInfos, diariesExist, isLoading } = useFavCards();
  const [detailData, setDetailData] = useState<PlantCard>();
  const [diaryId, setDiaryId] = useState<string | null>(null);
  const [ownerId, setOwnerId] = useState<string>("");

  return (
    <>
      {isLoading && <PageLoader />}
      <Wrapper isLoading={isLoading}>
        <MainVisual />
        <ContentWrapper>
          <Quote />
          <FeatureSection />
          <PopularCards
            ownerInfos={ownerInfos}
            favCards={favCards}
            setDetailData={setDetailData}
            diariesExist={diariesExist}
            setDiaryId={setDiaryId}
            setOwnerId={setOwnerId}
          />
        </ContentWrapper>
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
