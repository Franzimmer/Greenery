import React, { useRef, useState, useEffect } from "react";
import styled from "styled-components";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import "@tiptap/core";
import "./tiptap.css";
import MenuBar from "./MenuBar";
import { popUpActions } from "../../store/reducer/popUpReducer";
import { OperationBtn } from "../../components/GlobalStyles/button";
import Document from "@tiptap/extension-document";
import Text from "@tiptap/extension-text";
import Heading from "@tiptap/extension-heading";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../store/reducer";
import { firebase } from "../../utils/firebase";
import { Post } from "../../pages/Forum/ForumPost";
import { UserInfo } from "../../store/types/userInfoType";
import { Comment } from "../../pages/Forum/ForumPost";
import CardsWrapper from "../../components/CardSelectDialog/CardsWrapper";
import { PlantCard } from "../../store/types/plantCardType";
interface CardPanelWrapperProps {
  $show: boolean;
}
const Wrapper = styled.div<CardPanelWrapperProps>`
  width: ${(props) => (props.$show ? "880px" : "auto")};
  position: absolute;
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
  width: 500px;
  height: ${(props) =>
    props.$mode === "AddComment" || "EditComment" ? "fit-content" : "450px"};
  background: #fff;
  padding: 15px;
`;
const LabelText = styled.div`
  font-size: 16px;
  margin: 0 8px 0 0;
`;
const TextEditorBtn = styled(OperationBtn)`
  width: 100px;
  background: #6a5125;
  border: 1px solid #6a5125;
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
const TypeBtnInactive = styled(TypeBtn)`
  background: #fff;
  color: #6a5125;
`;
const TypeBtnDisabled = styled(TypeBtnInactive)`
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
  const userInfo: UserInfo = useSelector((state: RootState) => state.userInfo);
  const [cardList, setCardList] = useState<PlantCard[]>([]);
  const [menuSelect, setMenuSelect] = useState<Record<string, boolean>>({});
  const [cardWrapperDisplay, setCardWrapperDisplay] = useState<boolean>(false);
  const [type, setType] = useState<string>("discussion");
  const followers: string[] = useSelector(
    (state: RootState) => state.myFollowers
  );
  const titleEditor = useEditor({
    extensions: [Document, Text, Heading.configure({ levels: [3] })],
    content: initTitle || "Title",
  });
  const editor = useEditor({
    extensions: [StarterKit],
    content: initContent || "",
  });

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
  console.log(editorMode);
  return (
    <Wrapper $show={cardWrapperDisplay}>
      <EditoWrapper $mode={editorMode}>
        {editorMode !== "AddComment" && editorMode !== "EditComment" && (
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
                    emitAlert("fail", "You have no plant to trade.")
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
                <TypeBtnInactive
                  onClick={() => {
                    setType("trade");
                    setCardWrapperDisplay(true);
                  }}
                >
                  Trade
                </TypeBtnInactive>
              </TypeBtnWrapper>
            )}
            {cardList.length > 0 && type === "trade" && (
              <TypeBtnWrapper>
                <TypeBtnInactive
                  onClick={() => {
                    setType("discussion");
                    setCardWrapperDisplay(false);
                  }}
                >
                  Discussion
                </TypeBtnInactive>
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
            Save
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
            Save
          </TextEditorBtn>
        )}
        {editorMode === "EditComment" && (
          <TextEditorBtn
            onClick={() => {
              saveEditComment();
            }}
          >
            Save
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
