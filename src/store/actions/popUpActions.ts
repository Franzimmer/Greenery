export enum PopUpActions {
  SHOW_CARD_SELECT_TRADE = "SHOW_CARD_SELECT_TRADE",
  SHOW_MASK = "SHOW_MASK",
  HIDE_ALL = "HIDE_ALL",
  SHOW_ALERT = "SHOW_ALERT",
  CLOSE_ALERT = "CLOSE_ALERT",
}
interface showCardSelectTrade {
  type: PopUpActions.SHOW_CARD_SELECT_TRADE;
  payload: {
    targetId: string;
    targetName: string;
  };
}
interface showMask {
  type: PopUpActions.SHOW_MASK;
}
interface hideAll {
  type: PopUpActions.HIDE_ALL;
}
interface showAlert {
  type: PopUpActions.SHOW_ALERT;
  payload: {
    type: "success" | "fail";
    msg: string;
  };
}
interface closeAlert {
  type: PopUpActions.CLOSE_ALERT;
}
export type PopUpActionTypes =
  | showCardSelectTrade
  | showMask
  | hideAll
  | showAlert
  | closeAlert;
