import { Chatrooms } from "../types/chatroomType";
import {
  ChatroomActions,
  ChatroomActionType,
} from "../actions/chatroomActions";
const initialState = {
  allRooms: [],
  activeRooms: [],
};
const chatrooms = (
  state: Chatrooms = initialState,
  action: ChatroomActionType
) => {
  switch (action.type) {
    case ChatroomActions.SET_CHATROOMDATA: {
      return { ...state, allRooms: action.payload.targetInfos };
    }
    case ChatroomActions.ADD_CHATROOM: {
      const currentRooms = [...state.allRooms];
      const checkTarget = currentRooms.find(
        (room) => room.userId === action.payload.targetInfo.userId
      );
      if (!checkTarget) {
        currentRooms.push(action.payload.targetInfo);
        return { ...state, allRooms: currentRooms };
      } else return state;
    }
    case ChatroomActions.OPEN_CHATROOM: {
      const width =
        window.innerWidth > 0 ? window.innerWidth : window.screen.width;
      let limit: number = 3;
      if (width > 1200) limit = 3;
      else if (width <= 1200 && width > 820) limit = 2;
      else limit = 1;
      const currentActive = [...state.activeRooms];
      const currentAllRooms = [...state.allRooms];
      const openCount = currentActive.length;
      const target = currentAllRooms.find(
        (room) => room.userId === action.payload.targetId
      );
      if (target && currentActive.includes(target)) return state;
      if (openCount < limit && target) {
        currentActive.push(target);
        return { ...state, activeRooms: currentActive };
      } else if (openCount === limit && target) {
        const currentActive = [...state.activeRooms];
        currentActive.shift();
        currentActive.push(target);
        return { ...state, activeRooms: currentActive };
      } else return state;
    }
    case ChatroomActions.CLOSE_CHATROOM: {
      const currentActive = [...state.activeRooms];
      const target = currentActive.find(
        (room) => room.userId === action.payload.targetId
      );
      if (!target) return;
      const index = currentActive.findIndex(
        (room) => room.userId === action.payload.targetId
      ) as number;
      currentActive.splice(index, 1);
      return { ...state, activeRooms: currentActive };
    }
    case ChatroomActions.CLOSE_ALL_ROOMS: {
      return { ...state, activeRooms: [] };
    }
    default:
      return state;
  }
};

export default chatrooms;
