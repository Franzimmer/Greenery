import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashCan, faPlus } from "@fortawesome/free-solid-svg-icons";
import { firebase } from "../../../utils/firebase";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../../reducer";
import { UserInfoActions } from "../../../actions/userInfoActions";
import { IconButton } from "../../../components/GlobalStyles/button";
interface GalleryProps {
  id: string | undefined;
  isSelf: boolean;
}
interface PinProps {
  path: string;
}
const Pin = styled.div<PinProps>`
  cursor: pointer;
  position: relative;
  margin: 20px 15px;
  background-image: url(${(props) => props.path});
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  transition: 0.5s;
  &:hover {
    transform: scale(1.1) translateX(5px) translateY(5px);
    transition: 0.5s;
  }
`;
const SmallPin = styled(Pin)`
  grid-row-end: span 26;
`;
const MediumPin = styled(Pin)`
  grid-row-end: span 33;
`;
const LargePin = styled(Pin)`
  grid-row-end: span 45;
`;
const PinMask = styled.div`
  width: 100%;
  height: 100%;
  display: none;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 1;
  background-color: rgba(0, 0, 0, 0.3);
  transition: 0.5s;
  ${Pin}:hover & {
    transition: 0.5s;
    display: block;
  }
`;
const PinsWrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, 300px);
  grid-auto-rows: 10px;
  width: 80vw;
`;
const DeleteBtn = styled(IconButton)`
  display: none;
  position: absolute;
  z-index: 2;
  bottom: 0;
  right: 0;
  transform: translateX(-50%) translateY(-50%);
  ${Pin}:hover & {
    display: block;
  }
`;
const StyledFontAwesome = styled(FontAwesomeIcon)`
  position: absolue;
  z-index: 2;
  width: 30px;
  height: 30px;
  color: #fff;
`;
const LabelBtn = styled(IconButton)`
  width: 100px;
  color: #fff;
`;
const FlexWrapper = styled.div`
  align-self: flex-end;
  margin-right: 40px;
  cursor: pointer;
  width: 200px;
  height: 40px;
  border-radius: 20px;
  padding: 3px;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #5c836f;
  transition: 0.25s;
  &:hover {
    transform: scale(1.1);
    transition: 0.25s;
  }
`;
const Gallery = ({ id, isSelf }: GalleryProps) => {
  const userInfo = useSelector((state: RootState) => state.userInfo);
  const dispatch = useDispatch();
  const mediaRef = useRef<HTMLInputElement>(null);
  const [media, setMedia] = useState<string[]>([]);

  async function saveGalleryData() {
    if (mediaRef.current!.value === "") {
      alert("請選擇檔案!");
      return;
    }
    let file = mediaRef.current!.files![0];
    let link = await firebase.uploadFile(file);
    dispatch({
      type: UserInfoActions.ADD_GALLERY,
      payload: { link },
    });
    mediaRef.current!.value = "";
    await firebase.addGallery(id!, link);
  }
  async function deleteMedia(link: string) {
    await firebase.deleteGallery(id!, link);
    alert("Delete Success!");
    dispatch({
      type: UserInfoActions.REMOVE_GALLERY,
      payload: { link },
    });
  }
  useEffect(() => {
    async function getMediaData() {
      if (!isSelf) {
        const docData = await firebase.getGallery(id!);
        setMedia(docData.data()!.gallery);
      } else {
        const galleryData = userInfo.gallery;
        setMedia(galleryData);
      }
    }
    getMediaData();
  }, [id, isSelf, userInfo]);
  return (
    <>
      {isSelf && (
        <FlexWrapper>
          <IconButton htmlFor="image">
            <StyledFontAwesome icon={faPlus} />
          </IconButton>
          <LabelBtn htmlFor="image">Add Galery</LabelBtn>
          <input
            id="image"
            type="file"
            accept="image/*"
            ref={mediaRef}
            onChange={saveGalleryData}
            hidden
          />
        </FlexWrapper>
      )}
      <PinsWrapper>
        {media &&
          media.map((asset, index) => {
            return (
              <>
                {index % 3 === 1 && (
                  <SmallPin path={asset} key={`${asset}-asset`}>
                    <PinMask />
                    <DeleteBtn
                      onClick={() => {
                        deleteMedia(asset);
                      }}
                    >
                      <StyledFontAwesome icon={faTrashCan} />
                    </DeleteBtn>
                  </SmallPin>
                )}
                {index % 3 === 2 && (
                  <MediumPin path={asset} key={`${asset}-asset`}>
                    <PinMask />
                    <DeleteBtn
                      onClick={() => {
                        deleteMedia(asset);
                      }}
                    >
                      <StyledFontAwesome icon={faTrashCan} />
                    </DeleteBtn>
                  </MediumPin>
                )}
                {index % 3 === 0 && (
                  <LargePin path={asset} key={`${asset}-asset`}>
                    <PinMask />
                    <DeleteBtn
                      onClick={() => {
                        deleteMedia(asset);
                      }}
                    >
                      <StyledFontAwesome icon={faTrashCan} />
                    </DeleteBtn>
                  </LargePin>
                )}
              </>
            );
          })}
      </PinsWrapper>
    </>
  );
};

export default Gallery;
