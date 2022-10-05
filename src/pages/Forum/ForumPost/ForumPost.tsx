import React, { useEffect, useState } from "react";
import styled from "styled-components";
import parse from "html-react-parser";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../../store/reducer";
import { ChatroomActions } from "../../../store/actions/chatroomActions";
import { PopUpActions } from "../../../store/actions/popUpActions";
import { PlantCard } from "../../../store/types/plantCardType";
import { UserInfo } from "../../../store/types/userInfoType";
import { firebase } from "../../../utils/firebase";
import { useAlertDispatcher } from "../../../utils/useAlertDispatcher";
import CommentSection from "./CommentSection";
import TextEditor from "../../../components/TextEditor/TextEditor";
import DiaryEditor from "../../../components/Diary/DiaryEditor";
import DetailedCard from "../../../components/DetailCard/DetailedCard";
import PageLoader from "../../../components/GlobalStyles/PageLoader";
import { TypeText } from "../ForumHomePage";
import {
  OperationBtn,
  IconButton,
} from "../../../components/GlobalStyles/button";
import { PlantImg, Tag, TagsWrapper } from "../../Profile/cards/Cards";
import { Card, NameText, SpeciesText } from "../../Profile/cards/CardsGrid";
import { DiaryIconBtn } from "../../Profile/favorites/FavGrids";
import {
  faTrashCan,
  faPenToSquare,
  faBook,
} from "@fortawesome/free-solid-svg-icons";
import user from "../../../assets/user.png";
const Wrapper = styled.div`
  width: 80vw;
  margin: 120px auto 50px;
`;
export const PostWrapper = styled.div`
  margin-top: 12px;
  display: flex;
  justify-content: flex-start;
  border: 1px solid #6a5125;
  border-radius: 5px;
  width: 100%;
  position: relative;
`;
export const AuthorInfo = styled.div`
  padding: 15px;
  font-size: 10px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  margin: 16px;
`;
interface AuthorPhotoProps {
  $path: string | undefined;
}
export const AuthorPhoto = styled.div<AuthorPhotoProps>`
  background-image: url(${(props) => (props.$path ? props.$path : user)});
  background-size: cover;
  background-position: center center;
  border-radius: 50%;
  height: 150px;
  width: 150px;
  cursor: pointer;
  margin: 0 auto;
`;
export const AuthorName = styled.p`
  color: #6a5125;
  margin-top: 8px;
  font-size: 16px;
  letter-spacing: 1px;
  font-weight: 500;
  text-align: center;
  cursor: pointer;
`;
export const Content = styled.div`
  color: #6a5125;
  word-break: break-all;
  padding: 40px 20px;
  & > * + * {
    margin-top: 0.75em;
  }

  & p {
    font-size: 18px;
    line-height: 1.25;
  }

  & h1,
  h2,
  h3 {
    line-height: 1.25;
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
export const BtnWrapper = styled.div`
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
export const EditIconBtn = styled(IconButton)`
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
export const StyledFontAwesomeIcon = styled(FontAwesomeIcon)`
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
const FlexWrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 12px 0px;
`;
const PostTitle = styled.div`
  font-size: 26px;
  color: #6a5125;
  line-height: 30px;
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
export const OpenChatRoomBtn = styled(OperationBtn)`
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
const OverflowWrapper = styled.div`
  min-width: fit-content;
  flex-basis: 300px;
  overflow-x: scroll;
  &::-webkit-scrollbar {
    -webkit-appearance: none;
    width: 4px;
    height: 6px;
  }

  &::-webkit-scrollbar-thumb {
    border-radius: 4px;
    background-color: rgba(0, 0, 0, 0.5);
    box-shadow: 0 0 1px rgba(255, 255, 255, 0.5);
  }
`;
const TradeCardWrapper = styled.div`
  width: 300px;
  display: flex;
  flex-direction: row;
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
  const alertDispatcher = useAlertDispatcher();
  const { isLoggedIn } = useSelector((state: RootState) => state.authority);
  const userInfo: UserInfo = useSelector((state: RootState) => state.userInfo);
  const [post, setPost] = useState<Post>();
  const [comments, setComments] = useState<Comment[]>([]);
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
  const [detailData, setDetailData] = useState<PlantCard>();
  const [cards, setCards] = useState<PlantCard[]>([]);
  const [diaryId, setDiaryId] = useState<string | null>(null);
  const [ownerId, setOwnerId] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  async function deletePost(postId: string) {
    await firebase.deletePost(postId);
    navigate("/forum");
    alertDispatcher("success", "Delete Post Success !");
  }
  function addComment() {
    setEditorMode("AddComment");
    dispatch({
      type: PopUpActions.SHOW_MASK,
    });
    setTextEditorDisplay(true);
    setInitContent("");
  }
  async function openChatroom(targetId: string) {
    const users = [userInfo.userId, targetId];
    const getUserInfo = firebase.getUserInfo(targetId);
    const checkRoom = firebase.checkChatroom(users);
    const result = await Promise.all([getUserInfo, checkRoom]);
    dispatch({
      type: ChatroomActions.ADD_CHATROOM,
      payload: {
        targetInfo: result[0].data(),
      },
    });
  }
  useEffect(() => {
    async function getPost() {
      if (id) {
        const postData = await firebase.getPostData(id);
        if (!postData.exists()) {
          alertDispatcher("fail", "Post not exist !");
          navigate("/");
        }
        const userInfo = await firebase.getUserInfo(postData.data()!.authorId);
        setPost(postData.data());
        setInitTitle(postData.data()!.title);
        setInitContent(postData.data()!.content);
        setComments(postData.data()!.comments!);
        setAuthorInfo(userInfo.data());
        setTimeout(() => setIsLoading(false), 1000);
        if (postData.data()?.cardIds?.length !== 0) {
          const cardsData: PlantCard[] = [];
          const cardIds = postData.data()?.cardIds;
          if (!cardIds) return;
          const cards = await firebase.getCardsByIds(cardIds);
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
      const authorInfos: Record<string, UserInfo> = {};
      if (comments) {
        const authorIdList: string[] = [];
        comments.forEach((comment) => {
          if (!authorIdList.includes(comment.authorId))
            authorIdList.push(comment.authorId);
        });
        const promises = authorIdList.map(async (id) => {
          return firebase.getUserInfo(id);
        });
        const data = await Promise.all(promises);
        data.forEach((promise) => {
          const userData = promise.data() as UserInfo;
          authorInfos[userData.userId] = userData;
        });
      }
      setCommentAuthorInfos(authorInfos);
    }
    getCommentAuthorInfo();
  }, [comments]);
  return (
    <>
      {isLoading && <PageLoader />}
      {!isLoading && (
        <Wrapper>
          <TitleWrapper>
            <TypeText>{post?.type}</TypeText>
            <FlexWrapper>
              <PostTitle>{post?.title && parse(post.title)}</PostTitle>
              {isLoggedIn && (
                <CommentBtn onClick={addComment}>Comment</CommentBtn>
              )}
            </FlexWrapper>
          </TitleWrapper>
          <PostWrapper>
            <AuthorInfo>
              <AuthorPhoto
                $path={authorInfo?.photoUrl}
                onClick={() => navigate(`/profile/${authorInfo?.userId}`)}
              />
              <AuthorName
                onClick={() => navigate(`/profile/${authorInfo?.userId}`)}
              >
                {authorInfo?.userName}
              </AuthorName>
              {userInfo.userId !== authorInfo?.userId && isLoggedIn && (
                <OpenChatRoomBtn
                  onClick={() => openChatroom(authorInfo!.userId)}
                >
                  Open Chatroom
                </OpenChatRoomBtn>
              )}
            </AuthorInfo>
            <Content>{post?.content && parse(post.content)}</Content>
            {cards.length !== 0 && (
              <OverflowWrapper>
                <TradeCardWrapper>
                  {cards.map((card) => {
                    return (
                      <TradeCard
                        key={card.cardId}
                        $show={true}
                        $mode={"grid"}
                        onClick={() => {
                          setDetailData(card);
                          dispatch({
                            type: PopUpActions.SHOW_MASK,
                          });
                        }}
                      >
                        <PlantImg $path={card.plantPhoto} />
                        <NameText>{card.plantName}</NameText>
                        <SpeciesText>{card.species}</SpeciesText>
                        <TagsWrapper>
                          {card?.tags?.length !== 0 &&
                            card.tags?.map((tag) => {
                              return (
                                <Tag key={`${card.cardId}-${tag}`}>{tag}</Tag>
                              );
                            })}
                        </TagsWrapper>
                        <DiaryIconBtn
                          onClick={async (e) => {
                            setDiaryId(card.cardId!);
                            setOwnerId(card.ownerId!);
                            dispatch({
                              type: PopUpActions.SHOW_MASK,
                            });
                            e.stopPropagation();
                          }}
                        >
                          <BookFontAwesomeIcon icon={faBook} />
                        </DiaryIconBtn>
                      </TradeCard>
                    );
                  })}
                </TradeCardWrapper>
              </OverflowWrapper>
            )}
            {userInfo.userId === post?.authorId && (
              <BtnWrapper>
                <EditIconBtn
                  onClick={() => {
                    setEditorMode("EditPost");
                    setTextEditorDisplay(true);
                    dispatch({
                      type: PopUpActions.SHOW_MASK,
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
          {comments &&
            comments.length !== 0 &&
            comments.map((comment) => {
              return (
                <CommentSection
                  post={post}
                  comments={comments}
                  userInfo={userInfo}
                  comment={comment}
                  commentAuthorInfos={commentAuthorInfos}
                  openChatroom={openChatroom}
                  setComments={setComments}
                  setEditTargetComment={setEditTargetComment}
                  setInitContent={setInitContent}
                  setEditorMode={setEditorMode}
                  setTextEditorDisplay={setTextEditorDisplay}
                ></CommentSection>
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
      )}
      {diaryId && (
        <DiaryEditor
          ownerId={ownerId}
          diaryId={diaryId!}
          setDiaryId={setDiaryId}
        />
      )}
      {detailData && (
        <DetailedCard detailData={detailData!} setDetailData={setDetailData} />
      )}
    </>
  );
};

export default ForumPost;
