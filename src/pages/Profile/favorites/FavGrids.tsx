import React from "react";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../../store/reducer";
import { popUpActions } from "../../../store/reducer/popUpReducer";
import { PlantCard } from "../../../store/types/plantCardType";
import { UserInfoActions } from "../../../store/actions/userInfoActions";
import { firebase } from "../../../utils/firebase";
import { PlantImg, Tag, TagsWrapper } from "../cards/Cards";
import { GridWrapper, Card, NameText, SpeciesText } from "../cards/CardsGrid";
import {
  NoDataSection,
  NoDataText,
  NoDataBtn,
} from "../../../components/GlobalStyles/noDataLayout";
import { IconButton } from "../../../components/GlobalStyles/button";
import { faBook, faBookmark } from "@fortawesome/free-solid-svg-icons";
import defaultImg from "../../../assets/default.jpg";
interface SectionWrapperProps {
  isLoading: boolean;
}
const SectionWrapper = styled.div<SectionWrapperProps>`
  opacity: ${(props) => (props.isLoading ? "0" : "1")};
  transition: 1s;
`;
const UserLink = styled(Link)`
  text-decoration: none;
  color: #5c836f;
  &:hover {
    text-decoration: underline;
  }
`;
interface FavIconButtonProps {
  $show: boolean;
}
export const FavIconButton = styled(IconButton)<FavIconButtonProps>`
  position: absolute;
  top: 195px;
  right: 8px;
  margin: 5px;
  transition: 0.25s;
  &:hover {
    transform: scale(1.1);
    transition: 0.25s;
  }
  & * {
    color: ${(props) => !props.$show && "#ccc"};
  }
`;
interface DiaryBtnProps {
  $show?: boolean;
}
export const DiaryIconBtn = styled(IconButton)<DiaryBtnProps>`
  display: ${(props) => (props.$show ? "block" : "none")};
  position: absolute;
  bottom: 8px;
  right: 8px;
  margin: 5px;
  transition: 0.25s;
  &:hover {
    transform: scale(1.1);
    transition: 0.25s;
  }
`;
export const StyledFontAwesomeIcon = styled(FontAwesomeIcon)`
  color: #5c836f;
  width: 26px;
  height: 26px;
`;
interface FavGridsProps {
  isLoading: boolean;
  diariesExist: boolean[];
  favCards: PlantCard[];
  setDetailData: React.Dispatch<React.SetStateAction<PlantCard | undefined>>;
  setDetailDisplay: React.Dispatch<React.SetStateAction<boolean>>;
  setDiaryDisplay: React.Dispatch<React.SetStateAction<boolean>>;
  setDiaryId: React.Dispatch<React.SetStateAction<string | null>>;
  setOwnerId: React.Dispatch<React.SetStateAction<string>>;
  findOwnerName: (ownerId: string) => string | undefined;
}
const FavGrids = ({
  isLoading,
  diariesExist,
  favCards,
  setDetailData,
  setDetailDisplay,
  setDiaryDisplay,
  setDiaryId,
  setOwnerId,
  findOwnerName,
}: FavGridsProps) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isSelf } = useSelector((state: RootState) => state.authority);
  const userInfo = useSelector((state: RootState) => state.userInfo);
  function emitAlert(type: string, msg: string) {
    dispatch({
      type: popUpActions.SHOW_ALERT,
      payload: {
        type,
        msg,
      },
    });
    setTimeout(() => {
      dispatch({
        type: popUpActions.CLOSE_ALERT,
      });
    }, 2000);
  }
  function isOwner(ownerId: string) {
    if (userInfo.userId === ownerId) return true;
    else return false;
  }
  async function removeFavorite(cardId: string) {
    let userId = userInfo.userId;
    dispatch({
      type: UserInfoActions.DELETE_FAVORITE_PLANT,
      payload: { cardId },
    });
    await firebase.removeFavCard(userId, cardId);
    emitAlert("success", "Remove from your Favorites.");
  }
  return (
    <SectionWrapper isLoading={isLoading}>
      <GridWrapper $mode={"grid"}>
        {favCards.length !== 0 &&
          favCards.map((card: PlantCard, index) => {
            return (
              <Card
                key={card.cardId}
                id={card.cardId!}
                $mode={"grid"}
                $show={true}
                onClick={() => {
                  setDetailDisplay(true);
                  setDetailData(card);
                  dispatch({
                    type: popUpActions.SHOW_MASK,
                  });
                }}
              >
                <PlantImg path={card.plantPhoto || defaultImg} />
                <NameText>
                  <UserLink
                    to={`/profile/${card.ownerId}`}
                    onClick={(e) => {
                      dispatch({
                        type: popUpActions.HIDE_ALL,
                      });
                      e.stopPropagation();
                    }}
                  >
                    {findOwnerName(card.ownerId)}
                  </UserLink>
                  's {card.plantName}
                </NameText>
                <SpeciesText>{card.species}</SpeciesText>
                <TagsWrapper>
                  {card?.tags?.length !== 0 &&
                    card.tags?.map((tag) => {
                      return <Tag key={`${card.cardId}-${tag}`}>{tag}</Tag>;
                    })}
                </TagsWrapper>
                <DiaryIconBtn
                  $show={
                    isOwner(card.ownerId) ||
                    (!isOwner(card.ownerId) && diariesExist[index])
                  }
                  onClick={(e) => {
                    setDiaryDisplay(true);
                    setOwnerId(card.ownerId);
                    setDiaryId(card.cardId);
                    dispatch({
                      type: popUpActions.SHOW_MASK,
                    });
                    e.stopPropagation();
                  }}
                >
                  <StyledFontAwesomeIcon icon={faBook} />
                </DiaryIconBtn>
                {isSelf && (
                  <FavIconButton
                    $show={true}
                    onClick={(e) => {
                      removeFavorite(card.cardId!);
                      e.stopPropagation();
                    }}
                  >
                    <StyledFontAwesomeIcon icon={faBookmark} />
                  </FavIconButton>
                )}
              </Card>
            );
          })}
      </GridWrapper>
      {favCards.length === 0 && (
        <NoDataSection>
          {isSelf && (
            <>
              <NoDataText>
                You haven't add any card into your favorites. Go checkout
                other's plants !
              </NoDataText>
              <NoDataBtn onClick={() => navigate("/")}>
                Checkout the most beloved plants
              </NoDataBtn>
            </>
          )}
          {!isSelf && (
            <NoDataText>User has not add any plant in to favorites.</NoDataText>
          )}
        </NoDataSection>
      )}
    </SectionWrapper>
  );
};

export default FavGrids;
