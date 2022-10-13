import { CardsActions, CardsActionTypes } from "../actions/cardsActions";
import { PlantCard } from "../types/plantCardType";

let initialCards: PlantCard[] = [];

const cards = (state = initialCards, action: CardsActionTypes) => {
  switch (action.type) {
    case CardsActions.SET_CARDS_DATA: {
      return action.payload.data;
    }
    case CardsActions.ADD_NEW_PLANT_CARD: {
      return [...state, action.payload.newCard];
    }
    case CardsActions.EDIT_PLANT_INFO: {
      const currentCards = [...state];
      const editTargetIndex = currentCards.findIndex(
        (card) => card.cardId === action.payload.editCard.cardId
      );
      currentCards[editTargetIndex] = action.payload.editCard;
      return currentCards;
    }
    case CardsActions.DELETE_PLANT_CARD: {
      const currentCards = [...state];
      const result = currentCards.filter(
        (card: PlantCard) => card.cardId !== action.payload.cardId
      );
      return result;
    }
    case CardsActions.DELETE_PLANT_CARDS: {
      const currentCards = [...state];
      const result = currentCards.filter(
        (card: PlantCard) =>
          action.payload.cardIds.includes(card.cardId!) === false
      );
      return result;
    }
    case CardsActions.CLEAR_CARDS_DATA: {
      return initialCards;
    }
    default:
      return state;
  }
};

export default cards;
