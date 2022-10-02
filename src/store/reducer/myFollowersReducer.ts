export enum myFollowersActions {
  SET_FOLLOWERS = "SET_FOLLOWERS",
  CLEAR_FOLLOWERS = "CLEAR_FOLLOWERS",
}
interface setFollowers {
  type: myFollowersActions.SET_FOLLOWERS;
  payload: { followers: string[] };
}
interface clearFollowers {
  type: myFollowersActions.CLEAR_FOLLOWERS;
}
type myFollowersActionTypes = setFollowers | clearFollowers;

const myFollowers = (state: string[] = [], action: myFollowersActionTypes) => {
  switch (action.type) {
    case myFollowersActions.SET_FOLLOWERS: {
      return action.payload.followers;
    }
    case myFollowersActions.CLEAR_FOLLOWERS: {
      return [];
    }
    default:
      return state;
  }
};
export default myFollowers;
