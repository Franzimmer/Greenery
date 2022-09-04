import { UserInfo } from "../types/userInfoType";
export enum UserInfoActions {
  SET_USER_INFO,
  EDIT_USER_NAME,
  EDIT_USER_PHOTO,
}
interface setUserInfo {
  type: UserInfoActions.SET_USER_INFO;
  payload: {
    data: UserInfo;
  };
}
interface editUserName {
  type: UserInfoActions.EDIT_USER_NAME;
  payload: { userName: string };
}
interface editUserPhoto {
  type: UserInfoActions.EDIT_USER_PHOTO;
  payload: { userPhotoUrl: string };
}
export type userInfoActionsTypes = setUserInfo | editUserName | editUserPhoto;
