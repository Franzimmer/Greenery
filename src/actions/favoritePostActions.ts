import { favoritePost } from "../types/favoritePostType";
export enum favoritePostActions {
  ADD_FAVORITE_POST,
  DELETE_FAVORITE_POST,
}

interface addFavoritePost {
  type: favoritePostActions.ADD_FAVORITE_POST;
  payload: {
    data: favoritePost;
  };
}
interface deletefavoritePost {
  type: favoritePostActions.DELETE_FAVORITE_POST;
  payload: {
    articleId: string;
  };
}
export type favoritePostActionTypes = addFavoritePost | deletefavoritePost;
