import {
  MyFollowersActions,
  MyFollowersActionTypes,
} from "../actions/myFollowersActions";

const myFollowers = (state: string[] = [], action: MyFollowersActionTypes) => {
  switch (action.type) {
    case MyFollowersActions.SET_FOLLOWERS: {
      return action.payload.followers;
    }
    case MyFollowersActions.CLEAR_FOLLOWERS: {
      return [];
    }
    default:
      return state;
  }
};
export default myFollowers;
