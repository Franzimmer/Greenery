export enum CardsActions {
  ADD_NEW_PLANT_CARD,
  DELETE_PLANT_CARD,
}
interface addNewPlantCard {
  type: CardsActions.ADD_NEW_PLANT_CARD;
  payload: {
    cardId: string;
    ownerId: string;
    plantName: string;
    species: string;
    tags: string[];
    birthday?: number;
    parents?: string[];
  };
}
interface deletePlantCard {
  type: CardsActions.DELETE_PLANT_CARD;
}
export type CardsActionTypes = addNewPlantCard | deletePlantCard;
