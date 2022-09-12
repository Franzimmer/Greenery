import React, { useState } from "react";
import styled from "styled-components";
import FollowList from "./FollowList";

const Wrapper = styled.div`
  width: 20vw;
  height: 100vw;
  position: fixed;
  right: 0;
  border: 1px solid #000;
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

const SidebarWrapper = () => {
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
  return (
    <Wrapper>
      <Tabs>
        <Tab onClick={() => tabSwitch("FollowList")}>Follow List</Tab>
        <Tab onClick={() => tabSwitch("Notifications")}>Notifications</Tab>
        <Tab onClick={() => tabSwitch("Chatrooms")}>Chatrooms</Tab>
      </Tabs>
      {tab.FollowList && <FollowList></FollowList>}
    </Wrapper>
  );
};

export default SidebarWrapper;
