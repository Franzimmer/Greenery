export enum UserInfoActions {
  ADD_NEW_USER_INFO,
  EDIT_USER_NAME,
  EDIT_USER_PHOTO,
}

interface addANewUser {
  type: UserInfoActions.ADD_NEW_USER_INFO;
  payload: {
    userId: string;
    userName: string;
    userPhotoUrl: string;
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
export type userInfoActionsTypes = addANewUser | editUserName | editUserPhoto;
