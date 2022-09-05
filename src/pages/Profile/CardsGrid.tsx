import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../reducer/index";
import { CardsActions } from "../../actions/cardsActions";
import { db, cards } from "../../utils/firebase";
import CardEditor, { unixTimeToString } from "./CardEditor";
import DiaryEditor from "./DiaryEditor";
import DetailedCard from "./DetailedCard";
import defaultImg from "./default.jpg";
import { PlantCard } from "../../types/plantCardType";
import {
  getDoc,
  getDocs,
  query,
  where,
  DocumentData,
  collection,
  doc,
  setDoc,
  updateDoc,
  arrayUnion,
  deleteDoc,
} from "firebase/firestore";
const OperationMenu = styled.div`
  display: flex;
`;
export const OperationBtn = styled.button`
  margin: 5px 5px 0px 0px;
  padding: 5px;
  cursor: pointer;

  &:hover {
    background: #000;
    color: #fff;
  }
`;
const GridWrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-gap: 20px;
  margin-top: 20px;
`;
interface CardProps {
  show: boolean;
}
const Card = styled.div<CardProps>`
  display: flex;
  flex-direction: column;
  border: 1px solid black;
  padding: 10px;
  display: ${(props) => (props.show ? "block" : "none")};
`;
interface PlantImgProps {
  path: string | undefined;
}
const PlantImg = styled.div<PlantImgProps>`
  border-radius: 10px;
  margin: 8px;
  background-image: url(${(props) => (props.path ? props.path : defaultImg)});
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center center;
  width: 150px;
  height: 100px;
`;
const Text = styled.p`
  margin-bottom: 10px;
`;
const Tag = styled.p`
  background: #eee;
  font-size: 14px;
  border: 1px solid #000;
  margin-right: 5px;

  &:hover {
    background: #000;
    color: #fff;
  }
`;
const TagsWrapper = styled.div`
  display: flex;
  margin-top: 5px;
  padding: 2px;
`;

const CheckBox = styled.input``;
type CheckList = Record<string, boolean>;

const CardsGrid = () => {
  const cardList = useSelector((state: RootState) => state.cards);
  const dispatch = useDispatch();
  const [editorDisplay, setEditorDisplay] = useState<boolean>(false);
  const [detailDisplay, setDetailDisplay] = useState<boolean>(false);
  const [diaryDisplay, setDiaryDisplay] = useState<boolean>(false);
  const [editCardId, setEditCardId] = useState<string | null>(null);
  const [diaryId, setDiaryId] = useState<string | null>(null);
  const [tagList, setTagList] = useState<string[]>([]);
  const [filterOptions, setFilterOptionsOpen] = useState<boolean>(false);
  const [filter, setFilter] = useState<string>("");
  const [checkList, setCheckList] = useState<CheckList>({});
  const [detailData, setDetailData] = useState<PlantCard>();
  function editorToggle() {
    editorDisplay ? setEditorDisplay(false) : setEditorDisplay(true);
  }
  function detailToggle() {
    detailDisplay ? setDetailDisplay(false) : setDetailDisplay(true);
  }
  function diaryToggle(e: React.MouseEvent<HTMLElement>) {
    const target = e.target as HTMLDivElement;
    setDiaryId(target.parentElement!.id);
    diaryDisplay ? setDiaryDisplay(false) : setDiaryDisplay(true);
  }
  function selectDetailData(e: React.MouseEvent<HTMLElement>) {
    const target = e.currentTarget as HTMLDivElement;
    let selectedData = cardList.find((card) => target.id === card.cardId);
    setDetailData(selectedData);
  }
  function filterToggle() {
    if (filterOptions) {
      setFilterOptionsOpen(false);
      setFilter("");
    } else setFilterOptionsOpen(true);
  }
  function selectFilter(e: React.MouseEvent<HTMLElement>) {
    let eventTarget = e.target as HTMLDivElement;
    setFilter(eventTarget.textContent!);
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
  function switchOneCheck(
    event: React.MouseEvent<HTMLElement>,
    cardId: string
  ) {
    let newObj = { ...checkList };
    newObj[cardId] ? (newObj[cardId] = false) : (newObj[cardId] = true);
    setCheckList(newObj);
    event?.stopPropagation();
  }
  async function addEventToDB(type: "water" | "fertilize", plants: string[]) {
    let docName = unixTimeToString(Date.now());
    const activitiesRef = collection(db, "users", "test", "activities");
    let docRef = doc(activitiesRef, docName);
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) {
      await setDoc(docRef, { watering: [], fertilizing: [] });
    }
    if (type === "water") {
      await updateDoc(docRef, { watering: arrayUnion(...plants) });
    } else if (type === "fertilize") {
      await updateDoc(docRef, { fertilizing: arrayUnion(...plants) });
    }
  }
  function addEvents(type: "water" | "fertilize") {
    const eventIds = Object.keys(checkList).filter(
      (key) => checkList[key] === true
    );
    if (!eventIds.length) return;
    let nameList: string[] = [];
    eventIds.forEach((eventId) => {
      let targetCard = cardList.filter((card) => card.cardId === eventId)[0];
      nameList.push(targetCard.plantName);
    });
    if (type === "water") {
      alert(`已爲 ${nameList.join(" & ")} 澆水！`);
    }
    if (type === "fertilize") alert(`已爲 ${nameList.join(" & ")} 施肥！`);
    clearAllCheck();
    addEventToDB(type, nameList);
  }
  async function deleteCard(cardId: string) {
    dispatch({
      type: CardsActions.DELETE_PLANT_CARD,
      payload: { cardId: cardId },
    });
    await deleteDoc(doc(db, "cards", cardId));
  }
  function deleteCards() {
    const targets = Object.keys(checkList).filter(
      (key) => checkList[key] === true
    );
    if (!targets.length) return;
    let promises = targets.map((target) => deleteCard(target));
    Promise.all(promises).then(() => alert("刪除成功！"));
  }
  useEffect(() => {
    async function getCards() {
      let results: DocumentData[] = [];
      let tags: string[] = [];
      let checkboxes = {} as CheckList;
      const q = query(cards, where("ownerId", "==", "test"));
      const querySnapshot = await getDocs(q);
      if (querySnapshot.empty) {
        alert("User not existed!");
        return;
      }
      querySnapshot.forEach((doc) => {
        results.push(doc.data());
        checkboxes[doc.data().cardId] = false;
        let searchTargets = doc.data()?.tags || [];
        if (searchTargets.length) {
          let checkResults = searchTargets.map((tag: string) => {
            return tags.includes(tag);
          });
          searchTargets.forEach((tag: string, index: number) => {
            !checkResults[index] && tags.push(tag);
          });
        }
      });
      setTagList(tags);

      setCheckList(checkboxes);
      dispatch({
        type: CardsActions.SET_CARDS_DATA,
        payload: { data: results },
      });
    }
    getCards();
  }, []);
  useEffect(() => {
    let checkboxes = {} as CheckList;
    cardList.forEach((card) => {
      checkboxes[card.cardId] = false;
    });
    setCheckList(checkboxes);
  }, [cardList.length]);

  return (
    <>
      <DiaryEditor
        diaryDisplay={diaryDisplay}
        setDiaryDisplay={setDiaryDisplay}
        diaryId={diaryId!}
        setDiaryId={setDiaryId}
      />
      <OperationMenu>
        <OperationBtn
          onClick={() => {
            setEditCardId(null);
            editorToggle();
          }}
        >
          新增卡片
        </OperationBtn>
        <OperationBtn onClick={filterToggle}>Filter</OperationBtn>
        <OperationBtn>切換檢視</OperationBtn>
        <OperationBtn onClick={allCheck}>全選</OperationBtn>
        <OperationBtn onClick={clearAllCheck}>全選清除</OperationBtn>
        <OperationBtn onClick={() => addEvents("water")}>澆水</OperationBtn>
        <OperationBtn onClick={() => addEvents("fertilize")}>施肥</OperationBtn>
        <OperationBtn onClick={deleteCards}>刪除卡片</OperationBtn>
      </OperationMenu>
      {filterOptions && tagList.length && (
        <TagsWrapper>
          {tagList.map((tag: string) => (
            <Tag key={tag} onClick={selectFilter}>
              {tag}
            </Tag>
          ))}
        </TagsWrapper>
      )}
      <GridWrapper>
        {cardList &&
          cardList.map((card) => {
            return (
              <Card
                key={card.cardId}
                id={card.cardId}
                show={filterCard(card.tags || [])}
                onClick={(e) => {
                  detailToggle();
                  selectDetailData(e);
                }}
              >
                <CheckBox
                  type="checkbox"
                  checked={checkList[card.cardId]}
                  onClick={(event) => switchOneCheck(event, card.cardId)}
                />
                <PlantImg path={card.plantPhoto} />
                <Text>名字: {card.plantName}</Text>
                <Text>品種: {card.species}</Text>
                <TagsWrapper>
                  {card?.tags?.length !== 0 &&
                    card.tags?.map((tag) => {
                      return <Tag key={`${card.cardId}-${tag}`}>{tag}</Tag>;
                    })}
                </TagsWrapper>
                <OperationBtn
                  onClick={(e) => {
                    diaryToggle(e);
                    e.stopPropagation();
                  }}
                >
                  Diary
                </OperationBtn>
                <OperationBtn
                  onClick={(e: React.MouseEvent<HTMLElement>) => {
                    let button = e.target as HTMLButtonElement;
                    setEditCardId(button.parentElement!.id);
                    editorToggle();
                    e.stopPropagation();
                  }}
                >
                  Edit
                </OperationBtn>
                <OperationBtn>favorite</OperationBtn>
              </Card>
            );
          })}
      </GridWrapper>
      <CardEditor
        editorDisplay={editorDisplay}
        editorToggle={editorToggle}
        editCardId={editCardId}
        tagList={tagList}
        setTagList={setTagList}
      />
      <DetailedCard
        detailDisplay={detailDisplay}
        detailToggle={detailToggle}
        detailData={detailData!}
      />
    </>
  );
};

export default CardsGrid;
