import React, { useEffect } from "react";
import styled from "styled-components";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../store/reducer";
import { UserInfo } from "../../store/types/userInfoType";
import { ChatroomActions } from "../../store/actions/chatroomActions";
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
  const dispatch = useDispatch();
  const chatRooms = useSelector((state: RootState) => state.chatrooms);
  useEffect(() => {
    function resizeChatroomsWrapper() {
      const width = window.innerWidth;
      if (width <= 1150 && width > 800) {
        dispatch({
          type: ChatroomActions.RESIZE_ROOMS,
        });
      } else if (width <= 800 && width > 500) {
        dispatch({
          type: ChatroomActions.RESIZE_ROOMS,
        });
      }
    }
    window.addEventListener("resize", () => resizeChatroomsWrapper);
    return () =>
      window.removeEventListener("resize", () => resizeChatroomsWrapper);
  }, []);
  return (
    <ChatroomFlexWrapper>
      {chatRooms?.activeRooms?.map((room: UserInfo) => {
        return <Chatroom key={`${room.userId}_chat`} chatInfo={room} />;
      })}
    </ChatroomFlexWrapper>
  );
};

export default ChatroomsWrapper;
