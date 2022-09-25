import { PlantCard } from "../types/plantCardType";
export enum CardsActions {
  SET_CARDS_DATA = "SET_CARDS_DATA",
  ADD_NEW_PLANT_CARD = "ADD_NEW_PLANT_CARD",
  DELETE_PLANT_CARD = "DELETE_PLANT_CARD",
  DELETE_PLANT_CARDS = "DELETE_PLANT_CARDS",
  EDIT_PLANT_INFO = "EDIT_PLANT_INFO",
  CLEAR_CARDS_DATA = "CLEAR_CARDS_DATA",
}
interface getCardsData {
  type: CardsActions.SET_CARDS_DATA;
  payload: {
    data: PlantCard[];
  };
}
interface addNewPlantCard {
  type: CardsActions.ADD_NEW_PLANT_CARD;
  payload: {
    newCard: PlantCard;
  };
}
interface editPlantCard {
  type: CardsActions.EDIT_PLANT_INFO;
  payload: {
    editCard: PlantCard;
  };
}
interface deletePlantCard {
  type: CardsActions.DELETE_PLANT_CARD;
  payload: {
    cardId: string;
  };
}
interface deletePlantCards {
  type: CardsActions.DELETE_PLANT_CARDS;
  payload: {
    cardIds: string[];
  };
}
interface clearCardsData {
  type: CardsActions.CLEAR_CARDS_DATA;
}
export type CardsActionTypes =
  | getCardsData
  | addNewPlantCard
  | editPlantCard
  | deletePlantCard
  | deletePlantCards
  | clearCardsData;
