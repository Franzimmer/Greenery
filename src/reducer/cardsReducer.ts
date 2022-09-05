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
    case CardsActions.PLANT_PROPAGATE: {
      let currentCards = [...state];
      let parentCard = currentCards.find(
        (card: PlantCard) => card.cardId === action.payload.cardId
      );
      let editCardIndex = currentCards.findIndex(
        (card: PlantCard) => card.cardId === action.payload.cardId
      );

      for (let i = 0; i++; i < action.payload.number) {
        const childCard = {
          ...parentCard,
          cardId: action.payload.childId[i],
          parents: parentCard?.cardId,
          birthday: Date.now(),
        } as PlantCard;
        currentCards.splice(editCardIndex, 0, childCard);
      }
      return currentCards;
    }
    default:
      return state;
  }
};

export default cards;
