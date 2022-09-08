import React from "react";
import styled from "styled-components";
import { signOut } from "firebase/auth";
import { auth } from "../../utils/firebase";
import { useNavigate } from "react-router-dom";
import { OperationBtn } from "./cards/CardsGrid";

const UserInfoWrapper = styled.div`
  display: flex;
  align-items: flex-end;
  padding-bottom: 10px;
  border-bottom: 1px solid black;
  margin-bottom: 20px;
`;

const UserPhoto = styled.img`
  width: 200px;
  height: 200px;
  border-radius: 50%;
  border: 1px solid black;
`;
const UserInfoText = styled.p``;

const UserInfoSection = () => {
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
  return (
    <UserInfoWrapper>
      <UserPhoto />
      <OperationBtn>編輯相片</OperationBtn>
      <UserInfoText>User Name</UserInfoText>
      <OperationBtn>編輯姓名</OperationBtn>
      <OperationBtn onClick={userSignOut}>登出</OperationBtn>
    </UserInfoWrapper>
  );
};

export default UserInfoSection;
