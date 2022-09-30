import React from "react";
import { useSelector, useDispatch } from "react-redux";
import styled from "styled-components";
import { RootState } from "../../store/reducer";
import Chatroom from "./Chatroom";

const ChatroomFlexWrapper = styled.div`
  position: fixed;
  bottom: 1px;
  right: 60px;
  display: flex;
  flex-wrap: wrap;
  flex-direction: row-reverse;
  z-index: 99;
`;

const ChatroomsWrapper = () => {
  const dispatch = useDispatch();
  const userInfo = useSelector((state: RootState) => state.userInfo);
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
