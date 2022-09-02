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
      let result = currentCards.filter(
        (card: PlantCard) => card.cardId !== action.payload.cardId
      );
      return result;
    }
    case CardsActions.EDIT_PLANT_NAME: {
      let currentCards = JSON.parse(JSON.stringify(state));
      let editCardIndex = currentCards.findIndex(
        (card: PlantCard) => card.cardId === action.payload.cardId
      );
      currentCards[editCardIndex].plantName = action.payload.plantName;
      return currentCards;
    }
    case CardsActions.EDIT_PLANT_SPECIES: {
      let currentCards = JSON.parse(JSON.stringify(state));
      let editCardIndex = currentCards.findIndex(
        (card: PlantCard) => card.cardId === action.payload.cardId
      );
      currentCards[editCardIndex].species = action.payload.species;
      currentCards[editCardIndex].waterPref = action.payload.waterPref;
      currentCards[editCardIndex].lightPref = action.payload.lightPref;
      return currentCards;
    }
    case CardsActions.EDIT_PLANT_PHOTO: {
      let currentCards = JSON.parse(JSON.stringify(state));
      let editCardIndex = currentCards.findIndex(
        (card: PlantCard) => card.cardId === action.payload.cardId
      );
      currentCards[editCardIndex].plantPhoto = action.payload.plantPhoto;
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
      currentCards.splice(editCardIndex, 1);
      return currentCards;
    }
    case CardsActions.PLANT_PROPAGATE: {
      let currentCards = JSON.parse(JSON.stringify(state));
      let parentCard = currentCards.find(
        (card: PlantCard) => card.cardId === action.payload.cardId
      );
      let editCardIndex = currentCards.findIndex(
        (card: PlantCard) => card.cardId === action.payload.cardId
      );

      let childCard = {
        ...parentCard,
        parents: parentCard.cardId,
        birthday: Date.now(),
      };
      for (let i = 0; i++; i < action.payload.number) {
        currentCards.splice(editCardIndex, childCard);
      }
      return currentCards;
    }
  }
};

export default cards;
