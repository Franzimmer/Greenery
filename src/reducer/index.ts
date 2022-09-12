import { combineReducers } from "redux";
import userInfo from "./userInfoReducer";
import cards from "./cardsReducer";
import notifications from "./notificationsReducer";
import favoritePlants from "./favoritePlantsReducer";
import favoritePosts from "./favoritePostsReducer";

const allReducers = combineReducers({
  userInfo,
  cards,
  notifications,
  // favoritePlants,
  // favoritePosts,
});

export type RootState = ReturnType<typeof allReducers>;
export default allReducers;
