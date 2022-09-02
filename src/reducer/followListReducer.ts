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
    case FollowListActions.ADD_FOLLOW_PERSON: {
      let currentFollowList = JSON.parse(JSON.stringify(state));
      currentFollowList.push(action.payload.followPersonData);
      return currentFollowList;
    }
    case FollowListActions.DELETE_FOLLOW_PERSON: {
      let currentFollowList = JSON.parse(JSON.stringify(state));
      const result = currentFollowList.filter(
        (followPerson: UserInfo) =>
          followPerson.userId !== action.payload.deleteUserID
      );
      return result;
    }
  }
};

export default followList;
