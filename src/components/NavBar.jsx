import { Link, useLocation } from "react-router-dom";
import { useMovieContext } from "../contexts/MovieContext";
import "../css/Navbar.css";

function NavBar() {
  const location = useLocation();
  const { favorites } = useMovieContext();

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/">🎬 CineVerse</Link>
      </div>
      <div className="navbar-right">
        <Link
          to="/"
          className={`nav-link ${location.pathname === "/" ? "active" : ""}`}
        >
          Home
        </Link>
        <Link
          to="/favorites"
          className={`nav-link ${location.pathname === "/favorites" ? "active" : ""}`}
        >
          Favorites
          {favorites.length > 0 && (
            <span className="fav-badge">{favorites.length}</span>
          )}
        </Link>
      </div>
    </nav>
  );
}

export default NavBar;