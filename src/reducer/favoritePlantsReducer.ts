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
    case favoritePlantsActions.ADD_FAVORITE_PLANT: {
      let currentFavoritePlants = JSON.parse(JSON.stringify(state));
      currentFavoritePlants.push(action.payload.data);
      return currentFavoritePlants;
    }
    case favoritePlantsActions.DELETE_FAVORITE_PLANT: {
      let currentFavoritePlants = JSON.parse(JSON.stringify(state));
      const result = currentFavoritePlants.filter(
        (plant: favoritePlant) => plant.cardId !== action.payload.cardId
      );
      return result;
    }
  }
};

export default favoritePlants;
