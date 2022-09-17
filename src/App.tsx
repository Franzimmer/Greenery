import React, { useState, useEffect } from "react";
import { createGlobalStyle } from "styled-components";
import { Outlet } from "react-router-dom";
// import { Reset } from "styled-reset";
import { Provider, useDispatch } from "react-redux";
import store from "./store";
import Header from "./components/Header/Header";
import SideBarWrapper from "./components/SideBar/SideBarWrapper";
import { auth, firebase } from "./utils/firebase";
import { UserInfoActions } from "./actions/userInfoActions";
import { CardsActions } from "./actions/cardsActions";
import { myFollowersActions } from "./reducer/myFollowersReducer";
import { NotificationActions } from "./actions/notificationActions";
import MontserratBlack from "./assets/fonts/Montserrat-Black.ttf";
import MontserratBold from "./assets/fonts/Montserrat-Bold.ttf";
import MontserratRegular from "./assets/fonts/Montserrat-Regular.ttf";
import MontserratRegularItalic from "./assets/fonts/Montserrat-Italic.ttf";
const GlobalStyle = createGlobalStyle`
  @font-face {
    font-family: Montserrat;
    src: url(${MontserratBlack}) format('truetype');
    font-weight: 900;
  }
  @font-face {
    font-family: Montserrat;
    src: url(${MontserratBold}) format('truetype');
    font-weight: 700;
  }
  @font-face {
    font-family: Montserrat;
    src: url(${MontserratRegular}) format('truetype');
    font-weight: 400;
  }
   @font-face {
    font-family: Montserrat;
    src: url(${MontserratRegularItalic}) format('truetype');
    font-weight: 400;
    font-style: italic;
  }
  * {
    margin: 0;
    padding: 0;
    background: #F5F0EC;
    box-sizing: border-box;
    font-family: Montserrat;
  }
  body {
    width: 100%;
    height: 100%;
  }
`;

function UserLogInObserver({
  setIsLoggedIn,
}: {
  setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const dispatch = useDispatch();
  useEffect(() => {
    auth.onAuthStateChanged(async function(user) {
      if (user) {
        let userInfo = await firebase.getUserInfo(user.uid);
        dispatch({
          type: UserInfoActions.SET_USER_INFO,
          payload: { userData: userInfo.data() },
        });
        setIsLoggedIn(true);
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
        setIsLoggedIn(false);
      }
    });
  }, []);
  return null;
}

function App() {
  const [sideBarDisplay, setSideBarDisplay] = useState<boolean>(false);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  return (
    <>
      {/* <Reset /> */}
      <GlobalStyle />
      <Provider store={store}>
        <UserLogInObserver setIsLoggedIn={setIsLoggedIn} />
        <Header
          isLoggedIn={isLoggedIn}
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
