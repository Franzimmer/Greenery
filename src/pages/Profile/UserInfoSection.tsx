import React, { useState, useEffect, useRef } from "react";
import styled, { css, keyframes } from "styled-components";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { RootState } from "../../store/reducer/index";
import { UserInfoActions } from "../../store/actions/userInfoActions";
import { ChatroomActions } from "../../store/actions/chatroomActions";
import { UserInfo } from "../../store/types/userInfoType";
import { auth, firebase } from "../../utils/firebase";
import { useAlertDispatcher } from "../../utils/useAlertDispatcher";
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons";
import { OperationBtn, IconButton } from "../../components/GlobalStyles/button";
import user from "../../assets/user.png";

const UserInfoWrapper = styled.div`
  display: flex;
  align-items: center;
  padding-bottom: 10px;
  margin-bottom: 20px;
  @media (max-width: 430px) {
    flex-direction: column;
  }
`;
interface UserPhotoProps {
  $path: string | undefined;
}
export const UserPhoto = styled.div<UserPhotoProps>`
  width: 150px;
  height: 150px;
  border-radius: 50%;
  background-image: url(${(props) => (props.$path ? props.$path : user)});
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center center;
  @media (max-width: 650px) {
    width: 120px;
    height: 120px;
  }
  @media (max-width: 530px) {
    width: 100px;
    height: 100px;
  }
  @media (max-width: 430px) {
    width: 150px;
    height: 150px;
  }
`;
const UserInfoText = styled.div`
  color: ${(props) => props.theme.colors.button};
  padding: 0px 10px;
  font-size: 26px;
  font-weight: 600;
  &:focus {
    background: #fff;
  }
  @media (max-width: 800px) {
    font-weight: 500;
  }
  @media (max-width: 650px) {
    font-size: 20px;
  }
  @media (max-width: 530px) {
    font-size: 16px;
  }
  @media (max-width: 430px) {
    font-size: 20px;
    font-weight: 500;
  }
`;
const IconButtonLabel = styled(IconButton)`
  cursor: pointer;
  position: relative;
  top: 60px;
  left: -20px;
  transition: 0.25s;
  &:hover {
    transform: scale(1.1);
    transition: 0.25s;
  }
  @media (max-width: 650px) {
    top: 45px;
  }
  @media (max-width: 430px) {
    top: -10px;
    right: -60px;
    left: auto;
  }
`;
const NameButtonLabel = styled(IconButtonLabel)`
  padding: 10px;
  top: 0px;
  left: 5px;
  @media (max-width: 650px) {
    left: 0px;
  }
`;
const UserInfoBtn = styled(OperationBtn)`
  margin: 10px 0 0 40px;
  transition: 0.5s;
  &:hover {
    transform: scale(1.1);
    transition: 0.5s;
  }
  @media (max-width: 850px) {
    margin: 10px 0 0 10px;
  }
  @media (max-width: 650px) {
    font-size: 12px;
    height: 24px;
    border-radius: 12px;
    padding: 0px 10px;
  }
  @media (max-width: 430px) {
    margin: 10px auto 0 auto;
  }
`;
const StyledFontAwesomeIcon = styled(FontAwesomeIcon)`
  background-color: rgba(0, 0, 0, 0);
  color: ${(props) => props.theme.colors.main};
  height: 25px;
  @media (max-width: 650px) {
    height: 20px;
  }
`;
const NameWrapper = styled.div``;
interface FloatMsgProps {
  $show: boolean;
}
const showFloat = keyframes`
  from {
    max-height:0;
    opacity: 0;
  }
  to {
    max-height:100px;
    opacity: 1;
  }
`;
const showMixin = css`
  ${showFloat} 1s ease-in forwards
`;

const FloatMsg = styled.div<FloatMsgProps>`
  padding: 0px 10px;
  font-size: 14px;
  color: #aaa;
  opacity: 0;
  max-height: 0;
  animation: ${(props) => props.$show && showMixin};
`;
const FlexWrapper = styled.div`
  display: flex;
  align-items: center;
  width: fit-content;
  margin: 10px auto 0;
  @media (max-width: 850px) {
    margin: 0;
  }
`;
const MobileFlexWrapper = styled.div`
  display: flex;
  @media (max-width: 850px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;
interface UserInfoProps {
  id: string | undefined;
}
const UserInfoSection = ({ id }: UserInfoProps) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const alertDispatcher = useAlertDispatcher();
  const photoRef = useRef<HTMLInputElement>(null);
  const nameRef = useRef<HTMLInputElement>(null);
  const { isLoggedIn, isSelf } = useSelector(
    (state: RootState) => state.authority
  );
  const userInfo = useSelector((state: RootState) => state.userInfo);
  const [userData, setUserData] = useState<UserInfo>();
  const [showNameInput, setShowNameInput] = useState<boolean>(false);
  const [isFollowed, setIsFollowed] = useState<boolean>(false);
  function userSignOut() {
    dispatch({
      type: ChatroomActions.CLOSE_ALL_ROOMS,
    });
    signOut(auth)
      .then(() => {
        navigate("/login");
        alertDispatcher("success", "Log Out Success !");
      })
      .catch((error) => {
        const errorMessage = error.message;
        alertDispatcher("fail", `${errorMessage}`);
      });
  }
  async function editUserPhoto() {
    if (!photoRef.current) return;
    if (photoRef.current.files!.length === 0) return;
    const link = await firebase.uploadFile(photoRef.current.files![0]);
    photoRef.current.value = "";
    dispatch({
      type: UserInfoActions.EDIT_USER_PHOTO,
      payload: { photoUrl: link },
    });
    await firebase.updateUserPhoto(id!, link);
    alertDispatcher("success", "User Photo Upload Success !");
  }
  async function editUserName() {
    setShowNameInput(false);
    if (!nameRef.current) return;
    if (!nameRef.current.textContent) {
      nameRef.current.textContent = userInfo.userName;
      return;
    }
    let nameInput = nameRef.current.textContent;
    if (nameInput.length > 20) {
      nameInput = nameInput.substring(0, 20);
    }
    nameRef.current.textContent = nameInput;
    dispatch({
      type: UserInfoActions.EDIT_USER_NAME,
      payload: { userName: nameInput },
    });
    await firebase.updateUserName(id!, nameRef.current.textContent);
    alertDispatcher("success", "Edit Success !");
  }
  async function followStatusToggle() {
    if (isFollowed) {
      setIsFollowed(false);
      await firebase.removeFollowList(userInfo.userId, id!);
      alertDispatcher("success", "Unfollow Success.");
      dispatch({
        type: UserInfoActions.REMOVE_FOLLOW_LIST,
        payload: { targetId: id },
      });
    }
    if (!isFollowed) {
      setIsFollowed(true);
      await firebase.addFollowList(userInfo.userId, id!);
      alertDispatcher("success", "Follow Success.");
      dispatch({
        type: UserInfoActions.ADD_FOLLOW_LIST,
        payload: { targetId: id },
      });
    }
  }
  useEffect(() => {
    async function getUserInfo() {
      if (id && !isSelf) {
        const result = await firebase.getUserInfo(id);
        if (!result.exists()) {
          alertDispatcher("fail", "Page Not Exist.");
          navigate("/");
        }
        setUserData(result.data() as UserInfo);
        userInfo.followList?.includes(id)
          ? setIsFollowed(true)
          : setIsFollowed(false);
      } else if (id && isSelf) {
        setUserData(userInfo);
      }
    }
    getUserInfo();
  }, [id, isSelf]);
  useEffect(() => {
    if (id && isSelf) setUserData(userInfo);
  }, [id, userInfo, isSelf]);
  useEffect(() => {
    if (showNameInput) nameRef.current?.focus();
  }, [showNameInput]);
  return (
    <UserInfoWrapper>
      <UserPhoto $path={userData?.photoUrl} />
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
      <MobileFlexWrapper>
        <NameWrapper>
          <FloatMsg $show={showNameInput}>Enter 1-20 character(s)</FloatMsg>
          <FlexWrapper>
            <UserInfoText
              contentEditable={showNameInput}
              ref={nameRef}
              onKeyPress={(e) => {
                if (e.key === "Enter") editUserName();
              }}
              onBlur={() => {
                if (nameRef.current?.textContent !== userInfo.userName)
                  editUserName();
                else setShowNameInput(false);
              }}
            >
              {userData?.userName}
            </UserInfoText>
            {isSelf && (
              <NameButtonLabel
                htmlFor="nameInput"
                onClick={() => setShowNameInput(true)}
              >
                <StyledFontAwesomeIcon icon={faPenToSquare} />
              </NameButtonLabel>
            )}
          </FlexWrapper>
        </NameWrapper>
        {isLoggedIn && !isSelf && !isFollowed && (
          <UserInfoBtn onClick={followStatusToggle}>Follow</UserInfoBtn>
        )}
        {isLoggedIn && !isSelf && isFollowed && (
          <UserInfoBtn onClick={followStatusToggle}>Unfollow</UserInfoBtn>
        )}
        {isSelf && <UserInfoBtn onClick={userSignOut}>Log Out</UserInfoBtn>}
      </MobileFlexWrapper>
    </UserInfoWrapper>
  );
};

export default UserInfoSection;
