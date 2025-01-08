import { API_KEY, TOKEN } from "./config";
import { ApiMovie, Genre, Movie } from "./types";

const genres: Genre = {
  12: "Adventure",
  14: "Fantasy",
  16: "Animation",
  18: "Drama",
  27: "Horror",
  28: "Action",
  35: "Comedy",
  36: "History",
  37: "Western",
  53: "Thriller",
  80: "Crime",
  99: "Documentary",
  878: "Science Fiction",
  9648: "Mystery",
  10402: "Music",
  10749: "Romance",
  10751: "Family",
  10752: "War",
  10770: "TV Movie",
};

const API_URL = `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&sort_by=popularity.desc`;

const getImagePath = (path: string) =>
  `https://image.tmdb.org/t/p/w440_and_h660_face${path}`;

const getBackdropPath = (path: string) =>
  `https://image.tmdb.org/t/p/w370_and_h556_multi_faces${path}`;

export const getMovies = async () => {
  const { results } = await fetch(API_URL).then((x) => x.json());
  const movies: Movie[] = results.map(
    ({
      id,
      original_title,
      poster_path,
      backdrop_path,
      vote_average,
      overview,
      release_date,
      genre_ids,
    }: ApiMovie) => ({
      key: id,
      title: original_title,
      poster: getImagePath(poster_path),
      backdrop: getBackdropPath(backdrop_path),
      rating: vote_average,
      description: overview,
      releaseDate: release_date,
      genres: genre_ids.map((genre) => genres[genre]),
    })
  );

  return movies;
};

export const getMovieDetails = async (id: number) => {
  const results = await fetch(
    `https://api.themoviedb.org/3/movie/${id}?append_to_response=credits`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${TOKEN}`,
        "Content-Type": "application/json",
      },
    }
  )
    .then((x) => x.json())
    .catch((error) => console.log("Error getting movie details: ", error));

  const directors = results.credits.crew.filter(
    (person: { job: string }) => person.job === "Director"
  );

  // get the first 5 cast members
  const cast = results.credits.cast.slice(0, 5);

  const movie = {
    key: results.id,
    title: results.original_title,
    poster: getImagePath(results.poster_path),
    backdrop: getBackdropPath(results.backdrop_path),
    rating: results.vote_average,
    description: results.overview,
    releaseDate: results.release_date,
    genres: results.genres.map(
      (genre: { id: number; name: string }) => genre.name
    ),
    directors:
      directors.map((director: { name: string }) => director.name)[0] ||
      "Unknown",
    cast: cast.map(
      (actor: { name: string; profile_path: string; character: string }) => ({
        name: actor.name,
        image: actor.profile_path ? getImagePath(actor.profile_path) : null,
        character: actor.character,
      })
    ),
  };

  return movie;
};
