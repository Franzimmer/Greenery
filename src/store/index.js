import { createStore } from "react-redux";
import allReducers from "../reducer/index";

const store = createStore(allReducers);
export default store;
