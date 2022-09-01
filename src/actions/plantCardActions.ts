export enum PlantCardActions {
  EDIT_PLANT_NAME,
  EDIT_PLANT_OWNER,
  EDIT_PLANT_TAGS,
}

interface editPlantName {
  type: PlantCardActions.EDIT_PLANT_NAME;
  payload: {
    plantName: string;
  };
}
interface editPlantOwner {
  type: PlantCardActions.EDIT_PLANT_OWNER;
  payload: {
    ownerId: string;
  };
}
interface editPlantTags {
  type: PlantCardActions.EDIT_PLANT_TAGS;
  payload: {
    tags: string[];
  };
}
export type plantCardActionTypes =
  | editPlantName
  | editPlantOwner
  | editPlantTags;
