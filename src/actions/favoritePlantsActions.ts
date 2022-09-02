import { favoritePlant } from "../types/favoritePlantType";
export enum favoritePlantsActions {
  ADD_FAVORITE_PLANT,
  DELETE_FAVORITE_PLANT,
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

export type favoritePlantsActionTypes = addFavoritePlant | deleteFavoritePlant;
