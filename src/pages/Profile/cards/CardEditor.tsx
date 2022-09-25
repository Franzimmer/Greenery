import React, { useState, useRef, useEffect } from "react";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../../store/reducer/index";
import { PlantCard } from "../../../store/types/plantCardType";
import { popUpActions } from "../../../store/reducer/popUpReducer";
import { CardsActions } from "../../../store/actions/cardsActions";
import { firebase } from "../../../utils/firebase";
import { unixTimeToString } from "../../../utils/helpers";
import {
  OperationBtn,
  CloseBtn,
} from "../../../components/GlobalStyles/button";
import defaultImg from "../../../assets/default.jpg";

interface CardEditorWrapperProps {
  $display: boolean;
}
const CardEditorWrapper = styled.div<CardEditorWrapperProps>`
  position: fixed;
  z-index: 101;
  top: 50vh;
  left: 50vw;
  transform: translateX(-50%) translateY(-50%);
  border-radius: 15px;
  display: ${(props) => (props.$display ? "flex" : "none")};
  justify-content: center;
  align-items: center;
  background: #f5f0ec;
`;
const PageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  width: 360px;
  height: auto;
  padding: 30px;
`;
const InputLabel = styled.span`
  color: #6a5125;
  font-weight: 500;
  margin-right: 8px;
`;

interface PhotoPreviewProps {
  path: string | null;
}
const PhotoPreview = styled.div<PhotoPreviewProps>`
  width: 280px;
  height: 150px;
  background-image: url(${(props) => (props.path ? props.path : defaultImg)});
  background-repeat: no-repeat;
  background-size: contain;
  background-position: center center;
  background-color: #eee;
`;
const PhotoInputLabel = styled.label`
  width: 30px;
  margin: 0 0 0 260px;
  cursor: pointer;
`;
const PhotoInput = styled.input``;
const Input = styled.input`
  width: 200px;
  height: 30px;
  border-radius: 15px;
  border: 1px solid #6a5125;
  padding: 0px 15px;
`;
const TextArea = styled.textarea`
  width: 280px;
  height: 100px;
  border: 1px solid #6a5125;
  padding: 5px;
`;
const InputWrapper = styled.div`
  margin-bottom: 10px;
  width: 280px;
`;
const InputFlexWrapper = styled(InputWrapper)`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;
const Tag = styled.div`
  display: flex;
  align-items: center;
  border: 1px solid #6a5125;
  background-color: none;
  padding: 0px 5px;
  border-radius: 14px;
  height: 30px;
  margin: 8px 8px 0px 0px;
`;
const TagText = styled.div`
  color: #6a5125;
  font-size: 14px;
  border-radius: 7px;
`;
const TagsWrpper = styled.div`
  width: 280px;
  display: flex;
  justify-content: flex-start;
  flex-wrap: wrap;
  margin-bottom: 20px;
`;
const BtnWrpper = styled.div`
  width: 280px;
  display: flex;
  justify-content: space-between;
`;
const EditorBtn = styled(OperationBtn)`
  color: #fff;
  width: 100px;
  margin-top: 12px;
  border: 1px solid #6a5125;
  background: #6a5125;
  transition: 0.25s;
  &:hover {
    transform: scale(1.1);
    transition: 0.25s;
  }
`;
const RemoveTagBtn = styled(CloseBtn)`
  color: #6a5125;
  width: 20px;
  height: 20px;
  font-size: 20px;
  line-height: 20px;
  margin-left 5px;
  background-color: rgba(0,0,0,0);
  border: none;
  transition: 0.25s;
  &:hover {
    border:none;
    background-color: rgba(0,0,0,0);
    transform: scale(1.3);
    transition: 0.25s;
  }
`;
const UploadIcon = styled(FontAwesomeIcon)`
  color: #6a5125;
  width: 20px;
  height: 20px;
`;
interface FCProps {
  userId: string;
  editorDisplay: boolean;
  editorToggle: () => void;
  editCardId: string | null;
  setEditCardId: React.Dispatch<React.SetStateAction<string | null>>;
}

const CardEditor = ({
  userId,
  editorDisplay,
  editorToggle,
  editCardId,
  setEditCardId,
}: FCProps) => {
  const imageRef = useRef<HTMLInputElement>(null);
  const nameRef = useRef<HTMLInputElement>(null);
  const speciesRef = useRef<HTMLInputElement>(null);
  const birthdayRef = useRef<HTMLInputElement>(null);
  const tagRef = useRef<HTMLInputElement>(null);
  const waterRef = useRef<HTMLTextAreaElement>(null);
  const lightRef = useRef<HTMLTextAreaElement>(null);
  const toxicityRef = useRef<HTMLTextAreaElement>(null);
  const [previewLink, setPreviewLink] = useState<string | null>(null);
  const [tags, setTags] = useState<string[]>([]);
  const cardList = useSelector((state: RootState) => state.cards);
  const myFollowers = useSelector((state: RootState) => state.myFollowers);
  const dispatch = useDispatch();
  function emitAlert(type: string, msg: string) {
    dispatch({
      type: popUpActions.SHOW_ALERT,
      payload: {
        type,
        msg,
      },
    });
    setTimeout(() => {
      dispatch({
        type: popUpActions.CLOSE_ALERT,
      });
    }, 2000);
  }
  function createPreviewLink() {
    if (!imageRef.current) return;
    if (imageRef.current.files!.length !== 0) {
      let path = URL.createObjectURL(imageRef.current.files![0]);
      setPreviewLink(path);
    } else {
      setPreviewLink(null);
      return;
    }
  }
  async function searchPlantSpecies(input: string) {
    if (!waterRef.current || !lightRef.current) return;
    const querySnapshot = await firebase.searchSpecies(input);
    if (querySnapshot.empty) {
      emitAlert("fail", "Species data is not in the database.");
      waterRef.current!.value = "";
      lightRef.current!.value = "";
      toxicityRef.current!.value = "";
      return;
    }
    querySnapshot.forEach((doc) => {
      waterRef.current!.value = doc.data().WATER;
      lightRef.current!.value = doc.data().LIGHT;
      toxicityRef.current!.value = doc.data().TOXICITY;
    });
  }
  function addTag() {
    if (!tagRef.current) return;
    if (tags.includes(tagRef.current.value)) return;
    let currentTags = [...tags];
    currentTags.push(tagRef.current.value);
    setTags(currentTags);
  }
  function RemoveTag(e: React.MouseEvent<HTMLElement>) {
    if (!tagRef.current) return;
    let currentTags = [...tags];
    let button = e.target as HTMLDivElement;
    let newTags = currentTags.filter((tag) => tag !== button.parentElement!.id);
    setTags(newTags);
  }
  async function uploadFile() {
    if (!imageRef.current) return;
    let file = imageRef.current!.files![0];
    let dowloadLink = await firebase.uploadFile(file);
    return dowloadLink;
  }
  function resetEditor() {
    imageRef.current!.value = "";
    nameRef.current!.value = "";
    speciesRef.current!.value = "";
    birthdayRef.current!.value = "";
    tagRef.current!.value = "";
    waterRef.current!.value = "";
    lightRef.current!.value = "";
    toxicityRef.current!.value = "";
    setPreviewLink(null);
    setTags([]);
  }
  async function addCard() {
    const imgLink = await uploadFile();
    const data: PlantCard = {
      cardId: null,
      ownerId: userId,
      plantName: nameRef.current?.value!,
      plantPhoto: imgLink,
      tags: tags,
      species: speciesRef.current?.value!,
      waterPref: waterRef.current?.value,
      lightPref: lightRef.current?.value,
      toxicity: toxicityRef.current?.value,
      followers: 0,
    };
    if (!isNaN(Date.parse(birthdayRef.current?.value || ""))) {
      data["birthday"] = Date.parse(birthdayRef.current?.value!);
    }
    let cardId = await firebase.addCard(data);
    await firebase.emitNotices(userId, myFollowers, "1");
    dispatch({
      type: CardsActions.ADD_NEW_PLANT_CARD,
      payload: { newCard: { ...data, cardId } },
    });
    dispatch({
      type: popUpActions.HIDE_ALL,
    });
    emitAlert("success", "You add a new plant card !");
    editorToggle();
    resetEditor();
  }
  async function editCard() {
    let imgLink;
    if (imageRef.current?.value) imgLink = await uploadFile();
    else imgLink = previewLink!;
    const data = {
      cardId: editCardId!,
      parents:
        cardList.find((card) => card.cardId === editCardId)!.parents || [],
      followers: cardList.find((card) => card.cardId === editCardId)!.followers,
      ownerId: userId,
      plantName: nameRef.current?.value!,
      plantPhoto: imgLink,
      tags: tags || [],
      species: speciesRef.current?.value!,
      waterPref: waterRef.current?.value,
      lightPref: lightRef.current?.value,
      toxicity: toxicityRef.current?.value,
      birthday: Date.parse(birthdayRef.current?.value || ""),
    };
    await firebase.editCard(editCardId!, data);
    editorToggle();
    dispatch({
      type: CardsActions.EDIT_PLANT_INFO,
      payload: { editCard: data },
    });
    dispatch({
      type: popUpActions.HIDE_ALL,
    });
    emitAlert("success", "Edit Card Success!");
    resetEditor();
  }
  useEffect(() => {
    async function getEditCardData() {
      if (!editCardId) return;
      let docdata = await firebase.getCardData(editCardId!);
      let data = docdata.data();
      setPreviewLink(data!.plantPhoto || null);
      setTags(data?.tags || []);
      nameRef.current!.value = data!.plantName;
      speciesRef.current!.value = data!.species;
      waterRef.current!.value = data?.waterPref ?? "";
      lightRef.current!.value = data?.lightPref ?? "";
      if (data?.birthday)
        birthdayRef.current!.value = unixTimeToString(data?.birthday);
    }
    if (editCardId) getEditCardData();
  }, [editCardId]);
  return (
    <CardEditorWrapper $display={editorDisplay}>
      <PageWrapper>
        <InputWrapper>
          <PhotoPreview path={previewLink} />
          <PhotoInputLabel htmlFor="img">
            <UploadIcon icon={faPenToSquare} />
          </PhotoInputLabel>
          <PhotoInput
            id="img"
            ref={imageRef}
            type="file"
            accept="image/*"
            onChange={() => {
              createPreviewLink();
            }}
            hidden
          />
        </InputWrapper>
        <InputFlexWrapper>
          <InputLabel>Name</InputLabel>
          <Input type="text" ref={nameRef} />
        </InputFlexWrapper>
        <InputFlexWrapper>
          <InputLabel>Species</InputLabel>
          <Input
            type="text"
            ref={speciesRef}
            onKeyPress={(e) => {
              if (!speciesRef.current) return;
              if (e.key === "Enter") {
                searchPlantSpecies(speciesRef.current.value);
              }
            }}
          />
        </InputFlexWrapper>
        <InputFlexWrapper>
          <InputLabel>Birthday</InputLabel>
          <Input type="date" ref={birthdayRef} />
        </InputFlexWrapper>
        <InputFlexWrapper>
          <InputLabel>Tags</InputLabel>
          <Input
            type="text"
            ref={tagRef}
            onKeyPress={(e) => {
              if (e.key === "Enter") {
                addTag();
                tagRef.current!.value = "";
              }
            }}
          />
        </InputFlexWrapper>
        <TagsWrpper>
          {tags &&
            tags.map((tag) => {
              return (
                <Tag key={tag} id={tag}>
                  <TagText>{tag}</TagText>
                  <RemoveTagBtn onClick={(e) => RemoveTag(e)}>
                    &#215;
                  </RemoveTagBtn>
                </Tag>
              );
            })}
        </TagsWrpper>
      </PageWrapper>
      <PageWrapper>
        <InputWrapper>
          <InputLabel>Water Preference</InputLabel>
          <TextArea ref={waterRef} />
        </InputWrapper>
        <InputWrapper>
          <InputLabel>Light Preference</InputLabel>
          <TextArea ref={lightRef} />
        </InputWrapper>
        <InputWrapper>
          <InputLabel>Toxicity</InputLabel>
          <TextArea ref={toxicityRef} />
        </InputWrapper>
        <BtnWrpper>
          {editCardId ? (
            <EditorBtn
              onClick={() => {
                editCard();
                resetEditor();
                setEditCardId(null);
              }}
            >
              Save
            </EditorBtn>
          ) : (
            <EditorBtn
              onClick={() => {
                addCard();
              }}
            >
              Add
            </EditorBtn>
          )}
          <EditorBtn
            onClick={() => {
              editorToggle();
              resetEditor();
              setEditCardId(null);
              dispatch({
                type: popUpActions.HIDE_ALL,
              });
            }}
          >
            Cancel
          </EditorBtn>
        </BtnWrpper>
      </PageWrapper>
    </CardEditorWrapper>
  );
};

export default CardEditor;
