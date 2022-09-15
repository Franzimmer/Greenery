import React, { useEffect, useRef, useState } from "react";
import { firebase } from "../../../utils/firebase";
import { OperationBtn } from "../cards/Cards";
import { useSelector } from "react-redux";
import { RootState } from "../../../reducer";
import { useDispatch } from "react-redux";
import { UserInfoActions } from "../../../actions/userInfoActions";

interface GalleryProps {
  id: string | undefined;
  isSelf: boolean;
}
const Gallery = ({ id, isSelf }: GalleryProps) => {
  const userInfo = useSelector((state: RootState) => state.userInfo);
  const dispatch = useDispatch();
  const mediaRef = useRef<HTMLInputElement>(null);
  const [media, setMedia] = useState<string[]>([]);

  async function saveGalleryData() {
    if (mediaRef.current!.value === "") alert("請選擇檔案!");
    let file = mediaRef.current!.files![0];
    let link = await firebase.uploadFile(file);
    dispatch({
      type: UserInfoActions.ADD_GALLERY,
      payload: { link },
    });
    await firebase.addGallery(id!, link);
  }

  async function deleteMedia(link: string) {
    dispatch({
      type: UserInfoActions.REMOVE_GALLERY,
      payload: { link },
    });
    await firebase.deleteGallery(id!, link);
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
  }, [id, isSelf]);
  return (
    <>
      {isSelf && (
        <>
          <input type="file" accept="image/*" ref={mediaRef} />
          <OperationBtn onClick={saveGalleryData}>上傳</OperationBtn>
        </>
      )}
      {media &&
        media.map((asset: string) => {
          return (
            <div key={`${asset}-asset`}>
              <img
                src={asset}
                alt="photoUploaded"
                style={{ width: "300px", height: "auto" }}
              ></img>
              <OperationBtn
                key={asset}
                onClick={() => {
                  deleteMedia(asset);
                }}
              >
                Delete
              </OperationBtn>
            </div>
          );
        })}
    </>
  );
};

export default Gallery;
