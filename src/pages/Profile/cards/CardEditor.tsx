import React, {
  useState,
  useRef,
  useEffect,
  Dispatch,
  SetStateAction,
} from "react";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../../store/reducer/index";
import { PlantCard } from "../../../store/types/plantCardType";
import { PopUpActions } from "../../../store/actions/popUpActions";
import { CardsActions } from "../../../store/actions/cardsActions";
import { firebase } from "../../../utils/firebase";
import { unixTimeToString } from "../../../utils/helpers";
import { useAlertDispatcher } from "../../../utils/useAlertDispatcher";
import {
  OperationBtn,
  CloseBtn,
} from "../../../components/GlobalStyles/button";
import { speciesContents } from "./speciesContents";
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons";
import defaultImg from "../../../assets/default.jpg";

const CardEditorWrapper = styled.div`
  position: fixed;
  z-index: 101;
  top: 50vh;
  left: 50vw;
  transform: translateX(-50%) translateY(-50%);
  border-radius: 15px;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #f5f0ec;
  @media (max-width: 800px) {
    flex-direction: column;
    height: fit-content;
  }
`;
const PageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
  width: 360px;
  height: auto;
  padding: 30px;
  @media (max-width: 800px) {
    width: 340px;
    padding: 8px 15px;
  }
`;
const InputLabel = styled.span`
  color: ${(props) => props.theme.colors.button};
  font-weight: 500;
  margin-right: 8px;
  @media (max-width: 800px) {
    font-size: 14px;
  }
`;

interface PhotoPreviewProps {
  $path: string | null;
}
const PhotoPreview = styled.div<PhotoPreviewProps>`
  width: 280px;
  height: 150px;
  background-image: url(${(props) => (props.$path ? props.$path : defaultImg)});
  background-repeat: no-repeat;
  background-size: contain;
  background-position: center center;
  background-color: #eee;
  margin: auto;
  @media (max-width: 800px) {
    width: 180px;
    height: 100px;
  }
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
  border: 1px solid ${(props) => props.theme.colors.button};
  padding: 0px 15px;
  & ::placeholder {
    color: #ddd;
  }
  @media (max-width: 800px) {
    height: 24px;
    font-size: 14px;
  }
`;
const TextArea = styled.textarea`
  width: 280px;
  height: 100px;
  border: 1px solid ${(props) => props.theme.colors.button};
  padding: 5px;
  @media (max-width: 800px) {
    height: 70px;
  }
`;
const InputWrapper = styled.div`
  margin-bottom: 10px;
  width: 280px;
  @media (max-width: 800px) {
    margin-bottom: 6px;
  }
`;
const InputFlexWrapper = styled(InputWrapper)`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;
const Tag = styled.div`
  display: flex;
  align-items: center;
  border: 1px solid ${(props) => props.theme.colors.button};
  background-color: none;
  padding: 0px 5px;
  border-radius: 14px;
  height: 30px;
  margin: 8px 8px 0px 0px;
`;
const TagText = styled.div`
  color: ${(props) => props.theme.colors.button};
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
  $disabledBtn: boolean;
}
const EditorBtn = styled(OperationBtn)<EditortnProps>`
  color: #fff;
  width: 100px;
  margin-top: 12px;
  border: ${(props) =>
    props.$disabledBtn
      ? "1px solid #aaa"
      : `1px solid ${props.theme.colors.button}`};
  background: ${(props) =>
    props.$disabledBtn ? "#aaa" : props.theme.colors.button};
  cursor: ${(props) => props.$disabledBtn && "not-allowed"};
  transition: 0.25s;
  &:hover {
    transform: scale(1.1);
    transition: 0.25s;
  }
`;
const RemoveTagBtn = styled(CloseBtn)`
  color: ${(props) => props.theme.colors.button};
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
  color: ${(props) => props.theme.colors.button};
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
    background-color: ${(props) => props.theme.colors.main};
    color: #fff;
  }
`;
const SearchActive = styled(SearchSuggestion)`
  background-color: ${(props) => props.theme.colors.main};
  color: #fff;
`;
interface CardEditorProps {
  userId: string;
  editCardId: string | null;
  setEditCardId: Dispatch<SetStateAction<string | null>>;
  editorDisplay: boolean;
  setEditorDisplay: Dispatch<SetStateAction<boolean>>;
}
const CardEditor = ({
  userId,
  editCardId,
  setEditCardId,
  editorDisplay,
  setEditorDisplay,
}: CardEditorProps) => {
  const dispatch = useDispatch();
  const alertDispatcher = useAlertDispatcher();
  const cardList = useSelector((state: RootState) => state.cards);
  const myFollowers = useSelector((state: RootState) => state.myFollowers);
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
  const [searchActive, setSearchActive] = useState<number>(-1);

  function createPreviewLink() {
    if (!imageRef.current) return;
    if (imageRef.current.files!.length !== 0) {
      const path = URL.createObjectURL(imageRef.current.files![0]);
      setPreviewLink(path);
    } else {
      setPreviewLink(null);
      return;
    }
  }
  function searchRecommends() {
    if (!speciesRef.current) return;
    if (speciesRef.current.value === "") {
      setSearchSuggests([]);
      setSearchActive(-1);
      return;
    }
    const results: string[] = [];
    const targetString = speciesRef.current!.value.toLowerCase();
    speciesContents.forEach((speciesName) => {
      if (speciesName.startsWith(targetString)) results.push(speciesName);
    });
    if (results.length > 0) {
      setSearchSuggests(results);
      setSearchActive(0);
    } else {
      setSearchSuggests([]);
      setSearchActive(-1);
    }
  }
  function switchActive(e: React.KeyboardEvent) {
    const min = 0;
    const max = searchSuggests.length - 1;
    if (e.key === "ArrowUp" && searchActive > min) {
      e.preventDefault();
      setSearchActive((prev) => prev - 1);
    } else if (e.key === "ArrowDown" && searchActive < max) {
      setSearchActive((prev) => prev + 1);
    } else if (e.key === "Enter" && searchActive !== -1) {
      if (!speciesRef.current || !activeRef.current) return;
      speciesRef.current.value = activeRef.current.textContent!;
      setSearchSuggests([]);
    } else if (e.key === "Enter" && searchActive === -1) {
      setSearchSuggests([]);
    }
  }
  async function searchPlantSpecies(input: string) {
    if (!waterRef.current || !lightRef.current) return;
    const querySnapshot = await firebase.searchSpecies(input);
    if (querySnapshot.empty) {
      waterRef.current!.value = "";
      lightRef.current!.value = "";
      toxicityRef.current!.value = "";
    } else {
      querySnapshot.forEach((doc) => {
        waterRef.current!.value = doc.data().WATER;
        lightRef.current!.value = doc.data().LIGHT;
        toxicityRef.current!.value = doc.data().TOXICITY;
      });
    }
  }
  function addTag() {
    if (!tagRef.current || tagRef.current.value === "") return;
    if (tags.includes(tagRef.current.value)) return;
    const currentTags = [...tags];
    currentTags.push(tagRef.current.value);
    setTags(currentTags);
  }
  function RemoveTag(target: string) {
    if (!tagRef.current) return;
    const currentTags = [...tags];
    const newTags = currentTags.filter((tag) => tag !== target);
    setTags(newTags);
  }
  async function uploadFile() {
    if (!imageRef.current || imageRef.current!.value === "") return null;
    const file = imageRef.current!.files![0];
    const dowloadLink = await firebase.uploadFile(file);
    return dowloadLink;
  }
  function checkInput() {
    if (nameRef.current?.value === "") {
      alertDispatcher("fail", "Please fill plant name.");
      setDisabledBtn(false);
      return false;
    } else if (speciesRef.current?.value === "") {
      alertDispatcher("fail", "Please fill plant species.");
      setDisabledBtn(false);
      return false;
    } else return true;
  }
  async function handleUploadData() {
    let imgLink;
    if (imageRef.current?.value) imgLink = await uploadFile();
    else imgLink = previewLink!;
    const data: PlantCard = {
      cardId: editCardId ? editCardId : null,
      ownerId: userId,
      plantPhoto: imgLink || "",
      tags: tags || [],
      plantName: nameRef.current?.value!,
      species: speciesRef.current?.value!,
      waterPref: waterRef.current?.value,
      lightPref: lightRef.current?.value,
      toxicity: toxicityRef.current?.value,
      createdTime: editCardId
        ? cardList.find((card) => card.cardId === editCardId)!.createdTime
        : NaN,
      followers: editCardId
        ? cardList.find((card) => card.cardId === editCardId)!.followers
        : 0,
    };
    if (!isNaN(Date.parse(birthdayRef.current?.value || ""))) {
      data["birthday"] = Date.parse(birthdayRef.current?.value!);
    }
    if (editCardId) {
      data["parents"] =
        cardList.find((card) => card.cardId === editCardId)!.parents || [];
    }
    return data;
  }
  async function addCard() {
    setDisabledBtn(true);
    if (!checkInput()) return;
    const data = await handleUploadData();
    const cardId = await firebase.addCard(data);
    await firebase.emitNotices(userId, myFollowers, "1");
    dispatch({
      type: CardsActions.ADD_NEW_PLANT_CARD,
      payload: { newCard: { ...data, cardId } },
    });
    handleCloseClick();
    alertDispatcher("success", "You add a new plant card !");
  }
  async function editCard() {
    setDisabledBtn(true);
    if (!checkInput()) return;
    const data = await handleUploadData();
    await firebase.editCard(editCardId!, data);
    dispatch({
      type: CardsActions.EDIT_PLANT_INFO,
      payload: { editCard: data },
    });
    handleCloseClick();
    alertDispatcher("success", "Edit Card Success!");
  }
  function handleCloseClick() {
    if (!disabledBtn) {
      setEditCardId(null);
      setEditorDisplay(false);
      setPreviewLink(null);
      setDisabledBtn(false);
      setTags([]);
      setSearchSuggests([]);
      dispatch({
        type: PopUpActions.HIDE_ALL,
      });
    }
  }
  function handleSpeciesSearch(name: string) {
    if (!speciesRef.current) return;
    speciesRef.current.value = name;
    searchPlantSpecies(name);
    setSearchActive(-1);
    setSearchSuggests([]);
  }
  useEffect(() => {
    if (!editCardId) return;
    const data = cardList.find((card) => card.cardId === editCardId);
    setPreviewLink(data!.plantPhoto || null);
    setTags(data?.tags || []);
    nameRef.current!.value = data!.plantName;
    speciesRef.current!.value = data!.species;
    waterRef.current!.value = data?.waterPref ?? "";
    lightRef.current!.value = data?.lightPref ?? "";
    toxicityRef.current!.value = data?.toxicity ?? "";
    if (data?.birthday)
      birthdayRef.current!.value = unixTimeToString(data?.birthday);
  }, [editCardId]);
  useEffect(() => {
    if (activeRef.current) activeRef.current.scrollIntoView();
  }, [searchActive]);
  return editCardId || editorDisplay ? (
    <CardEditorWrapper>
      <PageWrapper>
        <InputWrapper>
          <PhotoPreview $path={previewLink || defaultImg} />
          <PhotoInputLabel htmlFor="img">
            <UploadIcon icon={faPenToSquare} />
          </PhotoInputLabel>
          <PhotoInput
            id="img"
            ref={imageRef}
            type="file"
            accept="image/*"
            onChange={createPreviewLink}
            hidden
          />
        </InputWrapper>
        <InputFlexWrapper>
          <InputLabel>Name</InputLabel>
          <Input
            type="text"
            ref={nameRef}
            maxLength={10}
            placeholder={"enter 1-10 character(s)"}
          />
        </InputFlexWrapper>
        <InputFlexWrapper>
          <InputLabel>Species</InputLabel>
          <SpeciesSearchWrapper>
            <Input
              type="text"
              ref={speciesRef}
              maxLength={40}
              placeholder={"press enter to search"}
              onKeyPress={(e) => {
                if (!speciesRef.current) return;
                if (e.key === "Enter")
                  searchPlantSpecies(speciesRef.current.value);
              }}
              onKeyDown={(e) => switchActive(e)}
              onChange={searchRecommends}
            />
            {!!searchSuggests.length && (
              <SearchSuggestionsWrapper>
                {searchSuggests.map((name, index) => {
                  if (index === searchActive)
                    return (
                      <SearchActive
                        key={name}
                        ref={activeRef}
                        onClick={() => handleSpeciesSearch(name)}
                      >
                        {name}
                      </SearchActive>
                    );
                  else
                    return (
                      <SearchSuggestion
                        key={name}
                        onClick={() => handleSpeciesSearch(name)}
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
            maxLength={20}
            placeholder={"enter 1-20 character(s)"}
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
                <Tag key={tag}>
                  <TagText>{tag}</TagText>
                  <RemoveTagBtn onClick={() => RemoveTag(tag)}>
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
              $disabledBtn={disabledBtn}
              onClick={() => {
                if (!disabledBtn) editCard();
              }}
            >
              Save
            </EditorBtn>
          ) : (
            <EditorBtn
              $disabledBtn={disabledBtn}
              onClick={() => {
                if (!disabledBtn) addCard();
              }}
            >
              Add
            </EditorBtn>
          )}
          <EditorBtn $disabledBtn={disabledBtn} onClick={handleCloseClick}>
            Cancel
          </EditorBtn>
        </BtnWrpper>
      </PageWrapper>
    </CardEditorWrapper>
  ) : null;
};

export default CardEditor;
