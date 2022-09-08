import { UserInfo } from "../types/userInfoType";
export enum UserInfoActions {
  SET_USER_INFO = "SET_USER_INFO",
  EDIT_USER_NAME = "EDIT_USER_NAME",
  EDIT_USER_PHOTO = "EDIT_USER_PHOTO",
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
export type userInfoActionsTypes = setUserInfo | editUserName | editUserPhoto;
