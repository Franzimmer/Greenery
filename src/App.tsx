import React, { useState, useEffect } from "react";
import { createGlobalStyle } from "styled-components";
import { Outlet } from "react-router-dom";
// import { Reset } from "styled-reset";
import { Provider, useDispatch } from "react-redux";
import { onSnapshot, query, collection, orderBy } from "firebase/firestore";
import { db } from "./utils/firebase";
import { Note } from "./types/notificationType";
import store from "./store";
import Header from "./components/Header/Header";
import SideBarWrapper from "./components/SideBar/SideBarWrapper";
import { auth, firebase } from "./utils/firebase";
import { UserInfoActions } from "./actions/userInfoActions";
import { CardsActions } from "./actions/cardsActions";
import { myFollowersActions } from "./reducer/myFollowersReducer";
import { NotificationActions } from "./actions/notificationActions";
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
        dispatch({
          type: CardsActions.CLEAR_CARDS_DATA,
        });
        dispatch({
          type: UserInfoActions.CLEAR_USER_INFO,
        });
        dispatch({
          type: myFollowersActions.CLEAR_FOLLOWERS,
        });
        dispatch({
          type: NotificationActions.CLEAR_NOTIFICATION,
        });
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
        {<SideBarWrapper sideBarDisplay={sideBarDisplay} />}
        <Outlet />
      </Provider>
    </>
  );
}

export default App;
