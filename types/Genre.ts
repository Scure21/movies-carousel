export type Genre = {
  [key: number]: string;
};

export type Genres =
  | "Adventure"
  | "Fantasy"
  | "Animation"
  | "Drama"
  | "Horror"
  | "Action"
  | "Comedy"
  | "History"
  | "Western"
  | "Thriller"
  | "Crime"
  | "Documentary"
  | "Science Fiction"
  | "Mystery"
  | "Music"
  | "Romance"
  | "Family"
  | "War"
  | "TV Movie";

export type GenresProps = {
  genres: Genres[];
};
