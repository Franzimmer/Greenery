import React, { useRef, useState, useEffect } from "react";
import { fabric } from "fabric";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowRight,
  faArrowLeft,
  faPlus,
  faPenToSquare,
  faBookmark,
  faFont,
  faBold,
  faImage,
  faPalette,
  faTrashCan,
  faFileArrowUp,
  faCircleXmark,
  faArrowRotateLeft,
} from "@fortawesome/free-solid-svg-icons";
import { popUpActions } from "../../reducer/popUpReducer";
import { IconButton, OperationBtn } from "../../components/GlobalStyles/button";
import Canvas from "./Canvas";
import { firebase } from "../../utils/firebase";
import { useDispatch } from "react-redux";

interface WrapperProps {
  $display: boolean;
}
const Wrapper = styled.div<WrapperProps>`
  display: ${(props) => (props.$display ? "flex" : "none")};
  flex-direction: column;
  position: fixed;
  top: 50vh;
  left: 50vw;
  transform: translateX(-50%) translateY(-50%);
  z-index: 101;
  background: none;
`;
const AddImgInput = styled.input``;
const FlexWrapper = styled.div`
  display: flex;
`;
const BtnWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  width: 400px;
  height: 40px;
  padding: 0px 10px;
`;
const ArrowWrapper = styled(BtnWrapper)`
  justify-content: center;
  background: #f5f0ec;
`;
const StyledFontAwesomeIcon = styled(FontAwesomeIcon)`
  color: #5c836f;
  width: 20px;
  height: 20px;
`;
const DiaryIconButton = styled(IconButton)`
  width: 30px;
  height: 30px;
  margin-right: 10px;
  transition: 0.25s;
  &:hover {
    transform: translateY(-5px);
    transition: 0.25s;
  }
`;
interface DiaryEditorProps {
  isSelf: boolean;
  diaryDisplay: boolean;
  setDiaryDisplay: React.Dispatch<React.SetStateAction<boolean>>;
  diaryId: string;
  setDiaryId: React.Dispatch<React.SetStateAction<string | null>>;
}
const DiaryEditor = ({
  isSelf,
  diaryDisplay,
  setDiaryDisplay,
  diaryId,
  setDiaryId,
}: DiaryEditorProps) => {
  const dispatch = useDispatch();
  //Fix Me: Ref or State?
  const pageRef = useRef(0);
  const fileRef = useRef<HTMLInputElement>(null);
  const colorRef = useRef<HTMLInputElement>(null);
  const [canvas, setCanvas] = useState<fabric.Canvas>();
  const [diariesData, setDiariesData] = useState<string[]>([]);
  //Fix Me: need to organize and re-check mode logic again
  const [mode, setMode] = useState<"view" | "edit">("view");
  const [saveMode, setSaveMode] = useState<"saveEdit" | "saveAdd" | null>(
    "saveAdd"
  );
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
      console.log(obj);
    });
  }
  function switchToViewMode() {
    setMode("view");
    canvas!.selection = false;
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
  async function addImage() {
    if (!fileRef.current) return;
    if (!fileRef.current.files!.length) return;
    let file = fileRef.current!.files![0];
    let fileLink = await firebase.uploadFile(file);
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
    let page = JSON.stringify(canvas);
    let currentDiaries = [...diariesData];
    currentDiaries.push(page);
    setDiariesData(currentDiaries);
    pageRef.current = currentDiaries.length - 1;
    load(pageRef.current);
    switchToViewMode();
    await firebase.saveDiary(diaryId, page);
  }
  async function saveEdit() {
    setAllObjDeactive();
    let index = pageRef.current;
    let page = JSON.stringify(canvas);
    let currentDiaries = [...diariesData];
    currentDiaries[index] = page;
    await firebase.saveEditDiary(diaryId, currentDiaries);
    alert("成功更新資料！");
    setDiariesData(currentDiaries);
    switchToViewMode();
  }
  function load(page: number) {
    canvas?.loadFromJSON(diariesData[page], () => {
      canvas!.selection = false;
      canvas?.getObjects().forEach((obj) => {
        obj.set({ selectable: false, hoverCursor: "text" });
      });
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
    async function getDiary(diaryId: string) {
      let docSnap = await firebase.getDiary(diaryId);
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
    if (diaryId) getDiary(diaryId);
  }, [diaryId]);
  return (
    <Wrapper $display={diaryDisplay}>
      <BtnWrapper>
        {mode === "view" && (
          <>
            {isSelf && (
              <DiaryIconButton
                onClick={() => {
                  setSaveMode("saveEdit");
                  switchToEditMode();
                }}
              >
                <StyledFontAwesomeIcon icon={faPenToSquare} />
              </DiaryIconButton>
            )}
            {isSelf && (
              <DiaryIconButton
                onClick={() => {
                  resetCanvas();
                  setSaveMode("saveAdd");
                  switchToEditMode();
                }}
              >
                <StyledFontAwesomeIcon icon={faPlus} />
              </DiaryIconButton>
            )}
            <DiaryIconButton onClick={() => load(diariesData.length - 1)}>
              <StyledFontAwesomeIcon icon={faBookmark} />
            </DiaryIconButton>
            <DiaryIconButton
              onClick={() => {
                resetCanvas();
                setDiariesData([]);
                setDiaryDisplay(false);
                setDiaryId(null);
                dispatch({
                  type: popUpActions.HIDE_ALL,
                });
              }}
            >
              <StyledFontAwesomeIcon icon={faCircleXmark} />
            </DiaryIconButton>
          </>
        )}
        {mode === "edit" && isSelf && (
          <>
            <DiaryIconButton onClick={addText}>
              <StyledFontAwesomeIcon icon={faFont} />
            </DiaryIconButton>
            <DiaryIconButton htmlFor="palette">
              <StyledFontAwesomeIcon icon={faPalette} />
              <input
                type="color"
                id="palette"
                ref={colorRef}
                onChange={changeTextColor}
                hidden
              />
            </DiaryIconButton>
            <DiaryIconButton onClick={changeTextWeight}>
              <StyledFontAwesomeIcon icon={faBold} />
            </DiaryIconButton>
            <DiaryIconButton htmlFor="image">
              <StyledFontAwesomeIcon icon={faImage} />
              <AddImgInput
                id="image"
                ref={fileRef}
                type="file"
                onChange={async () => {
                  await addImage();
                }}
                hidden
              />
            </DiaryIconButton>

            <DiaryIconButton onClick={removeItem}>
              <StyledFontAwesomeIcon icon={faTrashCan} />
            </DiaryIconButton>
            <DiaryIconButton onClick={cancelEdit}>
              <StyledFontAwesomeIcon icon={faArrowRotateLeft} />
            </DiaryIconButton>
            {saveMode === "saveAdd" && (
              <DiaryIconButton onClick={save}>
                <StyledFontAwesomeIcon icon={faFileArrowUp} />
              </DiaryIconButton>
            )}
            {saveMode === "saveEdit" && (
              <DiaryIconButton onClick={saveEdit}>
                <StyledFontAwesomeIcon icon={faFileArrowUp} />
              </DiaryIconButton>
            )}
          </>
        )}
      </BtnWrapper>
      <FlexWrapper>
        <Canvas setCanvas={setCanvas} />
      </FlexWrapper>
      <ArrowWrapper>
        {mode === "view" && (
          <>
            <DiaryIconButton onClick={() => switchPage("-")}>
              <StyledFontAwesomeIcon icon={faArrowLeft} />
            </DiaryIconButton>
            <DiaryIconButton onClick={() => switchPage("+")}>
              <StyledFontAwesomeIcon icon={faArrowRight} />
            </DiaryIconButton>
          </>
        )}
      </ArrowWrapper>
    </Wrapper>
  );
};

export default DiaryEditor;
