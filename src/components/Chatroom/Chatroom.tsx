import React, { useRef, useEffect } from "react";
import styled from "styled-components";
import { auth, firebase } from "../../utils/firebase";
import { OperationBtn } from "../../pages/Profile/cards/CardsGrid";

const ChatroomWindow = styled.div`
  border: 1px solid #000;
  width: 250px;
  height: 300px;
`;
const ChatroomHeader = styled.div`
  width: 100%;
  height: 30px;
`;
const MsgWindow = styled.div`
  width: 100%;
  height: 240px;
  background: #eee;
`;
const ChatInput = styled.input`
  width: 100%;
  height: 30px;
`;
const FlexWrapper = styled.div`
  display: flex;
  justify-content: space-between;
`;
const Chatroom = () => {
  let selfIdRef = useRef<string | null>(null);
  const userRef = useRef<HTMLInputElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  function openChatRoom() {
    if (!userRef.current?.value) return;
    if (!selfIdRef.current) return;
    const userId = userRef.current!.value;
    const usersTarget = [userId, selfIdRef.current];
    firebase.checkChatroomExist(usersTarget);
  }
  function writeMsg() {
    if (!userRef.current?.value) return;
    if (!selfIdRef.current) return;
    const userId = userRef.current!.value;
    const usersTarget = [userId, selfIdRef.current];
    const data = {
      userId: selfIdRef.current,
      msg: inputRef.current?.value || "",
    };
    // console.log(data);
    firebase.storeChatroomData(usersTarget, data);
  }

  useEffect(() => {
    auth.onAuthStateChanged(async function(user) {
      if (user) {
        selfIdRef.current = user.uid;
      }
    });
  }, []);
  return (
    <ChatroomWindow>
      <FlexWrapper>
        <ChatInput
          type="string"
          placeholder="搜尋使用者id開始聊天"
          onKeyPress={(e) => {
            if (e.key === "Enter") {
              openChatRoom();
            }
          }}
          ref={userRef}
        ></ChatInput>
        <OperationBtn>x</OperationBtn>
      </FlexWrapper>
      <MsgWindow></MsgWindow>
      <FlexWrapper>
        <OperationBtn>+</OperationBtn>
        <ChatInput
          type="text"
          ref={inputRef}
          onKeyPress={(e) => {
            if (e.key === "Enter") {
              writeMsg();
            }
          }}
        ></ChatInput>
      </FlexWrapper>
    </ChatroomWindow>
  );
};

export default Chatroom;
