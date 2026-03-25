import MovieCard from "../components/MovieCard";
import { useState, useEffect, useRef } from "react";
import {
  searchMovies,
  getPopularMovies,
  getTopRated,
  getUpcoming,
  getNowPlaying,
  getGenres,
} from "../services/api";
import "../css/Home.css";

const TABS = [
  { id: "popular",    label: "🔥 Popular" },
  { id: "top_rated",  label: "⭐ Top Rated" },
  { id: "upcoming",   label: "🎬 Upcoming" },
  { id: "now_playing",label: "▶️ Now Playing" },
];

const fetchByTab = {
  popular:     getPopularMovies,
  top_rated:   getTopRated,
  upcoming:    getUpcoming,
  now_playing: getNowPlaying,
};

function SkeletonCard() {
  return (
    <div className="skeleton-card">
      <div className="skeleton-poster shimmer" />
      <div className="skeleton-info">
        <div className="skeleton-line shimmer" />
        <div className="skeleton-line short shimmer" />
      </div>
    </div>
  );
}

function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("popular");
  const [movies, setMovies] = useState([]);
  const [allMovies, setAllMovies] = useState([]);  // unfiltered set
  const [genres, setGenres] = useState([]);
  const [activeGenre, setActiveGenre] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSearchMode, setIsSearchMode] = useState(false);
  const searchRef = useRef(null);

  // Load genres once
  useEffect(() => {
    getGenres().then(setGenres).catch(console.error);
  }, []);

  // Load movies when tab changes
  useEffect(() => {
    if (isSearchMode) return;
    loadMovies(activeTab);
  }, [activeTab, isSearchMode]);

  const loadMovies = async (tab) => {
    setLoading(true);
    setError(null);
    setActiveGenre(null);
    try {
      const data = await fetchByTab[tab]();
      setAllMovies(data);
      setMovies(data);
    } catch {
      setError("Failed to load movies. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      setIsSearchMode(false);
      loadMovies(activeTab);
      return;
    }
    setLoading(true);
    setIsSearchMode(true);
    setActiveGenre(null);
    try {
      const results = await searchMovies(searchQuery);
      setAllMovies(results);
      setMovies(results);
      setError(null);
    } catch {
      setError("Failed to search movies.");
    } finally {
      setLoading(false);
    }
  };

  const clearSearch = () => {
    setSearchQuery("");
    setIsSearchMode(false);
    loadMovies(activeTab);
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setIsSearchMode(false);
    setSearchQuery("");
  };

  const handleGenreFilter = (genreId) => {
    if (activeGenre === genreId) {
      setActiveGenre(null);
      setMovies(allMovies);
    } else {
      setActiveGenre(genreId);
      setMovies(allMovies.filter((m) => m.genre_ids?.includes(genreId)));
    }
  };

  const skeletons = Array.from({ length: 12 });

  return (
    <div className="home">
      {/* Hero Section */}
      <div className="hero">
        <h1 className="hero-title">
          Discover <span className="gradient-text">Amazing</span> Movies
        </h1>
        <p className="hero-subtitle">
          Browse thousands of movies, find your next favourite, and save them for later.
        </p>

        {/* Search */}
        <form onSubmit={handleSearch} className="search-form">
          <div className="search-input-wrapper">
            <span className="search-icon">🔍</span>
            <input
              ref={searchRef}
              type="text"
              placeholder="Search for a movie..."
              className="search-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button
                type="button"
                className="clear-btn"
                onClick={clearSearch}
                aria-label="Clear search"
              >
                ✕
              </button>
            )}
          </div>
          <button type="submit" className="search-button">Search</button>
        </form>
      </div>

      {/* Category Tabs */}
      {!isSearchMode && (
        <div className="tabs-section">
          <div className="tabs">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                className={`tab-btn ${activeTab === tab.id ? "active" : ""}`}
                onClick={() => handleTabChange(tab.id)}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Genre Chips */}
      {!isSearchMode && genres.length > 0 && (
        <div className="genres-scroll">
          {genres.map((g) => (
            <button
              key={g.id}
              className={`genre-pill ${activeGenre === g.id ? "active" : ""}`}
              onClick={() => handleGenreFilter(g.id)}
            >
              {g.name}
            </button>
          ))}
        </div>
      )}

      {/* Results label */}
      {isSearchMode && !loading && (
        <div className="results-label">
          {movies.length} result{movies.length !== 1 ? "s" : ""} for "{searchQuery}"
        </div>
      )}

      {error && <div className="error-message">{error}</div>}

      {/* Grid */}
      {loading ? (
        <div className="movies-grid">
          {skeletons.map((_, i) => <SkeletonCard key={i} />)}
        </div>
      ) : (
        <div className="movies-grid">
          {movies.length > 0
            ? movies.map((movie) => <MovieCard movie={movie} key={movie.id} />)
            : <p className="no-results">No movies found. Try a different search or filter.</p>
          }
        </div>
      )}
    </div>
  );
}

export default Home;
