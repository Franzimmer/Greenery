import React, { useEffect, useRef, useState, Fragment } from "react";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../../store/reducer";
import { UserInfoActions } from "../../../store/actions/userInfoActions";
import { firebase } from "../../../utils/firebase";
import { useAlertDispatcher } from "../../../utils/useAlertDispatcher";
import { IconButton } from "../../../components/GlobalStyles/button";
import {
  NoDataSection,
  NoDataText,
  NoDataBtn,
} from "../../../components/GlobalStyles/noDataLayout";
import { SectionLoader } from "../../../components/GlobalStyles/PageLoader";
import { faTrashCan, faPlus } from "@fortawesome/free-solid-svg-icons";
interface SectionWrapperProps {
  $isLoading: boolean;
}
const SectionWrapper = styled.div<SectionWrapperProps>`
  opacity: ${(props) => (props.$isLoading ? "0" : "1")};
  transition: 1s;
`;
interface PinProps {
  $path: string;
}
const Pin = styled.div<PinProps>`
  cursor: pointer;
  position: relative;
  margin: 20px 15px;
  background-image: url(${(props) => props.$path});
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
  grid-template-columns: repeat(auto-fill, 250px);
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
interface FlexWrapperProps {
  $disableBtn: boolean;
}
const FlexWrapper = styled.label<FlexWrapperProps>`
  align-self: flex-end;
  margin: 0 40px 20px 0;
  width: 200px;
  height: 40px;
  border-radius: 20px;
  padding: 3px;
  display: flex;
  justify-content: center;
  align-items: center;
  background: ${(props) => (props.$disableBtn ? "#aaa" : "#5c836f")};
  cursor: ${(props) => (props.$disableBtn ? "not-allowed" : "pointer")};
  transition: 0.25s;
  &:hover {
    transform: scale(1.1);
    transition: 0.25s;
  }
  & * {
    background: ${(props) => (props.$disableBtn ? "#aaa" : "#5c836f")};
    cursor: ${(props) => (props.$disableBtn ? "not-allowed" : "pointer")};
  }
`;
const NoGallerySection = styled(NoDataSection)`
  margin-top: 20px;
`;
interface GalleryProps {
  id: string | undefined;
}
const Gallery = ({ id }: GalleryProps) => {
  const dispatch = useDispatch();
  const alertDispatcher = useAlertDispatcher();
  const { isSelf } = useSelector((state: RootState) => state.authority);
  const userInfo = useSelector((state: RootState) => state.userInfo);
  const mediaRef = useRef<HTMLInputElement>(null);
  const [media, setMedia] = useState<string[]>([]);
  const [disableBtn, setDisableBtn] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  async function saveGalleryData() {
    if (mediaRef.current!.value === "") {
      alertDispatcher("fail", "Please choose a file.");
      return;
    }
    const file = mediaRef.current!.files![0];
    const link = await firebase.uploadFile(file);
    dispatch({
      type: UserInfoActions.ADD_GALLERY,
      payload: { link },
    });
    mediaRef.current!.value = "";
    await firebase.addGallery(id!, link);
    setDisableBtn(false);
    alertDispatcher("success", "Upload Success !");
  }
  async function deleteMedia(link: string) {
    await firebase.deleteGallery(id!, link);
    dispatch({
      type: UserInfoActions.REMOVE_GALLERY,
      payload: { link },
    });
    alertDispatcher("success", "Delete Success !");
  }
  useEffect(() => {
    async function getMediaData() {
      if (!isSelf) {
        setIsLoading(true);
        const docData = await firebase.getGallery(id!);
        setMedia(docData.data()!.gallery);
      } else {
        const galleryData = userInfo.gallery;
        setMedia(galleryData);
      }
      setTimeout(() => {
        setIsLoading(false);
      }, 500);
    }
    getMediaData();
  }, [id, isSelf, userInfo.gallery]);
  return (
    <>
      {isLoading && <SectionLoader></SectionLoader>}
      <SectionWrapper $isLoading={isLoading}>
        {isSelf && media.length !== 0 && (
          <FlexWrapper
            $disableBtn={disableBtn}
            htmlFor="image"
            onClick={(e) => {
              if (disableBtn) e.preventDefault();
            }}
          >
            <IconButton
              htmlFor="image"
              onClick={(e) => {
                if (disableBtn) e.preventDefault();
              }}
            >
              <StyledFontAwesome icon={faPlus} />
            </IconButton>
            <LabelBtn
              htmlFor="image"
              onClick={(e) => {
                if (disableBtn) e.preventDefault();
              }}
            >
              Add Photo
            </LabelBtn>
            <input
              id="image"
              type="file"
              accept="image/*"
              ref={mediaRef}
              onChange={() => {
                saveGalleryData();
                setDisableBtn(true);
              }}
              hidden
            />
          </FlexWrapper>
        )}
        <PinsWrapper>
          {media.length !== 0 &&
            media.map((asset, index) => {
              return (
                <Fragment key={`${asset}-asset`}>
                  {index % 3 === 1 && (
                    <SmallPin $path={asset}>
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
                    <MediumPin $path={asset}>
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
                    <LargePin $path={asset}>
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
                </Fragment>
              );
            })}
        </PinsWrapper>
        {media.length === 0 && (
          <NoGallerySection>
            {isSelf && (
              <>
                <NoDataText>
                  You haven't upload any photo yet. Share some with everyone !
                </NoDataText>
                <NoDataBtn htmlFor="image">Add Photo</NoDataBtn>
                <input
                  id="image"
                  type="file"
                  accept="image/*"
                  ref={mediaRef}
                  onChange={() => {
                    saveGalleryData();
                    setDisableBtn(true);
                  }}
                  hidden
                />
              </>
            )}
            {!isSelf && <NoDataText>User has no gallery data.</NoDataText>}
          </NoGallerySection>
        )}
      </SectionWrapper>
    </>
  );
};

export default Gallery;
