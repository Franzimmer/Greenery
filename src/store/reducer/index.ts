import { combineReducers } from "redux";
import userInfo from "./userInfoReducer";
import cards from "./cardsReducer";
import notifications from "./notificationsReducer";
import myFollowers from "./myFollowersReducer";
import popUp from "./popUpReducer";
import authority from "./authorityReducer";
import chatrooms from "./chatroomReducer";

const allReducers = combineReducers({
  userInfo,
  cards,
  notifications,
  myFollowers,
  popUp,
  authority,
  chatrooms,
});

export type RootState = ReturnType<typeof allReducers>;
export default allReducers;
