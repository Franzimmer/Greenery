import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { firebase } from "../../utils/firebase";
import { useParams, useNavigate } from "react-router-dom";
import parse from "html-react-parser";
import { UserInfo } from "../../types/userInfoType";
import { OperationBtn } from "../Profile/cards/CardsGrid";
import TextEditor from "../../components/TextEditor/TextEditor";
import { useSelector } from "react-redux";
import { RootState } from "../../reducer";
import { PlantCard } from "../../types/plantCardType";
import {
  Card,
  PlantImg,
  Text,
  Tag,
  TagsWrapper,
} from "../../pages/Profile/cards/CardsGrid";
const PostWrapper = styled.div`
  display: flex;
  border: 1px solid #000;
  width: 80vw;
`;
const AuthorInfo = styled.div`
  border-right: 2px solid red;
  font-size: 10px;
`;
const AuthorPhoto = styled.img`
  border-radius: 50%;
  height: auto;
  width: 100px;
`;
const AuthorName = styled.p`
  text-align: center;
`;
const Content = styled.div`
  padding: 8px;
  & > * + * {
    margin-top: 0.75em;
  }

  & h1,
  h2,
  h3 {
    line-height: 1.1;
  }

  & ul,
  ol {
    padding: 0 1rem;
  }
`;
const BtnWrapper = styled.div`
  display: flex;
  flex-direction: column;
`;
export interface Post {
  postId: string;
  authorId: string;
  createdTime: number;
  type: string;
  title: string;
  content: string;
  comments?: Comment[];
  cardIds?: string[];
}
export interface Comment {
  authorId: string;
  createdTime: number;
  content: string;
}
const ForumPost = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const userInfo: UserInfo = useSelector((state: RootState) => state.userInfo);
  const [post, setPost] = useState<Post>();
  const [comments, setComments] = useState<Comment[] | undefined>();
  const [pageComments, setPageComments] = useState<Comment[] | undefined>();
  const [authorInfo, setAuthorInfo] = useState<UserInfo>();
  const [commentAuthorInfos, setCommentAuthorInfos] = useState<
    Record<string, UserInfo>
  >({});
  const [initContent, setInitContent] = useState<string>("");
  const [initTitle, setInitTitle] = useState<string>("");
  const [textEditorDisplay, setTextEditorDisplay] = useState<boolean>(false);
  const [editorMode, setEditorMode] = useState<string>("");
  const [editTargetComment, setEditTargetComment] = useState<Comment>();
  const [cards, setCards] = useState<PlantCard[]>([]);
  function addComment() {
    setEditorMode("Comment");
    setTextEditorDisplay(true);
    setInitContent("");
  }
  function deleteComment(deleteTarget: Comment) {
    let postId = post!.postId;
    let newComments = comments!.filter((comment) => comment !== deleteTarget);
    firebase.saveEditComment(postId, newComments);
    setComments(newComments);
  }
  function sliceComments(begin: number, end: number) {
    if (!comments) return;
    return comments.slice(begin, end);
  }
  function editComment(comment: Comment) {
    setEditTargetComment(comment);
    setInitContent(comment.content);
    setEditorMode("Comment");
    setTextEditorDisplay(true);
  }
  useEffect(() => {
    async function getPost() {
      if (id) {
        let postData = await firebase.getPostData(id);
        let userInfo = await firebase.getUserInfo(postData.data()!.authorId);
        setPost(postData.data());
        setInitTitle(postData.data()!.title);
        setInitContent(postData.data()!.content);
        setComments(postData.data()!.comments); //all comments
        setPageComments(postData.data()?.comments?.slice(0, 10));
        setAuthorInfo(userInfo.data());
        if (postData.data()?.cardIds?.length !== 0) {
          let cardsData: PlantCard[] = [];
          let cardIds = postData.data()?.cardIds;
          if (!cardIds) return;
          let cards = await firebase.getCards(cardIds);
          if (!cards?.empty) {
            cards?.forEach((card) => {
              cardsData.push(card.data());
            });
            setCards(cardsData);
          }
        }
      }
    }
    getPost();
  }, []);
  useEffect(() => {
    async function getCommentAuthorInfo() {
      let authorInfos: Record<string, UserInfo> = {};
      if (pageComments) {
        let authorIdList: string[] = [];
        pageComments.forEach((comment) => {
          if (!authorIdList.includes(comment.authorId))
            authorIdList.push(comment.authorId);
        });
        let promises = authorIdList.map(async (id) => {
          return firebase.getUserInfo(id);
        });
        let data = await Promise.all(promises);
        data.forEach((promise) => {
          let userData = promise.data() as UserInfo;
          authorInfos[userData.userId] = userData;
        });
      }
      setCommentAuthorInfos(authorInfos);
    }
    getCommentAuthorInfo();
  }, [pageComments]);
  useEffect(() => {
    setPageComments(sliceComments(0, 10));
  }, [comments]);
  return (
    <>
      {post?.title && parse(post.title)}
      <p>{post?.type}</p>
      <PostWrapper>
        <AuthorInfo>
          <AuthorPhoto
            src={authorInfo?.photoUrl}
            onClick={() => navigate(`/profile/${authorInfo?.userId}`)}
          />
          <AuthorName>{authorInfo?.userName}</AuthorName>
          {userInfo.userId !== authorInfo?.userId && (
            <OperationBtn>Open Chatroom</OperationBtn>
          )}
        </AuthorInfo>
        <Content>{post?.content && parse(post.content)}</Content>
        {cards &&
          cards.map((card) => {
            return (
              <Card key={card.cardId} show={true}>
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
                <OperationBtn>Favorite</OperationBtn>
              </Card>
            );
          })}
        {userInfo.userId === post?.authorId && (
          <BtnWrapper>
            <OperationBtn onClick={() => setTextEditorDisplay(true)}>
              Edit
            </OperationBtn>
            <OperationBtn>Delete</OperationBtn>
          </BtnWrapper>
        )}
      </PostWrapper>
      {pageComments &&
        pageComments.length !== 0 &&
        pageComments.map((comment) => {
          return (
            <PostWrapper key={`${comment.authorId}_${comment.createdTime}`}>
              <AuthorInfo>
                <AuthorPhoto
                  src={commentAuthorInfos[comment.authorId]?.photoUrl}
                  onClick={() => navigate(`/profile/${comment.authorId}`)}
                />
                <AuthorName>
                  {commentAuthorInfos[comment.authorId]?.userName}
                </AuthorName>
                {userInfo.userId !== comment.authorId && (
                  <OperationBtn>Open Chatroom</OperationBtn>
                )}
              </AuthorInfo>
              <Content>{post?.content && parse(comment.content)}</Content>
              {userInfo.userId === comment.authorId && (
                <BtnWrapper>
                  <OperationBtn onClick={() => editComment(comment)}>
                    Edit
                  </OperationBtn>
                  <OperationBtn onClick={() => deleteComment(comment)}>
                    Delete
                  </OperationBtn>
                </BtnWrapper>
              )}
            </PostWrapper>
          );
        })}
      <OperationBtn onClick={addComment}>Comment</OperationBtn>
      {textEditorDisplay && (
        <TextEditor
          editorMode={editorMode}
          initContent={initContent}
          initTitle={initTitle}
          post={post}
          comments={comments}
          editTargetComment={editTargetComment}
          setPost={setPost}
          setEditorMode={setEditorMode}
          setTextEditorDisplay={setTextEditorDisplay}
          setComments={setComments}
        />
      )}
    </>
  );
};

export default ForumPost;
