import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import "@tiptap/core";
import "./tiptap.css";
import MenuBar from "./MenuBar";
import { OperationBtn } from "../../pages/Profile/cards/CardsGrid";
import Document from "@tiptap/extension-document";
import Text from "@tiptap/extension-text";
import Heading from "@tiptap/extension-heading";
import { useSelector } from "react-redux";
import { RootState } from "../../reducer";
import { firebase } from "../../utils/firebase";
import { Post } from "../../pages/Forum/ForumPost";
import { UserInfo } from "../../types/userInfoType";

interface TiptapProps {
  editorMode: string;
  initContent?: string;
  initTitle?: string;
  post?: Post;
  setEditorMode?: React.Dispatch<React.SetStateAction<string>>;
  setPost?: React.Dispatch<React.SetStateAction<Post | undefined>>;
  setTextEditorDisplay: React.Dispatch<React.SetStateAction<boolean>>;
}
const Tiptap = ({
  editorMode,
  initContent,
  initTitle,
  post,
  setPost,
  setTextEditorDisplay,
}: TiptapProps) => {
  const userInfo: UserInfo = useSelector((state: RootState) => state.userInfo);
  const titleEditor = useEditor({
    extensions: [Document, Text, Heading.configure({ levels: [1] })],
    content: initTitle || "<h1>Title</h1>",
  });
  const editor = useEditor({
    extensions: [StarterKit],
    content: initContent || "<h1>Hello World!</h1>",
  });

  function getPostHTML() {
    if (!titleEditor || !editor) return;
    const title = titleEditor!.getHTML();
    const content = editor!.getHTML();
    const postHtml = { title, content };
    return postHtml;
  }
  async function savePost() {
    const html = getPostHTML()!;
    const authorId = userInfo.userId;
    const data = {
      ...html,
      authorId,
    };
    await firebase.addPostData(data);
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
  async function saveComment() {
    const { content } = getPostHTML()!;
    const authorId = userInfo.userId;
    const comment = {
      content,
      authorId,
    };
    await firebase.saveComment(post!.postId, comment);
  }

  return (
    <>
      <label htmlFor="title">輸入文章標題</label>
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
        onClick={() => {
          saveComment();
          setTextEditorDisplay(false);
        }}
      >
        Save Comment
      </OperationBtn>
    </>
  );
};

export default Tiptap;
