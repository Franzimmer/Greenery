import React, { useRef, useState, useEffect } from "react";
import styled from "styled-components";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import "@tiptap/core";
import "./tiptap.css";
import MenuBar from "./MenuBar";
import { popUpActions } from "../../reducer/popUpReducer";
import { OperationBtn } from "../../components/GlobalStyles/button";
import Document from "@tiptap/extension-document";
import Text from "@tiptap/extension-text";
import Heading from "@tiptap/extension-heading";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../reducer";
import { firebase } from "../../utils/firebase";
import { Post } from "../../pages/Forum/ForumPost";
import { UserInfo } from "../../types/userInfoType";
import { Comment } from "../../pages/Forum/ForumPost";
import CardsWrapper from "../../components/CardSelectDialog/CardsWrapper";
import { PlantCard } from "../../types/plantCardType";
const Wrapper = styled.div`
  position: absolute;
  top: 50vh;
  left: 50vw;
  transform: translateX(-50%) translateY(-50%);
  z-index: 101;
  display: flex;
`;
const EditoWrapper = styled.div`
  width: 500px;
  height: 450px;
  background: #fff;
  padding: 15px;
`;
const LabelText = styled.label`
  font-size: 16px;
  margin: 10px 8px 0 0;
  display: inline-block;
`;
const TextEditorBtn = styled(OperationBtn)`
  background: #6a5125;
  border: 1px solid #6a5125;
  margin: 5px 5px 0px 0px;
  transtion: 0.25s;
  &:hover {
    transform: scale(1.1);
    transtion: 0.25s;
  }
`;
interface CardPanelWrapperProps {
  $show: boolean;
}
const CardPanelWrapper = styled.div<CardPanelWrapperProps>`
  width: ${(props) => (props.$show ? "330px" : 0)};
  height: 450px;
  overflow-y: auto;
  padding: 15px;
  background: #fff;
  transition: 1s;
`;
interface TiptapProps {
  editorMode: "AddPost" | "EditPost" | "AddComment" | "EditComment";
  initContent?: string;
  initTitle?: string;
  post?: Post;
  comments?: Comment[];
  editTargetComment?: Comment;
  setPost?: React.Dispatch<React.SetStateAction<Post | undefined>>;
  setComments?: React.Dispatch<React.SetStateAction<Comment[]>>;
  setTextEditorDisplay: React.Dispatch<React.SetStateAction<boolean>>;
  postList?: Post[];
  setPostList?: React.Dispatch<React.SetStateAction<Post[]>>;
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
  const userInfo: UserInfo = useSelector((state: RootState) => state.userInfo);
  const [cardList, setCardList] = useState<PlantCard[]>([]);
  const followers: string[] = useSelector(
    (state: RootState) => state.myFollowers
  );
  const typeRef = useRef<HTMLSelectElement>(null);
  const titleEditor = useEditor({
    extensions: [Document, Text, Heading.configure({ levels: [1] })],
    content: initTitle || "Title",
  });
  const editor = useEditor({
    extensions: [StarterKit],
    content: initContent || "",
  });
  const [menuSelect, setMenuSelect] = useState<Record<string, boolean>>({});
  const [cardWrapperDisplay, setCardWrapperDisplay] = useState<boolean>(false);
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
  function getPostHTML() {
    if (!titleEditor || !editor) return;
    const title = titleEditor!.getHTML();
    const content = editor!.getHTML();
    const postHtml = { title, content };
    return postHtml;
  }
  async function savePost() {
    let cardIds: string[] = [];
    if (!typeRef.current || !setPostList || !postList) return;
    const postType = typeRef.current!.value;
    const html = getPostHTML()!;
    const authorId = userInfo.userId;
    const data = {
      ...html,
      authorId,
      type: postType,
      cardIds,
    } as Post;
    if (postType === "trade") {
      Object.keys(menuSelect).forEach((id) => {
        if (menuSelect[id]) cardIds.push(id);
      });
      data["cardIds"] = cardIds;
    }
    let postId = await firebase.addPost(data);
    data["postId"] = postId;
    let newPosts = [...postList];
    newPosts.unshift(data);
    setPostList(newPosts);
    await firebase.emitNotices(userInfo.userId, followers, "2", postId);
    emitAlert("success", "Add Post Success !");
  }
  async function editPost() {
    const html = getPostHTML()!;
    const data = {
      ...post,
      ...html,
    } as Post;
    await firebase.saveEditPost(post!.postId, data);
    if (setPost) setPost(data);
    emitAlert("success", "Edit Post Success !");
  }
  async function addComment() {
    if (!setComments) return;
    const { content } = getPostHTML()!;
    const authorId = userInfo.userId;
    const comment = {
      content,
      authorId,
      createdTime: Date.now(),
    } as Comment;
    await firebase.saveComment(post!.postId, comment);
    let newComments: Comment[] = [];
    if (comments?.length) {
      newComments = [...comments];
    } else newComments = [];
    newComments.push(comment);
    setComments(newComments);
    emitAlert("success", "Add Comment Success !");
  }
  async function saveEditComment() {
    if (!comments || !setComments) return;
    let postId = post!.postId;
    let newComment = {
      authorId: editTargetComment!.authorId,
      content: getPostHTML()?.content || "",
      createdTime: Date.now(),
    };
    let targetId = comments!.findIndex(
      (comment) =>
        comment.authorId === editTargetComment?.authorId &&
        comment.createdTime === editTargetComment.createdTime
    );
    let newComments = [...comments];
    newComments[targetId] = newComment;
    await firebase.saveEditComment(postId, newComments);
    emitAlert("success", "Edit Comment Success !");
    setComments(newComments);
    setTextEditorDisplay(false);
    dispatch({
      type: popUpActions.HIDE_ALL,
    });
  }
  function toggleCardWrapperDisplay() {
    if (typeRef.current?.value === "trade") setCardWrapperDisplay(true);
    else setCardWrapperDisplay(false);
  }
  useEffect(() => {
    async function getUserCards() {
      let querySnapshot = await firebase.getUserCards(userInfo.userId);
      if (!querySnapshot.empty) {
        let cards: PlantCard[] = [];
        let checkList = {} as Record<string, boolean>;
        querySnapshot.forEach((doc) => {
          cards.push(doc.data());
          checkList[doc.data().cardId!] = false;
        });
        setCardList(cards);
        setMenuSelect(checkList);
      }
    }
    getUserCards();
  }, []);
  return (
    <Wrapper>
      <EditoWrapper>
        {editorMode !== "AddComment" && editorMode !== "EditComment" && (
          <>
            <LabelText>Post Type:</LabelText>
            <select
              name="type"
              ref={typeRef}
              onChange={toggleCardWrapperDisplay}
            >
              <option value="discussion">Discussion</option>
              <option value="trade">Trade</option>
            </select>
          </>
        )}
        {editorMode !== "AddComment" && editorMode !== "EditComment" && (
          <EditorContent editor={titleEditor} id="title" />
        )}
        <MenuBar editor={editor} />
        <EditorContent editor={editor} id="content" />
        {editorMode === "AddPost" && (
          <TextEditorBtn
            onClick={() => {
              savePost();
              setTextEditorDisplay(false);
              dispatch({
                type: popUpActions.HIDE_ALL,
              });
            }}
          >
            Save
          </TextEditorBtn>
        )}
        {editorMode === "EditPost" && (
          <TextEditorBtn
            onClick={() => {
              editPost();
              setTextEditorDisplay(false);
              dispatch({
                type: popUpActions.HIDE_ALL,
              });
            }}
          >
            Save Edit
          </TextEditorBtn>
        )}
        {editorMode === "AddComment" && (
          <TextEditorBtn
            onClick={async () => {
              await addComment();
              setTextEditorDisplay(false);
              dispatch({
                type: popUpActions.HIDE_ALL,
              });
            }}
          >
            Add Comment
          </TextEditorBtn>
        )}
        {editorMode === "EditComment" && (
          <TextEditorBtn
            onClick={() => {
              saveEditComment();
            }}
          >
            Save Edit Comment
          </TextEditorBtn>
        )}
        <TextEditorBtn
          onClick={() => {
            setTextEditorDisplay(false);
            dispatch({
              type: popUpActions.HIDE_ALL,
            });
          }}
        >
          Cancel
        </TextEditorBtn>
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
