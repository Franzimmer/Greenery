import React, { useRef, useState } from "react";
import styled from "styled-components";
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
  const userRef = useRef<HTMLInputElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  return (
    <ChatroomWindow>
      <FlexWrapper>
        <ChatInput
          type="string"
          placeholder="搜尋使用者id開始聊天"
          ref={userRef}
        ></ChatInput>
        <OperationBtn>x</OperationBtn>
      </FlexWrapper>
      <MsgWindow></MsgWindow>
      <FlexWrapper>
        <OperationBtn>+</OperationBtn>
        <ChatInput type="text" ref={inputRef}></ChatInput>
      </FlexWrapper>
    </ChatroomWindow>
  );
};

export default Chatroom;
