import React from "react";
import styled from "styled-components";
import { useSelector } from "react-redux";
import { RootState } from "../../store/reducer";
import Chatroom from "./Chatroom";

const ChatroomFlexWrapper = styled.div`
  position: fixed;
  bottom: 1px;
  right: 60px;
  display: flex;
  flex-wrap: nowrap;
  flex-direction: row-reverse;
  z-index: 2;
`;

const ChatroomsWrapper = () => {
  const chatInfos = useSelector((state: RootState) => state.chatroom);
  return (
    <ChatroomFlexWrapper>
      {chatInfos?.map((room) => {
        return (
          <Chatroom
            key={`${room.targetInfo.userId}_chat`}
            targetInfo={room.targetInfo}
            chatroomDisplay={room.chatroomDisplay}
          />
        );
      })}
    </ChatroomFlexWrapper>
  );
};

export default ChatroomsWrapper;
