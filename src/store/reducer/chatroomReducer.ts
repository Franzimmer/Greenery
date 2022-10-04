import { ChatroomType } from "../types/chatroomType";
import {
  ChatroomActions,
  ChatroomActionType,
} from "../actions/chatroomActions";

const chatroom = (state: ChatroomType[] = [], action: ChatroomActionType) => {
  switch (action.type) {
    case ChatroomActions.SET_CHATROOMDATA: {
      const newState = action.payload.targetInfos.map((user) => {
        return { targetInfo: user, chatroomDisplay: false };
      });
      return newState;
    }
    case ChatroomActions.ADD_CHATROOM: {
      const newRoom = {
        targetInfo: action.payload.targetInfo,
        chatroomDisplay: true,
      };
      return [...state, newRoom];
    }
    case ChatroomActions.OPEN_CHATROOM: {
      const target = state.find(
        (room) => room.targetInfo.userId === action.payload.targetId
      );
      if (!target) return;
      const index = state.findIndex(
        (room) => room.targetInfo.userId === action.payload.targetId
      ) as number;
      target!.chatroomDisplay = true;
      const newState = [...state];
      newState[index] = target;
      return newState;
    }
    case ChatroomActions.CLOSE_CHATROOM: {
      const target = state.find(
        (room) => room.targetInfo.userId === action.payload.targetId
      );
      if (!target) return;
      const index = state.findIndex(
        (room) => room.targetInfo.userId === action.payload.targetId
      ) as number;
      target!.chatroomDisplay = false;
      const newState = [...state];
      newState[index] = target;
      return newState;
    }
    case ChatroomActions.CLOSE_ALL_ROOMS: {
      const newState = state.map((room) => {
        return (room.chatroomDisplay = false);
      });
      return newState;
    }
    default:
      return state;
  }
};

export default chatroom;
