import React, { useState, Dispatch, SetStateAction } from "react";
import styled from "styled-components";
import { useSelector, useDispatch } from "react-redux";
import { PlantCard } from "../../store/types/plantCardType";
import { RootState } from "../../store/reducer";
import { PopUpActions } from "../../store/actions/popUpActions";
import { unixTimeToString } from "../../utils/helpers";
import { OperationBtn, IconButton } from "../../components/GlobalStyles/button";
import { LabelText } from "../../components/GlobalStyles/text";
import { StyledFontAwesomeIcon } from "../../pages/Profile/favorites/FavGrids";
import CardEditor from "../../pages/Profile/cards/CardEditor";
import PropagationMenu from "./PropagationMenu";
import defaultImg from "../../assets/default.jpg";
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons";

const DetailedCardWrapper = styled.div`
  position: fixed;
  z-index: 101;
  top: 50vh;
  left: 50vw;
  transform: translateX(-50%) translateY(-50%);
  justify-content: space-around;
  background: #f5f0ec;
  display: flex;
  @media (max-width: 800px) {
    flex-direction: column;
    max-height: 90vh;
    justify-content: center;
  }
`;
const PageWrapper = styled.div`
  width: 400px;
  height: 650px;
  display: flex;
  flex-direction: column;
  padding: 30px;
  @media (max-width: 800px) {
    width: 340px;
    padding: 15px;
    min-height: 0;
    margin-top: 8px;
  }
`;
const DescriptionWrapper = styled.div`
  height: 500px;
  overflow-y: scroll;
  &::-webkit-scrollbar {
    -webkit-appearance: none;
    width: 7px;
  }

  &::-webkit-scrollbar-thumb {
    border-radius: 4px;
    background-color: rgba(0, 0, 0, 0.5);
    box-shadow: 0 0 1px rgba(255, 255, 255, 0.5);
  }
  @media (max-width: 800px) {
    height: 300px;
    margin: 0 0 8px 0;
  }
`;
const FlexColumnWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: baseline;
  flex-wrap: wrap;
  margin-top: 12px;
  @media (max-width: 800px) {
    margin-top: 0px;
  }
`;
const FlexRowWrapper = styled(FlexColumnWrapper)`
  flex-direction: row;
`;
const NameText = styled(LabelText)`
  font-size: 26px;
  color: ${(props) => props.theme.colors.main};
  margin-right: 12px;
  width: 340px;
  word-wrap: break-word;
  @media (max-width: 800px) {
    font-size: 16px;
    margin-top: 4px;
  }
`;
const SpeciesText = styled.div`
  font-size: 14px;
  letter-spacing: 1px;
  font-style: italic;
  color: #999;
  width: 340px;
  word-wrap: break-word;
  @media (max-width: 800px) {
    font-size: 12px;
    letter-spacing: 0px;
  }
`;
const DetailLabelText = styled(LabelText)`
  font-size: 18px;
  color: ${(props) => props.theme.colors.main};
  margin: 0 8px 8px 0;
  @media (max-width: 800px) {
    font-size: 14px;
    margin: 0 8px 0 0;
  }
`;
const Description = styled.p`
  font-size: 14px;
  @media (max-width: 800px) {
    padding: 4px 0px;
    font-size: 12px;
  }
`;
const PlantImg = styled.img`
  width: auto;
  height: auto;
  margin: auto;
  box-shadow: 16px 12px 0px 0px ${(props) => props.theme.colors.main};
  max-width: 340px;
  max-height: 450px;
  @media (max-width: 800px) {
    max-width: 310px;
    max-height: 80%;
    box-shadow: 0 0 8px 4px rgb(0 0 0 / 25%);
  }
`;
const FlexBtnWrapper = styled(FlexRowWrapper)`
  margin-top: auto;
  justify-content: space-around;
`;
const DetailOperationBtn = styled(OperationBtn)`
  background: ${(props) => props.theme.colors.main};
  border: 1px solid ${(props) => props.theme.colors.main};
  width: 150px;
  transition: 0.25s;
  margin-top: 16px;
  &:hover {
    transform: scale(1.1);
    transition: 0.25s;
  }
  @media (max-width: 800px) {
    width: 100px;
    font-size: 14px;
    height: 24px;
    padding: 0;
  }
`;
const EditIconBtn = styled(IconButton)`
  background: rgba(0, 0, 0, 0);
  margin: 0 0 8px auto;
  transition: 0.25s;
  &:hover {
    transform: scale(1.1);
    transition: 0.25s;
  }
  & * {
    color: ${(props) => props.theme.colors.main};
  }
`;
const EditIcon = styled(StyledFontAwesomeIcon)`
  @media (max-width: 800px) {
    width: 20px;
    height: 20px;
  }
`;
interface DetailedCardProps {
  detailData: PlantCard;
  setDetailData: Dispatch<SetStateAction<PlantCard | undefined>>;
}
const DetailedCard = ({ detailData, setDetailData }: DetailedCardProps) => {
  const dispatch = useDispatch();
  const userInfo = useSelector((state: RootState) => state.userInfo);
  const [propagateDisplay, setPropagateDisplay] = useState(false);
  const [editCardId, setEditCardId] = useState<string | null>(null);
  const [editorDisplay, setEditorDisplay] = useState<boolean>(false);
  function isOwner(ownerId: string) {
    if (userInfo.userId === ownerId) return true;
    else return false;
  }
  function handleEditorClick(cardId: string) {
    setEditCardId(cardId);
    setDetailData(undefined);
  }
  return (
    <>
      {detailData && !propagateDisplay && (
        <DetailedCardWrapper>
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
            {detailData?.birthday && (
              <FlexRowWrapper>
                <DetailLabelText>Birthday</DetailLabelText>
                <Description>
                  {unixTimeToString(detailData.birthday)}
                </Description>
              </FlexRowWrapper>
            )}
          </PageWrapper>
          <PageWrapper>
            {detailData && detailData.ownerId === userInfo.userId && (
              <EditIconBtn
                onClick={(e: React.MouseEvent<HTMLElement>) => {
                  handleEditorClick(detailData.cardId!);
                  e.stopPropagation();
                }}
              >
                <EditIcon icon={faPenToSquare} />
              </EditIconBtn>
            )}
            <DescriptionWrapper>
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
            </DescriptionWrapper>
            <FlexBtnWrapper>
              {isOwner(detailData?.ownerId) && (
                <DetailOperationBtn
                  onClick={() => {
                    setPropagateDisplay(true);
                  }}
                >
                  Propagate
                </DetailOperationBtn>
              )}
              <DetailOperationBtn
                onClick={() => {
                  setDetailData(undefined);
                  dispatch({
                    type: PopUpActions.HIDE_ALL,
                  });
                }}
              >
                Close
              </DetailOperationBtn>
            </FlexBtnWrapper>
          </PageWrapper>
        </DetailedCardWrapper>
      )}
      <PropagationMenu
        propagateDisplay={propagateDisplay}
        setPropagateDisplay={setPropagateDisplay}
        propagateParentData={detailData}
        setDetailData={setDetailData}
      />
      <CardEditor
        userId={userInfo.userId}
        editorDisplay={editorDisplay}
        setEditorDisplay={setEditorDisplay}
        editCardId={editCardId}
        setEditCardId={setEditCardId}
      />
    </>
  );
};

export default DetailedCard;
