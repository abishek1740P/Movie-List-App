import { useNavigate } from "react-router-dom";
import { useMovieContext } from "../contexts/MovieContext";
import MovieCard from "../components/MovieCard";
import "../css/Favorites.css";

function Favorites() {
  const { favorites } = useMovieContext();
  const navigate = useNavigate();

  if (favorites.length > 0) {
    return (
      <div className="favorites">
        <div className="favorites-header">
          <h2>Your Favorites</h2>
          <span className="fav-count">{favorites.length} Movie{favorites.length !== 1 ? "s" : ""}</span>
        </div>
        <div className="movies-grid">
          {favorites.map((movie) => (
            <MovieCard movie={movie} key={movie.id} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="favorites-empty">
      <div className="empty-icon">🎬</div>
      <h2>No Favorites Yet</h2>
      <p>Start exploring and save movies you love. They'll all appear here!</p>
      <button className="browse-btn" onClick={() => navigate("/")}>
        Browse Movies →
      </button>
    </div>
  );
}

export default Favorites;
