import { useEffect, useState } from "react";
import { getMovieDetails } from "../services/api";
import { useMovieContext } from "../contexts/MovieContext";
import "../css/MovieModal.css";

function MovieModal({ movie, onClose }) {
  const [details, setDetails] = useState(null);
  const { isFavorite, addToFavorites, removeFromFavorites } = useMovieContext();
  const favorite = isFavorite(movie.id);

  useEffect(() => {
    getMovieDetails(movie.id).then(setDetails).catch(console.error);
  }, [movie.id]);

  // Close on Escape key
  useEffect(() => {
    const handleKey = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose]);

  // Prevent body scroll while modal is open
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  const handleFavorite = (e) => {
    e.stopPropagation();
    if (favorite) removeFromFavorites(movie.id, movie.title);
    else addToFavorites(movie);
  };

  const ratingColor = (r) => r >= 7 ? "var(--green)" : r >= 5 ? "var(--yellow)" : "var(--red)";

  const runtime = details?.runtime
    ? `${Math.floor(details.runtime / 60)}h ${details.runtime % 60}m`
    : null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose} aria-label="Close">✕</button>

        {/* Backdrop blur image */}
        {movie.backdrop_path && (
          <div
            className="modal-backdrop"
            style={{ backgroundImage: `url(https://image.tmdb.org/t/p/w1280${movie.backdrop_path})` }}
          />
        )}

        <div className="modal-body">
          {/* Poster */}
          <div className="modal-poster">
            <img
              src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
              alt={movie.title}
            />
          </div>

          {/* Info */}
          <div className="modal-info">
            <h2 className="modal-title">{movie.title}</h2>
            {details?.tagline && (
              <p className="modal-tagline">"{details.tagline}"</p>
            )}

            {/* Meta row */}
            <div className="modal-meta">
              <span
                className="modal-rating"
                style={{ color: ratingColor(movie.vote_average) }}
              >
                ⭐ {movie.vote_average?.toFixed(1)}
              </span>
              <span className="modal-dot">·</span>
              <span>{movie.release_date?.split("-")[0]}</span>
              {runtime && (
                <>
                  <span className="modal-dot">·</span>
                  <span>🕐 {runtime}</span>
                </>
              )}
            </div>

            {/* Genres */}
            {details?.genres?.length > 0 && (
              <div className="modal-genres">
                {details.genres.map((g) => (
                  <span key={g.id} className="genre-chip">{g.name}</span>
                ))}
              </div>
            )}

            {/* Overview */}
            <p className="modal-overview">{movie.overview}</p>

            {/* CTA */}
            <button
              className={`modal-fav-btn ${favorite ? "active" : ""}`}
              onClick={handleFavorite}
            >
              {favorite ? "💔 Remove from Favorites" : "❤️ Add to Favorites"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MovieModal;
