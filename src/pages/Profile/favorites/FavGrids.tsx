import React, { Dispatch, SetStateAction } from "react";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../../store/reducer";
import { PopUpActions } from "../../../store/actions/popUpActions";
import { PlantCard } from "../../../store/types/plantCardType";
import { UserInfoActions } from "../../../store/actions/userInfoActions";
import { firebase } from "../../../utils/firebase";
import { useAlertDispatcher } from "../../../utils/useAlertDispatcher";
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
  $isLoading: boolean;
}
const SectionWrapper = styled.div<SectionWrapperProps>`
  opacity: ${(props) => (props.$isLoading ? "0" : "1")};
  transition: 1s;
`;
const UserLink = styled(Link)`
  text-decoration: none;
  color: ${(props) => props.theme.colors.main};
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
  color: ${(props) => props.theme.colors.main};
  width: 26px;
  height: 26px;
`;
interface FavGridsProps {
  isLoading: boolean;
  diariesExist: boolean[];
  favCards: PlantCard[];
  setDetailData: Dispatch<SetStateAction<PlantCard | undefined>>;
  setDiaryId: Dispatch<SetStateAction<string | null>>;
  setOwnerId: Dispatch<SetStateAction<string>>;
  findOwnerName: (ownerId: string) => string | undefined;
}
const FavGrids = ({
  isLoading,
  diariesExist,
  favCards,
  setDetailData,
  setDiaryId,
  setOwnerId,
  findOwnerName,
}: FavGridsProps) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const alertDispatcher = useAlertDispatcher();
  const { isSelf } = useSelector((state: RootState) => state.authority);
  const userInfo = useSelector((state: RootState) => state.userInfo);

  function isOwner(ownerId: string) {
    if (userInfo.userId === ownerId) return true;
    else return false;
  }
  async function removeFavorite(cardId: string) {
    const userId = userInfo.userId;
    dispatch({
      type: UserInfoActions.DELETE_FAVORITE_PLANT,
      payload: { cardId },
    });
    await firebase.removeFavCard(userId, cardId);
    alertDispatcher("success", "Remove from your Favorites.");
  }
  function handleDetailClick(card: PlantCard) {
    setDetailData(card);
    dispatch({
      type: PopUpActions.SHOW_MASK,
    });
  }
  function handleDiaryclick(card: PlantCard) {
    setOwnerId(card.ownerId);
    setDiaryId(card.cardId);
    dispatch({
      type: PopUpActions.SHOW_MASK,
    });
  }
  return (
    <SectionWrapper $isLoading={isLoading}>
      <GridWrapper $mode={"grid"}>
        {favCards.length !== 0 &&
          favCards.map((card: PlantCard, index) => {
            return (
              <Card
                key={card.cardId}
                $mode={"grid"}
                $show={true}
                onClick={() => handleDetailClick(card)}
              >
                <PlantImg $path={card.plantPhoto || defaultImg} />
                <NameText>
                  <UserLink
                    to={`/profile/${card.ownerId}`}
                    onClick={(e) => {
                      dispatch({
                        type: PopUpActions.HIDE_ALL,
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
                    handleDiaryclick(card);
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
