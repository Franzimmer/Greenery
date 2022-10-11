import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import styled, { keyframes } from "styled-components";
import { RootState } from "../../store/reducer";
import { ChatroomType } from "../../store/types/chatroomType";
import { ChatroomActions } from "../../store/actions/chatroomActions";
import { UserInfo } from "../../store/types/userInfoType";
import { firebase } from "../../utils/firebase";
import { Person, PersonPhoto, NoSidebarDataText } from "./FollowList";
import spinner50 from "../../assets/spinner50.png";
const ChatroomsWrapper = styled.div`
  width: 100%;
  height: 300px;
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
  color: ${(props) => props.theme.colors.button};
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
  margin: 117px auto;
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
  const { isLoggedIn } = useSelector((state: RootState) => state.authority);
  const { userId } = useSelector((state: RootState) => state.userInfo);
  const chatInfos = useSelector(
    (state: RootState) => state.chatroom
  ) as ChatroomType[];
  const [spinDisplay, setSpinDisplay] = useState<boolean>(true);

  useEffect(() => {
    async function getChatTargets() {
      if (!userId) return;
      const targetList: string[] = [];
      const chatData: UserInfo[] = [];
      const chatrooms = await firebase.getChatrooms(userId);
      if (!chatrooms.empty) {
        chatrooms.forEach((chat) => {
          const chatData = chat.data();
          const targetId = chatData.users.filter(
            (user: string) => user !== userId
          );
          targetList.push(targetId[0]);
        });
      }
      const queryData = await firebase.getUsers(targetList);
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
  }, [userId, dispatch]);
  return (
    <>
      <ChatroomsWrapper>
        <Spinner $show={spinDisplay} />
        {chatInfos &&
          isLoggedIn &&
          !spinDisplay &&
          chatInfos?.length !== 0 &&
          chatInfos?.map((room) => {
            return (
              <Person
                key={`${room.targetInfo?.userId}_chat`}
                onClick={() =>
                  dispatch({
                    type: ChatroomActions.OPEN_CHATROOM,
                    payload: { targetId: room.targetInfo.userId },
                  })
                }
              >
                <PersonPhoto $path={room.targetInfo?.photoUrl} />
                <ChatroomText>{room.targetInfo?.userName}</ChatroomText>
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
