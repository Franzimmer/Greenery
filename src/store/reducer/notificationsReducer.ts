import { Note } from "../types/notificationType";
import {
  NotificationActions,
  NotificationActionTypes,
} from "../actions/notificationActions";
const initialNotifications: Note[] = [];

const notifications = (
  state = initialNotifications,
  action: NotificationActionTypes
) => {
  switch (action.type) {
    case NotificationActions.SET_NOTIFICATIONS: {
      return action.payload.data;
    }
    case NotificationActions.UPDATE_READ_STATUS: {
      const currentNotifications = [...state];
      const editTarget = currentNotifications.find(
        (notice: Note) => notice?.noticeId === action.paylaod?.noticeId
      ) as Note;
      if (editTarget) editTarget["read"] = true;
      return currentNotifications;
    }
    case NotificationActions.DELETE_NOTIFICATION: {
      const currentNotifications = [...state];
      const result = currentNotifications.filter(
        (notice: Note) => notice.noticeId !== action.paylaod?.noticeId
      );
      return result;
    }
    case NotificationActions.CLEAR_NOTIFICATION: {
      return initialNotifications;
    }
    default:
      return state;
  }
};
export default notifications;
