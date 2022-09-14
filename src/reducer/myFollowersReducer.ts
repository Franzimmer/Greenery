export enum myFollowersActions {
  SET_FOLLOWERS = "SET_FOLLOWERS",
}
interface setFollowers {
  type: myFollowersActions.SET_FOLLOWERS;
  payload: { followers: string[] };
}
type myFollowersActionTypes = setFollowers;

const myFollowers = (state: string[] = [], action: myFollowersActionTypes) => {
  switch (action.type) {
    case myFollowersActions.SET_FOLLOWERS: {
      console.log(action.payload.followers);
      return action.payload.followers;
    }
    default:
      return state;
  }
};
export default myFollowers;
