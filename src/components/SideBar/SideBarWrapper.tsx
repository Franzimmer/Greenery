import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useSelector } from "react-redux";
import { RootState } from "../../store/reducer";
import { UserInfo } from "../../store/types/userInfoType";
import { firebase } from "../../utils/firebase";
import FollowList from "./FollowList";
import Notifications from "./Notifications";
import Chatrooms from "./Chatrooms";
import {
  faBell,
  faUser,
  faCommentDots,
} from "@fortawesome/free-solid-svg-icons";

interface WrapperProps {
  $show: boolean;
}
const Wrapper = styled.div<WrapperProps>`
  width: ${(props) => (props.$show ? "300px" : "0px")};
  max-height: ${(props) => (props.$show ? "1000px" : 0)};
  background: rgba(255, 255, 255);
  border: 1px solid ${(props) => props.theme.colors.main};
  border-radius: 20px;
  margin-top: 112px;
  position: fixed;
  z-index: 3;
  top: 0px;
  right: 10px;
  opacity: ${(props) => (!props.$show ? "0" : "1")};
  transition: 0.5s max-height ease-in;
  & * {
    max-height: ${(props) => (props.$show ? "1000px" : 0)};
    transition: 0.5s max-height ease-in;
  }
`;
const Tabs = styled.div`
  width: auto;
  display: flex;
  align-items: center;
  justify-content: space-around;
  border-radius: 20px 20px 0 0;
  position: relative;
  border-bottom: 1px solid ${(props) => props.theme.colors.main};
  background-color: #fff;
  & * {
    background-color: #fff;
  }
`;
const Tab = styled(Tabs)`
  width: 50px;
  height: 50px;
  cursor: pointer;
  margin: 8px 0px;
  border-radius: 50%;
  border: 1px solid ${(props) => props.theme.colors.main};
  &:hover {
    border: 1px solid #7bc09a;
    box-shadow: 0 0 10px #ddd;
  }
`;
interface StyledFontAwesomeIconProps {
  $tab: boolean;
}
const StyledFontAwesomeIcon = styled(FontAwesomeIcon)<
  StyledFontAwesomeIconProps
>`
  background: none;
  ${Tab}:hover & {
    color: #7bc09a;
  }
  color: ${(props) => (props.$tab ? props.theme.colors.main : "#aaa")};
  height: 25px;
`;
interface SidebarWrapperProps {
  sideBarDisplay: boolean;
}
const SidebarWrapper = ({ sideBarDisplay }: SidebarWrapperProps) => {
  const { isLoggedIn } = useSelector((state: RootState) => state.authority);
  const userInfo = useSelector((state: RootState) => state.userInfo);
  const notices = useSelector((state: RootState) => state.notifications);
  const [followInfos, setFollowInfos] = useState<UserInfo[]>([]);

  const defaultState = {
    FollowList: true,
    Notifications: false,
    Chatrooms: false,
  };
  const [tab, setTab] = useState(defaultState);
  function tabSwitch(tab: "FollowList" | "Notifications" | "Chatrooms") {
    const newState = {
      FollowList: false,
      Notifications: false,
      Chatrooms: false,
    };
    newState[tab] = true;
    setTab(newState);
  }

  useEffect(() => {
    async function getUsersData() {
      const followData: UserInfo[] = [];
      if (!userInfo.followList) return;
      const queryData = await firebase.getUsers(userInfo.followList);
      if (!queryData?.empty) {
        queryData?.forEach((doc) => {
          followData.push(doc.data());
        });
        setFollowInfos(followData);
      }
    }
    getUsersData();
  }, [userInfo.followList]);
  useEffect(() => {
    if (!userInfo.userId) setTab(defaultState);
  }, [userInfo.userId]);
  return (
    <Wrapper $show={isLoggedIn && sideBarDisplay}>
      <Tabs>
        <Tab onClick={() => tabSwitch("FollowList")}>
          <StyledFontAwesomeIcon icon={faUser} $tab={tab["FollowList"]} />
        </Tab>
        <Tab onClick={() => tabSwitch("Notifications")}>
          <StyledFontAwesomeIcon icon={faBell} $tab={tab["Notifications"]} />
        </Tab>
        <Tab onClick={() => tabSwitch("Chatrooms")}>
          <StyledFontAwesomeIcon icon={faCommentDots} $tab={tab["Chatrooms"]} />
        </Tab>
      </Tabs>
      {tab.FollowList && <FollowList followInfos={followInfos!}></FollowList>}
      {tab.Notifications && (
        <Notifications
          notices={notices}
          followInfos={followInfos}
        ></Notifications>
      )}
      {tab.Chatrooms && <Chatrooms></Chatrooms>}
    </Wrapper>
  );
};

export default SidebarWrapper;
