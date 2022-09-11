import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import "@tiptap/core";
import "./tiptap.css";
import MenuBar from "./MenuBar";
import Document from "@tiptap/extension-document";
import Paragraph from "@tiptap/extension-paragraph";
import Text from "@tiptap/extension-text";
import Bold from "@tiptap/extension-bold";

const Tiptap = () => {
  const editor = useEditor({
    extensions: [StarterKit, Document, Paragraph, Text, Bold],
    content: "<h1>Hello World!</h1>",
  });

  return (
    <>
      <MenuBar editor={editor} />
      <EditorContent editor={editor} />
    </>
  );
};

export default Tiptap;
