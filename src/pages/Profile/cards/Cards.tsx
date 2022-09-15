import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { firebase } from "../../../utils/firebase";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../../reducer/index";
import { CardsActions } from "../../../actions/cardsActions";
import { UserInfoActions } from "../../../actions/userInfoActions";
import { PlantCard } from "../../../types/plantCardType";
import OperationMenu from "./OperationMenu";
import CardsGrid from "./CardsGrid";
import CardEditor from "./CardEditor";
import DiaryEditor from "../../../components/Diary/DiaryEditor";
import DetailedCard from "../../../components/DetailCard/DetailedCard";
import defaultImg from "../../../assets/default.jpg";

export const OperationBtn = styled.button`
  margin: 0px 5px 0px 0px;
  padding: px;
  cursor: pointer;
  &:hover {
    background: #000;
    color: #fff;
  }
`;
interface FavoriteButtonProps {
  show?: boolean;
}
export const FavoriteButton = styled.button<FavoriteButtonProps>`
  margin: 0px 5px 0px 0px;
  padding: px;
  cursor: pointer;
  background: ${(props) => (props.show ? "#f54825" : "FFF")};
`;
export const GridWrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-gap: 20px;
  margin-top: 20px;
`;
interface CardProps {
  show?: boolean;
}
export const Card = styled.div<CardProps>`
  display: flex;
  flex-direction: column;
  border: 1px solid black;
  padding: 10px;
  display: ${(props) => (props.show ? "block" : "none")};
`;
interface PlantImgProps {
  path: string | undefined;
}
export const PlantImg = styled.div<PlantImgProps>`
  border-radius: 10px;
  margin: 8px;
  background-image: url(${(props) => (props.path ? props.path : defaultImg)});
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center center;
  width: 150px;
  height: 100px;
`;
export const Text = styled.p`
  margin-bottom: 10px;
`;
export const Tag = styled.p`
  background: #eee;
  font-size: 14px;
  border: 1px solid #000;
  margin-right: 5px;

  &:hover {
    background: #000;
    color: #fff;
  }
`;
export const TagsWrapper = styled.div`
  display: flex;
  margin-top: 5px;
  padding: 2px;
`;

type CheckList = Record<string, boolean>;
interface CardsGridProps {
  id: string | undefined;
  isSelf: boolean;
}
const Cards = ({ id, isSelf }: CardsGridProps) => {
  const dispatch = useDispatch();
  const cardList = useSelector((state: RootState) => state.cards);
  const userInfo = useSelector((state: RootState) => state.userInfo);
  const [editCardId, setEditCardId] = useState<string | null>(null);
  const [editorDisplay, setEditorDisplay] = useState<boolean>(false);
  const [diaryId, setDiaryId] = useState<string | null>(null);
  const [diaryDisplay, setDiaryDisplay] = useState<boolean>(false);
  const [detailData, setDetailData] = useState<PlantCard>();
  const [detailDisplay, setDetailDisplay] = useState<boolean>(false);
  const [tagList, setTagList] = useState<string[]>([]);
  const [checkList, setCheckList] = useState<CheckList>({});
  const [filter, setFilter] = useState<string>("");
  const [filterOptions, setFilterOptionsOpen] = useState<boolean>(false);
  function editorToggle() {
    editorDisplay ? setEditorDisplay(false) : setEditorDisplay(true);
  }
  function filterToggle() {
    if (filterOptions) {
      setFilterOptionsOpen(false);
      setFilter("");
      let checkboxes = {} as CheckList;
      cardList.forEach((card) => {
        checkboxes[card.cardId!] = false;
      });
      setCheckList(checkboxes);
    } else setFilterOptionsOpen(true);
  }
  function selectFilter(e: React.MouseEvent<HTMLElement>) {
    let eventTarget = e.target as HTMLDivElement;
    let filter = eventTarget.textContent!;
    setFilter(filter);
    let filtered = cardList.filter((card) => card.tags?.includes(filter));
    let checkboxes = {} as CheckList;
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
    let newObj = Object.fromEntries(
      Object.keys(checkList).map((key) => [key, true])
    );
    setCheckList(newObj);
  }
  function clearAllCheck() {
    let newObj = Object.fromEntries(
      Object.keys(checkList).map((key) => [key, false])
    );
    setCheckList(newObj);
  }
  function switchOneCheck(cardId: string) {
    let newObj = { ...checkList };
    newObj[cardId] ? (newObj[cardId] = false) : (newObj[cardId] = true);
    setCheckList(newObj);
  }
  async function addEvents(type: "water" | "fertilize") {
    const eventIds = Object.keys(checkList).filter(
      (key) => checkList[key] === true
    );
    if (!eventIds.length) return;
    let idList: string[] = [];
    let nameList: string[] = [];
    eventIds.forEach((eventId) => {
      let targetCard = cardList.find((card) => card.cardId === eventId);
      idList.push(targetCard!.cardId!);
      nameList.push(targetCard!.plantName);
    });
    if (type === "water") {
      alert(`已爲 ${nameList.join(" & ")} 澆水！`);
    }
    if (type === "fertilize") alert(`已爲 ${nameList.join(" & ")} 施肥！`);
    clearAllCheck();
    await firebase.addEvents(type, idList, userInfo.userId);
  }
  async function deleteCards() {
    const targets = Object.keys(checkList).filter(
      (key) => checkList[key] === true
    );
    if (!targets.length) return;
    let promises = targets.map((target) => {
      return firebase.deleteCard(target);
    });
    await Promise.all(promises);
    dispatch({
      type: CardsActions.DELETE_PLANT_CARDS,
      payload: { cardIds: targets },
    });
    alert("刪除成功！");
  }
  async function favoriteToggle(cardId: string) {
    let userId = userInfo.userId;
    if (userInfo.favoriteCards.includes(cardId)) {
      dispatch({
        type: UserInfoActions.DELETE_FAVORITE_PLANT,
        payload: { cardId },
      });
      await firebase.removeFavCard(userId, cardId);
      alert("已取消收藏！");
    } else {
      dispatch({
        type: UserInfoActions.ADD_FAVORITE_PLANT,
        payload: { cardId },
      });
      await firebase.addFavCard(userId, cardId);
      alert("已加入收藏！");
    }
  }
  useEffect(() => {
    async function getCards() {
      let results: PlantCard[] = [];
      let checkboxes = {} as CheckList;
      let querySnapshot = await firebase.getUserCards(id!);
      if (querySnapshot.empty) {
        alert("User Has No Cards Data");
        return;
      }
      querySnapshot.forEach((doc) => {
        results.push(doc.data());
        checkboxes[doc.data().cardId!] = false;
      });
      setCheckList(checkboxes);
      if (results) {
        dispatch({
          type: CardsActions.SET_CARDS_DATA,
          payload: { data: results },
        });
      }
    }
    getCards();
  }, [id, isSelf, dispatch]);
  useEffect(() => {
    let tags: string[] = [];
    let checkboxes = {} as CheckList;
    cardList.forEach((card) => {
      let searchTargets = card.tags;
      checkboxes[card.cardId!] = false;
      searchTargets?.forEach((tag) => {
        if (!tags.includes(tag)) tags.push(tag);
      });
    });
    setTagList(tags);
    setCheckList(checkboxes);
  }, [cardList]);
  return (
    <div>
      <DiaryEditor
        isSelf={isSelf}
        diaryDisplay={diaryDisplay}
        setDiaryDisplay={setDiaryDisplay}
        diaryId={diaryId!}
        setDiaryId={setDiaryId}
      />
      <OperationMenu
        isSelf={isSelf}
        setEditCardId={setEditCardId}
        editorToggle={editorToggle}
        filterToggle={filterToggle}
        allCheck={allCheck}
        clearAllCheck={clearAllCheck}
        addEvents={addEvents}
        deleteCards={deleteCards}
      />
      {filterOptions && tagList.length && (
        <TagsWrapper>
          {tagList.map((tag: string) => (
            <Tag key={tag} onClick={selectFilter}>
              {tag}
            </Tag>
          ))}
        </TagsWrapper>
      )}
      <CardsGrid
        isSelf={isSelf}
        cardList={cardList}
        checkList={checkList}
        filterCard={filterCard}
        setDetailDisplay={setDetailDisplay}
        setDetailData={setDetailData}
        setDiaryDisplay={setDiaryDisplay}
        setDiaryId={setDiaryId}
        setEditCardId={setEditCardId}
        switchOneCheck={switchOneCheck}
        editorToggle={editorToggle}
        favoriteToggle={favoriteToggle}
      />
      <CardEditor
        userId={userInfo.userId}
        editorDisplay={editorDisplay}
        editorToggle={editorToggle}
        editCardId={editCardId}
        setEditCardId={setEditCardId}
      />
      <DetailedCard
        isSelf={isSelf}
        detailDisplay={detailDisplay}
        setDetailDisplay={setDetailDisplay}
        detailData={detailData!}
      />
    </div>
  );
};

export default Cards;
