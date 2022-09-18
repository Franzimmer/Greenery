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
  HIDE_ALL = "HIDE_ALL",
}
interface showCardSelectTrade {
  type: popUpActions.SHOW_CARD_SELECT_TRADE;
  payload: {
    targetId: string;
    targetName: string;
  };
}
interface hideAll {
  type: popUpActions.HIDE_ALL;
}
type PopUpDisplayActionTypes = showCardSelectTrade | hideAll;

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
    case popUpActions.HIDE_ALL: {
      return initialState;
    }
    default:
      return state;
  }
};
export default popUp;
