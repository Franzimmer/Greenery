import React, { useRef, useState, useEffect } from "react";
import styled, { keyframes } from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { fabric } from "fabric";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../store/reducer";
import { PopUpActions } from "../../store/actions/popUpActions";
import { firebase } from "../../utils/firebase";
import { useAlertDispatcher } from "../../utils/useAlertDispatcher";
import Canvas from "./Canvas";
import { IconButton } from "../../components/GlobalStyles/button";
import {
  NoDataSection,
  NoDataText,
  NoDataBtn,
} from "../GlobalStyles/noDataLayout";
import {
  faArrowRight,
  faArrowLeft,
  faPlus,
  faMinus,
  faItalic,
  faStrikethrough,
  faUnderline,
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
import spinner from "../../assets/spinner.png";
import forward from "./bring-to-front.png";

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
  background: #f5f0ec;
`;
interface NoDiarySectionProps {
  $display: boolean;
}
const NoDiarySection = styled(NoDataSection)<NoDiarySectionProps>`
  display: ${(props) => (props.$display ? "flex" : "none")};
  width: 320px;
  height: 320px;
  margin: 0 auto;
  position: fixed;
  top: 50vh;
  left: 50vw;
  transform: translateX(-50%) translateY(-50%);
  z-index: 102;
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
const ForwardIcon = styled.div`
  width: 20px;
  height: 20px;
  background-image: url(${forward});
  background-size: cover;
  background-position: center;
  background-repeat: norepeat;
`;
const DiaryIconButton = styled(IconButton)`
  width: 30px;
  height: 30px;
  margin-right: 10px;
  transition: 0.25s;
  &:hover {
    transform: scale(1.1);
    transition: 0.25s;
  }
`;
const MinusIconButton = styled(DiaryIconButton)`
  margin-right: 0px;
`;
const Spin = keyframes`
  0% {
    transform: translateX(-50%) translateY(-50%) rotate(0deg);
  }
  100% {
    transform: translateX(-50%) translateY(-50%) rotate(360deg);
  }
`;
const PageNumber = styled.span`
  color: #6a5125;
`;
const Loading = styled.div<WrapperProps>`
  display: ${(props) => (props.$display ? "flex" : "none")};
  width: 100px;
  height: 100px;
  background: url(${spinner});
  position: fixed;
  z-index: 103;
  top: 50vh;
  left: 50vw;
  animation: 2s ${Spin} linear infinite;
`;
const FontSizeInput = styled.input`
  width: 50px;
  font-size: 14px;
  line-height: 18px;
  text-align: center;
  &::-webkit-inner-spin-button {
    -webkit-appearance: none;
  }
`;
const ColorWrapper = styled.div`
  position: relative;
`;
const ColorInput = styled.input`
  opacity: 0;
  width: 0;
  position: absolute;
`;
interface DiaryEditorProps {
  ownerId: string;
  diaryDisplay: boolean;
  setDiaryDisplay: React.Dispatch<React.SetStateAction<boolean>>;
  diaryId: string;
  setDiaryId: React.Dispatch<React.SetStateAction<string | null>>;
}
const DiaryEditor = ({
  ownerId,
  diaryDisplay,
  setDiaryDisplay,
  diaryId,
  setDiaryId,
}: DiaryEditorProps) => {
  const dispatch = useDispatch();
  const alertDispatcher = useAlertDispatcher();
  const userInfo = useSelector((state: RootState) => state.userInfo);
  const [pageNo, setPageNo] = useState<number>(0);
  const fontSizeRef = useRef<HTMLInputElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const colorRef = useRef<HTMLInputElement>(null);
  const [canvas, setCanvas] = useState<fabric.Canvas>();
  const [diariesData, setDiariesData] = useState<string[]>([]);
  const [mode, setMode] = useState<"view" | "edit">("view");
  const [saveMode, setSaveMode] = useState<"saveEdit" | "saveAdd" | null>(
    "saveAdd"
  );
  const [loaderDisplay, setLoaderDisplay] = useState<boolean>(true);
  function isOwner(ownerId: string) {
    if (userInfo.userId === ownerId) return true;
    else return false;
  }
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
    canvas!.selection = false;
    canvas?.getObjects().forEach((obj) => {
      obj.set({ selectable: false, hoverCursor: "text" });
    });
  }
  function addText() {
    if (!fontSizeRef.current) return;
    const text = new fabric.IText("hello world", {
      left: 100,
      top: 100,
      fontFamily: "Montserrat",
      fontSize: 20,
    });
    canvas?.add(text);
    canvas?.setActiveObject(text);
    fontSizeRef.current!.value = "20";
  }
  function changeTextColor() {
    const cValue = colorRef.current?.value;
    if (canvas?.getActiveObject().type !== "i-text") return;
    canvas?.getActiveObject().set("fill", cValue);
    canvas?.renderAll();
  }
  function plusFontSize() {
    if (!fontSizeRef.current) return;
    if (canvas?.getActiveObject().type !== "i-text") return;
    const target = canvas?.getActiveObject() as fabric.IText;
    const fontSize = Number(fontSizeRef.current.value);
    if (fontSize <= 46 && fontSize >= 10)
      fontSizeRef.current.value = String(fontSize + 2);
    else if (fontSize > 48) fontSizeRef.current.value = "48";
    else if (fontSize < 10) fontSizeRef.current.value = "10";
    target.fontSize = Number(fontSizeRef.current.value);
    canvas?.renderAll();
  }
  function minusFontSize() {
    if (!fontSizeRef.current) return;
    if (canvas?.getActiveObject().type !== "i-text") return;
    const target = canvas?.getActiveObject() as fabric.IText;
    const fontSize = Number(fontSizeRef.current.value);
    if (fontSize >= 12 && fontSize <= 48)
      fontSizeRef.current.value = String(fontSize - 2);
    else if (fontSize > 48) fontSizeRef.current.value = "48";
    else if (fontSize < 10) fontSizeRef.current.value = "10";
    target.fontSize = Number(fontSizeRef.current.value);
    canvas?.renderAll();
  }
  function changeFontSize() {
    if (!fontSizeRef.current) return;
    if (canvas?.getActiveObject().type !== "i-text") return;
    const target = canvas?.getActiveObject() as fabric.IText;
    const fontSize = Number(fontSizeRef.current.value);
    if (fontSize > 48) {
      fontSizeRef.current.value = "48";
    } else if (fontSize < 10) {
      fontSizeRef.current.value = "10";
    }
    target.fontSize = Number(fontSizeRef.current.value);
    canvas?.renderAll();
  }
  function changeFontStyle() {
    if (canvas?.getActiveObject().type !== "i-text") return;
    const target = canvas?.getActiveObject() as fabric.IText;
    if (target.fontStyle === "normal") target.fontStyle = "italic";
    else if (target.fontStyle === "italic") target.fontStyle = "normal";
    canvas?.renderAll();
  }
  function strikeThrough() {
    if (canvas?.getActiveObject().type !== "i-text") return;
    const target = canvas?.getActiveObject() as fabric.IText;
    if (target.linethrough === false) target.set("linethrough", true);
    else if (target.linethrough === true) target.set("linethrough", false);
    canvas?.renderAll();
  }
  function underLine() {
    if (canvas?.getActiveObject().type !== "i-text") return;
    const target = canvas?.getActiveObject() as fabric.IText;
    if (target.underline === false) target.set("underline", true);
    else if (target.underline === true) target.set("underline", false);
    canvas?.renderAll();
  }
  function changeTextWeight() {
    if (canvas?.getActiveObject().type !== "i-text") return;
    const target = canvas?.getActiveObject() as fabric.IText;
    if (target.fontWeight === "normal") target.set("fontWeight", 500);
    else if (target.fontWeight === 500) target.set("fontWeight", "normal");
    canvas?.renderAll();
  }
  async function addImage() {
    if (!fileRef.current) return;
    if (!fileRef.current.files!.length) return;
    const file = fileRef.current!.files![0];
    const fileLink = await firebase.uploadFile(file);
    fabric.Image.fromURL(fileLink!, function(oImg) {
      oImg.set({ left: 20, top: 50 });
      oImg.scaleToWidth(200, false);
      canvas?.add(oImg);
      canvas?.setActiveObject(oImg);
    });
  }
  function bringForward() {
    const target = canvas?.getActiveObject() as fabric.IText;
    target.bringForward();
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
    const page = JSON.stringify(canvas);
    const currentDiaries = [...diariesData];
    currentDiaries.push(page);
    setDiariesData(currentDiaries);
    setPageNo(currentDiaries.length - 1);
    switchToViewMode();
    await firebase.saveDiary(diaryId, page);
    alertDispatcher("success", "Save Diary Data Successfully.");
  }
  async function saveEdit() {
    setAllObjDeactive();
    const index = pageNo;
    const page = JSON.stringify(canvas);
    const currentDiaries = [...diariesData];
    currentDiaries[index] = page;
    await firebase.saveEditDiary(diaryId, currentDiaries);
    alertDispatcher("success", "Update Diary Data Successfully.");
    setDiariesData(currentDiaries);
    switchToViewMode();
  }
  async function load(page: number) {
    canvas?.loadFromJSON(diariesData[page], async () => {
      canvas!.selection = false;
      canvas?.getObjects().forEach((obj) => {
        obj.set({ selectable: false, hoverCursor: "text" });
      });
      canvas.renderAll();
    });
  }
  function switchPage(type: "+" | "-") {
    if (type === "+" && pageNo !== diariesData.length - 1)
      setPageNo((prev) => prev + 1);
    else if (type === "-" && pageNo !== 0) setPageNo((prev) => prev - 1);
  }
  function cancelEdit() {
    resetCanvas();
    load(pageNo);
    switchToViewMode();
  }
  useEffect(() => {
    async function getDiary(diaryId: string) {
      resetCanvas();
      if (!canvas) return;
      const docSnapshot = await firebase.getDiary(diaryId);
      if (docSnapshot.exists()) {
        setDiariesData(docSnapshot.data().pages);
        switchToViewMode();
        canvas?.loadFromJSON(docSnapshot.data().pages[0], async () => {
          canvas.selection = false;
          canvas.getObjects().forEach((obj) => {
            obj.set({ selectable: false, hoverCursor: "text" });
          });
          canvas.renderAll();
        });
        setPageNo(0);
      }
      setLoaderDisplay(false);
    }
    if (diaryId) getDiary(diaryId);
  }, [diaryId]);
  useEffect(() => {
    load(pageNo);
  }, [pageNo]);
  useEffect(() => {
    function handleObj(obj: fabric.IEvent) {
      if (!obj.selected) return;
      if (obj.selected.length > 1) return;
      if (obj.selected[0]!.type !== "i-text") return;
      else {
        const target = obj.selected[0] as fabric.IText;
        fontSizeRef.current!.value = String(target.fontSize!);
      }
    }
    if (!canvas || !fontSizeRef.current) return;
    canvas.on("selection:updated", (obj) => handleObj(obj));
    canvas.on("selection:created", (obj) => handleObj(obj));
    canvas.on("selection:cleared", (obj) => handleObj(obj));
  }, [mode]);
  return (
    <>
      <NoDiarySection
        $display={
          diaryDisplay &&
          !loaderDisplay &&
          diariesData.length === 0 &&
          mode === "view"
        }
      >
        <NoDataText>You haven't write plants diary</NoDataText>
        <NoDataBtn
          onClick={() => {
            setSaveMode("saveAdd");
            switchToEditMode();
          }}
        >
          Write Diary
        </NoDataBtn>
      </NoDiarySection>
      <Loading $display={diaryDisplay && loaderDisplay} />
      <Wrapper $display={diaryDisplay}>
        {mode === "edit" && isOwner(ownerId) && (
          <BtnWrapper>
            <>
              <DiaryIconButton onClick={addText}>
                <StyledFontAwesomeIcon icon={faFont} />
              </DiaryIconButton>
              <MinusIconButton onClick={minusFontSize}>
                <StyledFontAwesomeIcon icon={faMinus} />
              </MinusIconButton>
              <FontSizeInput
                onKeyPress={(e) => {
                  if (e.key === "Enter") changeFontSize();
                }}
                ref={fontSizeRef}
                type="number"
                min="10"
                max="48"
                defaultValue="20"
              />
              <DiaryIconButton onClick={plusFontSize}>
                <StyledFontAwesomeIcon icon={faPlus} />
              </DiaryIconButton>
              <DiaryIconButton onClick={changeTextWeight}>
                <StyledFontAwesomeIcon icon={faBold} />
              </DiaryIconButton>
              <DiaryIconButton onClick={changeFontStyle}>
                <StyledFontAwesomeIcon icon={faItalic} />
              </DiaryIconButton>
              <DiaryIconButton onClick={strikeThrough}>
                <StyledFontAwesomeIcon icon={faStrikethrough} />
              </DiaryIconButton>
              <DiaryIconButton onClick={underLine}>
                <StyledFontAwesomeIcon icon={faUnderline} />
              </DiaryIconButton>
              <DiaryIconButton htmlFor="palette">
                <ColorWrapper>
                  <StyledFontAwesomeIcon icon={faPalette} />
                  <ColorInput
                    type="color"
                    id="palette"
                    ref={colorRef}
                    onChange={changeTextColor}
                  />
                </ColorWrapper>
              </DiaryIconButton>
            </>
          </BtnWrapper>
        )}
        <BtnWrapper>
          {mode === "view" && diariesData.length !== 0 && (
            <>
              {isOwner(ownerId) && (
                <DiaryIconButton
                  onClick={() => {
                    setSaveMode("saveEdit");
                    switchToEditMode();
                  }}
                >
                  <StyledFontAwesomeIcon icon={faPenToSquare} />
                </DiaryIconButton>
              )}
              {isOwner(ownerId) && (
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
              <DiaryIconButton
                onClick={() => setPageNo(diariesData.length - 1)}
              >
                <StyledFontAwesomeIcon icon={faBookmark} />
              </DiaryIconButton>
            </>
          )}
          {mode === "edit" && isOwner(ownerId) && (
            <>
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
              <DiaryIconButton onClick={bringForward}>
                <ForwardIcon />
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
          <DiaryIconButton
            onClick={() => {
              resetCanvas();
              setPageNo(0);
              setDiariesData([]);
              setDiaryDisplay(false);
              setDiaryId(null);
              setLoaderDisplay(true);
              switchToViewMode();
              dispatch({
                type: PopUpActions.HIDE_ALL,
              });
            }}
          >
            <StyledFontAwesomeIcon icon={faCircleXmark} />
          </DiaryIconButton>
        </BtnWrapper>
        <FlexWrapper>
          <Canvas setCanvas={setCanvas} />
        </FlexWrapper>
        <ArrowWrapper>
          {mode === "view" && diariesData.length !== 0 && (
            <>
              <DiaryIconButton onClick={() => switchPage("-")}>
                <StyledFontAwesomeIcon icon={faArrowLeft} />
              </DiaryIconButton>
              <PageNumber>
                {pageNo + 1} / {diariesData.length}
              </PageNumber>
              <DiaryIconButton onClick={() => switchPage("+")}>
                <StyledFontAwesomeIcon icon={faArrowRight} />
              </DiaryIconButton>
            </>
          )}
        </ArrowWrapper>
      </Wrapper>
    </>
  );
};

export default DiaryEditor;
