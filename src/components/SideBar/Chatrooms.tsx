import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import styled from "styled-components";
import { RootState } from "../../reducer";
import { firebase } from "../../utils/firebase";
import { Person, PersonPhoto } from "./FollowList";
import { UserInfo } from "../../types/userInfoType";
import Chatroom from "./Chatroom/Chatroom";
const ChatroomsWrapper = styled.div`
  width: 100%;
  max-height: calc(100vh - 42px);
  overflow-y: auto;
  padding: 8px;
  border-radius: 20px;
  display: flex;
  justify-content: flex-start;
  background-color: #fff;
  & * {
    background-color: #fff;
  }
`;
const ChatroomText = styled.p`
  font-size: normal;
  color: #6a5125;
  background: none;
`;
const Chatrooms = () => {
  const userInfo = useSelector((state: RootState) => state.userInfo);
  const [chatInfos, setChatInfos] = useState<UserInfo[]>([]);
  const [chatroomDisplay, setChatroomDisplay] = useState<
    Record<string, boolean>
  >({});

  function toggleChatroom(targetId: string) {
    let newChatDisplay = { ...chatroomDisplay };
    if (newChatDisplay[targetId]) newChatDisplay[targetId] = false;
    else if (!newChatDisplay[targetId]) newChatDisplay[targetId] = true;
    setChatroomDisplay(newChatDisplay);
  }
  useEffect(() => {
    async function getChatTargets() {
      let targetList: string[] = [];
      let chatData: UserInfo[] = [];
      let chatDisplay: Record<string, boolean> = {};
      let chatrooms = await firebase.getChatrooms(userInfo.userId);
      if (!chatrooms.empty) {
        chatrooms.forEach((chat) => {
          let chatData = chat.data();
          let targetId = chatData.users.filter(
            (user: string) => user !== userInfo.userId
          );
          targetList.push(targetId[0]);
          chatDisplay[targetId[0]] = false;
        });
      } else return;
      let queryData = await firebase.getUsers(targetList);
      queryData?.forEach((doc) => {
        chatData.push(doc.data());
      });
      setChatInfos(chatData);
      setChatroomDisplay(chatDisplay);
    }
    getChatTargets();
  }, []);
  return (
    <>
      <ChatroomsWrapper>
        {chatInfos &&
          chatInfos?.length !== 0 &&
          chatInfos?.map((chat) => {
            return (
              <Person
                key={`${chat.userId}_chat`}
                onClick={() => toggleChatroom(chat.userId)}
              >
                <PersonPhoto path={chat.photoUrl} />
                <ChatroomText>Chatroom with {chat.userName}</ChatroomText>
              </Person>
            );
          })}
      </ChatroomsWrapper>
      {chatInfos.map((user) => {
        return (
          <Chatroom
            key={`${user.userId}_chat`}
            targetInfo={user}
            chatroomDisplay={chatroomDisplay[user.userId]}
            toggleChatroom={toggleChatroom}
          />
        );
      })}
    </>
  );
};

export default Chatrooms;
