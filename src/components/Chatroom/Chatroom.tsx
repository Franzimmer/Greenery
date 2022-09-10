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
interface DialogProps {
  show: boolean;
}
const DialogWrapper = styled.div<DialogProps>`
  padding: 15px 10px;
  position: relative;
  display: ${(props) => (props.show ? "flex" : "none")};
  flex-direction: column;
  background: #f5a263;
  width: 500px;
`;
const DialogCloseBtn = styled(OperationBtn)`
  position: absolute;
  top: 0px;
  right: 0px;
`;
const CardListWrapper = styled.div<DialogProps>`
  display: ${(props) => (props.show ? "block" : "none")};
`;
const CardWrapper = styled.div`
  display: flex;
  border: 1px solid #000;
  align-items: center;
  justify-content: space-between;
  padding: 5px;
  background: #fff;
  width: 90%;
`;
interface CardPhotoProps {
  path: string | undefined;
}
const CardPhoto = styled.div<CardPhotoProps>`
  background-image: url(${(props) => (props.path ? props.path : "")});
  background-size: cover;
  background-repeat: no-repeat;
  width: 100px;
  height: 75px;
`;
const CardText = styled.div``;
const CardCheck = styled.input``;
const ConfirmPanel = styled.div`
  background: #fff;
  text-align: center;
  padding: 8px;
`;

const Chatroom = () => {
  const cardList = useSelector((state: RootState) => state.cards);
  let selfIdRef = useRef<string | null>(null);
  const userRef = useRef<HTMLInputElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [msgs, setMsgs] = useState<message[]>([]);
  const [dialogDisplay, setDialogDisplay] = useState<boolean>(false);
  const [cardListDisplay, setCardListDisplay] = useState<boolean>(false);
  const userId = userRef.current?.value;
  const [menuSelect, setMenuSelect] = useState<Record<string, boolean>>({});
  const [confirm, setConfirm] = useState<string>("");

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
    // if (!userRef.current?.value) return;
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

  function confirmTradeItems() {
    if (!userRef.current?.value) return;
    setCardListDisplay(false);
    let selected = cardList.filter((card) => menuSelect[card.cardId] === true);
    let nameList = selected.map((card) => {
      return card.plantName;
    });
    let msg = `要將${nameList.join(" & ")}送給新主人${
      userRef.current!.value
    }嗎?`;
    setConfirm(msg);
  }

  function switchOneCheck(cardId: string): void {
    let newObj = { ...menuSelect };
    newObj[cardId] ? (newObj[cardId] = false) : (newObj[cardId] = true);
    setMenuSelect(newObj);
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
        <DialogWrapper show={dialogDisplay}>
          <DialogCloseBtn
            onClick={() => {
              setDialogDisplay(false);
            }}
          >
            x
          </DialogCloseBtn>
          <CardListWrapper show={cardListDisplay}>
            {cardList.map((card) => {
              return (
                <CardWrapper key={`${card.cardId}_menu`}>
                  <CardPhoto path={card.plantPhoto}></CardPhoto>
                  <CardText>{card.plantName}</CardText>
                  <CardText>{card.species}</CardText>
                  <CardCheck
                    type="checkbox"
                    id={`${card.cardId}_check`}
                    checked={menuSelect[card.cardId]}
                    onClick={() => {
                      switchOneCheck(card.cardId);
                    }}
                  ></CardCheck>
                </CardWrapper>
              );
            })}
          </CardListWrapper>

          {!cardListDisplay && (
            <>
              <ConfirmPanel>{confirm}</ConfirmPanel>
              <OperationBtn onClick={() => setCardListDisplay(true)}>
                Back
              </OperationBtn>
            </>
          )}
          <OperationBtn onClick={confirmTradeItems}>Next</OperationBtn>
        </DialogWrapper>
      )}
    </>
  );
};

export default Chatroom;
