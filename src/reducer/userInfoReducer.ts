import { UserInfo } from "../types/userInfoType";
import {
  UserInfoActions,
  userInfoActionsTypes,
} from "../actions/userInfoActions";
const initialUserInfo: UserInfo = {
  userId: "",
  userName: "",
  photoUrl: "",
  gallery: [],
};

const userInfo = (state = initialUserInfo, action: userInfoActionsTypes) => {
  switch (action.type) {
    case UserInfoActions.SET_USER_INFO: {
      return action.payload.userData;
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
        photoUrl: action.payload.photoUrl,
      };
    }
    default:
      return state;
  }
};

export default userInfo;
