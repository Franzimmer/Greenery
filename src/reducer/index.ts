import { combineReducers } from "redux";
import userInfo from "./userInfoReducer";
import cards from "./cardsReducer";
import notifications from "./notificationsReducer";
import myFollowers from "./myFollowersReducer";

const allReducers = combineReducers({
  userInfo,
  cards,
  notifications,
  myFollowers,
});

export type RootState = ReturnType<typeof allReducers>;
export default allReducers;
