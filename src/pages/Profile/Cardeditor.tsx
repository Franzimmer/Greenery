import React, { useState, useRef } from "react";
import styled from "styled-components";
import { OperationBtn } from "./CardsGrid";
import preview from "./previewDefault.png";
import { species, storage, cards } from "../../utils/firebase";
import { getDocs, query, where, setDoc, doc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { CardsActions } from "../../actions/cardsActions";
import { useDispatch } from "react-redux";

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
const TextArea = styled.textarea`
  width: 80%;
  height: 100px;
`;
const InputWrapper = styled.div`
  margin-bottom: 10px;
  width: 100%;
`;
const Tag = styled.div`
  display: flex;
  border: 1px solid #000;
`;
const TagText = styled.div``;
const RemoveTagBtn = styled.div`
  background: #ddd;
  font-weight: 700;
`;
interface FCProps {
  editorDisplay: boolean;
  editorToggle: () => void;
}
const CardEditor = ({ editorDisplay, editorToggle }: FCProps) => {
  const imageRef = useRef<HTMLInputElement>(null);
  const nameRef = useRef<HTMLInputElement>(null);
  const speciesRef = useRef<HTMLInputElement>(null);
  const birthdayRef = useRef<HTMLInputElement>(null);
  const tagRef = useRef<HTMLInputElement>(null);
  const waterRef = useRef<HTMLTextAreaElement>(null);
  const lightRef = useRef<HTMLTextAreaElement>(null);
  const [previewLink, setPreviewLink] = useState<string | null>(null);
  const [tags, setTags] = useState<string[]>([]);
  const dispatch = useDispatch();

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
    const q = query(species, where("speciesName", "==", input));
    const querySnapshot = await getDocs(q);
    if (querySnapshot.empty) {
      alert("Species not existed!");
      waterRef.current!.value = "";
      lightRef.current!.value = "";
      return;
    }
    querySnapshot.forEach((doc) => {
      waterRef.current!.value = doc.data().waterPref;
      lightRef.current!.value = doc.data().lightPref;
      let currentTags = [...tags];
      let newTags = currentTags.concat(doc.data().category);
      setTags(newTags);
    });
  }
  function test() {
    if (birthdayRef.current) {
      console.log(Date.parse(birthdayRef.current.value));
    }
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
    const storageRef = ref(storage, `${file.name}`);
    await uploadBytes(storageRef, file);
    const dowloadLink = await getDownloadURL(storageRef);
    return dowloadLink;
  }

  async function addCard() {
    const imgLink = await uploadFile();
    const card = doc(cards);
    const data = {
      cardId: card.id,
      ownerId: "test",
      plantName: nameRef.current?.value,
      plantPhoto: imgLink,
      tags: tags,
      species: speciesRef.current?.value,
      waterPref: waterRef.current?.value,
      lightPref: lightRef.current?.value,
      birthday: Date.parse(birthdayRef.current?.value || ""),
    };
    await setDoc(card, data);
    dispatch({
      type: CardsActions.ADD_NEW_PLANT_CARD,
      payload: { newCard: data },
    });
  }
  return (
    <CardEditorWrapper $display={editorDisplay}>
      <InputWrapper>
        <PhotoPreview path={previewLink} />
        <PhotoInput
          ref={imageRef}
          type="file"
          accept="image/*"
          onChange={() => {
            createPreviewLink();
          }}
        />
      </InputWrapper>
      <InputWrapper>
        <InputLabel>幫你的植物取個名字！</InputLabel>
        <Input type="text" ref={nameRef} />
      </InputWrapper>
      <InputWrapper>
        <InputLabel>品種</InputLabel>
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
      </InputWrapper>
      <InputWrapper>
        <InputLabel>水分需求</InputLabel>
        <TextArea ref={waterRef} placeholder="搜尋品種可自動帶入資訊" />
      </InputWrapper>
      <InputWrapper>
        <InputLabel>光線需求</InputLabel>
        <TextArea ref={lightRef} placeholder="搜尋品種可自動帶入資訊" />
      </InputWrapper>
      <InputWrapper>
        <InputLabel>生日</InputLabel>
        <Input type="date" ref={birthdayRef} />
      </InputWrapper>
      <InputWrapper>
        <InputLabel>標籤</InputLabel>
        <Input
          type="text"
          ref={tagRef}
          onKeyPress={(e) => {
            if (e.key === "Enter") {
              addTag();
            }
          }}
        />
      </InputWrapper>
      {tags &&
        tags.map((tag) => {
          return (
            <Tag key={tag} id={tag}>
              <TagText>{tag}</TagText>
              <RemoveTagBtn onClick={(e) => RemoveTag(e)}>X</RemoveTagBtn>
            </Tag>
          );
        })}
      <InputWrapper>
        <OperationBtn onClick={addCard}>Add</OperationBtn>
        <OperationBtn onClick={editorToggle}>Cancel</OperationBtn>
      </InputWrapper>
    </CardEditorWrapper>
  );
};

export default CardEditor;
