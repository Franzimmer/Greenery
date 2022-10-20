import React, { useState, useEffect, Dispatch, SetStateAction } from "react";
import { createGlobalStyle, ThemeProvider } from "styled-components";
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
import { AuthorityActions } from "./store/actions/authorityActions";
import { MyFollowersActions } from "./store/actions/myFollowersActions";
import { NotificationActions } from "./store/actions/notificationActions";
import theme from "./theme";
const GlobalStyle = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,200;0,400;0,500;0,600;1,200;1,400;1,500&display=swap');
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-family: "Montserrat";
  }
  body {
    width: 100%;
    height: 100%;
    background:${(props) => props.theme.colors.bg};
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
          type: MyFollowersActions.SET_FOLLOWERS,
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
          type: MyFollowersActions.CLEAR_FOLLOWERS,
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
    <ThemeProvider theme={theme}>
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
    </ThemeProvider>
  );
}

export default App;
