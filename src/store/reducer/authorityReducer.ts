import { AuthorityType } from "../types/authorityType";
import {
  AuthorityActions,
  AuthorityActionTypes,
} from "../actions/authorityActions";

const initialAuthority: AuthorityType = {
  isLoggedIn: false,
  isSelf: false,
};
const authority = (
  state: AuthorityType = initialAuthority,
  action: AuthorityActionTypes
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
