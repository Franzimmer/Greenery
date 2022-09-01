import { CardsActions, CardsActionTypes } from "../actions/cardsActions";
import { PlantCard } from "../types/plantCardType";

const initialCards: PlantCard[] = [];

const cards = (state = initialCards, action: CardsActionTypes) => {
  switch (action.type) {
    case CardsActions.ADD_NEW_PLANT_CARD: {
      let currentCards = [...state];
      currentCards.push(action.payload.newCard);
      return currentCards;
    }
    case CardsActions.DELETE_PLANT_CARD: {
      let currentCards = [...state];
      let deleteCardIndex = currentCards.findIndex(
        (card) => card.cardId === action.payload.cardId
      );
      currentCards.splice(deleteCardIndex, 1);
      return currentCards;
    }
  }
};

export default cards;
