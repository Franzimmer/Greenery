import React, { useRef, useState, useEffect } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import "@tiptap/core";
import "./tiptap.css";
import MenuBar from "./MenuBar";
import { OperationBtn } from "../../pages/Profile/cards/Cards";
import Document from "@tiptap/extension-document";
import Text from "@tiptap/extension-text";
import Heading from "@tiptap/extension-heading";
import { useSelector } from "react-redux";
import { RootState } from "../../reducer";
import { firebase } from "../../utils/firebase";
import { Post } from "../../pages/Forum/ForumPost";
import { UserInfo } from "../../types/userInfoType";
import { Comment } from "../../pages/Forum/ForumPost";
import CardsWrapper from "../../components/CardSelectDialog/CardsWrapper";
import { PlantCard } from "../../types/plantCardType";

interface TiptapProps {
  editorMode: string;
  initContent?: string;
  initTitle?: string;
  post?: Post;
  comments?: Comment[];
  editTargetComment?: Comment;
  setEditorMode?: React.Dispatch<React.SetStateAction<string>>;
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
  setEditorMode,
  setPost,
  setComments,
  setTextEditorDisplay,
}: TiptapProps) => {
  const userInfo: UserInfo = useSelector((state: RootState) => state.userInfo);
  const cardList: PlantCard[] = useSelector((state: RootState) => state.cards);
  const followers: string[] = useSelector(
    (state: RootState) => state.myFollowers
  );
  const typeRef = useRef<HTMLSelectElement>(null);
  const titleEditor = useEditor({
    extensions: [Document, Text, Heading.configure({ levels: [1] })],
    content: initTitle || "<h1>Title</h1>",
  });
  const editor = useEditor({
    extensions: [StarterKit],
    content: initContent || "<h1>Hello World!</h1>",
  });
  const [menuSelect, setMenuSelect] = useState<Record<string, boolean>>({});
  const [cardWrapperDisplay, setCardWrapperDisplay] = useState<boolean>(false);
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
    newPosts.push(data);
    setPostList(newPosts);
    await firebase.emitNotices(userInfo.userId, followers, "2", postId);
    alert("文章發表成功！");
  }
  async function editPost() {
    const html = getPostHTML()!;
    const data = {
      ...post,
      ...html,
    } as Post;
    await firebase.saveEditPost(post!.postId, data);
    if (setPost) setPost(data);
    alert("編輯成功！");
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
    alert("編輯留言成功！");
    setComments(newComments);
    setTextEditorDisplay(false);
  }
  function toggleCardWrapperDisplay() {
    if (typeRef.current?.value === "trade") setCardWrapperDisplay(true);
    else setCardWrapperDisplay(false);
  }

  useEffect(() => {
    if (cardList.length !== 0) {
      let checkList = {} as Record<string, boolean>;
      cardList.forEach((card) => {
        checkList[card.cardId!] = false;
      });
      setMenuSelect(checkList);
    }
  }, []);
  return (
    <>
      {editorMode !== "Comment" && (
        <>
          <label style={{ display: "inline-block", marginTop: "10px" }}>
            選擇文章類型
          </label>
          <select name="type" ref={typeRef} onChange={toggleCardWrapperDisplay}>
            <option value="discussion">討論</option>
            <option value="trade">交易</option>
          </select>
          <CardsWrapper
            cardListDisplay={cardWrapperDisplay}
            cardList={cardList}
            menuSelect={menuSelect}
            setMenuSelect={setMenuSelect}
          ></CardsWrapper>
        </>
      )}
      <label htmlFor="title" style={{ display: "block", marginTop: "10px" }}>
        輸入文章標題
      </label>
      {editorMode !== "Comment" && (
        <EditorContent editor={titleEditor} id="title" />
      )}
      <MenuBar editor={editor} />
      <EditorContent editor={editor} />
      <OperationBtn
        onClick={() => {
          savePost();
          setTextEditorDisplay(false);
        }}
      >
        Save
      </OperationBtn>
      <OperationBtn
        onClick={() => {
          editPost();
          setTextEditorDisplay(false);
        }}
      >
        Save Edit
      </OperationBtn>
      <OperationBtn
        onClick={async () => {
          await addComment();
          setTextEditorDisplay(false);
        }}
      >
        Add Comment
      </OperationBtn>
      <OperationBtn
        onClick={() => {
          saveEditComment();
        }}
      >
        Save Edit Comment
      </OperationBtn>
      <OperationBtn
        onClick={() => {
          setTextEditorDisplay(false);
        }}
      >
        Cancel
      </OperationBtn>
    </>
  );
};

export default TextEditor;
