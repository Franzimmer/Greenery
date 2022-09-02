import { combineReducers } from "redux";
import userInfo from "./userInfoReducer";
import cards from "./cardsReducer";
import followList from "./followListReducer";
import notifications from "./notificationsReducer";
import favoritePlants from "./favoritePlantsReducer";
import favoritePosts from "./favoritePostsReducer";

const allReducers = combineReducers({
  userInfo,
  cards,
  followList,
  notifications,
  favoritePlants,
  favoritePosts,
});

export default allReducers;
