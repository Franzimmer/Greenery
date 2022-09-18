export interface PopUpDisplayType {
  mask: boolean;
  cardSelect: boolean;
  cardEditor: boolean;
  cardDetail: boolean;
  diary: boolean;
  textEditor: boolean;
  target: {
    id: string;
    name: string;
  };
}

export enum popUpActions {
  SHOW_CARD_SELECT_TRADE = "SHOW_CARD_SELECT_TRADE",
  SHOW_MASK = "SHOW_MASK",
  HIDE_ALL = "HIDE_ALL",
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
type PopUpDisplayActionTypes = showCardSelectTrade | showMask | hideAll;

const initialState: PopUpDisplayType = {
  mask: false,
  cardSelect: false,
  cardEditor: false,
  cardDetail: false,
  diary: false,
  textEditor: false,
  target: {
    id: "",
    name: "",
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
    default:
      return state;
  }
};
export default popUp;
