import { PlantCard } from "../types/plantCardType";
import {
  PlantCardActions,
  plantCardActionTypes,
} from "../actions/plantCardActions";

const initialCard: PlantCard = {
  cardId: "",
  ownerId: "",
  plantName: "",
  species: "",
  tags: [],
};

const plantCard = (state = initialCard, action: plantCardActionTypes) => {
  switch (action.type) {
    case PlantCardActions.EDIT_PLANT_NAME: {
      return {
        ...state,
        plantName: action.payload.plantName,
      };
    }
    case PlantCardActions.EDIT_PLANT_OWNER: {
      return {
        ...state,
        ownerId: action.payload.ownerId,
      };
    }
    case PlantCardActions.EDIT_PLANT_TAGS: {
      return {
        ...state,
        tags: action.payload.tags,
      };
    }
  }
};

export default plantCard;
