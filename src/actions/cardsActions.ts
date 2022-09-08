import { PlantCard } from "../types/plantCardType";
export enum CardsActions {
  SET_CARDS_DATA = "SET_CARDS_DATA",
  ADD_NEW_PLANT_CARD = "ADD_NEW_PLANT_CARD",
  DELETE_PLANT_CARD = "DELETE_PLANT_CARD",
  EDIT_PLANT_INFO = "EDIT_PLANT_INFO",
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
export type CardsActionTypes =
  | getCardsData
  | addNewPlantCard
  | editPlantCard
  | deletePlantCard;
