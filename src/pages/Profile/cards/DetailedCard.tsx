import React, { useState } from "react";
import styled from "styled-components";
import { PlantCard } from "../../../types/plantCardType";
import { unixTimeToString } from "./CardEditor";
import { OperationBtn } from "./CardsGrid";
import Dialog from "./Dialog";
import PropagationMenu from "./PropagationMenu";
import defaultImg from "./default.jpg";
interface DetailedCardWrapperProps {
  $display: boolean;
}
const DetailedCardWrapper = styled.div<DetailedCardWrapperProps>`
  border: 1px solid #000;
  width: 360px;
  height: auto;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
  padding: 10px;
  display: ${(props) => (props.$display ? "block" : "none")};
`;
const Text = styled.p``;
const PlantImg = styled.img`
  width: 80%;
  height: auto;
`;
interface DetailedCardProps {
  isSelf: boolean;
  detailDisplay: boolean;
  detailData: PlantCard;
  detailToggle: () => void;
}
const DetailedCard = ({
  isSelf,
  detailDisplay,
  detailData,
  detailToggle,
}: DetailedCardProps) => {
  const [tradeDisplay, setTradeDisplay] = useState(false);
  const [propagateDisplay, setPropagateDisplay] = useState(false);
  return (
    <>
      <DetailedCardWrapper $display={detailDisplay}>
        {detailData?.plantPhoto ? (
          <PlantImg src={detailData.plantPhoto} />
        ) : (
          <PlantImg src={defaultImg} />
        )}
        {detailData?.plantName && (
          <>
            <Text>名字</Text>
            <Text>{detailData.plantName}</Text>
          </>
        )}
        {detailData?.species && (
          <>
            <Text>品種</Text>
            <Text>{detailData.species}</Text>
          </>
        )}
        {detailData?.parents?.length !== 0 && (
          <>
            <Text>Family</Text>
            <Text>{detailData?.parents?.join(" & ")}的寶寶</Text>
          </>
        )}
        {detailData?.waterPref && (
          <>
            <Text>水分需求</Text>
            <Text>{detailData.waterPref}</Text>
          </>
        )}
        {detailData?.lightPref && (
          <>
            <Text>光線需求</Text>
            <Text>{detailData.lightPref}</Text>
          </>
        )}
        {detailData?.birthday && (
          <>
            <Text>生日</Text>
            <Text>{unixTimeToString(detailData.birthday)}</Text>
          </>
        )}
        {isSelf && (
          <OperationBtn onClick={() => setTradeDisplay(true)}>
            trade
          </OperationBtn>
        )}
        {isSelf && (
          <OperationBtn onClick={() => setPropagateDisplay(true)}>
            propagate
          </OperationBtn>
        )}
        <OperationBtn onClick={detailToggle}>close</OperationBtn>
      </DetailedCardWrapper>
      <Dialog
        tradeDisplay={tradeDisplay}
        detailToggle={detailToggle}
        setTradeDisplay={setTradeDisplay}
        tradeId={detailData?.cardId!}
      />
      <PropagationMenu
        propagateDisplay={propagateDisplay}
        setPropagateDisplay={setPropagateDisplay}
        propagateParentData={detailData}
      />
    </>
  );
};

export default DetailedCard;
