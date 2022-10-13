import React, { useState } from "react";
import styled from "styled-components";
import { useSelector } from "react-redux";
import { ChatroomType } from "../../store/types/chatroomType";
import { RootState } from "../../store/reducer";
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
  const chatInfos = useSelector(
    (state: RootState) => state.chatroom
  ) as ChatroomType[];
  const [activeChatrooms, setActiveChatrooms] = useState<ChatroomType[]>([]);
  return (
    <ChatroomFlexWrapper>
      {chatInfos?.map((room) => {
        if (room.chatroomDisplay)
          return (
            <Chatroom
              key={`${room.targetInfo.userId}_chat`}
              chatInfo={room}
              activeChatrooms={activeChatrooms}
              setActiveChatrooms={setActiveChatrooms}
            />
          );
      })}
    </ChatroomFlexWrapper>
  );
};

export default ChatroomsWrapper;
