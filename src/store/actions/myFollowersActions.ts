export enum MyFollowersActions {
  SET_FOLLOWERS = "SET_FOLLOWERS",
  CLEAR_FOLLOWERS = "CLEAR_FOLLOWERS",
}
interface setFollowers {
  type: MyFollowersActions.SET_FOLLOWERS;
  payload: { followers: string[] };
}
interface clearFollowers {
  type: MyFollowersActions.CLEAR_FOLLOWERS;
}
export type MyFollowersActionTypes = setFollowers | clearFollowers;
