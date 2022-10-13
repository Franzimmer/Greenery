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
      const width =
        window.innerWidth > 0 ? window.innerWidth : window.screen.width;
      let limit: number = 3;
      if (width > 1200) limit = 3;
      else if (width <= 1200 && width > 820) limit = 2;
      else limit = 1;
      const currentState = [...state];
      let openCount = 0;
      currentState.forEach((room) => {
        if (room.chatroomDisplay) openCount += 1;
      });
      if (openCount < limit) {
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
      } else return state;
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
      if (state.length > 0) {
        state.forEach((room: ChatroomType) => {
          room["chatroomDisplay"] = false;
        });
        const newState = [...state];
        return newState;
      } else return state;
    }
    default:
      return state;
  }
};

export default chatroom;
