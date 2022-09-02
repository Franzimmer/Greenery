import { CardsActions, CardsActionTypes } from "../actions/cardsActions";
import { PlantCard } from "../types/plantCardType";

const initialCards: PlantCard[] = [];

const cards = (state = initialCards, action: CardsActionTypes) => {
  switch (action.type) {
    case CardsActions.ADD_NEW_PLANT_CARD: {
      let currentCards = JSON.parse(JSON.stringify(state));
      currentCards.push(action.payload.newCard);
      return currentCards;
    }
    case CardsActions.DELETE_PLANT_CARD: {
      let currentCards = JSON.parse(JSON.stringify(state));
      let deleteCardIndex = currentCards.findIndex(
        (card: PlantCard) => card.cardId === action.payload.cardId
      );
      currentCards.splice(deleteCardIndex, 1);
      return currentCards;
    }
    case CardsActions.EDIT_PLANT_NAME: {
      let currentCards = JSON.parse(JSON.stringify(state));
      let editCardIndex = currentCards.findIndex(
        (card: PlantCard) => card.cardId === action.payload.cardId
      );
      currentCards[editCardIndex].plantName = action.payload.plantName;
      return currentCards;
    }
    case CardsActions.EDIT_PLANT_TAGS: {
      let currentCards = JSON.parse(JSON.stringify(state));
      let editCardIndex = currentCards.findIndex(
        (card: PlantCard) => card.cardId === action.payload.cardId
      );
      currentCards[editCardIndex].tags.concat(action.payload.tags);
      return currentCards;
    }
    case CardsActions.EDIT_PLANT_OWNER: {
      let currentCards = JSON.parse(JSON.stringify(state));
      let editCardIndex = currentCards.findIndex(
        (card: PlantCard) => card.cardId === action.payload.cardId
      );
      currentCards[editCardIndex].ownerId = action.payload.cardId;
      return currentCards;
    }
  }
};

export default cards;
