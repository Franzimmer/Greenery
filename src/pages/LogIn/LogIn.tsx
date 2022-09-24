import React, { useRef, useState } from "react";
import styled from "styled-components";
import { OperationBtn } from "../../components/GlobalStyles/button";
import { auth, firebase } from "../../utils/firebase";
import { useNavigate } from "react-router-dom";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import login2 from "./login4.jpeg";
import { useDispatch } from "react-redux";
import { popUpActions } from "../../reducer/popUpReducer";
const Wrapper = styled.div`
  display: flex;
`;
const LogInBanner = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 50vw;
  height: 100vh;
  background-image: url(${login2});
  background-size: cover;
  background-position: center center;
  background-repeat: no-repeat;
  filter: sepia(0.4);
`;
const FlexItem = styled.div`
  width: 50vw;
  height: 100vh;
`;
const LogInPanel = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 300px;
  height: fit-content;
  border: 1px solid #6a5125;
  border-radius: 8px;
  padding: 24px;
  margin: 240px auto;
  background: rgba(255, 255, 255, 0.3);
  transition: 0.5s;
`;
const FlexWrapper = styled.div`
  display: flex;
  align-items: baseline;
  align-self: flex-start;
  margin: 0 0 24px 0;
`;
const InputLabel = styled.label`
  font-size: 14px;
  font-weight: 700;
  color: #6a5125;
  align-self: flex-start;
  margin: 0 0 6px 0;
`;
const Input = styled.input`
  height: 30px;
  width: 100%;
  margin: 0 0 24px 0;
  padding-left: 8px;
`;
const Tab = styled.div`
  cursor: pointer;
  margin: 0px 8px 8px;
  font-size: 14px;
  font-weight: 700;
  letter-spacing: 1px;
  color: #6a5125;
  transition: 0.25s;
  &:hover {
    transform: scale(1.1);
    transition: 0.25s;
  }
`;
const TabActive = styled(Tab)`
  font-size: 20px;
  filter: drop-shadow(1px 4px 3px #aaa);
`;
const LogInBtn = styled(OperationBtn)`
  background: #6a5125;
  border: 1px solid #6a5125;
  transition: 0.25s;
  &:hover {
    transform: scale(1.1);
    transition: 0.25s;
  }
`;
const LogIn = () => {
  const dispatch = useDispatch();
  const nameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const [mode, setMode] = useState<"login" | "signin">("login");
  const navigate = useNavigate();
  function emitAlert(type: string, msg: string) {
    dispatch({
      type: popUpActions.SHOW_ALERT,
      payload: {
        type,
        msg,
      },
    });
    setTimeout(() => {
      dispatch({
        type: popUpActions.CLOSE_ALERT,
      });
    }, 2000);
  }
  function createNewAccount() {
    if (!emailRef.current || !passwordRef.current || !nameRef.current) return;
    if (
      emailRef.current.value === "" ||
      passwordRef.current.value === "" ||
      nameRef.current.value === ""
    ) {
      emitAlert("fail", "Please fill info completely !");
    }
    const email = emailRef.current?.value;
    const password = passwordRef.current?.value;
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        const data = {
          userId: user.uid,
          userName: nameRef.current!.value,
          photoUrl: "",
          gallery: [],
          followList: [],
          followers: [],
          favoriteCards: [],
        };
        firebase.initUserInfo(user.uid, data);
        return data.userId;
      })
      .then((id) => {
        navigate(`/profile/${id}`);
        emitAlert("success", "Sign In Success !");
      })
      .catch((error) => {
        const errorMessage = error.message;
        emitAlert("fail", `${errorMessage}`);
      });
  }
  function userSignIn() {
    if (!emailRef.current || !passwordRef.current) return;
    if (emailRef.current.value === "" || passwordRef.current.value === "") {
      emitAlert("fail", "Please fill info completely !");
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
        emitAlert("success", "Log In Success !");
      })
      .catch((error) => {
        const errorMessage = error.message;
        emitAlert("fail", `${errorMessage}`);
      });
  }
  return (
    <Wrapper>
      <LogInBanner />
      <FlexItem />
      <LogInPanel>
        <FlexWrapper>
          {mode === "login" && (
            <>
              <TabActive onClick={() => setMode("login")}>Log In </TabActive>
              <Tab onClick={() => setMode("signin")}>Sign In</Tab>
            </>
          )}
          {mode === "signin" && (
            <>
              <Tab onClick={() => setMode("login")}>Log In </Tab>
              <TabActive onClick={() => setMode("signin")}>Sign In</TabActive>
            </>
          )}
        </FlexWrapper>
        {mode === "signin" && (
          <>
            <InputLabel htmlFor="nameInput">Name</InputLabel>
            <Input
              type="text"
              name="nameInput"
              id="nameInput"
              ref={nameRef}
            ></Input>
          </>
        )}
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
        {mode === "login" && <LogInBtn onClick={userSignIn}>Log In</LogInBtn>}
        {mode === "signin" && (
          <LogInBtn onClick={createNewAccount}>Sign In</LogInBtn>
        )}
      </LogInPanel>
    </Wrapper>
  );
};

export default LogIn;
