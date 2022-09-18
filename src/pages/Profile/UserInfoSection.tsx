import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../reducer/index";
import { UserInfoActions } from "../../actions/userInfoActions";
import { UserInfo } from "../../types/userInfoType";
import { auth, firebase } from "../../utils/firebase";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons";
import { OperationBtn, IconButton } from "../../components/GlobalStyles/button";

const UserInfoWrapper = styled.div`
  display: flex;
  align-items: center;
  padding-bottom: 10px;
  margin-bottom: 20px;
`;
interface UserPhotoProps {
  path: string | undefined;
}
export const UserPhoto = styled.div<UserPhotoProps>`
  width: 150px;
  height: 150px;
  border-radius: 50%;
  background-image: url(${(props) => (props.path ? props.path : "")});
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
`;
const UserInfoText = styled.div`
  padding: 0px 10px;
  font-size: 26px;
  font-weight: 700;
  &:focus {
    background: #fff;
  }
`;
const IconButtonLabel = styled(IconButton)`
  cursor: pointer;
  position: relative;
  top: 50px;
  left: -30px;

  &:hover {
    transform: translateY(5px);
    transition: 0.25s;
  }
`;
const NameButtonLabel = styled(IconButtonLabel)`
  padding: 10px;
  top: 0px;
  left: 5px;
`;
const UserInfoBtn = styled(OperationBtn)`
  margin-left: 40px;
  transition: 0.5s;
  &:hover {
    border: 1px solid #fddba9;
    background: #fddba9;
    color: #6a5125;
    transform: translateY(5px);
    transition: 0.5s;
  }
`;
const StyledFontAwesomeIcon = styled(FontAwesomeIcon)`
  background-color: rgba(0, 0, 0, 0);
  color: #5c836f;
  height: 25px;
`;
interface UserInfoProps {
  id: string | undefined;
  isSelf: boolean;
}
const UserInfoSection = ({ id, isSelf }: UserInfoProps) => {
  const photoRef = useRef<HTMLInputElement>(null);
  const nameRef = useRef<HTMLInputElement>(null);
  const userInfo = useSelector((state: RootState) => state.userInfo);
  const [userData, setUserData] = useState<UserInfo>();
  const [showNameInput, setShowNameInput] = useState<boolean>(false);
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
    let link = await firebase.uploadFile(photoRef.current.files![0]);
    photoRef.current.value = "";
    dispatch({
      type: UserInfoActions.EDIT_USER_PHOTO,
      payload: { photoUrl: link },
    });
    await firebase.updateUserPhoto(id!, link);
  }
  async function editUserName() {
    setShowNameInput(false);
    if (!nameRef.current) return;
    if (!nameRef.current.textContent) return;
    dispatch({
      type: UserInfoActions.EDIT_USER_NAME,
      payload: { userName: nameRef.current.textContent },
    });
    await firebase.updateUserName(id!, nameRef.current.textContent);
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
        <>
          <IconButtonLabel htmlFor="upload">
            <StyledFontAwesomeIcon icon={faPenToSquare} />
          </IconButtonLabel>
          <input
            id="upload"
            type="file"
            accept="image/*"
            ref={photoRef}
            onChange={editUserPhoto}
            hidden
          />
        </>
      )}
      <UserInfoText
        contentEditable={showNameInput}
        ref={nameRef}
        onKeyPress={(e) => {
          if (e.key === "Enter") editUserName();
        }}
        onBlur={() => setShowNameInput(false)}
      >
        {userData?.userName}
      </UserInfoText>
      {isSelf && (
        <NameButtonLabel
          htmlFor="nameInput"
          onClick={() => {
            setShowNameInput(true);
            nameRef.current?.focus();
          }}
        >
          <StyledFontAwesomeIcon icon={faPenToSquare} />
        </NameButtonLabel>
      )}
      {!isSelf && !isFollowed && (
        <UserInfoBtn onClick={followStatusToggle}>Follow</UserInfoBtn>
      )}
      {!isSelf && isFollowed && (
        <UserInfoBtn onClick={followStatusToggle}>Unfollow</UserInfoBtn>
      )}
      {isSelf && <UserInfoBtn onClick={userSignOut}>Log Out</UserInfoBtn>}
    </UserInfoWrapper>
  );
};

export default UserInfoSection;
