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
import { speciesContents } from "./speciesContents";
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
  & ::placeholder {
    color: #ddd;
  }
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
interface EditortnProps {
  disabledBtn: boolean;
}
const EditorBtn = styled(OperationBtn)<EditortnProps>`
  color: #fff;
  width: 100px;
  margin-top: 12px;
  border: ${(props) =>
    props.disabledBtn ? "1px solid #aaa" : "1px solid #6a5125"};
  background: ${(props) => (props.disabledBtn ? "#aaa" : "#6a5125")};
  cursor: ${(props) => props.disabledBtn && "not-allowed"};
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
const SpeciesSearchWrapper = styled.div`
  position: relative;
`;
const SearchSuggestionsWrapper = styled.div`
  position: absolute;
  top: 35px;
  width: 200px;
  height: 100px;
  background-color: #fff;
  overflow-y: scroll;
  cursor: pointer;
  border-radius: 8px;
`;
const SearchSuggestion = styled.p`
  font-size: 14px;
  padding: 6px;
  &:hover {
    background-color: #5c836f;
    color: #fff;
  }
`;
const SearchActive = styled(SearchSuggestion)`
  background-color: #5c836f;
  color: #fff;
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
  const activeRef = useRef<HTMLParagraphElement>(null);
  const birthdayRef = useRef<HTMLInputElement>(null);
  const tagRef = useRef<HTMLInputElement>(null);
  const waterRef = useRef<HTMLTextAreaElement>(null);
  const lightRef = useRef<HTMLTextAreaElement>(null);
  const toxicityRef = useRef<HTMLTextAreaElement>(null);
  const [previewLink, setPreviewLink] = useState<string | null>(null);
  const [tags, setTags] = useState<string[]>([]);
  const [disabledBtn, setDisabledBtn] = useState<boolean>(false);
  const [searchSuggests, setSearchSuggests] = useState<string[]>([]);
  const [searchSuggestsDisplay, setSearchSuggestsDisplay] = useState<boolean>(
    false
  );
  const [searchActive, setSearchActive] = useState<number>(-1);
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
  function searchRecommends() {
    if (!speciesRef.current) return;
    if (speciesRef.current.value === "") {
      setSearchActive(-1);
      setSearchSuggestsDisplay(false);
      return;
    }
    let results: string[] = [];
    let targetString = speciesRef.current!.value.toLowerCase();
    speciesContents.forEach((speciesName) => {
      if (speciesName.startsWith(targetString)) results.push(speciesName);
    });
    if (results.length > 0) {
      setSearchSuggestsDisplay(true);
      setSearchSuggests(results);
      setSearchActive(0);
    } else {
      setSearchSuggestsDisplay(true);
      setSearchSuggests(["No Search Result"]);
      setSearchActive(-1);
    }
  }
  function switchActive(e: React.KeyboardEvent) {
    let min = 0;
    let max = searchSuggests.length - 1;
    if (e.key === "ArrowUp" && searchActive > min) {
      e.preventDefault();
      setSearchActive((prev) => prev - 1);
    } else if (e.key === "ArrowDown" && searchActive < max) {
      setSearchActive((prev) => prev + 1);
    } else if (e.key === "Enter" && searchActive !== -1) {
      if (!speciesRef.current || !activeRef.current) return;
      speciesRef.current.value = activeRef.current.textContent!;
      setSearchSuggestsDisplay(false);
    } else if (e.key === "Enter" && searchActive === -1) {
      setSearchSuggests([]);
      setSearchSuggestsDisplay(false);
    }
  }
  async function searchPlantSpecies(input: string) {
    if (!waterRef.current || !lightRef.current) return;
    const querySnapshot = await firebase.searchSpecies(input);
    if (querySnapshot.empty) {
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
    if (tagRef.current.value === "") return;
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
    if (!imageRef.current) return null;
    if (imageRef.current!.value === "") return null;
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
    setSearchActive(-1);
    setSearchSuggests([]);
    setSearchSuggestsDisplay(false);
    setPreviewLink(null);
    setTags([]);
  }
  function checkInput() {
    if (nameRef.current?.value === "") {
      emitAlert("fail", "Please fill plant name.");
      return false;
    } else if (speciesRef.current?.value === "") {
      emitAlert("fail", "Please fill plant species.");
      return false;
    } else return true;
  }
  async function addCard() {
    const imgLink = await uploadFile();
    if (!checkInput()) return;
    setDisabledBtn(true);
    const data: PlantCard = {
      cardId: null,
      ownerId: userId,
      plantName: nameRef.current?.value!,
      plantPhoto: imgLink || "",
      tags: tags,
      species: speciesRef.current?.value!,
      waterPref: waterRef.current?.value,
      lightPref: lightRef.current?.value,
      toxicity: toxicityRef.current?.value,
      followers: 0,
      createdTime: NaN,
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
    setDisabledBtn(false);
    resetEditor();
  }
  async function editCard() {
    let imgLink;
    if (imageRef.current?.value) imgLink = await uploadFile();
    else imgLink = previewLink!;
    if (!checkInput()) return;
    setDisabledBtn(true);
    const data: PlantCard = {
      cardId: editCardId!,
      parents:
        cardList.find((card) => card.cardId === editCardId)!.parents || [],
      followers: cardList.find((card) => card.cardId === editCardId)!.followers,
      ownerId: userId,
      plantName: nameRef.current?.value!,
      plantPhoto: imgLink || "",
      tags: tags || [],
      species: speciesRef.current?.value!,
      waterPref: waterRef.current?.value,
      lightPref: lightRef.current?.value,
      toxicity: toxicityRef.current?.value,
      createdTime: cardList.find((card) => card.cardId === editCardId)!
        .createdTime,
    };
    if (!isNaN(Date.parse(birthdayRef.current?.value || ""))) {
      data["birthday"] = Date.parse(birthdayRef.current?.value!);
    }
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
    setDisabledBtn(false);
    setEditCardId(null);
  }
  useEffect(() => {
    async function getEditCardData() {
      if (!editCardId) return;
      let data = cardList.find((card) => card.cardId === editCardId);
      setPreviewLink(data!.plantPhoto || null);
      setTags(data?.tags || []);
      nameRef.current!.value = data!.plantName;
      speciesRef.current!.value = data!.species;
      waterRef.current!.value = data?.waterPref ?? "";
      lightRef.current!.value = data?.lightPref ?? "";
      toxicityRef.current!.value = data?.toxicity ?? "";
      if (data?.birthday)
        birthdayRef.current!.value = unixTimeToString(data?.birthday);
    }
    if (editCardId) getEditCardData();
  }, [editCardId]);
  useEffect(() => {
    if (activeRef.current) {
      activeRef.current.scrollIntoView();
    }
  }, [searchActive]);
  return (
    <CardEditorWrapper $display={editorDisplay}>
      <PageWrapper>
        <InputWrapper>
          <PhotoPreview path={previewLink || defaultImg} />
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
          <Input
            type="text"
            ref={nameRef}
            maxLength={16}
            placeholder={"enter 1-16 character(s)"}
          />
        </InputFlexWrapper>
        <InputFlexWrapper>
          <InputLabel>Species</InputLabel>
          <SpeciesSearchWrapper>
            <Input
              type="text"
              ref={speciesRef}
              maxLength={40}
              placeholder={"enter 1-40 character(s)"}
              onKeyPress={(e) => {
                if (!speciesRef.current) return;
                if (e.key === "Enter") {
                  searchPlantSpecies(speciesRef.current.value);
                }
              }}
              onKeyDown={(e) => {
                switchActive(e);
              }}
              onChange={searchRecommends}
            />
            {searchSuggestsDisplay && (
              <SearchSuggestionsWrapper>
                {searchSuggests.map((name, index) => {
                  if (index === searchActive)
                    return (
                      <SearchActive
                        ref={activeRef}
                        onClick={() => {
                          if (!speciesRef.current) return;
                          speciesRef.current.value = name;
                          searchPlantSpecies(name);
                          setSearchSuggestsDisplay(false);
                          setSearchActive(-1);
                          setSearchSuggests([]);
                        }}
                      >
                        {name}
                      </SearchActive>
                    );
                  else
                    return (
                      <SearchSuggestion
                        onClick={() => {
                          if (!speciesRef.current) return;
                          speciesRef.current.value = name;
                          searchPlantSpecies(name);
                          setSearchSuggestsDisplay(false);
                          setSearchActive(-1);
                          setSearchSuggests([]);
                        }}
                      >
                        {name}
                      </SearchSuggestion>
                    );
                })}
              </SearchSuggestionsWrapper>
            )}
          </SpeciesSearchWrapper>
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
            maxLength={30}
            placeholder={"enter 1-30 character(s)"}
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
          <TextArea
            ref={waterRef}
            maxLength={500}
            placeholder={"enter 1-500 character(s)"}
          />
        </InputWrapper>
        <InputWrapper>
          <InputLabel>Light Preference</InputLabel>
          <TextArea
            ref={lightRef}
            maxLength={500}
            placeholder={"enter 1-500 character(s)"}
          />
        </InputWrapper>
        <InputWrapper>
          <InputLabel>Toxicity</InputLabel>
          <TextArea
            ref={toxicityRef}
            maxLength={500}
            placeholder={"enter 1-500 character(s)"}
          />
        </InputWrapper>
        <BtnWrpper>
          {editCardId ? (
            <EditorBtn
              disabledBtn={disabledBtn}
              onClick={() => {
                if (!disabledBtn) {
                  editCard();
                }
              }}
            >
              Save
            </EditorBtn>
          ) : (
            <EditorBtn
              disabledBtn={disabledBtn}
              onClick={() => {
                if (!disabledBtn) {
                  addCard();
                }
              }}
            >
              Add
            </EditorBtn>
          )}
          <EditorBtn
            disabledBtn={disabledBtn}
            onClick={() => {
              if (!disabledBtn) {
                editorToggle();
                resetEditor();
                setEditCardId(null);
                dispatch({
                  type: popUpActions.HIDE_ALL,
                });
              }
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
