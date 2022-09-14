import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { UserPhoto } from "../../pages/Profile/UserInfoSection";
import { RootState } from "../../reducer";
import { UserInfo } from "../../types/userInfoType";
import { firebase } from "../../utils/firebase";
const ListWrapper = styled.div`
  width: 100%;
  overflow-y: auto;
  padding: 8px;
`;
export const Person = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
`;
export const PersonPhoto = styled(UserPhoto)`
  width: 60px;
  height: 60px;
  margin-right: 8px;
`;

export const PersonText = styled.p``;
const FollowList = ({ followInfos }: { followInfos: UserInfo[] }) => {
  const userInfo = useSelector((state: RootState) => state.userInfo);
  const navigate = useNavigate();

  return (
    <ListWrapper>
      {userInfo.followList?.length !== 0 &&
        followInfos?.map((user) => {
          return (
            <Person
              onClick={() => navigate(`/profile/${user.userId}`)}
              key={`${user.userId}`}
            >
              <PersonPhoto path={user.photoUrl} />
              <PersonText>{user.userName}</PersonText>
            </Person>
          );
        })}
    </ListWrapper>
  );
};

export default FollowList;
