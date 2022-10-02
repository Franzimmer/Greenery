import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import styled, { keyframes } from "styled-components";
import { RootState } from "../../store/reducer";
import { firebase } from "../../utils/firebase";
import { Person, PersonPhoto } from "./FollowList";
import { UserInfo } from "../../store/types/userInfoType";
import { ChatroomActions } from "../../store/reducer/chatroomReducer";
import { NoSidebarDataText } from "./FollowList";
import spinner50 from "../../assets/spinner50.png";
const ChatroomsWrapper = styled.div`
  width: 100%;
  height: 550px;
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
  const dispatch = useDispatch();
  const userInfo = useSelector((state: RootState) => state.userInfo);
  const chatInfos = useSelector((state: RootState) => state.chatroom);
  const [spinDisplay, setSpinDisplay] = useState<boolean>(true);

  useEffect(() => {
    async function getChatTargets() {
      let targetList: string[] = [];
      let chatData: UserInfo[] = [];

      let chatrooms = await firebase.getChatrooms(userInfo.userId);
      if (!chatrooms.empty) {
        chatrooms.forEach((chat) => {
          let chatData = chat.data();
          let targetId = chatData.users.filter(
            (user: string) => user !== userInfo.userId
          );
          targetList.push(targetId[0]);
        });
      }
      let queryData = await firebase.getUsers(targetList);
      queryData?.forEach((doc) => {
        chatData.push(doc.data());
      });

      setTimeout(() => {
        setSpinDisplay(false);
        dispatch({
          type: ChatroomActions.SET_CHATROOMDATA,
          payload: { targetInfos: chatData },
        });
      }, 500);
    }
    getChatTargets();
  }, [userInfo.userId]);
  return (
    <>
      <ChatroomsWrapper>
        <Spinner $show={spinDisplay} />
        {chatInfos &&
          !spinDisplay &&
          chatInfos?.length !== 0 &&
          chatInfos?.map((room) => {
            return (
              <Person
                key={`${room.targetInfo.userId}_chat`}
                onClick={() =>
                  dispatch({
                    type: ChatroomActions.OPEN_CHATROOM,
                    payload: { targetId: room.targetInfo.userId },
                  })
                }
              >
                <PersonPhoto path={room.targetInfo?.photoUrl} />
                <ChatroomText>with {room.targetInfo?.userName}</ChatroomText>
              </Person>
            );
          })}
        {chatInfos?.length === 0 && !spinDisplay && (
          <NoSidebarDataText>No chatroom history</NoSidebarDataText>
        )}
      </ChatroomsWrapper>
    </>
  );
};

export default Chatrooms;
