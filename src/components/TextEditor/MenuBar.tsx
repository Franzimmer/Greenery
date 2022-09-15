import React from "react";
import { Editor } from "@tiptap/core";
import { OperationBtn } from "../../pages/Profile/cards/Cards";

interface MenuBarProps {
  editor: Editor | null;
}
const MenuBar = ({ editor }: MenuBarProps) => {
  if (!editor) {
    return null;
  }

  return (
    <>
      <OperationBtn
        onClick={() =>
          editor
            .chain()
            .focus()
            .toggleBold()
            .run()
        }
        className={editor.isActive("bold") ? "is-active" : ""}
      >
        bold
      </OperationBtn>
      <OperationBtn
        onClick={() =>
          editor
            .chain()
            .focus()
            .toggleItalic()
            .run()
        }
        className={editor.isActive("italic") ? "is-active" : ""}
      >
        italic
      </OperationBtn>
      <OperationBtn
        onClick={() =>
          editor
            .chain()
            .focus()
            .toggleStrike()
            .run()
        }
        className={editor.isActive("strike") ? "is-active" : ""}
      >
        strike
      </OperationBtn>
      <OperationBtn
        onClick={() =>
          editor
            .chain()
            .focus()
            .toggleHeading({ level: 1 })
            .run()
        }
        className={editor.isActive("heading", { level: 1 }) ? "is-active" : ""}
      >
        h1
      </OperationBtn>
      <OperationBtn
        onClick={() =>
          editor
            .chain()
            .focus()
            .toggleHeading({ level: 2 })
            .run()
        }
        className={editor.isActive("heading", { level: 2 }) ? "is-active" : ""}
      >
        h2
      </OperationBtn>
      <OperationBtn
        onClick={() =>
          editor
            .chain()
            .focus()
            .toggleHeading({ level: 3 })
            .run()
        }
        className={editor.isActive("heading", { level: 3 }) ? "is-active" : ""}
      >
        h3
      </OperationBtn>
      <OperationBtn
        onClick={() =>
          editor
            .chain()
            .focus()
            .toggleBulletList()
            .run()
        }
        className={editor.isActive("bulletList") ? "is-active" : ""}
      >
        bullet list
      </OperationBtn>
      <OperationBtn
        onClick={() =>
          editor
            .chain()
            .focus()
            .toggleOrderedList()
            .run()
        }
        className={editor.isActive("orderedList") ? "is-active" : ""}
      >
        ordered list
      </OperationBtn>
      <OperationBtn
        onClick={() =>
          editor
            .chain()
            .focus()
            .toggleBlockquote()
            .run()
        }
        className={editor.isActive("blockquote") ? "is-active" : ""}
      >
        blockquote
      </OperationBtn>
      <OperationBtn
        onClick={() =>
          editor
            .chain()
            .focus()
            .setHorizontalRule()
            .run()
        }
      >
        horizontal rule
      </OperationBtn>
      <OperationBtn
        onClick={() =>
          editor
            .chain()
            .focus()
            .setHardBreak()
            .run()
        }
      >
        hard break
      </OperationBtn>
      <OperationBtn
        onClick={() =>
          editor
            .chain()
            .focus()
            .undo()
            .run()
        }
      >
        undo
      </OperationBtn>
      <OperationBtn
        onClick={() =>
          editor
            .chain()
            .focus()
            .redo()
            .run()
        }
      >
        redo
      </OperationBtn>
    </>
  );
};

export default MenuBar;
