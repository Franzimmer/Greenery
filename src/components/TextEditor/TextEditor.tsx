import React, { useState, useEffect, Dispatch, SetStateAction } from "react";
import styled from "styled-components";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Document from "@tiptap/extension-document";
import Text from "@tiptap/extension-text";
import Heading from "@tiptap/extension-heading";
import "@tiptap/core";
import "./tiptap.css";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../store/reducer";
import { PopUpActions } from "../../store/actions/popUpActions";
import { firebase } from "../../utils/firebase";
import { useAlertDispatcher } from "../../utils/useAlertDispatcher";
import MenuBar from "./MenuBar";
import CardsWrapper from "../../components/CardSelectDialog/CardsWrapper";
import { Post } from "../../pages/Forum/ForumPost/ForumPost";
import { UserInfo } from "../../store/types/userInfoType";
import { Comment } from "../../pages/Forum/ForumPost/ForumPost";
import { PlantCard } from "../../store/types/plantCardType";
import { OperationBtn } from "../../components/GlobalStyles/button";
interface CardPanelWrapperProps {
  $show: boolean;
}
const Wrapper = styled.div<CardPanelWrapperProps>`
  width: ${(props) => (props.$show ? "calc(50vw + 330px)" : "auto")};
  position: fixed;
  top: 50vh;
  left: 50vw;
  transform: translateX(-50%) translateY(-50%);
  z-index: 101;
  display: flex;
  @media (max-width: 750px) {
    width: 90vw;
    max-height: 100vh;
    flex-direction: column;
  }
`;
interface EditorWrapperProps {
  $mode: "AddPost" | "EditPost" | "AddComment" | "EditComment";
  $type: string;
}
const EditoWrapper = styled.div<EditorWrapperProps>`
  width: 50vw;
  height: ${(props) =>
    props.$mode === "AddComment" || props.$mode === "EditComment"
      ? "fit-content"
      : "450px"};
  background: #fff;
  padding: 15px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  @media (max-width: 927px) {
    height: ${(props) =>
      props.$mode === "AddComment" || props.$mode === "EditComment"
        ? "fit-content"
        : "480px"};
  }
  @media (max-width: 750px) {
    width: 90vw;
    margin-top: ${(props) => props.$type === "discussion" && "120px"};
  }
`;
const LabelText = styled.div`
  font-size: 16px;
  margin: 0 8px 0 0;
`;
const TextEditorBtnWrapper = styled.div`
  display: flex;
  margin-top: auto;
`;
interface TextEditorBtnProps {
  $disabledBtn: boolean;
}
const TextEditorBtn = styled(OperationBtn)<TextEditorBtnProps>`
  width: 100px;
  background: ${(props) =>
    props.$disabledBtn ? "#aaa" : props.theme.colors.button};
  border: ${(props) =>
    props.$disabledBtn
      ? "1px solid #aaa"
      : `1px solid ${props.theme.colors.button}`};
  cursor: ${(props) => (props.$disabledBtn ? "not-allowed" : "pointer")};
  margin: 8px 8px 0px 0px;
  transtion: 0.25s;
  &:hover {
    transform: scale(1.1);
    transtion: 0.25s;
  }
`;
const CardPanelWrapper = styled.div<CardPanelWrapperProps>`
  width: ${(props) => (props.$show ? "330px" : 0)};
  height: 450px;
  overflow-y: auto;
  padding: ${(props) => (props.$show ? "15px" : 0)};
  background: #fff;
  transition: 1s;
  @media (max-width: 927px) {
    height: 480px;
  }
  @media (max-width: 750px) {
    width: ${(props) => (props.$show ? "90vw" : 0)};
  }
`;
const TypeBtnWrapper = styled.div`
  display: flex;
  align-items: center;
`;
const TypeBtn = styled.div`
  cursor: pointer;
  width: 100px;
  height: 30px;
  line-height: 30px;
  text-align: center;
  border-radius: 10px;
  border: 1px solid ${(props) => props.theme.colors.button};
  background: ${(props) => props.theme.colors.button};
  color: #fff;
  margin-right: 8px;
`;
const TypeBtnActive = styled(TypeBtn)`
  background: #fff;
  color: ${(props) => props.theme.colors.button};
`;
const TypeBtnDisabled = styled(TypeBtnActive)`
  border: 1px solid #aaa;
  color: #aaa;
  cursor: not-allowed;
`;
interface TiptapProps {
  editorMode: "AddPost" | "EditPost" | "AddComment" | "EditComment";
  initContent?: string;
  initTitle?: string;
  post?: Post;
  comments?: Comment[];
  editTargetComment?: Comment;
  postList?: Post[];
  setPost?: Dispatch<SetStateAction<Post | undefined>>;
  setComments?: Dispatch<SetStateAction<Comment[]>>;
  setTextEditorDisplay: Dispatch<SetStateAction<boolean>>;
  setPostList?: Dispatch<SetStateAction<Post[]>>;
}
const TextEditor = ({
  editorMode,
  initContent,
  initTitle,
  post,
  comments,
  editTargetComment,
  postList,
  setPostList,
  setPost,
  setComments,
  setTextEditorDisplay,
}: TiptapProps) => {
  const dispatch = useDispatch();
  const alertDispatcher = useAlertDispatcher();
  const { userId }: UserInfo = useSelector(
    (state: RootState) => state.userInfo
  );
  const followers: string[] = useSelector(
    (state: RootState) => state.myFollowers
  );
  const cardList: PlantCard[] = useSelector((state: RootState) => state.cards);
  const [menuSelect, setMenuSelect] = useState<Record<string, boolean>>({});
  const [cardWrapperDisplay, setCardWrapperDisplay] = useState<boolean>(false);
  const [disabledBtn, setDisabledBtn] = useState<boolean>(false);
  const [type, setType] = useState<string>("discussion");

  const titleEditor = useEditor({
    extensions: [Document, Text, Heading.configure({ levels: [3] })],
    content: initTitle || "Title",
  });
  const editor = useEditor({
    extensions: [
      StarterKit,
      Image.configure({
        HTMLAttributes: { class: "my-img" },
      }),
    ],
    content: initContent || "",
  });
  function getPostHTML() {
    if (!titleEditor || !editor) return;
    const title = titleEditor!.getHTML();
    const content = editor!.getHTML();
    const postHtml = { title, content };
    return postHtml;
  }
  async function uploadPostData() {
    const cardIds: string[] = [];
    const html = getPostHTML()!;
    const data = {
      ...html,
      authorId: userId,
      type,
      cardIds,
    } as Post;
    if (type === "trade") {
      Object.keys(menuSelect).forEach((id) => {
        if (menuSelect[id]) cardIds.push(id);
      });
      data["cardIds"] = cardIds;
    }
    const postId = await firebase.addPost(data);
    data["postId"] = postId;
    return data;
  }
  function closeEditor() {
    dispatch({
      type: PopUpActions.HIDE_ALL,
    });
    setTextEditorDisplay(false);
    setDisabledBtn(false);
  }
  function updatePostList(data: Post) {
    if (!setPostList || !postList) return;
    const newPosts = [...postList!];
    newPosts.unshift(data);
    setPostList(newPosts);
  }
  async function savePost() {
    const data = (await uploadPostData()) as Post;
    updatePostList(data);
    closeEditor();
    await firebase.emitNotices(userId, followers, "2", data!.postId);
    alertDispatcher("success", "Add Post Success !");
  }
  async function editPost() {
    const html = getPostHTML()!;
    const data = {
      ...post,
      ...html,
    } as Post;
    await firebase.saveEditPost(post!.postId, data);
    if (setPost) setPost(data);
    closeEditor();
    alertDispatcher("success", "Edit Post Success !");
  }
  async function uploadCommentData() {
    const { content } = getPostHTML()!;
    const comment = {
      content,
      authorId: userId,
      createdTime: Date.now(),
    } as Comment;
    await firebase.saveComment(post!.postId, comment);
    return comment;
  }
  function updateCommentList(comment: Comment) {
    let newComments: Comment[];
    if (comments?.length) newComments = [...comments];
    else newComments = [];
    newComments.push(comment);
    if (setComments) setComments(newComments);
  }
  async function addComment() {
    const comment = await uploadCommentData();
    updateCommentList(comment);
    closeEditor();
    alertDispatcher("success", "Add Comment Success !");
  }
  function updateEditComment() {
    if (!comments || !setComments) return;
    const newComment = {
      authorId: editTargetComment!.authorId,
      content: getPostHTML()?.content || "",
      createdTime: Date.now(),
    };
    const targetId = comments!.findIndex(
      (comment) =>
        comment.authorId === editTargetComment?.authorId &&
        comment.createdTime === editTargetComment.createdTime
    );
    const newComments = [...comments];
    newComments[targetId] = newComment;
    setComments(newComments);
    return newComments;
  }
  async function saveEditComment() {
    const newComments = updateEditComment() as Comment[];
    await firebase.saveEditComment(post!.postId, newComments);
    closeEditor();
    alertDispatcher("success", "Edit Comment Success !");
  }
  function switchToTradeType() {
    setType("trade");
    setCardWrapperDisplay(true);
  }
  function switchToDiscussionType() {
    setType("discussion");
    setCardWrapperDisplay(false);
  }
  useEffect(() => {
    const checkList: Record<string, boolean> = {};
    cardList.forEach((card) => {
      checkList[card.cardId!] = false;
    });
    setMenuSelect(checkList);
  }, [cardList]);
  return (
    <Wrapper $show={cardWrapperDisplay}>
      <EditoWrapper $mode={editorMode} $type={type}>
        {editorMode === "AddPost" && (
          <TypeBtnWrapper>
            <LabelText>Post Type</LabelText>
            {cardList.length === 0 && (
              <TypeBtnWrapper>
                <TypeBtn onClick={switchToDiscussionType}>Discussion</TypeBtn>
                <TypeBtnDisabled
                  onClick={() =>
                    alertDispatcher("fail", "You have no plant to trade.")
                  }
                >
                  Trade
                </TypeBtnDisabled>
              </TypeBtnWrapper>
            )}
            {cardList.length > 0 && type === "discussion" && (
              <TypeBtnWrapper>
                <TypeBtn onClick={switchToDiscussionType}>Discussion</TypeBtn>
                <TypeBtnActive onClick={switchToTradeType}>Trade</TypeBtnActive>
              </TypeBtnWrapper>
            )}
            {cardList.length > 0 && type === "trade" && (
              <TypeBtnWrapper>
                <TypeBtnActive onClick={switchToDiscussionType}>
                  Discussion
                </TypeBtnActive>
                <TypeBtn onClick={switchToTradeType}>Trade</TypeBtn>
              </TypeBtnWrapper>
            )}
          </TypeBtnWrapper>
        )}
        {editorMode !== "AddComment" && editorMode !== "EditComment" && (
          <EditorContent editor={titleEditor} id="title" />
        )}
        <MenuBar editor={editor} />
        <EditorContent editor={editor} id="content" />
        <TextEditorBtnWrapper>
          {editorMode === "AddPost" && (
            <TextEditorBtn
              $disabledBtn={disabledBtn}
              onClick={() => {
                if (!disabledBtn) {
                  savePost();
                  setDisabledBtn(true);
                }
              }}
            >
              Save
            </TextEditorBtn>
          )}
          {editorMode === "EditPost" && (
            <TextEditorBtn
              $disabledBtn={disabledBtn}
              onClick={() => {
                if (!disabledBtn) {
                  editPost();
                  setDisabledBtn(true);
                }
              }}
            >
              Save
            </TextEditorBtn>
          )}
          {editorMode === "AddComment" && (
            <TextEditorBtn
              $disabledBtn={disabledBtn}
              onClick={() => {
                if (!disabledBtn) {
                  addComment();
                  setDisabledBtn(true);
                }
              }}
            >
              Save
            </TextEditorBtn>
          )}
          {editorMode === "EditComment" && (
            <TextEditorBtn
              $disabledBtn={disabledBtn}
              onClick={() => {
                if (!disabledBtn) {
                  saveEditComment();
                  setDisabledBtn(true);
                }
              }}
            >
              Save
            </TextEditorBtn>
          )}
          <TextEditorBtn $disabledBtn={disabledBtn} onClick={closeEditor}>
            Cancel
          </TextEditorBtn>
        </TextEditorBtnWrapper>
      </EditoWrapper>
      <CardPanelWrapper $show={cardWrapperDisplay}>
        <CardsWrapper
          cardListDisplay={cardWrapperDisplay}
          cardList={cardList}
          menuSelect={menuSelect}
          setMenuSelect={setMenuSelect}
        ></CardsWrapper>
      </CardPanelWrapper>
    </Wrapper>
  );
};

export default TextEditor;
