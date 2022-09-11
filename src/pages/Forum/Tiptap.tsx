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

const Tiptap = () => {
  const userInfo = useSelector((state: RootState) => state.userInfo);

  const titleEditor = useEditor({
    extensions: [Document, Text, Heading.configure({ levels: [1] })],
    content: "<h1>Title</h1>",
  });
  const editor = useEditor({
    extensions: [StarterKit],
    content: "<h1>Hello World!</h1>",
  });

  async function savePost() {
    if (!titleEditor || !editor) return;
    const title = titleEditor!.getHTML();
    const content = editor!.getHTML();
    const authorId = userInfo.userId;
    const data = {
      title,
      content,
      authorId,
    };
    await firebase.savePostData(data);
    alert("文章發表成功！");
  }

  return (
    <>
      <label htmlFor="title">輸入文章標題</label>
      <EditorContent editor={titleEditor} id="title" />
      <MenuBar editor={editor} />
      <EditorContent editor={editor} />
      <OperationBtn
        onClick={() => {
          savePost();
        }}
      >
        Save
      </OperationBtn>
    </>
  );
};

export default Tiptap;
