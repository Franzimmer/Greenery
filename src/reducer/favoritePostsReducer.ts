import { favoritePost } from "../types/favoritePostType";
import {
  favoritePostActions,
  favoritePostActionTypes,
} from "../actions/favoritePostActions";

const initialFavoritePosts: favoritePost[] = [];

const favoritePosts = (
  state = initialFavoritePosts,
  action: favoritePostActionTypes
) => {
  switch (action.type) {
    case favoritePostActions.SET_FAVORITE_POSTS_DATA: {
      return action.payload.data;
    }
    case favoritePostActions.ADD_FAVORITE_POST: {
      let currentFavoritePosts = [...state];
      currentFavoritePosts.push(action.payload.data);
      return currentFavoritePosts;
    }
    case favoritePostActions.DELETE_FAVORITE_POST: {
      let currentFavoritePosts = [...state];
      let result = currentFavoritePosts.filter(
        (post: favoritePost) => post.articleId !== action.payload.articleId
      );
      return result;
    }
    default:
      return state;
  }
};

export default favoritePosts;
