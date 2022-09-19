import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBell,
  faUser,
  faCommentDots,
} from "@fortawesome/free-solid-svg-icons";
import { firebase, db } from "../../utils/firebase";
import { onSnapshot, query, collection, orderBy } from "firebase/firestore";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../reducer";
import { UserInfo } from "../../types/userInfoType";
import { Note } from "../../types/notificationType";
import { NotificationActions } from "../../actions/notificationActions";
import { myFollowersActions } from "../../reducer/myFollowersReducer";
import FollowList from "./FollowList";
import Notifications from "./Notifications";
import Chatrooms from "./Chatrooms";

interface WrapperProps {
  show: boolean;
}
const Wrapper = styled.div<WrapperProps>`
  width: ${(props) => (props.show ? "300px" : "0px")};
  max-height: ${(props) => (props.show ? "calc(100vh -42px)" : 0)};
  background: rgba(255, 255, 255);
  border: 1px solid #5c836f;
  border-radius: 20px;
  margin-top: 100px;
  position: fixed;
  z-index: 2;
  top: 0px;
  right: 10px;
  display: ${(props) => !props.show && "none"};
  transition: 0.5s max-height ease-in;
`;
const Tabs = styled.div`
  width: auto;
  display: flex;
  align-items: center;
  justify-content: space-around;
  border-radius: 20px 20px 0 0;
  position: relative;
  border-bottom: 1px solid #5c836f;
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
  border: 1px solid #5c836f;
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
  color: ${(props) => (props.$tab ? "#5c836f" : "#aaa")};
  height: 25px;
`;
const SidebarWrapper = ({ sideBarDisplay }: { sideBarDisplay: boolean }) => {
  const userInfo = useSelector((state: RootState) => state.userInfo);
  const notices = useSelector((state: RootState) => state.notifications);
  const [followInfos, setFollowInfos] = useState<UserInfo[]>([]);
  const dispatch = useDispatch();
  const defaltState = {
    FollowList: true,
    Notifications: false,
    Chatrooms: false,
  };
  const [tab, setTab] = useState(defaltState);
  function tabSwitch(tab: "FollowList" | "Notifications" | "Chatrooms") {
    let newState = {
      FollowList: false,
      Notifications: false,
      Chatrooms: false,
    };
    newState[tab] = true;
    setTab(newState);
  }

  useEffect(() => {
    async function getUsersData() {
      let followData: UserInfo[] = [];
      if (!userInfo.followList) return;
      let queryData = await firebase.getUsers(userInfo.followList);
      if (!queryData?.empty) {
        queryData?.forEach((doc) => {
          followData.push(doc.data());
        });
        setFollowInfos(followData);
      }
    }
    async function listenToNotices() {
      if (!userInfo.userId) return;
      let noticeCol = collection(db, "users", userInfo.userId, "notices");
      const q = query(noticeCol, orderBy("time", "desc"));
      onSnapshot(q, (querySnapshot) => {
        let noticeData: Note[] = [];
        querySnapshot.forEach((doc) => {
          if (doc.id !== "followers") noticeData.push(doc.data() as Note);
          else
            dispatch({
              type: myFollowersActions.SET_FOLLOWERS,
              payload: { followers: doc.data().followers },
            });
        });
        dispatch({
          type: NotificationActions.SET_NOTIFICATIONS,
          payload: { data: noticeData },
        });
      });
    }
    listenToNotices();
    getUsersData();
  }, [userInfo]);
  return (
    <Wrapper show={sideBarDisplay}>
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
