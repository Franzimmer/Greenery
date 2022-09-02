export enum NotificationActions {
  UPDATE_READ_STATUS,
  DELETE_NOTIFICATION,
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
export type NotificationActionTypes = updateReadStatus | deleteNotification;
