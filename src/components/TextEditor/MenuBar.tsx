import React, { useRef } from "react";
import { firebase } from "../../utils/firebase";
import { Editor } from "@tiptap/core";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBold,
  faItalic,
  faStrikethrough,
  faListUl,
  faListOl,
  faRotateRight,
  faRotateLeft,
  faQuoteLeft,
  faArrowTurnUp,
} from "@fortawesome/free-solid-svg-icons";
import { faImage } from "@fortawesome/free-regular-svg-icons";
const OperationMenu = styled.div`
  display: flex;
  flex-wrap: wrap;
  margin-top: 20px;
`;
const TextEditorBtn = styled.label`
  display: flex;
  justify-content: center;
  alugn-items: center;
  color: #6a5125;
  border: 1px solid #6a5125;
  padding: 3px;
  width: 26px;
  height: 26px;
  margin: 0px 5px 5px 0px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: 0.25s;
  &:hover {
    transform: scale(1.1);
    transition: 0.25s;
  }
`;

const StyledFontAwesomeIcon = styled(FontAwesomeIcon)`
  color: #6a5125;
  width: 16px;
  height: 16px;
  background: none;
`;
interface MenuBarProps {
  editor: Editor | null;
}
const MenuBar = ({ editor }: MenuBarProps) => {
  const imageRef = useRef<HTMLInputElement>(null);
  if (!editor) {
    return null;
  }

  async function addImage() {
    if (!imageRef.current) return;
    if (imageRef.current.files!.length === 0) return;
    const imgLink = await firebase.uploadFile(imageRef.current.files![0]);
    if (imgLink) {
      editor!
        .chain()
        .focus()
        .setImage({ src: imgLink })
        .run();
    }
  }

  return (
    <OperationMenu>
      <TextEditorBtn
        onClick={() =>
          editor
            .chain()
            .focus()
            .toggleBold()
            .run()
        }
        className={editor.isActive("bold") ? "is-active" : ""}
      >
        <StyledFontAwesomeIcon icon={faBold} />
      </TextEditorBtn>
      <TextEditorBtn
        onClick={() =>
          editor
            .chain()
            .focus()
            .toggleItalic()
            .run()
        }
        className={editor.isActive("italic") ? "is-active" : ""}
      >
        <StyledFontAwesomeIcon icon={faItalic} />
      </TextEditorBtn>
      <TextEditorBtn
        onClick={() =>
          editor
            .chain()
            .focus()
            .toggleStrike()
            .run()
        }
        className={editor.isActive("strike") ? "is-active" : ""}
      >
        <StyledFontAwesomeIcon icon={faStrikethrough} />
      </TextEditorBtn>

      <TextEditorBtn
        onClick={() =>
          editor
            .chain()
            .focus()
            .toggleBulletList()
            .run()
        }
        className={editor.isActive("bulletList") ? "is-active" : ""}
      >
        <StyledFontAwesomeIcon icon={faListUl} />
      </TextEditorBtn>
      <TextEditorBtn
        onClick={() =>
          editor
            .chain()
            .focus()
            .toggleOrderedList()
            .run()
        }
        className={editor.isActive("orderedList") ? "is-active" : ""}
      >
        <StyledFontAwesomeIcon icon={faListOl} />{" "}
      </TextEditorBtn>
      <TextEditorBtn
        onClick={() =>
          editor
            .chain()
            .focus()
            .toggleBlockquote()
            .run()
        }
        className={editor.isActive("blockquote") ? "is-active" : ""}
      >
        <StyledFontAwesomeIcon icon={faQuoteLeft} />
      </TextEditorBtn>
      <TextEditorBtn htmlFor="image">
        <input
          id="image"
          type="file"
          accept="image/*"
          ref={imageRef}
          onChange={addImage}
          hidden
        />
        <StyledFontAwesomeIcon icon={faImage} />
      </TextEditorBtn>
      <TextEditorBtn
        onClick={() =>
          editor
            .chain()
            .focus()
            .setHardBreak()
            .run()
        }
      >
        <StyledFontAwesomeIcon
          icon={faArrowTurnUp}
          style={{ transform: "rotate(90deg)" }}
        />
      </TextEditorBtn>
      <TextEditorBtn
        onClick={() =>
          editor
            .chain()
            .focus()
            .undo()
            .run()
        }
      >
        <StyledFontAwesomeIcon icon={faRotateLeft} />
      </TextEditorBtn>
      <TextEditorBtn
        onClick={() =>
          editor
            .chain()
            .focus()
            .redo()
            .run()
        }
      >
        <StyledFontAwesomeIcon icon={faRotateRight} />
      </TextEditorBtn>
      <TextEditorBtn
        onClick={() =>
          editor
            .chain()
            .focus()
            .toggleHeading({ level: 1 })
            .run()
        }
        className={editor.isActive("heading", { level: 1 }) ? "is-active" : ""}
      >
        H1
      </TextEditorBtn>
      <TextEditorBtn
        onClick={() =>
          editor
            .chain()
            .focus()
            .toggleHeading({ level: 2 })
            .run()
        }
        className={editor.isActive("heading", { level: 2 }) ? "is-active" : ""}
      >
        H2
      </TextEditorBtn>
      <TextEditorBtn
        onClick={() =>
          editor
            .chain()
            .focus()
            .toggleHeading({ level: 3 })
            .run()
        }
        className={editor.isActive("heading", { level: 3 }) ? "is-active" : ""}
      >
        H3
      </TextEditorBtn>
      <TextEditorBtn
        onClick={() =>
          editor
            .chain()
            .focus()
            .setHorizontalRule()
            .run()
        }
      >
        hr
      </TextEditorBtn>
    </OperationMenu>
  );
};

export default MenuBar;
