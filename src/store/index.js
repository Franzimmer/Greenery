import { createStore } from "redux";
import allReducers from "../reducer/index";

const store = createStore(allReducers);
export default store;
