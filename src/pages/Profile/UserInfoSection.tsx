import React from "react";
import styled from "styled-components";

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
const EditButton = styled.button`
  height: 20px;
  margin-right: 5px;
`;

const UserInfoSection = () => {
  return (
    <UserInfoWrapper>
      <UserPhoto />
      <EditButton>編輯相片</EditButton>
      <UserInfoText>User Name</UserInfoText>
      <EditButton>編輯姓名</EditButton>
    </UserInfoWrapper>
  );
};

export default UserInfoSection;
