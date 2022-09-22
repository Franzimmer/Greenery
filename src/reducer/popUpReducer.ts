export interface PopUpDisplayType {
  mask: boolean;
  cardSelect: boolean;
  target: {
    id: string;
    name: string;
  };
  alert: boolean;
  alertInfo: {
    type: "success" | "fail";
    msg: string;
  };
}

export enum popUpActions {
  SHOW_CARD_SELECT_TRADE = "SHOW_CARD_SELECT_TRADE",
  SHOW_MASK = "SHOW_MASK",
  HIDE_ALL = "HIDE_ALL",
  SHOW_ALERT = "SHOW_ALERT",
  CLOSE_ALERT = "CLOSE_ALERT",
}
interface showCardSelectTrade {
  type: popUpActions.SHOW_CARD_SELECT_TRADE;
  payload: {
    targetId: string;
    targetName: string;
  };
}
interface showMask {
  type: popUpActions.SHOW_MASK;
}
interface hideAll {
  type: popUpActions.HIDE_ALL;
}
interface showAlert {
  type: popUpActions.SHOW_ALERT;
  payload: {
    type: "success" | "fail";
    msg: string;
  };
}
interface closeAlert {
  type: popUpActions.CLOSE_ALERT;
}
type PopUpDisplayActionTypes =
  | showCardSelectTrade
  | showMask
  | hideAll
  | showAlert
  | closeAlert;

const initialState: PopUpDisplayType = {
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
const popUp = (
  state: PopUpDisplayType = initialState,
  action: PopUpDisplayActionTypes
) => {
  switch (action.type) {
    case popUpActions.SHOW_CARD_SELECT_TRADE: {
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
    case popUpActions.SHOW_MASK: {
      return { ...state, mask: true };
    }
    case popUpActions.HIDE_ALL: {
      return initialState;
    }
    case popUpActions.SHOW_ALERT: {
      return {
        ...state,
        alert: true,
        alertInfo: {
          type: action.payload.type,
          msg: action.payload.msg,
        },
      };
    }
    case popUpActions.CLOSE_ALERT: {
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
