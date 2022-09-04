import { UserInfo } from "../types/userInfoType";
import {
  FollowListActionTypes,
  FollowListActions,
} from "../actions/followListActions";

const initialFollowList: UserInfo[] = [];

const followList = (
  state = initialFollowList,
  action: FollowListActionTypes
) => {
  switch (action.type) {
    case FollowListActions.SET_FOLLOW_LIST: {
      return action.payload.data;
    }
    case FollowListActions.ADD_FOLLOW_PERSON: {
      let currentFollowList = [...state];
      currentFollowList.push(action.payload.followPersonData);
      return currentFollowList;
    }
    case FollowListActions.DELETE_FOLLOW_PERSON: {
      let currentFollowList = [...state];
      const result = currentFollowList.filter(
        (followPerson: UserInfo) =>
          followPerson?.userId !== action.payload.deleteUserID
      );
      return result;
    }
    default:
      return state;
  }
};

export default followList;
