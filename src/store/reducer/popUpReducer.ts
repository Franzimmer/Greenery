import { PopUpType } from "../types/popUpType";
import { PopUpActions, PopUpActionTypes } from "../actions/popUpActions";

const initialState: PopUpType = {
  mask: false,
  cardSelect: false,
  target: {
    id: "",
    name: "",
  },
  alert: false,
  alertInfo: {
    type: "success",
    msg: "",
  },
};
const popUp = (state: PopUpType = initialState, action: PopUpActionTypes) => {
  switch (action.type) {
    case PopUpActions.SHOW_CARD_SELECT_TRADE: {
      return {
        ...state,
        mask: true,
        cardSelect: true,
        target: {
          id: action.payload.targetId,
          name: action.payload.targetName,
        },
      };
    }
    case PopUpActions.SHOW_MASK: {
      return { ...state, mask: true };
    }
    case PopUpActions.HIDE_ALL: {
      return initialState;
    }
    case PopUpActions.SHOW_ALERT: {
      return {
        ...state,
        alert: true,
        alertInfo: {
          type: action.payload.type,
          msg: action.payload.msg,
        },
      };
    }
    case PopUpActions.CLOSE_ALERT: {
      return {
        ...state,
        alert: false,
      };
    }
    default:
      return state;
  }
};
export default popUp;
