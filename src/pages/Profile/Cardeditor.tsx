import React, { useState, useRef } from "react";
import styled from "styled-components";
import { OperationBtn } from "./CardsGrid";
import preview from "./previewDefault.png";
interface CardEditorWrapperProps {
  $display: boolean;
}
const CardEditorWrapper = styled.div<CardEditorWrapperProps>`
  border-radius: 15px;
  border: 1px solid #000;
  width: 360px;
  height: auto;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
  padding: 10px;
  display: ${(props) => (props.$display ? "block" : "none")};
`;
const InputLabel = styled.p``;

interface PhotoPreviewProps {
  path: string | null;
}
const PhotoPreview = styled.div<PhotoPreviewProps>`
  width: 80%;
  height: 100px;
  background-image: url(${(props) => (props.path ? props.path : preview)});
  background-repeat: no-repeat;
  background-size: contain;
  background-position: center center;
  background-color: #ddd;
`;
const PhotoInput = styled.input``;
const Input = styled.input`
  width: 80%;
  height: 30px;
`;
const InputWrapper = styled.div`
  margin-bottom: 10px;
  width: 100%;
`;
interface FCProps {
  editorDisplay: boolean;
  editorToggle: () => void;
}
const CardEditor = ({ editorDisplay, editorToggle }: FCProps) => {
  const speciesRef = useRef<HTMLInputElement>(null);
  const [previewLink, setPreviewLink] = useState<string | null>(null);

  function createPreviewLink(e: React.ChangeEvent<HTMLInputElement>) {
    if (!e.target.files) return;
    if (e.target.files.length !== 0) {
      let path = URL.createObjectURL(e.target.files[0]);
      setPreviewLink(path);
    } else {
      setPreviewLink(null);
      return;
    }
  }
  return (
    <CardEditorWrapper $display={editorDisplay}>
      <InputWrapper>
        <PhotoPreview path={previewLink} />
        <PhotoInput
          type="file"
          accept="image/*"
          onChange={(e) => {
            createPreviewLink(e);
          }}
        />
      </InputWrapper>
      <InputWrapper>
        <InputLabel>幫你的植物取個名字！</InputLabel>
        <Input type="text" />
      </InputWrapper>
      <InputWrapper>
        <InputLabel>品種</InputLabel>
        <Input type="text" ref={speciesRef} />
      </InputWrapper>
      <InputWrapper>
        <InputLabel>生日</InputLabel>
        <Input type="date" />
      </InputWrapper>
      <InputWrapper>
        <InputLabel>標籤</InputLabel>
        <Input type="text" />
      </InputWrapper>
      <InputWrapper>
        <OperationBtn>Add</OperationBtn>
        <OperationBtn onClick={editorToggle}>Cancel</OperationBtn>
      </InputWrapper>
    </CardEditorWrapper>
  );
};

export default CardEditor;
