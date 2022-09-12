import React, { useState, useEffect } from "react";
import { createGlobalStyle } from "styled-components";
import { Outlet } from "react-router-dom";
// import { Reset } from "styled-reset";
import { Provider, useDispatch } from "react-redux";
import store from "./store";
import Chatroom from "./components/Chatroom/Chatroom";
import Header from "./components/Header/Header";
import SideBarWrapper from "./components/SideBar/SideBarWrapper";
import { auth, firebase } from "./utils/firebase";
import { UserInfoActions } from "./actions/userInfoActions";

const GlobalStyle = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
  body {
    width: 100%;
    height: 100%;
  }
`;
function UserLogInObserver() {
  const dispatch = useDispatch();

  useEffect(() => {
    auth.onAuthStateChanged(async function(user) {
      if (user) {
        let userInfo = await firebase.getUserInfo(user.uid);
        dispatch({
          type: UserInfoActions.SET_USER_INFO,
          payload: { userData: userInfo.data() },
        });
      } else {
      }
    });
  }, []);
  return null;
}

function App() {
  const [sideBarDisplay, setSideBarDisplay] = useState<boolean>(false);
  return (
    <>
      {/* <Reset /> */}
      <GlobalStyle />
      <Provider store={store}>
        <UserLogInObserver />
        <Header
          sideBarDisplay={sideBarDisplay}
          setSideBarDisplay={setSideBarDisplay}
        ></Header>
        {sideBarDisplay && <SideBarWrapper />}
        <Outlet />
        <Chatroom />
      </Provider>
    </>
  );
}

export default App;
