import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import styled from "styled-components";
import { RootState } from "../../reducer";
import { chatrooms, firebase } from "../../utils/firebase";
import { Person, PersonPhoto, PersonText } from "./FollowList";
import { UserInfo } from "../../types/userInfoType";
import Chatroom from "./Chatroom/Chatroom";
const ChatroomsWrapper = styled.div`
  width: 100%;
  overflow-y: auto;
  padding: 8px;
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
    if (!newChatDisplay[targetId]) newChatDisplay[targetId] = true;
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
  console.log(chatroomDisplay);
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
                <PersonText>{chat.userName}的聊天室</PersonText>
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
