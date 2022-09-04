import React, { useRef, useState } from "react";
import { fabric } from "fabric";
import styled from "styled-components";
import { OperationBtn } from "./CardsGrid";
import Canvas from "./Canvas";
import { db, storage, cards, species } from "../../utils/firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

const BtnWrapper = styled.div`
  display: flex;
  flex-direction: column;
`;
const Wrapper = styled.div`
  display: flex;
`;
const AddImgInput = styled.input``;
const DiaryEditor = () => {
  const fileRef = useRef<HTMLInputElement>(null);
  const [canvas, setCanvas] = useState<fabric.Canvas>();
  function addText() {
    let text = new fabric.IText("hello world", {
      left: 100,
      top: 100,
    });
    canvas?.add(text);
    canvas?.setActiveObject(text);
  }
  async function uploadFile() {
    if (!fileRef.current) return;
    if (!fileRef.current.files!.length) return;
    let file = fileRef.current!.files![0];
    const storageRef = ref(storage, `${file.name}`);
    await uploadBytes(storageRef, file);
    const dowloadLink = await getDownloadURL(storageRef);
    fileRef.current.value = "";
    return dowloadLink;
  }
  async function addImage() {
    let fileLink = await uploadFile();
    fabric.Image.fromURL(fileLink!, function(oImg) {
      oImg.set({ left: 20, top: 50 });
      canvas?.add(oImg);
      canvas?.setActiveObject(oImg);
    });
  }
  function removeItem() {
    canvas?.getActiveObjects().forEach((obj) => {
      canvas?.remove(obj);
    });
    canvas?.discardActiveObject().renderAll();
  }
  return (
    <Wrapper>
      <Canvas setCanvas={setCanvas} />
      <BtnWrapper>
        <OperationBtn onClick={addText}>Add Text</OperationBtn>
        <AddImgInput
          ref={fileRef}
          type="file"
          onChange={async () => {
            await addImage();
          }}
        />
        <OperationBtn onClick={removeItem}>Remove</OperationBtn>
      </BtnWrapper>
    </Wrapper>
  );
};

export default DiaryEditor;
