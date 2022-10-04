export enum AuthorityActions {
  LOG_IN = "LOG_IN",
  LOG_OUT = "LOG_OUT",
  JUDGE_IS_SELF = "JUDGE_IS_SELF",
}

interface userLogIn {
  type: AuthorityActions.LOG_IN;
}
interface userLogOut {
  type: AuthorityActions.LOG_OUT;
}
interface judgeIsSelf {
  type: AuthorityActions.JUDGE_IS_SELF;
  payload: {
    targetId: string;
    selfId: string;
  };
}

export type AuthorityActionTypes = userLogIn | userLogOut | judgeIsSelf;
