import { useState } from "react";
import { useMovieContext } from "../contexts/MovieContext";
import MovieModal from "./MovieModal";
import "../css/MovieCard.css";

function MovieCard({ movie }) {
  const { isFavorite, addToFavorites, removeFromFavorites } = useMovieContext();
  const [showModal, setShowModal] = useState(false);
  const favorite = isFavorite(movie.id);

  const rating = movie.vote_average?.toFixed(1);
  const ratingClass =
    movie.vote_average >= 7 ? "rating-green" :
    movie.vote_average >= 5 ? "rating-yellow" : "rating-red";

  function onFavoriteClick(e) {
    e.preventDefault();
    e.stopPropagation();
    if (favorite) removeFromFavorites(movie.id, movie.title);
    else addToFavorites(movie);
  }

  return (
    <>
      <div className="movie-card" onClick={() => setShowModal(true)}>
        {/* Rating badge */}
        <div className={`rating-badge ${ratingClass}`}>⭐ {rating}</div>

        <div className="movie-poster">
          <img
            src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
            alt={movie.title}
            loading="lazy"
          />
          <div className="movie-overlay">
            <p className="overlay-overview">
              {movie.overview?.slice(0, 120)}
              {movie.overview?.length > 120 ? "..." : ""}
            </p>
            <span className="overlay-cta">View Details →</span>
          </div>
        </div>

        <div className="movie-info">
          <h3>{movie.title}</h3>
          <p className="movie-year">{movie.release_date?.split("-")[0]}</p>
        </div>

        <button
          className={`favorite-btn ${favorite ? "active" : ""}`}
          onClick={onFavoriteClick}
          title={favorite ? "Remove from favorites" : "Add to favorites"}
          aria-label={favorite ? "Remove from favorites" : "Add to favorites"}
        >
          {favorite ? "❤️" : "🤍"}
        </button>
      </div>

      {showModal && (
        <MovieModal movie={movie} onClose={() => setShowModal(false)} />
      )}
    </>
  );
}

export default MovieCard;