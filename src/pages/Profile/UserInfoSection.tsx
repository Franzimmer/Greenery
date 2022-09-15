import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import { signOut } from "firebase/auth";
import { UserInfo } from "../../types/userInfoType";
import { auth, firebase, storage } from "../../utils/firebase";
import { useNavigate } from "react-router-dom";
import { OperationBtn } from "./cards/Cards";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../reducer/index";
import { UserInfoActions } from "../../actions/userInfoActions";
const UserInfoWrapper = styled.div`
  display: flex;
  align-items: flex-end;
  padding-bottom: 10px;
  border-bottom: 1px solid black;
  margin-bottom: 20px;
`;
interface UserPhotoProps {
  path: string | undefined;
}
export const UserPhoto = styled.div<UserPhotoProps>`
  width: 150px;
  height: 150px;
  border-radius: 50%;
  border: 1px solid black;
  background-image: url(${(props) => (props.path ? props.path : "")});
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
`;
const UserInfoText = styled.p``;
const LabelForHiddenInput = styled.label`
  background: #eee;
  border: 1px solid #000;
  padding: 5px;
  &:hover {
    background: #000;
    color: #fff;
    cursor: pointer;
  }
`;

interface UserInfoProps {
  id: string | undefined;
  isSelf: boolean;
}

async function uploadFile(file: File) {
  const storageRef = ref(storage, `${file.name}`);
  await uploadBytes(storageRef, file);
  const dowloadLink = await getDownloadURL(storageRef);
  return dowloadLink;
}

const UserInfoSection = ({ id, isSelf }: UserInfoProps) => {
  const photoRef = useRef<HTMLInputElement>(null);
  const nameRef = useRef<HTMLInputElement>(null);
  const userInfo = useSelector((state: RootState) => state.userInfo);
  const [userData, setUserData] = useState<UserInfo>();
  const [showNameInput, setShowNameInput] = useState<string>("none");
  const [isFollowed, setIsFollowed] = useState<boolean>(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  function userSignOut() {
    signOut(auth)
      .then(() => {
        navigate("/login");
      })
      .catch((error) => {
        alert("An error happened..");
      });
  }
  async function editUserPhoto() {
    if (!photoRef.current) return;
    if (photoRef.current.files!.length === 0) return;
    let link = await uploadFile(photoRef.current.files![0]);
    photoRef.current.value = "";
    dispatch({
      type: UserInfoActions.EDIT_USER_PHOTO,
      payload: { photoUrl: link },
    });
    await firebase.updateUserPhoto(id!, link);
  }
  async function editUserName() {
    setShowNameInput("none");
    if (!nameRef.current) return;
    if (!nameRef.current.value) return;
    dispatch({
      type: UserInfoActions.EDIT_USER_NAME,
      payload: { userName: nameRef.current.value },
    });
    await firebase.updateUserName(id!, nameRef.current.value);
    nameRef.current.value = "";
  }
  async function followStatusToggle() {
    if (isFollowed) {
      setIsFollowed(false);
      await firebase.removeFollowList(userInfo.userId, id!);
      dispatch({
        type: UserInfoActions.REMOVE_FOLLOW_LIST,
        payload: { targetId: id },
      });
    }
    if (!isFollowed) {
      setIsFollowed(true);
      await firebase.addFollowList(userInfo.userId, id!);
      dispatch({
        type: UserInfoActions.ADD_FOLLOW_LIST,
        payload: { targetId: id },
      });
    }
  }
  useEffect(() => {
    async function getUserInfo() {
      if (id && !isSelf) {
        let result = await firebase.getUserInfo(id);
        setUserData(result.data());
        userInfo.followList?.includes(id)
          ? setIsFollowed(true)
          : setIsFollowed(false);
      } else if (id && isSelf) {
        setUserData(userInfo);
      } else {
        alert("此頁面不存在！");
        navigate("/");
      }
    }
    getUserInfo();
  }, [id, isSelf]);

  useEffect(() => {
    if (isSelf) {
      setUserData(userInfo);
    }
  }, [userInfo, isSelf]);
  return (
    <UserInfoWrapper>
      <UserPhoto path={userData?.photoUrl} />
      {isSelf && (
        <LabelForHiddenInput htmlFor="upload">
          編輯相片
          <input
            id="upload"
            type="file"
            accept="image/*"
            ref={photoRef}
            onChange={editUserPhoto}
            hidden
          />
        </LabelForHiddenInput>
      )}
      <UserInfoText>{userData?.userName}</UserInfoText>
      {isSelf && (
        <LabelForHiddenInput
          htmlFor="nameInput"
          onClick={() => setShowNameInput("block")}
        >
          編輯姓名
          <input
            id="nameInput"
            type="text"
            ref={nameRef}
            onKeyPress={(e) => {
              if (e.key === "Enter") editUserName();
            }}
            style={{ display: showNameInput }}
          />
        </LabelForHiddenInput>
      )}
      {!isSelf && !isFollowed && (
        <OperationBtn onClick={followStatusToggle}>Follow</OperationBtn>
      )}
      {!isSelf && isFollowed && (
        <OperationBtn onClick={followStatusToggle}>Unfollow</OperationBtn>
      )}
      {isSelf && <OperationBtn onClick={userSignOut}>登出</OperationBtn>}
    </UserInfoWrapper>
  );
};

export default UserInfoSection;
