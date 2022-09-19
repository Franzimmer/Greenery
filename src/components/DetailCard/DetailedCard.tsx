import React, { useState } from "react";
import styled from "styled-components";
import { useDispatch } from "react-redux";
import { popUpActions } from "../../reducer/popUpReducer";
import { PlantCard } from "../../types/plantCardType";
import { unixTimeToString } from "../../utils/helpers";
import { OperationBtn } from "../../components/GlobalStyles/button";
import { LabelText } from "../../components/GlobalStyles/text";
import PropagationMenu from "./PropagationMenu";
import defaultImg from "../../assets/default.jpg";
interface DetailedCardWrapperProps {
  $display: boolean;
}
const DetailedCardWrapper = styled.div<DetailedCardWrapperProps>`
  position: absolute;
  z-index: 101;
  top: 50vh;
  left: 50vw;
  transform: translateX(-50%) translateY(-50%);
  border: 1px solid #6a5125;
  width: 400px;
  height: auto;
  flex-direction: column;
  justify-content: space-around;
  padding: 30px;
  background: #f5f0ec;
  display: ${(props) => (props.$display ? "flex" : "none")};
`;
const FlexWrapper = styled.div`
  display: flex;
  align-items: baseline;
  flex-wrap: wrap;
  margin-top: 12px;
`;
const NameText = styled(LabelText)`
  font-size: 26px;
  color: #5c836f;
  margin-right: 12px;
`;
const SpeciesText = styled.div`
  font-size: 14px;
  letter-spacing: 1px;
  font-style: italic;
  color: #999;
`;
const DetailLabelText = styled(LabelText)`
  color: #5c836f;
  margin-right: 8px;
`;
const Text = styled.p`
  font-size: 14px;
  padding-left: 8px;
`;
const Description = styled(Text)`
  border-left: 3px solid #5c836f;
`;
const PlantImg = styled.img`
  width: 280px;
  height: auto;
  margin auto;
`;
const FlexBtnWrapper = styled(FlexWrapper)`
  justify-content: space-around;
`;
const DetailOperationBtn = styled(OperationBtn)`
  width: 150px;
  transition: 0.25s;
  &:hover {
    transform: translateY(5px);
    transition: 0.25s;
  }
`;
interface DetailedCardProps {
  isSelf: boolean;
  detailDisplay: boolean;
  detailData: PlantCard;
  setDetailDisplay: React.Dispatch<React.SetStateAction<boolean>>;
}
const DetailedCard = ({
  isSelf,
  detailDisplay,
  detailData,
  setDetailDisplay,
}: DetailedCardProps) => {
  const dispatch = useDispatch();
  const [propagateDisplay, setPropagateDisplay] = useState(false);
  return (
    <>
      <DetailedCardWrapper $display={detailDisplay}>
        {detailData?.plantPhoto ? (
          <PlantImg src={detailData.plantPhoto} />
        ) : (
          <PlantImg src={defaultImg} />
        )}
        <FlexWrapper>
          {detailData?.plantName && <NameText>{detailData.plantName}</NameText>}
          {detailData?.species && (
            <SpeciesText>{detailData.species}</SpeciesText>
          )}
        </FlexWrapper>
        {detailData?.parents && detailData?.parents?.length !== 0 && (
          <>
            <Text>Family</Text>
            <Text>{detailData?.parents?.join(" & ")}'s Baby</Text>
          </>
        )}
        {detailData?.waterPref && (
          <FlexWrapper>
            <DetailLabelText>Water</DetailLabelText>
            <Description>{detailData.waterPref}</Description>
          </FlexWrapper>
        )}
        {detailData?.lightPref && (
          <FlexWrapper>
            <DetailLabelText>Light</DetailLabelText>
            <Description>{detailData.lightPref}</Description>
          </FlexWrapper>
        )}
        {detailData?.birthday && (
          <FlexWrapper>
            <DetailLabelText>Birthday</DetailLabelText>
            <Text>{unixTimeToString(detailData.birthday)}</Text>
          </FlexWrapper>
        )}
        <FlexBtnWrapper>
          {isSelf && (
            <DetailOperationBtn
              onClick={() => {
                setPropagateDisplay(true);
                setDetailDisplay(false);
              }}
            >
              propagate
            </DetailOperationBtn>
          )}
          <DetailOperationBtn
            onClick={() => {
              setDetailDisplay(false);
              dispatch({
                type: popUpActions.HIDE_ALL,
              });
            }}
          >
            close
          </DetailOperationBtn>
        </FlexBtnWrapper>
      </DetailedCardWrapper>
      <PropagationMenu
        propagateDisplay={propagateDisplay}
        setPropagateDisplay={setPropagateDisplay}
        propagateParentData={detailData}
      />
    </>
  );
};

export default DetailedCard;
