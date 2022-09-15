import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../reducer";
import styled from "styled-components";
import defaultImg from "./default.jpg";
import { PlantCard } from "../../types/plantCardType";
import { firebase } from "../../utils/firebase";
import { Post } from "../Forum/ForumPost";
import parse from "html-react-parser";
import {
  Card,
  PlantImg,
  Text,
  Tag,
  TagsWrapper,
  OperationBtn,
  FavoriteButton,
} from "../Profile/cards/CardsGrid";
import { ForumPostPage, ForumPostPageInfo } from "../Forum/ForumHomePage";
import DiaryEditor from "../../components/Diary/DiaryEditor";
import DetailedCard from "../../components/DetailCard/DetailedCard";
import { UserInfoActions } from "../../actions/userInfoActions";

const CardsFlexWrpper = styled.div`
  display: flex;
`;
const PostsListWrapper = styled.div``;

const Home = () => {
  const dispatch = useDispatch();
  const userInfo = useSelector((state: RootState) => state.userInfo);
  const [favCards, setFavCards] = useState<PlantCard[]>([]);
  const [newPosts, setNewPosts] = useState<Post[]>([]);
  const [detailDisplay, setDetailDisplay] = useState<boolean>(false);
  const [detailData, setDetailData] = useState<PlantCard>();
  const [diaryDisplay, setDiaryDisplay] = useState<boolean>(false);
  const [diaryId, setDiaryId] = useState<string | null>(null);
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
    async function getHomePageData() {
      const postQuery = firebase.getLatestPosts();
      const favCardsQuery = firebase.getFavCards();
      let queryData = await Promise.all([postQuery, favCardsQuery]);
      if (!queryData[0].empty) {
        let newPosts: Post[] = [];
        queryData[0].forEach((doc) => {
          newPosts.push(doc.data());
        });
        setNewPosts(newPosts);
      }
      if (!queryData[1].empty) {
        let favCards: PlantCard[] = [];
        queryData[1].forEach((doc) => {
          favCards.push(doc.data());
        });
        setFavCards(favCards);
      }
    }
    getHomePageData();
  }, []);
  return (
    <>
      <h1>人氣植物</h1>
      <CardsFlexWrpper>
        {favCards.length !== 0 &&
          favCards.map((card) => {
            return (
              <Card
                key={card.cardId}
                id={card.cardId!}
                show={true}
                onClick={(e) => {
                  setDetailDisplay(true);
                  setDetailData(card);
                }}
              >
                <PlantImg path={card.plantPhoto || defaultImg} />
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
                    setDiaryDisplay(true);
                    setDiaryId(card.cardId);
                    e.stopPropagation();
                  }}
                >
                  Diary
                </OperationBtn>
                <FavoriteButton
                  show={userInfo?.favoriteCards.includes(card.cardId!) || false}
                  onClick={(e: React.MouseEvent<HTMLElement>) => {
                    favoriteToggle(card.cardId!);
                    e.stopPropagation();
                  }}
                >
                  Favorite
                </FavoriteButton>
              </Card>
            );
          })}
      </CardsFlexWrpper>
      <h1>最新文章</h1>
      {newPosts.length !== 0 &&
        newPosts.map((post) => {
          return (
            <ForumPostPage key={post.postId} show={true}>
              <ForumPostPageInfo to={`/forum/${post.postId}`}>
                {parse(post.title)}
              </ForumPostPageInfo>
              <p>{post.type}</p>
            </ForumPostPage>
          );
        })}
      <PostsListWrapper></PostsListWrapper>
      <DetailedCard
        isSelf={false}
        detailDisplay={detailDisplay}
        setDetailDisplay={setDetailDisplay}
        detailData={detailData!}
      />
      <DiaryEditor
        isSelf={false}
        diaryDisplay={diaryDisplay}
        setDiaryDisplay={setDiaryDisplay}
        diaryId={diaryId!}
        setDiaryId={setDiaryId}
      />
    </>
  );
};

export default Home;
