import React, { useRef, useEffect, useState } from "react";
import styled from "styled-components";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../store/reducer/index";
import { UserInfo } from "../../store/types/userInfoType";
import { popUpActions } from "../../store/reducer/popUpReducer";
import { firebase, chatrooms } from "../../utils/firebase";
import {
  onSnapshot,
  query,
  where,
  getDocs,
  DocumentData,
  doc,
} from "firebase/firestore";
import { CloseBtn } from "../GlobalStyles/button";

export interface message {
  userId: string;
  msg: string;
}
interface ChatroomWindowProps {
  show: boolean;
}
const ChatroomWindow = styled.div<ChatroomWindowProps>`
  border: 1px solid #5c836f;
  width: 328px;
  height: 445px;
  margin-right: 20px;
  background-color: #fff;
  box-shadow: 5px 2px 10px #aaa;
  display: ${(props) => (props.show ? "block" : "none")};
`;
const FlexWrapper = styled.div`
  width: 100%;
  height: 48px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #5c836f;
  padding: 8px;
`;
const FlexInputWrapper = styled(FlexWrapper)`
  padding: 12px 8px;
  justify-content: flex-start;
  align-items: center;
`;
const InfoText = styled.span`
  width: 90%;
  color: #fff;
  font-weight: normal;
  font-size: 16px;
  line-height: 26px;
  letter-spacing: 2px;
  background-color: #5c836f;
  padding-left: 8px;
`;
const LeftText = styled.div`
  font-size: 14px;
  max-width: 60%;
  align-self: flex-start;
  border: 1px solid #5c836f;
  background-color: #fff;
  color: #5c836f;
  border-radius: 16px;
  padding: 2px 10px;
  margin: 6px 0px;
`;
const RightText = styled(LeftText)`
  align-self: flex-end;
  border: 1px solid #fddba9;
  color: #6a5125;
  background-color: #fddba9;
`;
const MsgWindow = styled.div`
  width: 100%;
  height: 347px;
  padding: 5px;
  background: linear-gradient(#ddd 1%, #fff 15%);
  display: flex;
  flex-direction: column;
  overflow-y: auto;
`;
const ChatInput = styled.textarea`
  width: 90%;
  height: 36px;
  max-height: 50px;
  border: 1px solid #5c836f;
  border-radius: 18px;
  margin-left: 8px;
  background-color: #fff;
  padding: 8px 18px;
  overflow-y: auto;
  font-size: 14px;
`;
const ChatBtn = styled(CloseBtn)`
  background-color: #fff;
  color: #5c836f;
  transition: 0.25s;
  &:hover {
    background-color: #fff;
    border: 1px solid #5c836f;
    color: #5c836f;
    transform: scale(1.3);
  }
`;
interface ChatroomProps {
  targetInfo: UserInfo;
  chatroomDisplay: boolean;
  toggleChatroom: (targetId: string) => void;
}
const Chatroom = ({
  targetInfo,
  chatroomDisplay,
  toggleChatroom,
}: ChatroomProps) => {
  const dispatch = useDispatch();
  const userInfo = useSelector((state: RootState) => state.userInfo);
  const selfId = userInfo.userId;
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const [msgs, setMsgs] = useState<message[]>([]);

  const scrollRef = useRef<HTMLDivElement>(null);
  function writeMsg() {
    const usersTarget = [targetInfo.userId, selfId];
    const data = {
      userId: selfId,
      msg: inputRef.current?.value || "",
    };
    firebase.storeChatroomData(usersTarget, data);
    inputRef.current!.value = "";
  }
  async function listenToChatroom() {
    const usersTarget = [targetInfo.userId, selfId];
    const usersTargetFlip = [selfId, targetInfo.userId];
    const q = query(
      chatrooms,
      where("users", "in", [usersTarget, usersTargetFlip])
    );
    const querySnapshot = await getDocs(q);
    if (querySnapshot.empty) {
      return;
    } else {
      querySnapshot.forEach((docData: DocumentData) => {
        let docRef = doc(chatrooms, docData.id);
        setMsgs(docData.data().msgs);
        onSnapshot(docRef, async (doc: DocumentData) => {
          let msgs = doc.data().msgs;
          setMsgs(msgs);
        });
      });
    }
  }
  function scrollToBottom() {
    if (!scrollRef?.current) return;
    scrollRef!.current.scrollTo({
      top: scrollRef!.current.scrollHeight,
      left: 0,
      behavior: "auto",
    });
  }

  useEffect(() => {
    listenToChatroom();
  }, []);
  useEffect(() => {
    scrollToBottom();
  }, [msgs, chatroomDisplay]);
  return (
    <>
      <ChatroomWindow show={chatroomDisplay}>
        <FlexWrapper>
          <InfoText>{targetInfo.userName}</InfoText>
          <ChatBtn
            onClick={() => {
              toggleChatroom(targetInfo.userId);
            }}
          >
            &#215;
          </ChatBtn>
        </FlexWrapper>
        <MsgWindow ref={scrollRef}>
          {msgs.length !== 0 &&
            msgs.map((msg, index) => {
              if (msg.userId !== selfId)
                return (
                  <LeftText key={`${msg.userId}_${index}`}>{msg.msg}</LeftText>
                );
              else
                return (
                  <RightText key={`${msg.userId}_${index}`}>
                    {msg.msg}
                  </RightText>
                );
            })}
        </MsgWindow>
        <FlexInputWrapper>
          <ChatBtn
            onClick={() => {
              dispatch({
                type: popUpActions.SHOW_CARD_SELECT_TRADE,
                payload: {
                  targetId: targetInfo.userId,
                  targetName: targetInfo.userName,
                },
              });
            }}
          >
            +
          </ChatBtn>
          <ChatInput
            ref={inputRef}
            onKeyPress={(e) => {
              if (e.key === "Enter") {
                writeMsg();
              }
            }}
          ></ChatInput>
        </FlexInputWrapper>
      </ChatroomWindow>
    </>
  );
};

export default Chatroom;
