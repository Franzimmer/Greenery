import { useDispatch } from "react-redux";
import { popUpActions } from "../store/reducer/popUpReducer";

export const useAlertDispatcher = () => {
  const dispatch = useDispatch();

  return (type: string, msg: string) => {
    dispatch({
      type: popUpActions.SHOW_ALERT,
      payload: {
        type,
        msg,
      },
    });
    setTimeout(() => {
      dispatch({
        type: popUpActions.CLOSE_ALERT,
      });
    }, 2000);
  };
};
