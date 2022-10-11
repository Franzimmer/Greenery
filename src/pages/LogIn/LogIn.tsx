import React, { useRef, useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { auth, firebase } from "../../utils/firebase";
import { useAlertDispatcher } from "../../utils/useAlertDispatcher";
import { OperationBtn } from "../../components/GlobalStyles/button";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import login from "./login.jpeg";
const Wrapper = styled.div`
  display: flex;
`;
const LogInBg = styled.div`
  position: absolute;
  z-index: -1;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-image: url(${login});
  background-size: cover;
  background-position: center center;
  background-repeat: no-repeat;
  filter: brightness(0.85);
`;
const LogoWrapper = styled.div`
  font-size: 24px;
  letter-spacing: 2px;
  line-height: 42px;
  position: absolute;
  top: 50%;
  left: 30%;
  transform: translateX(-50%) translateY(-50%);
  color: #222422;
  font-weight: 500;
  padding: 12px 36px;
  filter: drop-shadow(0px 0px 10px #fff);
`;
const Author = styled.span`
  font-size: 16px;
  letter-spacing: 1px;
  mix-blend-mode: overlay;
`;
const LogInPanel = styled.div`
  position: absolute;
  top: 50%;
  left: 75%;
  transform: translateX(-50%) translateY(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 300px;
  height: 400px;
  border-radius: 8px;
  padding: 24px;
  background: rgba(255, 255, 255, 0.65);
  box-shadow: 0 0 20px 20px rgba(0, 0, 0, 0.2);
`;
const FlexWrapper = styled.div`
  display: flex;
  align-items: baseline;
  align-self: flex-start;
  margin: 0 0 24px 0;
`;
const InputLabel = styled.label`
  font-size: 14px;
  font-weight: 500;
  color: ${(props) => props.theme.colors.button};
  align-self: flex-start;
  margin: 0 0 6px 0;
`;
const Input = styled.input`
  height: 30px;
  width: 100%;
  margin: 0 0 36px 0;
  padding-left: 8px;
  border: 1px solid ${(props) => props.theme.colors.button};
  background-color: rgba(92, 131, 111, 0.2);
  &:-webkit-autofill,
  :-webkit-autofill:hover,
  :-webkit-autofill:focus {
    -webkit-box-shadow: 0 0 0px 1000px rgba(92, 131, 111, 0.2) inset !important;
    transition: background-color 5000s ease-in-out 0s;
  }
`;
const Tab = styled.div`
  cursor: pointer;
  margin: 0px 8px 8px;
  font-size: 14px;
  font-weight: 500;
  letter-spacing: 1px;
  color: ${(props) => props.theme.colors.button};
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
  background: ${(props) => props.theme.colors.button};
  border: 1px solid ${(props) => props.theme.colors.button};
  transition: 0.25s;
  &:hover {
    transform: scale(1.1);
    transition: 0.25s;
  }
`;
const LogIn = () => {
  const navigate = useNavigate();
  const alertDispatcher = useAlertDispatcher();
  const nameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const [mode, setMode] = useState<"login" | "signin">("login");
  const emailRule = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
  function createNewAccount() {
    if (!emailRef.current || !passwordRef.current || !nameRef.current) return;
    if (
      emailRef.current.value === "" ||
      passwordRef.current.value === "" ||
      nameRef.current.value === ""
    ) {
      alertDispatcher("fail", "Please fill info completely !");
      return;
    } else if (!emailRule.test(emailRef.current.value)) {
      alertDispatcher("fail", "Invalid email!");
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
        alertDispatcher("success", "Sign In Success !");
      })
      .catch((error) => {
        const errorMessage = error.message;
        alertDispatcher("fail", `${errorMessage}`);
      });
  }
  function userSignIn() {
    if (!emailRef.current || !passwordRef.current) return;
    if (emailRef.current.value === "" || passwordRef.current.value === "") {
      alertDispatcher("fail", "Please fill info completely !");
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
        alertDispatcher("success", "Log In Success !");
      })
      .catch((error) => {
        const errorMessage = error.message;
        alertDispatcher("fail", `${errorMessage}`);
      });
  }
  return (
    <Wrapper>
      <LogInBg />
      <LogoWrapper>
        Green is the prime color of the world,
        <br /> and that from which its loveliness arises.
        <br /> <Author>- Pedro Calderon De La Barca</Author>
      </LogoWrapper>
      <LogInPanel>
        <FlexWrapper>
          {mode === "login" && (
            <>
              <TabActive onClick={() => setMode("login")}>Log In</TabActive>
              <Tab onClick={() => setMode("signin")}>Sign In</Tab>
            </>
          )}
          {mode === "signin" && (
            <>
              <Tab onClick={() => setMode("login")}>Log In</Tab>
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
              maxLength={20}
              placeholder={"Enter 1-20 character(s)"}
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
