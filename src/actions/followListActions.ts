import { UserInfo } from "../types/userInfoType";
export enum FollowListActions {
  SET_FOLLOW_LIST = "SET_FOLLOW_LIST",
  ADD_FOLLOW_PERSON = "ADD_FOLLOW_PERSON",
  DELETE_FOLLOW_PERSON = "DELETE_FOLLOW_PERSON",
}
interface setFollowList {
  type: FollowListActions.SET_FOLLOW_LIST;
  payload: {
    data: UserInfo[];
  };
}
interface addFollowPerson {
  type: FollowListActions.ADD_FOLLOW_PERSON;
  payload: {
    followPersonData: UserInfo;
  };
}
interface deleteFollowPerson {
  type: FollowListActions.DELETE_FOLLOW_PERSON;
  payload: {
    deleteUserID: string;
  };
}

export type FollowListActionTypes =
  | setFollowList
  | addFollowPerson
  | deleteFollowPerson;
