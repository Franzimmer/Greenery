import { UserInfo } from "../types/userInfoType";

export interface ChatroomType {
  targetInfo: UserInfo;
  chatroomDisplay: boolean;
}
export enum ChatroomActions {
  SET_CHATROOMDATA = "SET_CHATROOMDATA",
  ADD_CHATROOM = "SET_CHATROOM",
  OPEN_CHATROOM = "OPEN_CHATROOM",
  CLOSE_CHATROOM = "CLOSE_CHATROOM",
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
    chatroomDisplay: boolean;
  };
}
interface closeChatroom {
  type: ChatroomActions.CLOSE_CHATROOM;
  payload: {
    targetId: string;
    chatroomDisplay: boolean;
  };
}

type ChatroomActionType =
  | setChatroom
  | addChatroom
  | openChatroom
  | closeChatroom;

const chatroom = (state: ChatroomType[] = [], action: ChatroomActionType) => {
  switch (action.type) {
    case ChatroomActions.SET_CHATROOMDATA: {
      let newState = action.payload.targetInfos.map((user) => {
        return { targetInfo: user, chatroomDisplay: false };
      });
      return newState;
    }
    case ChatroomActions.ADD_CHATROOM: {
      let newRoom = {
        targetInfo: action.payload.targetInfo,
        chatroomDisplay: true,
      };
      return [...state, newRoom];
    }
    case ChatroomActions.OPEN_CHATROOM: {
      let target = state.find(
        (room) => room.targetInfo.userId === action.payload.targetId
      );
      if (!target) return;
      let index = state.findIndex(
        (room) => room.targetInfo.userId === action.payload.targetId
      ) as number;
      target!.chatroomDisplay = true;
      let newState = [...state];
      newState[index] = target;
      return newState;
    }
    case ChatroomActions.CLOSE_CHATROOM: {
      let target = state.find(
        (room) => room.targetInfo.userId === action.payload.targetId
      );
      if (!target) return;
      let index = state.findIndex(
        (room) => room.targetInfo.userId === action.payload.targetId
      ) as number;
      target!.chatroomDisplay = false;
      let newState = [...state];
      newState[index] = target;
      return newState;
    }
    default:
      return state;
  }
};

export default chatroom;
