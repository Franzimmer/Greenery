import { PlantCard } from "../types/plantCardType";
export enum CardsActions {
  ADD_NEW_PLANT_CARD,
  DELETE_PLANT_CARD,
  EDIT_PLANT_SPECIES,
  EDIT_PLANT_NAME,
  EDIT_PLANT_PHOTO,
  EDIT_PLANT_OWNER,
  EDIT_PLANT_TAGS,
  PLANT_PROPAGATE,
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
interface editPlantSpecies {
  type: CardsActions.EDIT_PLANT_SPECIES;
  payload: {
    cardId: string;
    species: string;
    waterPref: string;
    lightPref: string;
  };
}
interface editPlantPhoto {
  type: CardsActions.EDIT_PLANT_PHOTO;
  payload: {
    cardId: string;
    plantPhoto: string;
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
interface plantPropogate {
  type: CardsActions.PLANT_PROPAGATE;
  payload: {
    cardId: string;
    number: number;
    childId: string[];
  };
}
export type CardsActionTypes =
  | addNewPlantCard
  | deletePlantCard
  | editPlantName
  | editPlantSpecies
  | editPlantPhoto
  | editPlantOwner
  | editPlantTags
  | plantPropogate;
