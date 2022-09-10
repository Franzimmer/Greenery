import React, { useRef, useEffect, useState } from "react";
import styled from "styled-components";
import { auth, firebase, chatrooms } from "../../utils/firebase";
import { OperationBtn } from "../../pages/Profile/cards/CardsGrid";
import {
  onSnapshot,
  query,
  where,
  getDocs,
  DocumentData,
  doc,
} from "firebase/firestore";

export interface message {
  userId: string;
  msg: string;
}

const ChatroomWindow = styled.div`
  border: 1px solid #000;
  width: 250px;
  height: 300px;
`;
const LeftText = styled.div`
  height: 30px;
  align-self: flex-start;
  border: 1px solid #000;
  padding: 2px;
  background: #fff;
`;
const RightText = styled(LeftText)`
  align-self: flex-end;
  color: red;
`;
const MsgWindow = styled.div`
  width: 100%;
  height: 240px;
  background: #eee;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
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
  const [msgs, setMsgs] = useState<message[]>([]);
  const userId = userRef.current?.value;

  function writeMsg() {
    if (!userId) return;
    if (!selfIdRef.current) return;
    const usersTarget = [userId, selfIdRef.current];
    const data = {
      userId: selfIdRef.current,
      msg: inputRef.current?.value || "",
    };
    firebase.storeChatroomData(usersTarget, data);
    inputRef.current!.value = "";
  }

  async function listenToChatroom() {
    if (!userRef.current?.value) return;
    if (!selfIdRef.current) return;
    const usersTarget = [userId, selfIdRef.current];
    const usersTargetFlip = [selfIdRef.current, userId];
    const q = query(
      chatrooms,
      where("users", "in", [usersTarget, usersTargetFlip])
    );
    const querySnapshot = await getDocs(q);
    if (querySnapshot.empty) return;
    else {
      querySnapshot.forEach((docData) => {
        let docRef = doc(chatrooms, docData.id);
        onSnapshot(docRef, async (doc: DocumentData) => {
          let msgs = doc.data().msgs;
          setMsgs(msgs);
        });
      });
    }
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
          ref={userRef}
          onKeyPress={(e) => {
            if (e.key === "Enter") {
              listenToChatroom();
            }
          }}
        ></ChatInput>
        <OperationBtn>x</OperationBtn>
      </FlexWrapper>
      <MsgWindow>
        {msgs.length !== 0 &&
          msgs.map((msg) => {
            if (msg.userId !== selfIdRef.current)
              return <LeftText>{msg.msg}</LeftText>;
            else return <RightText>{msg.msg}</RightText>;
          })}
      </MsgWindow>
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
