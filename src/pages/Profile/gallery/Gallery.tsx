import React, { useEffect, useRef, useState } from "react";
import { getDownloadURL, uploadBytes, ref } from "firebase/storage";
import { storage, users } from "../../../utils/firebase";
import {
  doc,
  updateDoc,
  arrayUnion,
  arrayRemove,
  getDoc,
} from "firebase/firestore";
import { OperationBtn } from "../cards/Cards";

interface GalleryProps {
  id: string | undefined;
  isSelf: boolean;
}
const Gallery = ({ id, isSelf }: GalleryProps) => {
  const mediaRef = useRef<HTMLInputElement>(null);
  const [media, setMedia] = useState<string[]>([]);
  const docRef = doc(users, id);

  async function getMediaData() {
    const docData = await getDoc(docRef);
    setMedia(docData.data()!.gallery);
  }
  async function uploadFile() {
    if (!mediaRef.current) return;
    if (!mediaRef.current.files?.length) return;
    let file = mediaRef.current!.files![0];
    const storageRef = ref(storage, `${file.name}`);
    await uploadBytes(storageRef, file);
    const dowloadLink = await getDownloadURL(storageRef);
    mediaRef.current.value = "";
    return dowloadLink;
  }

  async function saveGalleryData() {
    if (mediaRef.current!.value === "") alert("請選擇檔案!");
    const link = await uploadFile();
    if (!link) return;
    await updateDoc(docRef, { gallery: arrayUnion(link) });
    const docData = await getDoc(docRef);
    setMedia(docData.data()!.gallery);
  }

  async function deleteMedia(e: React.MouseEvent<HTMLElement>) {
    let target = e.target as HTMLButtonElement;
    let link = target.id;
    await updateDoc(docRef, { gallery: arrayRemove(link) });
    let index = media.findIndex((item) => item === link);
    let newMedia = [...media];
    newMedia.splice(index, 1);
    setMedia(newMedia);
  }

  useEffect(() => {
    getMediaData();
  }, [id]);
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
                id={asset}
                onClick={(e) => {
                  deleteMedia(e);
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
