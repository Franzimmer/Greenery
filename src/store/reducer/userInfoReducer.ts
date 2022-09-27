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
      let currentFollowList = [...state.followList];
      currentFollowList?.push(action.payload.targetId);
      return {
        ...state,
        followList: currentFollowList,
      };
    }
    case UserInfoActions.REMOVE_FOLLOW_LIST: {
      let newFollowList = state.followList?.filter(
        (id) => id !== action.payload.targetId
      );
      return {
        ...state,
        followList: newFollowList,
      };
    }
    case UserInfoActions.ADD_GALLERY: {
      let currentGallery = [...state.gallery];
      currentGallery?.unshift(action.payload.link);
      return {
        ...state,
        gallery: currentGallery,
      };
    }
    case UserInfoActions.REMOVE_GALLERY: {
      let newGallery = state.gallery?.filter(
        (asset) => asset !== action.payload.link
      );
      return {
        ...state,
        gallery: newGallery,
      };
    }
    case UserInfoActions.ADD_FAVORITE_PLANT: {
      let newFavPlants = [...state.favoriteCards];
      newFavPlants.push(action.payload.cardId);
      return {
        ...state,
        favoriteCards: newFavPlants,
      };
    }
    case UserInfoActions.DELETE_FAVORITE_PLANT: {
      let newFavPlants = state.favoriteCards?.filter(
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
