import { favoritePost } from "../types/favoritePostType";
import {
  favoritePostActions,
  favoritePostActionTypes,
} from "../actions/favoritePostActions";
import { act } from "react-dom/test-utils";

const initialFavoritePosts: favoritePost[] = [];

const favoritePosts = (
  state = initialFavoritePosts,
  action: favoritePostActionTypes
) => {
  switch (action.type) {
    case favoritePostActions.ADD_FAVORITE_POST: {
      let currentFavoritePosts = JSON.parse(JSON.stringify(state));
      currentFavoritePosts.push(action.payload.data);
      return currentFavoritePosts;
    }
    case favoritePostActions.DELETE_FAVORITE_POST: {
      let currentFavoritePosts = JSON.parse(JSON.stringify(state));
      let result = currentFavoritePosts.filter(
        (post: favoritePost) => post.articleId !== action.payload.articleId
      );
      return result;
    }
  }
};

export default favoritePosts;
