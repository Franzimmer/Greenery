import React from "react";
import styled from "styled-components";
import { useSelector } from "react-redux";
import { RootState } from "../../store/reducer";
import { UserInfo } from "../../store/types/userInfoType";
import Chatroom from "./Chatroom";

const ChatroomFlexWrapper = styled.div`
  position: fixed;
  bottom: 0px;
  right: 60px;
  display: flex;
  flex-wrap: nowrap;
  flex-direction: row-reverse;
  z-index: 2;
  @media (max-width: 450px) {
    right: 0;
  }
`;

const ChatroomsWrapper = () => {
  const chatRooms = useSelector((state: RootState) => state.chatrooms);

  return (
    <ChatroomFlexWrapper>
      {chatRooms?.activeRooms?.map((room: UserInfo) => {
        return <Chatroom key={`${room.userId}_chat`} chatInfo={room} />;
      })}
    </ChatroomFlexWrapper>
  );
};

export default ChatroomsWrapper;
