import React, { useRef, useState, useEffect } from "react";
import { fabric } from "fabric";
import styled from "styled-components";
import { OperationBtn } from "./CardsGrid";
import Canvas from "./Canvas";
import { storage, diaries } from "../../../utils/firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { doc, getDoc, setDoc, updateDoc, arrayUnion } from "firebase/firestore";

const BtnWrapper = styled.div`
  display: flex;
  flex-direction: column;
`;
interface WrapperProps {
  $display: boolean;
}
const Wrapper = styled.div<WrapperProps>`
  display: ${(props) => (props.$display ? "flex" : "none")};
`;
const AddImgInput = styled.input``;

interface DiaryEditorProps {
  diaryDisplay: boolean;
  setDiaryDisplay: React.Dispatch<React.SetStateAction<boolean>>;
  diaryId: string;
  setDiaryId: React.Dispatch<React.SetStateAction<string | null>>;
}
const DiaryEditor = ({
  diaryDisplay,
  setDiaryDisplay,
  diaryId,
  setDiaryId,
}: DiaryEditorProps) => {
  const pageRef = useRef(0);
  const fileRef = useRef<HTMLInputElement>(null);
  const colorRef = useRef<HTMLInputElement>(null);
  const [canvas, setCanvas] = useState<fabric.Canvas>();
  const [diariesData, setDiariesData] = useState<string[]>([]);
  const [mode, setMode] = useState<"view" | "edit">("view");
  const [saveMode, setSaveMode] = useState<"saveEdit" | "saveAdd" | null>(null);
  function setAllObjDeactive() {
    if (!canvas) return;
    canvas!.selection = false;
    canvas.discardActiveObject().renderAll();
  }
  function switchToEditMode() {
    setMode("edit");
    if (!canvas) return;
    canvas!.selection = true;
    canvas.getObjects().forEach((obj) => {
      obj.set({ selectable: true, hoverCursor: "move" });
    });
  }
  function switchToViewMode() {
    setMode("view");
    canvas?.getObjects().forEach((obj) => {
      obj.set({ selectable: false, hoverCursor: "text" });
    });
  }
  function addText() {
    let text = new fabric.IText("hello world", {
      left: 100,
      top: 100,
    });
    canvas?.add(text);
    canvas?.setActiveObject(text);
  }
  function changeTextColor() {
    let cValue = colorRef.current?.value;
    if (canvas?.getActiveObject().type !== "i-text") return;
    canvas?.getActiveObject().set("fill", cValue);
    canvas?.renderAll();
  }
  function changeTextWeight() {
    if (canvas?.getActiveObject().type !== "i-text") return;
    let target = canvas?.getActiveObject() as fabric.IText;
    if (target.fontWeight === "normal") target.set("fontWeight", "bold");
    else if (target.fontWeight === "bold") target.set("fontWeight", "normal");
    canvas?.renderAll();
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
      oImg.scaleToWidth(200, false);
      canvas?.add(oImg);
      canvas?.setActiveObject(oImg);
    });
  }
  function removeItem() {
    canvas?.remove(...canvas?.getActiveObjects());
    canvas?.discardActiveObject().renderAll();
  }
  function resetCanvas() {
    canvas?.remove(...canvas.getObjects());
  }
  async function save() {
    setAllObjDeactive();
    let record = JSON.stringify(canvas);
    let docRef = doc(diaries, diaryId);
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) {
      await setDoc(docRef, { pages: [] });
    }
    await updateDoc(docRef, { pages: arrayUnion(record) });
    let currentDiaries = [...diariesData];
    currentDiaries.push(record);
    setDiariesData(currentDiaries);
    pageRef.current = currentDiaries.length - 1;
    load(pageRef.current);
    switchToViewMode();
  }
  async function saveEdit() {
    setAllObjDeactive();
    let index = pageRef.current;
    let record = JSON.stringify(canvas);
    let currentDiaries = [...diariesData];
    currentDiaries[index] = record;
    let docRef = doc(diaries, diaryId);
    await setDoc(docRef, { pages: currentDiaries });
    alert("成功更新資料！");
    setDiariesData(currentDiaries);
    switchToViewMode();
  }
  async function getDiary() {
    let docRef = doc(diaries, diaryId);
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) {
      resetCanvas();
      switchToEditMode();
    } else {
      setDiariesData(docSnap.data().pages);
      switchToViewMode();
      canvas?.loadFromJSON(docSnap.data().pages[0], () => {
        canvas.renderAll();
        canvas.selection = false;
        canvas.getObjects().forEach((obj) => {
          obj.set({ selectable: false, hoverCursor: "text" });
        });
      });
      pageRef.current = 0;
    }
  }
  function load(page: number) {
    canvas?.loadFromJSON(diariesData[page], () => {
      canvas.renderAll();
    });
  }
  function switchPage(type: "+" | "-") {
    if (type === "+" && pageRef.current !== diariesData.length - 1)
      pageRef.current++;
    else if (type === "-" && pageRef.current !== 0) pageRef.current--;
    load(pageRef.current);
  }
  function cancelEdit() {
    load(pageRef.current);
    switchToViewMode();
  }
  useEffect(() => {
    if (diaryId) getDiary();
  }, [diaryId]);
  return (
    <Wrapper $display={diaryDisplay}>
      <Canvas setCanvas={setCanvas} />
      <BtnWrapper>
        {mode === "view" && (
          <>
            <OperationBtn
              onClick={() => {
                setSaveMode("saveEdit");
                switchToEditMode();
              }}
            >
              Edit Page
            </OperationBtn>
            <OperationBtn onClick={() => switchPage("-")}>
              Previous Page
            </OperationBtn>
            <OperationBtn onClick={() => switchPage("+")}>
              Next Page
            </OperationBtn>
            <OperationBtn
              onClick={() => {
                resetCanvas();
                setSaveMode("saveAdd");
                switchToEditMode();
              }}
            >
              Add New Page
            </OperationBtn>
            <OperationBtn onClick={() => load(diariesData.length - 1)}>
              Jump to Last Page
            </OperationBtn>
          </>
        )}
        {mode === "edit" && (
          <>
            <OperationBtn onClick={addText}>Add Text</OperationBtn>
            <input type="color" ref={colorRef} onChange={changeTextColor} />
            <OperationBtn onClick={changeTextWeight}>
              Bold Switcher
            </OperationBtn>
            <br />
            <AddImgInput
              ref={fileRef}
              type="file"
              onChange={async () => {
                await addImage();
              }}
            />
            <OperationBtn onClick={removeItem}>Remove</OperationBtn>
            <OperationBtn onClick={resetCanvas}>Reset</OperationBtn>
            {saveMode === "saveAdd" && (
              <OperationBtn onClick={save}>Save</OperationBtn>
            )}
            {saveMode === "saveEdit" && (
              <OperationBtn onClick={saveEdit}>Save Edit</OperationBtn>
            )}
            <OperationBtn onClick={cancelEdit}>Cancel</OperationBtn>
          </>
        )}
        <OperationBtn
          onClick={() => {
            resetCanvas();
            setDiariesData([]);
            setDiaryDisplay(false);
            setDiaryId(null);
          }}
        >
          Close
        </OperationBtn>
      </BtnWrapper>
    </Wrapper>
  );
};

export default DiaryEditor;
