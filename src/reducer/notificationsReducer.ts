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
      let currentNotifications = [...state];
      let editTarget = currentNotifications.find(
        (notice: Note) => notice?.noticeId === action.paylaod?.noticeId
      ) as Note;
      if (editTarget) editTarget["read"] = true;
      return currentNotifications;
    }
    case NotificationActions.DELETE_NOTIFICATION: {
      let currentNotifications = [...state];
      let result = currentNotifications.filter(
        (notice: Note) => notice.noticeId !== action.paylaod?.noticeId
      );
      return result;
    }
    default:
      return state;
  }
};
export default notifications;
