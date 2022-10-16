import { UserInfo } from "../types/userInfoType";
export enum ChatroomActions {
  SET_CHATROOMDATA = "SET_CHATROOMDATA",
  ADD_CHATROOM = "SET_CHATROOM",
  OPEN_CHATROOM = "OPEN_CHATROOM",
  CLOSE_CHATROOM = "CLOSE_CHATROOM",
  CLOSE_ALL_ROOMS = "CLOSE_ALL_ROOMS",
}
interface setChatroom {
  type: ChatroomActions.SET_CHATROOMDATA;
  payload: {
    targetInfos: UserInfo[];
  };
}
interface addChatroom {
  type: ChatroomActions.ADD_CHATROOM;
  payload: {
    targetInfo: UserInfo;
  };
}
interface openChatroom {
  type: ChatroomActions.OPEN_CHATROOM;
  payload: {
    targetId: string;
  };
}
interface closeChatroom {
  type: ChatroomActions.CLOSE_CHATROOM;
  payload: {
    targetId: string;
  };
}
interface closeRooms {
  type: ChatroomActions.CLOSE_ALL_ROOMS;
}
export type ChatroomActionType =
  | setChatroom
  | addChatroom
  | openChatroom
  | closeChatroom
  | closeRooms;
