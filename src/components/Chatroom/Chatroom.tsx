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
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../reducer/index";
import { CardsActions } from "../../actions/cardsActions";
import Dialog from "./Dialog";

export interface message {
  userId: string;
  msg: string;
}
interface ChatroomWindowProps {
  show: boolean;
}
const ChatroomWindow = styled.div<ChatroomWindowProps>`
  border: 1px solid #000;
  width: 250px;
  height: 300px;
  display: ${(props) => (props.show ? "block" : "none")};
`;
const LeftText = styled.div`
  max-width: 60%;
  align-self: flex-start;
  border: 1px solid #000;
  padding: 2px;
  background: #fff;
`;
const RightText = styled(LeftText)`
  align-self: flex-end;
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
  const cardList = useSelector((state: RootState) => state.cards);
  let selfIdRef = useRef<string | null>(null);
  const userRef = useRef<HTMLInputElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [msgs, setMsgs] = useState<message[]>([]);
  const [chatroomDisplay, setChatroomDisplay] = useState<boolean>(false);
  const [dialogDisplay, setDialogDisplay] = useState<boolean>(false);
  const [cardListDisplay, setCardListDisplay] = useState<boolean>(false);
  const userId = userRef.current?.value;
  const [menuSelect, setMenuSelect] = useState<Record<string, boolean>>({});

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
    const usersTarget = [userRef.current?.value, selfIdRef.current];
    const usersTargetFlip = [selfIdRef.current, userRef.current?.value];
    console.log(usersTarget);
    const q = query(
      chatrooms,
      where("users", "in", [usersTarget, usersTargetFlip])
    );
    const querySnapshot = await getDocs(q);
    console.log("test");
    if (querySnapshot.empty) {
      console.log("fail");
      return;
    } else {
      querySnapshot.forEach((docData) => {
        let docRef = doc(chatrooms, docData.id);
        console.log(docData.data().msgs);
        setMsgs(docData.data().msgs);
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
    let menuCheck = {} as Record<string, boolean>;
    cardList.forEach((card) => {
      menuCheck[card.cardId] = false;
    });
    setMenuSelect(menuCheck);
  }, []);

  return (
    <>
      <ChatroomWindow show={chatroomDisplay}>
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
          <OperationBtn
            onClick={() => {
              setChatroomDisplay(false);
            }}
          >
            x
          </OperationBtn>
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
          <OperationBtn
            onClick={() => {
              setDialogDisplay(true);
              setCardListDisplay(true);
            }}
          >
            +
          </OperationBtn>
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
      {cardList && (
        <Dialog
          userID={userRef.current?.value}
          selfID={selfIdRef.current}
          dialogDisplay={dialogDisplay}
          cardListDisplay={cardListDisplay}
          menuSelect={menuSelect}
          setDialogDisplay={setDialogDisplay}
          setCardListDisplay={setCardListDisplay}
          setMenuSelect={setMenuSelect}
        ></Dialog>
      )}
    </>
  );
};

export default Chatroom;
