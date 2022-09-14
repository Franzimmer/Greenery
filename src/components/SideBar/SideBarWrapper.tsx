import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import styled from "styled-components";
import { firebase, db } from "../../utils/firebase";
import { onSnapshot, query, collection, orderBy } from "firebase/firestore";
import FollowList from "./FollowList";
import Notifications from "./Notifications";
import Chatrooms from "./Chatrooms";
import { RootState } from "../../reducer";
import { UserInfo } from "../../types/userInfoType";
import { Note } from "../../types/notificationType";
import { NotificationActions } from "../../actions/notificationActions";
import { myFollowersActions } from "../../reducer/myFollowersReducer";
interface WrapperProps {
  show: boolean;
}
const Wrapper = styled.div<WrapperProps>`
  width: 20vw;
  height: calc(100vh - 42px);
  position: fixed;
  right: 0;
  border: 1px solid #000;
  display: ${(props) => (props.show ? "blocks" : "none")};
`;
const Tabs = styled.div`
  display: flex;
  algn-items: center;
`;
const Tab = styled.div`
  font-weight: 700;
  font-size: 14px;
  margin-right: 8px;
  border-bottom: 2px solid #000;
  cursor: pointer;
  background: #eee;
  &:hover {
    background: #000;
    color: #fff;
  }
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
        <Tab onClick={() => tabSwitch("FollowList")}>Follow List</Tab>
        <Tab onClick={() => tabSwitch("Notifications")}>Notifications</Tab>
        <Tab onClick={() => tabSwitch("Chatrooms")}>Chatrooms</Tab>
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
