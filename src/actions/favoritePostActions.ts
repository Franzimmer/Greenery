import { favoritePost } from "../types/favoritePostType";
export enum favoritePostActions {
  SET_FAVORITE_POSTS_DATA,
  ADD_FAVORITE_POST,
  DELETE_FAVORITE_POST,
}
interface setFavoritePosts {
  type: favoritePostActions.SET_FAVORITE_POSTS_DATA;
  payload: {
    data: favoritePost[];
  };
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
export type favoritePostActionTypes =
  | setFavoritePosts
  | addFavoritePost
  | deletefavoritePost;
