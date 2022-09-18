import { combineReducers } from "redux";
import userInfo from "./userInfoReducer";
import cards from "./cardsReducer";
import notifications from "./notificationsReducer";
import myFollowers from "./myFollowersReducer";
import popUp from "./popUpReducer";

const allReducers = combineReducers({
  userInfo,
  cards,
  notifications,
  myFollowers,
  popUp,
});

export type RootState = ReturnType<typeof allReducers>;
export default allReducers;
