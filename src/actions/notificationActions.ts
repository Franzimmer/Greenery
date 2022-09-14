import { Note } from "../types/notificationType";
export enum NotificationActions {
  SET_NOTIFICATIONS = "SET_NOTIFICATIONS",
  UPDATE_READ_STATUS = "UPDATE_READ_STATUS",
  DELETE_NOTIFICATION = " DELETE_NOTIFICATION",
}
interface setNotifications {
  type: NotificationActions.SET_NOTIFICATIONS;
  payload: {
    data: Note[];
  };
}
interface updateReadStatus {
  type: NotificationActions.UPDATE_READ_STATUS;
  paylaod: {
    noticeId: string;
  };
}
interface deleteNotification {
  type: NotificationActions.DELETE_NOTIFICATION;
  paylaod: {
    noticeId: string;
  };
}
export type NotificationActionTypes =
  | setNotifications
  | updateReadStatus
  | deleteNotification;
