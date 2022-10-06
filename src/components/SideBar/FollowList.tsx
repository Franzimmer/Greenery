import React from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { UserPhoto } from "../../pages/Profile/UserInfoSection";
import { RootState } from "../../store/reducer";
import { UserInfo } from "../../store/types/userInfoType";
import { NoDataText } from "../GlobalStyles/noDataLayout";
const ListWrapper = styled.div`
  width: 100%;
  height: 300px;
  overflow-y: auto;
  padding: 8px;
  border-radius: 20px;
  background: rgba(255, 255, 255);
  & * {
    background-color: rgba(255, 255, 255);
  }
`;
export const Person = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  cursor: pointer;
  margin: 8px 0;
`;
export const PersonPhoto = styled(UserPhoto)`
  width: 60px;
  height: 60px;
  margin: 0px 8px 0px 14px;
  transition: 0.25s;
  ${Person}:hover & {
    margin-left: 30px;
    transition: 0.25s;
  }
`;
const PersonText = styled.p`
  font-size: normal;
  letter-spacing: 1px;
  color: #6a5125;
`;
const StyleWrapper = styled.div`
  display: flex;
  align-items: center;
`;
export const NoSidebarDataText = styled(NoDataText)`
  padding: 14px 22px;
  color: #aaa;
`;
const FollowList = ({ followInfos }: { followInfos: UserInfo[] }) => {
  const { followList } = useSelector((state: RootState) => state.userInfo);
  const navigate = useNavigate();
  return (
    <ListWrapper>
      {followList?.length !== 0 &&
        followInfos?.map((user) => {
          return (
            <Person
              onClick={() => navigate(`/profile/${user.userId}`)}
              key={`${user.userId}`}
            >
              <StyleWrapper>
                <PersonPhoto path={user.photoUrl} />
                <PersonText>{user.userName}</PersonText>
              </StyleWrapper>
            </Person>
          );
        })}
      {followList.length === 0 && (
        <NoSidebarDataText>You haven't follow anyone.</NoSidebarDataText>
      )}
    </ListWrapper>
  );
};

export default FollowList;
