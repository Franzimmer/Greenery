import { notification } from "../types/notificationType";
export enum NotificationActions {
  SET_NOTIFICATIONS,
  UPDATE_READ_STATUS,
  DELETE_NOTIFICATION,
}
interface setNotifications {
  type: NotificationActions.SET_NOTIFICATIONS;
  payload: {
    data: notification[];
  };
}
interface updateReadStatus {
  type: NotificationActions.UPDATE_READ_STATUS;
  paylaod: {
    msgId: string;
  };
}
interface deleteNotification {
  type: NotificationActions.DELETE_NOTIFICATION;
  paylaod: {
    msgId: string;
  };
}
export type NotificationActionTypes =
  | setNotifications
  | updateReadStatus
  | deleteNotification;
