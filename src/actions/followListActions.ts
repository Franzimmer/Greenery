import { UserInfo } from "../types/userInfoType";
export enum FollowListActions {
  ADD_FOLLOW_PERSON,
  DELETE_FOLLOW_PERSON,
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

export type FollowListActionTypes = addFollowPerson | deleteFollowPerson;
