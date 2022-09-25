interface authorityType {
  isLoggedIn: boolean;
  isSelf: boolean;
}

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

type authorityActionTypes = userLogIn | userLogOut | judgeIsSelf;

const initialAuthority: authorityType = {
  isLoggedIn: false,
  isSelf: false,
};
const authority = (
  state: authorityType = initialAuthority,
  action: authorityActionTypes
) => {
  switch (action.type) {
    case AuthorityActions.LOG_IN: {
      return {
        isLoggedIn: true,
        isSelf: true,
      };
    }
    case AuthorityActions.LOG_OUT: {
      return initialAuthority;
    }
    case AuthorityActions.JUDGE_IS_SELF: {
      if (action.payload.selfId === action.payload.targetId) {
        return {
          ...state,
          isSelf: true,
        };
      } else {
        return {
          ...state,
          isSelf: false,
        };
      }
    }
    default:
      return state;
  }
};

export default authority;
