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
import ConetentSection from "./ContentSection";
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
import user from "../../../assets/user.png";
const Wrapper = styled.div`
  width: 80vw;
  margin: 120px auto 50px;
`;
export const PostWrapper = styled.div`
  margin-top: 12px;
  display: flex;
  justify-content: flex-start;
  border: 1px solid ${(props) => props.theme.colors.button};
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
  color: ${(props) => props.theme.colors.button};
  margin-top: 8px;
  font-size: 16px;
  letter-spacing: 1px;
  font-weight: 500;
  text-align: center;
  cursor: pointer;
`;
export const Content = styled.div`
  color: ${(props) => props.theme.colors.button};
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
    border-left: 5px solid ${(props) => props.theme.colors.button};
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
  border: 1px solid ${(props) => props.theme.colors.button};
  padding: 3px;
  border-radius: 4px;
  &:hover {
    transform: scale(1.2);
    tansition: 0.5s;
  }
`;
export const StyledFontAwesomeIcon = styled(FontAwesomeIcon)`
  color: ${(props) => props.theme.colors.button};
  width: 18px;
  height: 18px;
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
  color: ${(props) => props.theme.colors.button};
  line-height: 30px;
`;
const CommentBtn = styled(OperationBtn)`
  background: ${(props) => props.theme.colors.button};
  border: 1px solid ${(props) => props.theme.colors.button};
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
  border: 1px solid ${(props) => props.theme.colors.button};
  color: ${(props) => props.theme.colors.button};
  display: block;
  margin-top: 12px;
  transition: 0.25s;
  &:hover {
    transform: scale(1.1);
    transition: 0.25s;
  }
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
  function openChatroom(targetId: string) {
    const users = [userInfo.userId, targetId];
    const getUserInfo = firebase.getUserInfo(targetId);
    const checkRoom = firebase.checkChatroom(users);
    Promise.all([getUserInfo, checkRoom]).then((result) =>
      dispatch({
        type: ChatroomActions.ADD_CHATROOM,
        payload: {
          targetInfo: result[0].data(),
        },
      })
    );
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
    function getCommentAuthorInfo() {
      const authorInfos: Record<string, UserInfo> = {};
      if (!comments) return;
      const authorIdList: string[] = [];
      comments.forEach((comment) => {
        if (!authorIdList.includes(comment.authorId))
          authorIdList.push(comment.authorId);
      });
      const promises = authorIdList.map(async (id) => {
        return firebase.getUserInfo(id);
      });
      Promise.all(promises)
        .then((data) =>
          data.forEach((promise) => {
            const userData = promise.data() as UserInfo;
            authorInfos[userData.userId] = userData;
          })
        )
        .then(() => setCommentAuthorInfos(authorInfos));
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
          <ConetentSection
            post={post}
            cards={cards}
            isLoggedIn={isLoggedIn}
            authorInfo={authorInfo!}
            userInfo={userInfo}
            openChatroom={openChatroom}
            setEditorMode={setEditorMode}
            setTextEditorDisplay={setTextEditorDisplay}
            deletePost={deletePost}
            setDetailData={setDetailData}
            setDiaryId={setDiaryId}
            setOwnerId={setOwnerId}
          />
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
                />
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
