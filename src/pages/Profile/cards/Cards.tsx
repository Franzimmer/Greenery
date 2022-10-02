import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { firebase } from "../../../utils/firebase";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../../store/reducer/index";
import { popUpActions } from "../../../store/reducer/popUpReducer";
import { CardsActions } from "../../../store/actions/cardsActions";
import { UserInfoActions } from "../../../store/actions/userInfoActions";
import { PlantCard } from "../../../store/types/plantCardType";
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
  path: string | undefined;
}
export const PlantImg = styled.div<PlantImgProps>`
  border-radius: 10px;
  margin: 8px auto;
  background-image: url(${(props) => (props.path ? props.path : defaultImg)});
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
  color: #5c836f;
  padding: 0px 3px;
  border-radius: 8px;
  font-size: 14px;
  border: 1px solid #5c836f;
  margin: 5px 5px 0 0;
  cursor: pointer;
  transition: 0.25s;
  &:hover {
    background: #5c836f;
    color: #fff;
    transition: 0.25s;
  }
`;
interface TagsWrapper {
  viewMode?: "grid" | "list";
}
export const TagsWrapper = styled.div<TagsWrapper>`
  width: 200px;
  display: flex;
  flex-wrap: wrap;
  margin: ${(props) =>
    props.viewMode === "list" ? "0px 5px" : "10px 5px 0px 0px"};
  padding: 2px;
`;
const TagsList = styled(TagsWrapper)`
  width: auto;
  flex-wrap: wrap;
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
  border: 1px solid #6a5125;
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
  background-color: #6a5125;
  border: 1px solid #6a5125;
`;
type CheckList = Record<string, boolean>;
interface CardsGridProps {
  id: string | undefined;
  isLoading: boolean;
  cardsDisplay: boolean;
}
const Cards = ({ id, isLoading, cardsDisplay }: CardsGridProps) => {
  const dispatch = useDispatch();
  const { isSelf } = useSelector((state: RootState) => state.authority);
  const cardList = useSelector((state: RootState) => state.cards);
  const userInfo = useSelector((state: RootState) => state.userInfo);
  const [cardItems, setCardItems] = useState<PlantCard[]>([]);
  const [editCardId, setEditCardId] = useState<string | null>(null);
  const [editorDisplay, setEditorDisplay] = useState<boolean>(false);
  const [diaryId, setDiaryId] = useState<string | null>(null);
  const [ownerId, setOwnerId] = useState<string>("");
  const [diaryDisplay, setDiaryDisplay] = useState<boolean>(false);
  const [detailData, setDetailData] = useState<PlantCard>();
  const [detailDisplay, setDetailDisplay] = useState<boolean>(false);
  const [tagList, setTagList] = useState<string[]>([]);
  const [checkList, setCheckList] = useState<CheckList>({});
  const [filter, setFilter] = useState<string>("");
  const [filterOptions, setFilterOptionsOpen] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [diariesExist, setDiariesExist] = useState<boolean[]>([]);
  const [ConfirmDisplay, setConfirmDisplay] = useState<boolean>(false);
  const [confirmMsg, setConfirmMsg] = useState<string>("");
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
      emitAlert("success", `Watering ${nameList.join(" & ")} Success!`);
    }
    if (type === "fertilize")
      emitAlert("success", `Fertilizing ${nameList.join(" & ")} Success!`);
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
    dispatch({
      type: popUpActions.HIDE_ALL,
    });
    setConfirmDisplay(false);
    emitAlert("success", `Delete Card Success`);
  }
  async function favoriteToggle(cardId: string) {
    let userId = userInfo.userId;
    if (userInfo.favoriteCards.includes(cardId)) {
      dispatch({
        type: UserInfoActions.DELETE_FAVORITE_PLANT,
        payload: { cardId },
      });
      await firebase.removeFavCard(userId, cardId);
      emitAlert("success", "Remove from your Favorites.");
    } else {
      dispatch({
        type: UserInfoActions.ADD_FAVORITE_PLANT,
        payload: { cardId },
      });
      await firebase.addFavCard(userId, cardId);
      emitAlert("success", "Add to Favorites!");
    }
  }
  useEffect(() => {
    async function getUserCards() {
      let cards: PlantCard[] = [];
      let cardsIds: string[] = [];
      let checkboxes = {} as CheckList;

      if (isSelf) {
        cards = cardList;
        cards.forEach((card) => {
          cardsIds.push(card.cardId!);
          checkboxes[card.cardId!] = false;
        });
      } else {
        let querySnapshot = await firebase.getUserCards(id!);
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
    <Wrapper $show={cardsDisplay}>
      <DiaryEditor
        ownerId={ownerId}
        diaryDisplay={diaryDisplay}
        setDiaryDisplay={setDiaryDisplay}
        diaryId={diaryId!}
        setDiaryId={setDiaryId}
      />
      <OperationMenu
        isSelf={isSelf}
        viewMode={viewMode}
        checkList={checkList}
        setViewMode={setViewMode}
        setEditCardId={setEditCardId}
        editorToggle={editorToggle}
        filterToggle={filterToggle}
        allCheck={allCheck}
        clearAllCheck={clearAllCheck}
        addEvents={addEvents}
        setConfirmDisplay={setConfirmDisplay}
        setConfirmMessage={setConfirmMessage}
      />
      {filterOptions && tagList.length && (
        <TagsList>
          {tagList.map((tag: string) => (
            <Tag key={tag} onClick={selectFilter}>
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
        setDetailDisplay={setDetailDisplay}
        setDetailData={setDetailData}
        setDiaryDisplay={setDiaryDisplay}
        setDiaryId={setDiaryId}
        setOwnerId={setOwnerId}
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
        detailDisplay={detailDisplay}
        setDetailDisplay={setDetailDisplay}
        detailData={detailData!}
      />
      {ConfirmDisplay && (
        <ConfirmPanel>
          <MsgWrapper>
            <ConfirmMsg>Are you goin to delete</ConfirmMsg>
            <ConfirmBoldMsg>{confirmMsg}</ConfirmBoldMsg>
            <ConfirmMsg></ConfirmMsg>
          </MsgWrapper>
          <BtnWrapper>
            <ConfirmBtn onClick={deleteCards}>Sure</ConfirmBtn>
            <ConfirmBtn
              onClick={() => {
                dispatch({
                  type: popUpActions.HIDE_ALL,
                });
                setConfirmDisplay(false);
              }}
            >
              Cancel
            </ConfirmBtn>
          </BtnWrapper>
        </ConfirmPanel>
      )}
    </Wrapper>
  );
};

export default Cards;
