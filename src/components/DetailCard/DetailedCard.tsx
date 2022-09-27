import React, { useState } from "react";
import styled from "styled-components";
import { useDispatch } from "react-redux";
import { popUpActions } from "../../store/reducer/popUpReducer";
import { PlantCard } from "../../store/types/plantCardType";
import { unixTimeToString } from "../../utils/helpers";
import { OperationBtn } from "../../components/GlobalStyles/button";
import { LabelText } from "../../components/GlobalStyles/text";
import PropagationMenu from "./PropagationMenu";
import defaultImg from "../../assets/default.jpg";
interface DetailedCardWrapperProps {
  $display: boolean;
}
const DetailedCardWrapper = styled.div<DetailedCardWrapperProps>`
  position: fixed;
  z-index: 101;
  top: 50vh;
  left: 50vw;
  transform: translateX(-50%) translateY(-50%);
  justify-content: space-around;
  background: #f5f0ec;
  display: ${(props) => (props.$display ? "flex" : "none")};
`;
const PageWrapper = styled.div`
  width: 400px;
  display: flex;
  flex-direction: column;
  padding: 30px;
`;
const FlexColumnWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: baseline;
  flex-wrap: wrap;
  margin-top: 20px;
`;
const FlexRowWrapper = styled(FlexColumnWrapper)`
  flex-direction: row;
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
  font-size: 18px;
  color: #5c836f;
  margin: 0 8px 8px 0;
`;
const Description = styled.p`
  font-size: 14px;
`;
const PlantImg = styled.img`
  width: 340px;
  height: auto;
  margin: auto;
`;
const FlexBtnWrapper = styled(FlexRowWrapper)`
  margin-top: auto;
  justify-content: space-around;
`;
const DetailOperationBtn = styled(OperationBtn)`
  background: #5c836f;
  border: 1px solid #5c836f;
  width: 150px;
  transition: 0.25s;
  margin-top: 16px;
  &:hover {
    transform: scale(1.1);
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
        <PageWrapper>
          {detailData?.plantPhoto ? (
            <PlantImg src={detailData.plantPhoto} />
          ) : (
            <PlantImg src={defaultImg} />
          )}
          <FlexRowWrapper>
            {detailData?.plantName && (
              <NameText>{detailData.plantName}</NameText>
            )}
            {detailData?.species && (
              <SpeciesText>{detailData.species}</SpeciesText>
            )}
          </FlexRowWrapper>
          {detailData?.parents && detailData?.parents?.length !== 0 && (
            <FlexRowWrapper>
              <DetailLabelText>Family</DetailLabelText>
              <Description>
                {detailData?.parents?.join(" & ")}'s Baby
              </Description>
            </FlexRowWrapper>
          )}
        </PageWrapper>
        <PageWrapper>
          {detailData?.waterPref && (
            <FlexColumnWrapper>
              <DetailLabelText>Water</DetailLabelText>
              <Description>{detailData.waterPref}</Description>
            </FlexColumnWrapper>
          )}
          {detailData?.lightPref && (
            <FlexColumnWrapper>
              <DetailLabelText>Light</DetailLabelText>
              <Description>{detailData.lightPref}</Description>
            </FlexColumnWrapper>
          )}
          {detailData?.toxicity && (
            <FlexColumnWrapper>
              <DetailLabelText>Toxicity</DetailLabelText>
              <Description>{detailData.toxicity}</Description>
            </FlexColumnWrapper>
          )}
          {detailData?.birthday && (
            <FlexRowWrapper>
              <DetailLabelText>Birthday</DetailLabelText>
              <Description>{unixTimeToString(detailData.birthday)}</Description>
            </FlexRowWrapper>
          )}
          <FlexBtnWrapper>
            {isSelf && (
              <DetailOperationBtn
                onClick={() => {
                  setPropagateDisplay(true);
                  setDetailDisplay(false);
                }}
              >
                Propagate
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
              Close
            </DetailOperationBtn>
          </FlexBtnWrapper>
        </PageWrapper>
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
