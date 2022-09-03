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
    case NotificationActions.SET_NOTIFICATIONS: {
      return action.payload.data;
    }
    case NotificationActions.UPDATE_READ_STATUS: {
      let currentNotifications = [...state];
      let editTarget = currentNotifications.find(
        (notice: notification) => notice?.msgId === action.paylaod?.msgId
      ) as notification;
      if (editTarget) editTarget["read"] = true;
      return currentNotifications;
    }
    case NotificationActions.DELETE_NOTIFICATION: {
      let currentNotifications = [...state];
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
