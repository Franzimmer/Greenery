import React, { useState, useEffect, Dispatch, SetStateAction } from "react";
import { createGlobalStyle } from "styled-components";
import { Outlet } from "react-router-dom";
import { Provider, useDispatch } from "react-redux";
import store from "./store";
import Alert from "./components/GlobalStyles/Alert";
import Mask from "./components/Mask/Mask";
import ChatroomsWrapper from "./components/Chatroom/ChatroomsWrapper";
import CardSelectDialog from "./components/CardSelectDialog/CardSelectDialog";
import Header from "./components/Header/Header";
import SideBarWrapper from "./components/SideBar/SideBarWrapper";
import { PlantCard } from "./store/types/plantCardType";
import {
  onSnapshot,
  query,
  collection,
  orderBy,
  doc,
} from "firebase/firestore";
import { auth, firebase, db } from "./utils/firebase";
import { Note } from "./store/types/notificationType";
import { UserInfoActions } from "./store/actions/userInfoActions";
import { CardsActions } from "./store/actions/cardsActions";
import { AuthorityActions } from "./store/reducer/authorityReducer";
import { myFollowersActions } from "./store/reducer/myFollowersReducer";
import { NotificationActions } from "./store/actions/notificationActions";
import MontserratSemiBold from "./assets/fonts/Montserrat-SemiBold.ttf";
import MontserratMedium from "./assets/fonts/Montserrat-Medium.ttf";
import MontserratMediumItalic from "./assets/fonts/Montserrat-MediumItalic.ttf";
import MontserratRegular from "./assets/fonts/Montserrat-Regular.ttf";
import MontserratRegularItalic from "./assets/fonts/Montserrat-Italic.ttf";
import MontserratExtraLight from "./assets/fonts/Montserrat-ExtraLight.ttf";
import MontserratExtraLightItalic from "./assets/fonts/Montserrat-ExtraLightItalic.ttf";
const GlobalStyle = createGlobalStyle`
@font-face {
    font-family: Montserrat;
    src: url(${MontserratSemiBold}) format('truetype');
    font-weight: 600;
  }
  @font-face {
    font-family: Montserrat;
    src: url(${MontserratMedium}) format('truetype');
    font-weight: 500;
  }
  @font-face {
    font-family: Montserrat;
    src: url(${MontserratMediumItalic}) format('truetype');
    font-weight: 500;
    font-style: italic;
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
  @font-face {
    font-family: Montserrat;
    src: url(${MontserratExtraLight}) format('truetype');
    font-weight: 200;
  }
  @font-face {
    font-family: Montserrat;
    src: url(${MontserratExtraLightItalic}) format('truetype');
    font-weight: 200;
    font-style: italic;
  }
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-family: Montserrat;
  }
  body {
    width: 100%;
    height: 100%;
    background: #F5F0EC;
    overflow-x:hidden;
  }

`;

function UserLogInObserver({
  setSideBarDisplay,
}: {
  setSideBarDisplay: Dispatch<SetStateAction<boolean>>;
}) {
  const dispatch = useDispatch();

  async function listenToNotices(uid: string) {
    let noticeCol = collection(db, "users", uid, "notices");
    const q = query(noticeCol, orderBy("time", "desc"));
    const docRef = doc(noticeCol, "followers");
    onSnapshot(q, (querySnapshot) => {
      let noticeData: Note[] = [];
      querySnapshot.forEach((doc) => {
        if (doc.id !== "followers") noticeData.push(doc.data() as Note);
      });
      dispatch({
        type: NotificationActions.SET_NOTIFICATIONS,
        payload: { data: noticeData },
      });
    });
    onSnapshot(docRef, (doc) => {
      if (doc.exists())
        dispatch({
          type: myFollowersActions.SET_FOLLOWERS,
          payload: { followers: doc.data()!.followers },
        });
    });
  }

  useEffect(() => {
    auth.onAuthStateChanged(async (user) => {
      if (user) {
        let userInfo = await firebase.getUserInfo(user.uid);
        let querySnapshot = await firebase.getUserCards(user.uid!);
        let cards: PlantCard[] = [];
        listenToNotices(user.uid);
        dispatch({
          type: UserInfoActions.SET_USER_INFO,
          payload: { userData: userInfo.data() },
        });
        dispatch({
          type: AuthorityActions.LOG_IN,
        });

        if (!querySnapshot.empty) {
          querySnapshot.forEach((doc) => {
            cards.push(doc.data());
          });
          dispatch({
            type: CardsActions.SET_CARDS_DATA,
            payload: { data: cards },
          });
        }
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
        dispatch({
          type: AuthorityActions.LOG_OUT,
        });
        setSideBarDisplay(false);
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
        <UserLogInObserver setSideBarDisplay={setSideBarDisplay} />
        <Alert />
        <Mask />
        <CardSelectDialog />
        <Header
          sideBarDisplay={sideBarDisplay}
          setSideBarDisplay={setSideBarDisplay}
        ></Header>
        <SideBarWrapper sideBarDisplay={sideBarDisplay} />
        <ChatroomsWrapper />
        <Outlet />
      </Provider>
    </>
  );
}

export default App;
