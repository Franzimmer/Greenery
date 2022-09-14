import React, { useRef, useEffect, useState } from "react";
import styled from "styled-components";
import { firebase, chatrooms } from "../../../utils/firebase";
import { OperationBtn } from "../../../pages/Profile/cards/CardsGrid";
import {
  onSnapshot,
  query,
  where,
  getDocs,
  DocumentData,
  doc,
} from "firebase/firestore";
import { useSelector } from "react-redux";
import { RootState } from "../../../reducer/index";
import CardSelectDialog from "../../CardSelectDialog/CardSelectDialog";
import { UserInfo } from "../../../types/userInfoType";

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
  position: absolute;
  bottom: 0px;
  right: 0px;
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
const InfoText = styled.p`
  width: 100%;
  height: 30px;
`;
const ChatInput = styled.input`
  width: 100%;
`;
const FlexWrapper = styled.div`
  display: flex;
  justify-content: space-between;
`;

const Chatroom = ({
  targetInfo,
  chatroomDisplay,
  toggleChatroom,
}: {
  targetInfo: UserInfo;
  chatroomDisplay: boolean;
  toggleChatroom: (targetId: string) => void;
}) => {
  const cardList = useSelector((state: RootState) => state.cards);
  const userInfo = useSelector((state: RootState) => state.userInfo);
  const selfId = userInfo.userId;
  const inputRef = useRef<HTMLInputElement>(null);
  const [msgs, setMsgs] = useState<message[]>([]);
  const [dialogDisplay, setDialogDisplay] = useState<boolean>(false);
  const [cardListDisplay, setCardListDisplay] = useState<boolean>(false);
  const [menuSelect, setMenuSelect] = useState<Record<string, boolean>>({});

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

  useEffect(() => {
    listenToChatroom();
    let menuCheck = {} as Record<string, boolean>;
    cardList.forEach((card) => {
      menuCheck[card.cardId!] = false;
    });
    setMenuSelect(menuCheck);
  }, []);

  return (
    <>
      <ChatroomWindow show={chatroomDisplay}>
        <FlexWrapper>
          <InfoText>{targetInfo.userName}</InfoText>
          <OperationBtn
            onClick={() => {
              toggleChatroom(targetInfo.userId);
            }}
          >
            x
          </OperationBtn>
        </FlexWrapper>
        <MsgWindow>
          {msgs.length !== 0 &&
            msgs.map((msg) => {
              if (msg.userId !== selfId) return <LeftText>{msg.msg}</LeftText>;
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
        <CardSelectDialog
          cardList={cardList}
          userID={targetInfo.userId}
          userName={targetInfo.userName}
          selfID={selfId}
          dialogDisplay={dialogDisplay}
          cardListDisplay={cardListDisplay}
          menuSelect={menuSelect}
          setDialogDisplay={setDialogDisplay}
          setCardListDisplay={setCardListDisplay}
          setMenuSelect={setMenuSelect}
        ></CardSelectDialog>
      )}
    </>
  );
};

export default Chatroom;
