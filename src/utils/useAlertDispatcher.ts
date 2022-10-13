import { useDispatch } from "react-redux";
import { PopUpActions } from "../store/actions/popUpActions";

export const useAlertDispatcher = () => {
  const dispatch = useDispatch();

  return (type: string, msg: string) => {
    dispatch({
      type: PopUpActions.SHOW_ALERT,
      payload: {
        type,
        msg,
      },
    });
    setTimeout(() => {
      dispatch({
        type: PopUpActions.CLOSE_ALERT,
      });
    }, 2000);
  };
};
