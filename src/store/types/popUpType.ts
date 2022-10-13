export interface PopUpType {
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
