import { favoritePlant } from "../types/favoritePlantType";
import {
  favoritePlantsActions,
  favoritePlantsActionTypes,
} from "../actions/favoritePlantsActions";

const initialFavoritePlants: favoritePlant[] = [];

const favoritePlants = (
  state = initialFavoritePlants,
  action: favoritePlantsActionTypes
) => {
  switch (action.type) {
    case favoritePlantsActions.SET_FAVORITE_PLANTS_DATA: {
      return action.payload.data;
    }
    case favoritePlantsActions.ADD_FAVORITE_PLANT: {
      let currentFavoritePlants = [...state];
      currentFavoritePlants.push(action.payload.data);
      return currentFavoritePlants;
    }
    case favoritePlantsActions.DELETE_FAVORITE_PLANT: {
      let currentFavoritePlants = [...state];
      const result = currentFavoritePlants.filter(
        (plant: favoritePlant) => plant.cardId !== action.payload.cardId
      );
      return result;
    }
    default:
      return state;
  }
};

export default favoritePlants;
