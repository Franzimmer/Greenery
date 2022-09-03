import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../reducer/index";
import { CardsActions } from "../../actions/cardsActions";
import { cards } from "../../utils/firebase";
import { getDocs, query, where, DocumentData } from "firebase/firestore";
import CardEditor from "./CardEditor";
import defaultImg from "./default.jpg";
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
const CardsGrid = () => {
  const cardList = useSelector((state: RootState) => state.cards);
  const dispatch = useDispatch();
  const [editorDisplay, setEditorDisplay] = useState<boolean>(false);
  const [editCardId, setEditCardId] = useState<string | null>(null);
  const [tagList, setTagList] = useState<string[]>([]);
  const [filterOptions, setFilterOptionsOpen] = useState<boolean>(false);
  const [filter, setFilter] = useState<string>("");

  function editorToggle() {
    editorDisplay ? setEditorDisplay(false) : setEditorDisplay(true);
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
  useEffect(() => {
    async function getCards() {
      let results: DocumentData[] = [];
      let tags: string[] = [];
      const q = query(cards, where("ownerId", "==", "test"));
      const querySnapshot = await getDocs(q);
      if (querySnapshot.empty) {
        alert("User not existed!");
        return;
      }
      querySnapshot.forEach((doc) => {
        results.push(doc.data());
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
      dispatch({
        type: CardsActions.SET_CARDS_DATA,
        payload: { data: results },
      });
    }
    getCards();
  }, []);
  return (
    <>
      <OperationMenu>
        <OperationBtn onClick={editorToggle}>新增卡片</OperationBtn>
        <OperationBtn onClick={filterToggle}>Filter</OperationBtn>
        <OperationBtn>選取</OperationBtn>
        <OperationBtn>切換檢視</OperationBtn>
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
              >
                <PlantImg path={card.plantPhoto} />
                <Text>名字: {card.plantName}</Text>
                <Text>品種: {card.species}</Text>
                <TagsWrapper>
                  {card?.tags?.length !== 0 &&
                    card.tags?.map((tag) => {
                      return <Tag key={`${card.cardId}-${tag}`}>{tag}</Tag>;
                    })}
                </TagsWrapper>
                <OperationBtn>Diary</OperationBtn>
                <OperationBtn
                  onClick={(e: React.MouseEvent<HTMLElement>) => {
                    let button = e.target as HTMLButtonElement;
                    setEditCardId(button.parentElement!.id);
                    editorToggle();
                  }}
                >
                  Edit
                </OperationBtn>
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
    </>
  );
};

export default CardsGrid;
