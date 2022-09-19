import React, { useEffect, useState } from "react";
import styled from "styled-components";
import parse from "html-react-parser";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTrashCan,
  faPenToSquare,
  faBook,
} from "@fortawesome/free-solid-svg-icons";
import { firebase } from "../../utils/firebase";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../reducer";
import { popUpActions } from "../../reducer/popUpReducer";
import { PlantCard } from "../../types/plantCardType";
import { UserInfo } from "../../types/userInfoType";
import { useParams, useNavigate } from "react-router-dom";
import TextEditor from "../../components/TextEditor/TextEditor";
import Chatroom from "../../components/Chatroom/Chatroom";
import { OperationBtn, IconButton } from "../../components/GlobalStyles/button";
import { Card, NameText, SpeciesText } from "../Profile/cards/CardsGrid";
import { DiaryIconBtn } from "../Profile/favorites/FavGrids";
import { PlantImg, Tag, TagsWrapper } from "../Profile/cards/Cards";
import { TypeText } from "./ForumHomePage";
import DiaryEditor from "../../components/Diary/DiaryEditor";
const Wrapper = styled.div`
  width: 80vw;
  margin: 120px auto 50px;
`;
const PostWrapper = styled.div`
  margin-top: 12px;
  display: flex;
  border: 1px solid #6a5125;
  border-radius: 5px;
  width: 100%;
  position: relative;
`;
const AuthorInfo = styled.div`
  padding: 15px;
  font-size: 10px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin: 0 15px;
`;
interface AuthorPhotoProps {
  path: string | undefined;
}
const AuthorPhoto = styled.div<AuthorPhotoProps>`
  background-image: url(${(props) => props.path});
  background-size: cover;
  backround-position: center center;
  border-radius: 50%;
  height: 150px;
  width: 150px;
  cursor: pointer;
  margin: 0 auto;
`;
const AuthorName = styled.p`
  color: #6a5125;
  margin-top: 8px;
  font-size: 16px;
  letter-spacing: 1px;
  font-weight: 700;
  text-align: center;
  cursor: pointer;
`;
const Content = styled.div`
  color: #6a5125;
  padding: 40px 20px;
  & > * + * {
    margin-top: 0.75em;
  }

  & h1,
  h2,
  h3 {
    line-height: 1.1;
    letter-spacing: 1px;
  }

  & ul,
  ol {
    padding: 0 1rem;
  }

  & blockquote {
    padding-left: 1rem;
    border-left: 5px solid #6a5125;
  }
`;
const BtnWrapper = styled.div`
  display: none;
  position: absolute;
  top: 8px;
  right 8px;
  tansition: .5s;
  ${PostWrapper}:hover &{
    display: flex;
    tansition: .5s;
  }
`;
const EditIconBtn = styled(IconButton)`
  width: 26px;
  height: 26px;
  margin-left: 12px;
  background: #fff;
  border: 1px solid #6a5125;
  padding: 3px;
  border-radius: 4px;
  &:hover {
    transform: scale(1.2);
    tansition: 0.5s;
  }
`;
const StyledFontAwesomeIcon = styled(FontAwesomeIcon)`
  color: #6a5125;
  width: 18px;
  height: 18px;
`;
const BookFontAwesomeIcon = styled(FontAwesomeIcon)`
  color: #5c836f;
  width: 26px;
  height: 26px;
`;
const TitleWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;
const PostTitle = styled.h2`
  color: #6a5125;
  margin: 6px 0px 20px 0px;
`;
const CommentBtn = styled(OperationBtn)`
  background: #6a5125;
  border: 1px solid #6a5125;
  align-self: flex-end;
  transition: 0.25s;
  &:hover {
    transform: scale(1.1);
    transition: 0.25s;
  }
`;
const OpenChatRoomBtn = styled(OperationBtn)`
  width: 160px;
  height: 30px;
  padding: 0px 10px;
  text-align: center;
  font-size: 14px;
  background: none;
  border: 1px solid #6a5125;
  color: #6a5125;
  display: block;
  margin-top: 12px;
  transition: 0.25s;
  &:hover {
    transform: scale(1.1);
    transition: 0.25s;
  }
`;
const TradeCard = styled(Card)`
  margin: 12px;
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
  const dispatch = useDispatch();
  const userInfo: UserInfo = useSelector((state: RootState) => state.userInfo);
  const [chatroomDisplay, setChatroomDisplay] = useState<
    Record<string, boolean>
  >({});
  const [post, setPost] = useState<Post>();
  const [comments, setComments] = useState<Comment[]>([]);
  const [pageComments, setPageComments] = useState<Comment[] | undefined>();
  const [authorInfo, setAuthorInfo] = useState<UserInfo>();
  const [commentAuthorInfos, setCommentAuthorInfos] = useState<
    Record<string, UserInfo>
  >({});
  const [initContent, setInitContent] = useState<string>("");
  const [initTitle, setInitTitle] = useState<string>("");
  const [textEditorDisplay, setTextEditorDisplay] = useState<boolean>(false);
  const [editorMode, setEditorMode] = useState<
    "AddPost" | "EditPost" | "AddComment" | "EditComment"
  >("EditPost");
  const [editTargetComment, setEditTargetComment] = useState<Comment>();
  const [targetUser, setTargetUser] = useState<UserInfo>();
  const [cards, setCards] = useState<PlantCard[]>([]);
  const [diaryId, setDiaryId] = useState<string | null>(null);
  const [diaryDisplay, setDiaryDisplay] = useState<boolean>(false);
  const [isOwner, setIsOwner] = useState<boolean>(false);
  function toggleChatroom(targetId: string) {
    let newChatDisplay = { ...chatroomDisplay };
    if (newChatDisplay[targetId]) newChatDisplay[targetId] = false;
    else if (!newChatDisplay[targetId]) newChatDisplay[targetId] = true;
    setChatroomDisplay(newChatDisplay);
  }
  async function deletePost(postId: string) {
    await firebase.deletePost(postId);
    alert("刪除成功");
    navigate("/forum");
  }
  function addComment() {
    setEditorMode("AddComment");
    dispatch({
      type: popUpActions.SHOW_MASK,
    });
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
    setEditorMode("EditComment");
    dispatch({
      type: popUpActions.SHOW_MASK,
    });
    setTextEditorDisplay(true);
  }
  async function openChatroom(targetId: string) {
    let users = [userInfo.userId, targetId];
    let getUserInfo = firebase.getUserInfo(targetId);
    let checkRoom = firebase.checkChatroom(users);
    let result = await Promise.all([getUserInfo, checkRoom]);
    setTargetUser(result[0].data());
    toggleChatroom(targetId);
  }
  async function checkOwner(diaryId: string) {
    let ownerId = await firebase.checkOwner(diaryId);
    let result = ownerId === userInfo.userId;
    setIsOwner(result);
  }
  useEffect(() => {
    async function getPost() {
      if (id) {
        let postData = await firebase.getPostData(id);
        let userInfo = await firebase.getUserInfo(postData.data()!.authorId);
        setPost(postData.data());
        setInitTitle(postData.data()!.title);
        setInitContent(postData.data()!.content);
        setComments(postData.data()!.comments!); //all comments
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
      <Wrapper>
        <TitleWrapper>
          <TypeText>{post?.type}</TypeText>
          <PostTitle>{post?.title && parse(post.title)}</PostTitle>
        </TitleWrapper>
        <CommentBtn onClick={addComment}>Comment</CommentBtn>
        <PostWrapper>
          <AuthorInfo>
            <AuthorPhoto
              path={authorInfo?.photoUrl}
              onClick={() => navigate(`/profile/${authorInfo?.userId}`)}
            />
            <AuthorName
              onClick={() => navigate(`/profile/${authorInfo?.userId}`)}
            >
              {authorInfo?.userName}
            </AuthorName>
            {userInfo.userId !== authorInfo?.userId && (
              <OpenChatRoomBtn
                onClick={() => {
                  openChatroom(authorInfo!.userId);
                }}
              >
                Open Chatroom
              </OpenChatRoomBtn>
            )}
          </AuthorInfo>
          <Content>{post?.content && parse(post.content)}</Content>
          {cards &&
            cards.map((card) => {
              return (
                <TradeCard key={card.cardId} show={true} mode={"grid"}>
                  <PlantImg path={card.plantPhoto} />
                  <NameText>{card.plantName}</NameText>
                  <SpeciesText>{card.species}</SpeciesText>
                  <TagsWrapper>
                    {card?.tags?.length !== 0 &&
                      card.tags?.map((tag) => {
                        return <Tag key={`${card.cardId}-${tag}`}>{tag}</Tag>;
                      })}
                  </TagsWrapper>
                  <DiaryIconBtn
                    onClick={async (e) => {
                      await checkOwner(card.cardId!);
                      setDiaryDisplay(true);
                      setDiaryId(card.cardId!);
                      dispatch({
                        type: popUpActions.SHOW_MASK,
                      });
                      e.stopPropagation();
                    }}
                  >
                    <BookFontAwesomeIcon icon={faBook} />
                  </DiaryIconBtn>
                </TradeCard>
              );
            })}
          {userInfo.userId === post?.authorId && (
            <BtnWrapper>
              <EditIconBtn
                onClick={() => {
                  setEditorMode("EditPost");
                  setTextEditorDisplay(true);
                  dispatch({
                    type: popUpActions.SHOW_MASK,
                  });
                }}
              >
                <StyledFontAwesomeIcon icon={faPenToSquare} />
              </EditIconBtn>
              <EditIconBtn onClick={() => deletePost(post.postId)}>
                <StyledFontAwesomeIcon icon={faTrashCan} />
              </EditIconBtn>
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
                    path={commentAuthorInfos[comment.authorId]?.photoUrl}
                    onClick={() => navigate(`/profile/${comment.authorId}`)}
                  />
                  <AuthorName>
                    {commentAuthorInfos[comment.authorId]?.userName}
                  </AuthorName>
                  {userInfo.userId !== comment.authorId && (
                    <OpenChatRoomBtn
                      onClick={() => {
                        openChatroom(authorInfo!.userId);
                      }}
                    >
                      Open Chatroom
                    </OpenChatRoomBtn>
                  )}
                </AuthorInfo>
                <Content>{post?.content && parse(comment.content)}</Content>
                {userInfo.userId === comment.authorId && (
                  <BtnWrapper>
                    <EditIconBtn onClick={() => editComment(comment)}>
                      <StyledFontAwesomeIcon icon={faPenToSquare} />
                    </EditIconBtn>
                    <EditIconBtn onClick={() => deleteComment(comment)}>
                      <StyledFontAwesomeIcon icon={faTrashCan} />
                    </EditIconBtn>
                  </BtnWrapper>
                )}
              </PostWrapper>
            );
          })}
        {textEditorDisplay && (
          <TextEditor
            editorMode={editorMode}
            initContent={initContent}
            initTitle={initTitle}
            post={post}
            comments={comments}
            editTargetComment={editTargetComment}
            setPost={setPost}
            setTextEditorDisplay={setTextEditorDisplay}
            setComments={setComments}
          />
        )}
      </Wrapper>
      {targetUser && chatroomDisplay[targetUser?.userId] && (
        <Chatroom
          key={`${targetUser!.userId}_chat`}
          targetInfo={targetUser!}
          chatroomDisplay={chatroomDisplay[targetUser!.userId]}
          toggleChatroom={toggleChatroom}
        />
      )}
      {diaryDisplay && (
        <DiaryEditor
          isSelf={isOwner}
          diaryDisplay={diaryDisplay}
          setDiaryDisplay={setDiaryDisplay}
          diaryId={diaryId!}
          setDiaryId={setDiaryId}
        />
      )}
    </>
  );
};

export default ForumPost;
