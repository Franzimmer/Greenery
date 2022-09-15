import React, { useRef } from "react";
import styled from "styled-components";
import { OperationBtn } from "../Profile/cards/Cards";
import { auth, users } from "../../utils/firebase";
import { useNavigate } from "react-router-dom";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

const LogInPanel = styled.div`
  display: flex;
  flex-direction: column;
  width: 300px;
  border: 1px solid #000;
  margin: 0 auto;
`;
const MethodWrapper = styled.div`
  display: flex;
  margin-bottom: 20px;
`;
const InputLabel = styled.label``;
const Input = styled.input`
  height: 30px;
`;

const LogIn = () => {
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  function createNewAccount() {
    if (!emailRef.current || !passwordRef.current) return;
    if (emailRef.current.value === "" || passwordRef.current.value === "") {
      alert("請完整填寫資料！");
    }
    const email = emailRef.current?.value;
    const password = passwordRef.current?.value;
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        const docRef = doc(users, user.uid);
        const data = {
          userId: user.uid,
          userName: "user",
          photoUrl: "",
          gallery: [],
          followList: [],
          followers: [],
          favoriteCards: [],
        };
        setDoc(docRef, data);
        return data.userId;
      })
      .then((id) => {
        navigate(`/profile/${id}`);
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        alert(`[${errorCode}] ${errorMessage}`);
      });
  }
  function userSignIn() {
    if (!emailRef.current || !passwordRef.current) return;
    if (emailRef.current.value === "" || passwordRef.current.value === "") {
      alert("請完整填寫資料！");
    }
    const email = emailRef.current?.value;
    const password = passwordRef.current?.value;
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        return user.uid;
      })
      .then((id) => {
        navigate(`/profile/${id}`);
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        alert(`[${errorCode}] ${errorMessage}`);
      });
  }
  return (
    <>
      <LogInPanel>
        <MethodWrapper>
          <OperationBtn>登入</OperationBtn>
          <OperationBtn>註冊</OperationBtn>
        </MethodWrapper>
        <InputLabel htmlFor="emailInput">Mail</InputLabel>
        <Input
          type="text"
          name="emailInput"
          id="emailInput"
          ref={emailRef}
        ></Input>
        <InputLabel htmlFor="passwordInput">Password</InputLabel>
        <Input
          type="password"
          name="passwordInput"
          id="passwordInput"
          ref={passwordRef}
        ></Input>
        <OperationBtn onClick={userSignIn}>Log In</OperationBtn>
        <OperationBtn onClick={createNewAccount}>Sign In</OperationBtn>
      </LogInPanel>
    </>
  );
};

export default LogIn;
