import { favoritePlant } from "../types/favoritePlantType";
export enum favoritePlantsActions {
  SET_FAVORITE_PLANTS_DATA,
  ADD_FAVORITE_PLANT,
  DELETE_FAVORITE_PLANT,
}
interface setFavoritePlantsData {
  type: favoritePlantsActions.SET_FAVORITE_PLANTS_DATA;
  payload: {
    data: favoritePlant[];
  };
}
interface addFavoritePlant {
  type: favoritePlantsActions.ADD_FAVORITE_PLANT;
  payload: {
    data: favoritePlant;
  };
}
interface deleteFavoritePlant {
  type: favoritePlantsActions.DELETE_FAVORITE_PLANT;
  payload: {
    cardId: string;
  };
}

export type favoritePlantsActionTypes =
  | setFavoritePlantsData
  | addFavoritePlant
  | deleteFavoritePlant;
