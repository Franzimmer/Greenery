import { notification } from "../types/notificationType";
import {
  NotificationActions,
  NotificationActionTypes,
} from "../actions/notificationActions";
const initialNotifications: notification[] = [];

const notifications = (
  state = initialNotifications,
  action: NotificationActionTypes
) => {
  switch (action.type) {
    case NotificationActions.UPDATE_READ_STATUS: {
      let currentNotifications = JSON.parse(JSON.stringify(state));
      let editTarget = currentNotifications.findIndex(
        (notice: notification) => notice.msgId === action.paylaod.msgId
      );
      editTarget.read = true;
      return currentNotifications;
    }
    case NotificationActions.DELETE_NOTIFICATION: {
      let currentNotifications = JSON.parse(JSON.stringify(state));
      let result = currentNotifications.filter(
        (notice: notification) => notice.msgId !== action.paylaod.msgId
      );
      return result;
    }
    default:
      return state;
  }
};
export default notifications;
