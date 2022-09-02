import { PlantCard } from "../types/plantCardType";
export enum CardsActions {
  ADD_NEW_PLANT_CARD,
  DELETE_PLANT_CARD,
  EDIT_PLANT_NAME,
  EDIT_PLANT_OWNER,
  EDIT_PLANT_TAGS,
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
interface editPlantName {
  type: CardsActions.EDIT_PLANT_NAME;
  payload: {
    cardId: string;
    plantName: string;
  };
}
interface editPlantOwner {
  type: CardsActions.EDIT_PLANT_OWNER;
  payload: {
    cardId: string;
    ownerId: string;
  };
}
interface editPlantTags {
  type: CardsActions.EDIT_PLANT_TAGS;
  payload: {
    cardId: string;
    tags: string[];
  };
}
export type CardsActionTypes =
  | addNewPlantCard
  | deletePlantCard
  | editPlantName
  | editPlantOwner
  | editPlantTags;
