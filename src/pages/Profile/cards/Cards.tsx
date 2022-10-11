import React, { useEffect, useState } from "react";
import styled, { keyframes } from "styled-components";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../../store/reducer/index";
import { PopUpActions } from "../../../store/actions/popUpActions";
import { CardsActions } from "../../../store/actions/cardsActions";
import { UserInfoActions } from "../../../store/actions/userInfoActions";
import { PlantCard } from "../../../store/types/plantCardType";
import { firebase } from "../../../utils/firebase";
import { useAlertDispatcher } from "../../../utils/useAlertDispatcher";
import { OperationBtn } from "../../../components/GlobalStyles/button";
import OperationMenu from "./OperationMenu";
import CardsGrid from "./CardsGrid";
import CardEditor from "./CardEditor";
import DiaryEditor from "../../../components/Diary/DiaryEditor";
import DetailedCard from "../../../components/DetailCard/DetailedCard";
import defaultImg from "../../../assets/default.jpg";

interface WrapperProps {
  $show: boolean;
}
const Wrapper = styled.div<WrapperProps>`
  display: ${(props) => (props.$show ? "block" : "none")};
`;

interface PlantImgProps {
  $path: string | undefined;
}
export const PlantImg = styled.div<PlantImgProps>`
  border-radius: 10px;
  margin: 8px auto;
  background-image: url(${(props) => (props.$path ? props.$path : defaultImg)});
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center center;
  width: 250px;
  height: 150px;
  box-shadow: 0px 0px 10px #aaa;
`;
export const Text = styled.p`
  margin-bottom: 10px;
`;
export const Tag = styled.p`
  color: ${(props) => props.theme.colors.main};
  padding: 0px 3px;
  border-radius: 8px;
  font-size: 14px;
  border: 1px solid ${(props) => props.theme.colors.main};
  margin: 5px 5px 0 0;
  cursor: pointer;
  transition: 0.25s;
  &:hover {
    background: ${(props) => props.theme.colors.main};
    color: #fff;
    transition: 0.25s;
  }
`;
interface TagsWrapperProps {
  $viewMode?: "grid" | "list";
}
export const TagsWrapper = styled.div<TagsWrapperProps>`
  width: 200px;
  display: flex;
  flex-wrap: wrap;
  margin: ${(props) =>
    props.$viewMode === "list" ? "0px 5px" : "10px 5px 0px 0px"};
  padding: 2px;
`;
const open = keyframes`
    from {
      opacity: 0;
      max-height: 0;
    }
    to {
      opacity: 1;
      max-height: 500px;
    }
`;
const TagsList = styled(TagsWrapper)`
  width: auto;
  flex-wrap: wrap;
  animation: ${open} 1s;
  & * {
    animation: ${open} 1s;
  }
`;
const ConfirmPanel = styled.div`
  position: absolute;
  z-index: 102;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 400px;
  padding: 24px;
  background: #f5f0ec;
  border-radius: 15px;
  border: 1px solid ${(props) => props.theme.colors.button};
`;
const BtnWrapper = styled.div`
  display: flex;
  justify-content: space-evenly;
  column-gap: 12px;
`;
const MsgWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  row-gap: 12px;
  margin-bottom: 24px;
`;
const ConfirmMsg = styled.p``;
const ConfirmBoldMsg = styled(ConfirmMsg)`
  font-weight: 500;
`;
const ConfirmBtn = styled(OperationBtn)`
  width: 100px;
  background-color: ${(props) => props.theme.colors.button};
  border: 1px solid ${(props) => props.theme.colors.button};
`;
type CheckList = Record<string, boolean>;
interface CardsGridProps {
  id: string | undefined;
  isLoading: boolean;
  cardsDisplay: boolean;
}
const Cards = ({ id, isLoading, cardsDisplay }: CardsGridProps) => {
  const dispatch = useDispatch();
  const alertDispatcher = useAlertDispatcher();
  const { isSelf } = useSelector((state: RootState) => state.authority);
  const cardList = useSelector((state: RootState) => state.cards);
  const userInfo = useSelector((state: RootState) => state.userInfo);
  const [cardItems, setCardItems] = useState<PlantCard[]>([]);
  const [editCardId, setEditCardId] = useState<string | null>(null);
  const [editorDisplay, setEditorDisplay] = useState<boolean>(false);
  const [diaryId, setDiaryId] = useState<string | null>(null);
  const [ownerId, setOwnerId] = useState<string>("");
  const [diariesExist, setDiariesExist] = useState<boolean[]>([]);
  const [detailData, setDetailData] = useState<PlantCard>();
  const [tagList, setTagList] = useState<string[]>([]);
  const [checkList, setCheckList] = useState<CheckList>({});
  const [filter, setFilter] = useState<string>("");
  const [filterOptionsOpen, setFilterOptionsOpen] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [confirmMsg, setConfirmMsg] = useState<string>("");

  function filterToggle() {
    if (filterOptionsOpen) {
      setFilterOptionsOpen(false);
      setFilter("");
      const checkboxes = {} as CheckList;
      cardList.forEach((card) => {
        checkboxes[card.cardId!] = false;
      });
      setCheckList(checkboxes);
    } else setFilterOptionsOpen(true);
  }
  function selectFilter(tag: string) {
    setFilter(tag);
    const filtered = cardList.filter((card) => card.tags?.includes(tag));
    const checkboxes = {} as CheckList;
    filtered.forEach((card) => {
      checkboxes[card.cardId!] = false;
    });
    setCheckList(checkboxes);
  }
  function filterCard(tagList: string[]): boolean {
    if (filter) return tagList.includes(filter);
    else return true;
  }
  function allCheck() {
    const newObj = Object.fromEntries(
      Object.keys(checkList).map((key) => [key, true])
    );
    setCheckList(newObj);
  }
  function clearAllCheck() {
    const newObj = Object.fromEntries(
      Object.keys(checkList).map((key) => [key, false])
    );
    setCheckList(newObj);
  }
  function switchOneCheck(cardId: string) {
    const newObj = { ...checkList };
    newObj[cardId] ? (newObj[cardId] = false) : (newObj[cardId] = true);
    setCheckList(newObj);
  }
  async function addEvents(type: "water" | "fertilize") {
    const eventIds = Object.keys(checkList).filter(
      (key) => checkList[key] === true
    );
    if (!eventIds.length) return;
    const idList: string[] = [];
    eventIds.forEach((eventId) => {
      const targetCard = cardList.find((card) => card.cardId === eventId);
      idList.push(targetCard!.cardId!);
    });
    if (type === "water") {
      alertDispatcher("success", `Watering Success!`);
    }
    if (type === "fertilize")
      alertDispatcher("success", `Fertilizing Success!`);
    clearAllCheck();
    await firebase.addEvents(type, idList, userInfo.userId);
  }
  function setConfirmMessage() {
    const targets = Object.keys(checkList).filter(
      (key) => checkList[key] === true
    );
    const targetNames = targets.map((target) => {
      return cardList.find((card) => card.cardId === target)?.plantName;
    });
    setConfirmMsg(`${targetNames.join(", ")}`);
  }
  function deleteCards() {
    const targets = Object.keys(checkList).filter(
      (key) => checkList[key] === true
    );
    if (!targets.length) return;
    const promises = targets.map((target) => {
      return firebase.deleteCard(target);
    });
    Promise.all(promises)
      .then(() => {
        dispatch({
          type: CardsActions.DELETE_PLANT_CARDS,
          payload: { cardIds: targets },
        });
      })
      .then(() => {
        dispatch({
          type: PopUpActions.HIDE_ALL,
        });
        setConfirmMsg("");
        alertDispatcher("success", `Delete Card Success`);
      });
  }
  async function favoriteToggle(cardId: string) {
    const userId = userInfo.userId;
    if (userInfo.favoriteCards.includes(cardId)) {
      dispatch({
        type: UserInfoActions.DELETE_FAVORITE_PLANT,
        payload: { cardId },
      });
      await firebase.removeFavCard(userId, cardId);
      alertDispatcher("success", "Remove from your Favorites.");
    } else {
      dispatch({
        type: UserInfoActions.ADD_FAVORITE_PLANT,
        payload: { cardId },
      });
      await firebase.addFavCard(userId, cardId);
      alertDispatcher("success", "Add to Favorites!");
    }
  }
  function handleCancelConfirm() {
    dispatch({
      type: PopUpActions.HIDE_ALL,
    });
    setConfirmMsg("");
  }
  useEffect(() => {
    async function getUserCards() {
      let cards: PlantCard[] = [];
      const cardsIds: string[] = [];
      const checkboxes = {} as CheckList;
      if (isSelf) {
        cards = cardList;
        cards.forEach((card) => {
          cardsIds.push(card.cardId!);
          checkboxes[card.cardId!] = false;
        });
      } else {
        const querySnapshot = await firebase.getUserCards(id!);
        querySnapshot.forEach((doc) => {
          cards.push(doc.data());
          cardsIds.push(doc.data().cardId!);
        });
      }
      let result = await firebase.checkDiariesExistence(cardsIds);
      setDiariesExist(result);
      setCardItems(cards);
      setCheckList(checkboxes);
    }
    getUserCards();
  }, [id, isSelf, cardList]);
  useEffect(() => {
    const tags: string[] = [];
    const checkboxes = {} as CheckList;
    cardList.forEach((card) => {
      const searchTargets = card.tags;
      checkboxes[card.cardId!] = false;
      searchTargets?.forEach((tag) => {
        if (!tags.includes(tag)) tags.push(tag);
      });
    });
    setTagList(tags);
    setCheckList(checkboxes);
  }, [cardList]);
  return (
    <Wrapper $show={cardsDisplay}>
      <DiaryEditor
        ownerId={ownerId}
        diaryId={diaryId!}
        setDiaryId={setDiaryId}
      />
      <OperationMenu
        isSelf={isSelf}
        viewMode={viewMode}
        checkList={checkList}
        setViewMode={setViewMode}
        setEditCardId={setEditCardId}
        setEditorDisplay={setEditorDisplay}
        filterToggle={filterToggle}
        allCheck={allCheck}
        clearAllCheck={clearAllCheck}
        addEvents={addEvents}
        setConfirmMessage={setConfirmMessage}
      />
      {filterOptionsOpen && (
        <TagsList>
          {tagList.map((tag: string) => (
            <Tag key={tag} onClick={() => selectFilter(tag)}>
              {tag}
            </Tag>
          ))}
        </TagsList>
      )}
      <CardsGrid
        isSelf={isSelf}
        isLoading={isLoading}
        diariesExist={diariesExist}
        viewMode={viewMode}
        cardItems={cardItems}
        checkList={checkList}
        filterCard={filterCard}
        setDetailData={setDetailData}
        setDiaryId={setDiaryId}
        setOwnerId={setOwnerId}
        setEditCardId={setEditCardId}
        switchOneCheck={switchOneCheck}
        setEditorDisplay={setEditorDisplay}
        favoriteToggle={favoriteToggle}
      />
      <CardEditor
        userId={userInfo.userId}
        editCardId={editCardId}
        editorDisplay={editorDisplay}
        setEditorDisplay={setEditorDisplay}
        setEditCardId={setEditCardId}
      />
      <DetailedCard detailData={detailData!} setDetailData={setDetailData} />
      {!!confirmMsg && (
        <ConfirmPanel>
          <MsgWrapper>
            <ConfirmMsg>Are you goin to delete</ConfirmMsg>
            <ConfirmBoldMsg>{confirmMsg}</ConfirmBoldMsg>
            <ConfirmMsg></ConfirmMsg>
          </MsgWrapper>
          <BtnWrapper>
            <ConfirmBtn onClick={deleteCards}>Sure</ConfirmBtn>
            <ConfirmBtn onClick={handleCancelConfirm}>Cancel</ConfirmBtn>
          </BtnWrapper>
        </ConfirmPanel>
      )}
    </Wrapper>
  );
};

export default Cards;
