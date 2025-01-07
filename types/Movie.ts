import { Genres } from "./Genre";

export type Movie = {
  key: string;
  title?: string;
  poster?: string;
  backdrop?: string;
  rating?: number;
  description?: string;
  releaseDate?: string;
  genres?: Genres[];
};

export interface EmptyItem {
  key: "empty-left" | "empty-right";
}

export type MovieListState = [EmptyItem, ...Movie[], EmptyItem];
