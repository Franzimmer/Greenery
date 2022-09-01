import { UserInfo } from "../types/userInfoType";
import {
  UserInfoActions,
  userInfoActionsTypes,
} from "../actions/userInfoActions";
const initialUserInfo: UserInfo = {
  userId: "",
  userName: "",
  userPhotoUrl: "",
};

//action
const userInfo = (state = initialUserInfo, action: userInfoActionsTypes) => {
  switch (action.type) {
    case UserInfoActions.ADD_NEW_USER_INFO: {
      return {
        userId: action.payload.userId,
        userName: action.payload.userName,
        userPhotoUrl: action.payload.userPhotoUrl,
      };
    }
    case UserInfoActions.EDIT_USER_NAME: {
      return {
        ...state,
        userName: action.payload.userName,
      };
    }
    case UserInfoActions.EDIT_USER_PHOTO: {
      return {
        ...state,
        userPhotoUrl: action.payload.userPhotoUrl,
      };
    }
  }
};

export default userInfo;
