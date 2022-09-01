import { CardsActions, CardsActionTypes } from "../actions/cardsActions";
import { PlantCard } from "../types/plantCardType";

const initialCards: PlantCard[] = [];

const cards = (state = initialCards, action: CardsActionTypes) => {
  switch (action.type) {
    case CardsActions.ADD_NEW_PLANT_CARD: {
      return {
        cardId: action.payload.cardId,
        ownerId: action.payload.ownerId,
        plantName: action.payload.plantName,
        species: action.payload.species,
        tags: action.payload.tags,
        birthday: action.payload?.birthday,
        parents: action.payload?.parents,
      };
    }
    case CardsActions.DELETE_PLANT_CARD: {
      return;
    }
  }
};
