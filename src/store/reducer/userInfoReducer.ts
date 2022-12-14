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
  followList: [],
  followers: [],
  favoriteCards: [],
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
    case UserInfoActions.ADD_FOLLOW_LIST: {
      return {
        ...state,
        followList: [...state.followList, action.payload.targetId],
      };
    }
    case UserInfoActions.REMOVE_FOLLOW_LIST: {
      const newFollowList = state.followList?.filter(
        (id) => id !== action.payload.targetId
      );
      return {
        ...state,
        followList: newFollowList,
      };
    }
    case UserInfoActions.ADD_GALLERY: {
      const currentGallery = [...state.gallery];
      currentGallery?.unshift(action.payload.link);
      return {
        ...state,
        gallery: currentGallery,
      };
    }
    case UserInfoActions.REMOVE_GALLERY: {
      const newGallery = state.gallery?.filter(
        (asset) => asset !== action.payload.link
      );
      return {
        ...state,
        gallery: newGallery,
      };
    }
    case UserInfoActions.ADD_FAVORITE_PLANT: {
      return {
        ...state,
        favoriteCards: [...state.favoriteCards, action.payload.cardId],
      };
    }
    case UserInfoActions.DELETE_FAVORITE_PLANT: {
      const newFavPlants = state.favoriteCards?.filter(
        (id) => id !== action.payload.cardId
      );
      return {
        ...state,
        favoriteCards: newFavPlants,
      };
    }
    case UserInfoActions.CLEAR_USER_INFO: {
      return initialUserInfo;
    }
    default:
      return state;
  }
};

export default userInfo;
