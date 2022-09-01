import { PlantCard } from "../types/plantCardType";
export enum CardsActions {
  ADD_NEW_PLANT_CARD,
  DELETE_PLANT_CARD,
}
interface addNewPlantCard {
  type: CardsActions.ADD_NEW_PLANT_CARD;
  payload: {
    newCard: PlantCard;
  };
}
interface deletePlantCard {
  type: CardsActions.DELETE_PLANT_CARD;
  payload: {
    cardId: string;
  };
}
export type CardsActionTypes = addNewPlantCard | deletePlantCard;
