import React, { useState } from "react";
import styled from "styled-components";
import { PlantCard } from "../../../store/types/plantCardType";
import useFavCards from "../../../utils/useFavCards";
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
  const [detailData, setDetailData] = useState<PlantCard>();
  const [diaryId, setDiaryId] = useState<string | null>(null);
  const [ownerId, setOwnerId] = useState<string>("");
  const { favCards, ownerInfos, diariesExist, isLoading } = useFavCards();
  function findOwnerName(ownerId: string) {
    let target = ownerInfos.find((owner) => owner.userId === ownerId);
    return target?.userName;
  }
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
