import React, { useRef, useState } from "react";
import { fabric } from "fabric";
import styled from "styled-components";
import { OperationBtn } from "./CardsGrid";
import Canvas from "./Canvas";

const BtnWrapper = styled.div`
  display: flex;
  flex-direction: column;
`;
const Wrapper = styled.div`
  display: flex;
`;
const DiaryEditor = () => {
  const fileRef = useRef<HTMLInputElement>(null);
  const [canvas, setCanvas] = useState<fabric.Canvas>();
  function addText() {
    let text = new fabric.IText("hello world", {
      left: 100,
      top: 100,
    });
    canvas?.add(text);
  }
  function openDialog() {
    if (!fileRef.current) return;
    fileRef.current.click();
  }
  function addImage() {
    openDialog();
  }
  return (
    <Wrapper>
      <Canvas setCanvas={setCanvas} />
      <BtnWrapper>
        <OperationBtn onClick={addText}>Add Text</OperationBtn>
        <input id="fileid" type="file" ref={fileRef} hidden />
        <OperationBtn onClick={addImage}>Add Image</OperationBtn>
      </BtnWrapper>
    </Wrapper>
  );
};

export default DiaryEditor;
