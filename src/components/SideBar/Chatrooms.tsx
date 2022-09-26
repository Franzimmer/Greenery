import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import styled, { keyframes } from "styled-components";
import { RootState } from "../../store/reducer";
import { firebase } from "../../utils/firebase";
import { Person, PersonPhoto } from "./FollowList";
import { UserInfo } from "../../store/types/userInfoType";
import { NoSidebarDataText } from "./FollowList";
import Chatroom from "../../components/Chatroom/Chatroom";
import spinner50 from "../../assets/spinner50.png";
const ChatroomsWrapper = styled.div`
  width: 100%;
  max-height: calc(100vh - 42px);
  overflow-y: auto;
  padding: 8px 12px;
  border-radius: 20px;
  display: flex;
  flex-direction: column;
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
const Spin = keyframes`
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
`;
interface SpinnerProps {
  $show: boolean;
}
const Spinner = styled.div<SpinnerProps>`
  display: ${(props) => (props.$show ? "block" : "none")};
  width: 50px;
  height: 50px;
  margin: 0 auto;
  background: url(${spinner50});
  animation: 2s ${Spin} linear infinite;
`;
export const ChatroomFlexWrapper = styled.div`
  position: fixed;
  bottom: 1px;
  right: 60px;
  display: flex;
  flex-wrap: wrap;
  flex-direction: row-reverse;
`;
const Chatrooms = () => {
  const userInfo = useSelector((state: RootState) => state.userInfo);
  const [chatInfos, setChatInfos] = useState<UserInfo[]>([]);
  const [chatroomDisplay, setChatroomDisplay] = useState<
    Record<string, boolean>
  >({});
  const [spinDisplay, setSpinDisplay] = useState<boolean>(true);

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
      } else {
        setTimeout(() => setSpinDisplay(false), 500);
      }
      let queryData = await firebase.getUsers(targetList);
      queryData?.forEach((doc) => {
        chatData.push(doc.data());
      });
      setTimeout(() => {
        setSpinDisplay(false);
        setChatInfos(chatData);
        setChatroomDisplay(chatDisplay);
      }, 500);
    }
    getChatTargets();
  }, []);
  return (
    <>
      <ChatroomsWrapper>
        <Spinner $show={spinDisplay} />
        {chatInfos &&
          chatInfos?.length !== 0 &&
          chatInfos?.map((chat) => {
            return (
              <Person
                key={`${chat.userId}_chat`}
                onClick={() => toggleChatroom(chat.userId)}
              >
                <PersonPhoto path={chat.photoUrl} />
                <ChatroomText>with {chat.userName}</ChatroomText>
              </Person>
            );
          })}
        {chatInfos?.length === 0 && !spinDisplay && (
          <NoSidebarDataText>No chatroom history</NoSidebarDataText>
        )}
      </ChatroomsWrapper>
      <ChatroomFlexWrapper>
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
      </ChatroomFlexWrapper>
    </>
  );
};

export default Chatrooms;
