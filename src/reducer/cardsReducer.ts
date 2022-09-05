import { CardsActions, CardsActionTypes } from "../actions/cardsActions";
import { PlantCard } from "../types/plantCardType";

let initialCards: PlantCard[] = [];

const cards = (state = initialCards, action: CardsActionTypes) => {
  switch (action.type) {
    case CardsActions.SET_CARDS_DATA: {
      return action.payload.data;
    }
    case CardsActions.ADD_NEW_PLANT_CARD: {
      let currentCards = [...state];
      currentCards.push(action.payload.newCard);
      return currentCards;
    }
    case CardsActions.EDIT_PLANT_INFO: {
      let currentCards = [...state];
      let editTargetIndex = currentCards.findIndex(
        (card) => card.cardId === action.payload.editCard.cardId
      );
      currentCards[editTargetIndex] = action.payload.editCard;
      return currentCards;
    }
    case CardsActions.DELETE_PLANT_CARD: {
      let currentCards = [...state];
      let result = currentCards.filter(
        (card: PlantCard) => card.cardId !== action.payload.cardId
      );
      return result;
    }
    default:
      return state;
  }
};

export default cards;
