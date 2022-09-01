import { combineReducers } from "redux";
import userInfo from "./userInfoReducer";
import plantCard from "./plantCardReducer";

const allReducers = combineReducers({ userInfo, plantCard });

export default allReducers;
