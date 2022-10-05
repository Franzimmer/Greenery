import React, { useState, useEffect } from "react";
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
  transtion: 1s;
  transform: translateX(-50%) translateY(-50%);
  z-index: 101;
  display: flex;
`;
interface EditorWrapperProps {
  $mode: "AddPost" | "EditPost" | "AddComment" | "EditComment";
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
  background: ${(props) => (props.$disabledBtn ? "#aaa" : "#6a5125")};
  border: ${(props) =>
    props.$disabledBtn ? "1px solid #aaa" : "1px solid #6a5125"};
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
  border: 1px solid #6a5125;
  background: #6a5125;
  color: #fff;
  margin-right: 8px;
`;
const TypeBtnActive = styled(TypeBtn)`
  background: #fff;
  color: #6a5125;
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
  const alertDispatcher = useAlertDispatcher();
  const userInfo: UserInfo = useSelector((state: RootState) => state.userInfo);
  const [cardList, setCardList] = useState<PlantCard[]>([]);
  const [menuSelect, setMenuSelect] = useState<Record<string, boolean>>({});
  const [cardWrapperDisplay, setCardWrapperDisplay] = useState<boolean>(false);
  const [disabledBtn, setDisabledBtn] = useState<boolean>(false);
  const [type, setType] = useState<string>("discussion");
  const followers: string[] = useSelector(
    (state: RootState) => state.myFollowers
  );
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
  async function savePost() {
    const cardIds: string[] = [];
    if (!setPostList || !postList) return;
    const postType = type;
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
    const postId = await firebase.addPost(data);
    data["postId"] = postId;
    const newPosts = [...postList];
    newPosts.unshift(data);
    setPostList(newPosts);
    await firebase.emitNotices(userInfo.userId, followers, "2", postId);
    alertDispatcher("success", "Add Post Success !");
    setDisabledBtn(false);
  }
  async function editPost() {
    const html = getPostHTML()!;
    const data = {
      ...post,
      ...html,
    } as Post;
    await firebase.saveEditPost(post!.postId, data);
    if (setPost) setPost(data);
    alertDispatcher("success", "Edit Post Success !");
    setDisabledBtn(false);
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
    setDisabledBtn(false);
    dispatch({
      type: PopUpActions.HIDE_ALL,
    });
    alertDispatcher("success", "Add Comment Success !");
  }
  async function saveEditComment() {
    if (!comments || !setComments) return;
    const postId = post!.postId;
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
    await firebase.saveEditComment(postId, newComments);
    dispatch({
      type: PopUpActions.HIDE_ALL,
    });
    alertDispatcher("success", "Edit Comment Success !");
    setComments(newComments);
    setTextEditorDisplay(false);
    setDisabledBtn(false);
  }

  useEffect(() => {
    async function getUserCards() {
      const querySnapshot = await firebase.getUserCards(userInfo.userId);
      if (!querySnapshot.empty) {
        const cards: PlantCard[] = [];
        const checkList = {} as Record<string, boolean>;
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
    <Wrapper $show={cardWrapperDisplay}>
      <EditoWrapper $mode={editorMode}>
        {editorMode === "AddPost" && (
          <TypeBtnWrapper>
            <LabelText>Post Type</LabelText>
            {cardList.length === 0 && (
              <TypeBtnWrapper>
                <TypeBtn
                  onClick={() => {
                    setType("discussion");
                    setCardWrapperDisplay(false);
                  }}
                >
                  Discussion
                </TypeBtn>
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
                <TypeBtn
                  onClick={() => {
                    setType("discussion");
                    setCardWrapperDisplay(false);
                  }}
                >
                  Discussion
                </TypeBtn>
                <TypeBtnActive
                  onClick={() => {
                    setType("trade");
                    setCardWrapperDisplay(true);
                  }}
                >
                  Trade
                </TypeBtnActive>
              </TypeBtnWrapper>
            )}
            {cardList.length > 0 && type === "trade" && (
              <TypeBtnWrapper>
                <TypeBtnActive
                  onClick={() => {
                    setType("discussion");
                    setCardWrapperDisplay(false);
                  }}
                >
                  Discussion
                </TypeBtnActive>
                <TypeBtn
                  onClick={() => {
                    setType("trade");
                    setCardWrapperDisplay(true);
                  }}
                >
                  Trade
                </TypeBtn>
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
                  setTextEditorDisplay(false);
                  setDisabledBtn(true);
                  dispatch({
                    type: PopUpActions.HIDE_ALL,
                  });
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
                  setTextEditorDisplay(false);
                  setDisabledBtn(true);
                  dispatch({
                    type: PopUpActions.HIDE_ALL,
                  });
                }
              }}
            >
              Save
            </TextEditorBtn>
          )}
          {editorMode === "AddComment" && (
            <TextEditorBtn
              $disabledBtn={disabledBtn}
              onClick={async () => {
                if (!disabledBtn) {
                  await addComment();
                  setDisabledBtn(true);
                  setTextEditorDisplay(false);
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
          <TextEditorBtn
            $disabledBtn={disabledBtn}
            onClick={() => {
              setTextEditorDisplay(false);
              dispatch({
                type: PopUpActions.HIDE_ALL,
              });
            }}
          >
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
