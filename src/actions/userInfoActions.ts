import { UserInfo } from "../types/userInfoType";
export enum UserInfoActions {
  SET_USER_INFO = "SET_USER_INFO",
  EDIT_USER_NAME = "EDIT_USER_NAME",
  EDIT_USER_PHOTO = "EDIT_USER_PHOTO",
  ADD_FOLLOW_LIST = "ADD_FOLLOW_LIST",
  REMOVE_FOLLOW_LIST = "REMOVE_FOLLOW_LIST",
}
interface setUserInfo {
  type: UserInfoActions.SET_USER_INFO;
  payload: {
    userData: UserInfo;
  };
}
interface editUserName {
  type: UserInfoActions.EDIT_USER_NAME;
  payload: { userName: string };
}
interface editUserPhoto {
  type: UserInfoActions.EDIT_USER_PHOTO;
  payload: { photoUrl: string };
}
interface addFollow {
  type: UserInfoActions.ADD_FOLLOW_LIST;
  payload: { targetId: string };
}
interface removeFollow {
  type: UserInfoActions.REMOVE_FOLLOW_LIST;
  payload: { targetId: string };
}
export type userInfoActionsTypes =
  | setUserInfo
  | editUserName
  | editUserPhoto
  | addFollow
  | removeFollow;
