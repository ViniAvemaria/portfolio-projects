import { useState, useEffect, useContext, useRef } from "react";
import axios from "axios";
import MovieList from "./components/MovieList";
import { FavoritesContext } from "./contexts/FavoritesContext";
import "./App.css";

function App() {
    const { favorites } = useContext(FavoritesContext);
    const [favoriteTab, setFavoriteTab] = useState(false);
    const [movieName, setMovieName] = useState("");
    const [searchInput, setSearchInput] = useState("");
    const [movieList, setMovieList] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const inputRef = useRef(null);

    const clearAndFocus = () => {
        if (inputRef.current) {
            inputRef.current.focus();
        }
        setSearchInput("");
    };

    const previousPage = () => {
        if (currentPage > 1) {
            setCurrentPage((prev) => prev - 1);
        }
    };

    const nextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage((prev) => prev + 1);
        }
    };

    useEffect(() => {
        if (movieName) {
            const API_KEY = import.meta.env.VITE_OMDB_API_KEY;

            const searchMovie = async () => {
                if (!movieName) return;

                setLoading(true);
                setError(null);

                try {
                    const response = await axios.get("https://www.omdbapi.com/", {
                        params: {
                            apikey: API_KEY,
                            s: movieName,
                            page: currentPage,
                        },
                    });

                    if (response.data.Response === "True") {
                        setMovieList(response.data.Search);
                        setTotalPages(Math.ceil(parseInt(response.data.totalResults, 10) / 10));
                    } else {
                        setError(response.data.Error);
                        setMovieList([]);
                    }
                } catch (err) {
                    setError(`Failed to fetch movies. ${err}`);
                    setMovieList([]);
                } finally {
                    setLoading(false);
                }
            };
            searchMovie();
            window.scrollTo({ top: 0, behavior: "smooth" });
        }
    }, [currentPage, movieName]);

    return (
        <>
            <header>
                <div className="header-container">
                    <button className={favoriteTab ? "" : "active"} onClick={() => setFavoriteTab(false)}>
                        Home
                    </button>
                    <h1>Film Vault</h1>
                    <button className={favoriteTab ? "active" : ""} onClick={() => setFavoriteTab(true)}>
                        Favorites
                    </button>
                </div>
            </header>

            <main>
                {favoriteTab ? (
                    favorites.length > 0 ? (
                        <MovieList movieList={favorites}></MovieList>
                    ) : (
                        <div className="empty-favorites-container">
                            <p>No favorites yet</p>
                        </div>
                    )
                ) : (
                    <>
                        <div className="container">
                            <div className="search-container">
                                <input
                                    type="text"
                                    id="searchInput"
                                    value={searchInput}
                                    autoComplete="off"
                                    ref={inputRef}
                                    placeholder="Search a movie"
                                    onChange={(e) => setSearchInput(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter") {
                                            setCurrentPage(1);
                                            setMovieName(searchInput);
                                        }
                                    }}
                                />
                                {searchInput && (
                                    <button onClick={clearAndFocus}>
                                        <i className="fa-solid fa-xmark"></i>
                                    </button>
                                )}
                                <button
                                    id="search-btn"
                                    onClick={() => {
                                        setCurrentPage(1);
                                        setMovieName(searchInput);
                                    }}
                                >
                                    <i className="fa-solid fa-magnifying-glass"></i>
                                </button>
                            </div>
                        </div>

                        {loading && (
                            <div className="loading-container">
                                <div className="loading-wrapper">
                                    <i className="fa-solid fa-circle-notch fa-spin"></i>
                                </div>
                            </div>
                        )}

                        {error && (
                            <div className="error-container">
                                <div className="error-wrapper">
                                    <button onClick={() => setError(null)}>
                                        <i className="fa-solid fa-xmark"></i>
                                    </button>
                                    <p>{error}</p>
                                </div>
                            </div>
                        )}

                        {movieList.length > 0 && (
                            <>
                                <MovieList movieList={movieList}></MovieList>

                                <div className="page-buttons-container">
                                    <button onClick={previousPage}>
                                        <i className="fa-solid fa-chevron-left"></i>
                                    </button>
                                    <p>
                                        {currentPage} <span>/</span> {totalPages}
                                    </p>
                                    <button onClick={nextPage}>
                                        <i className="fa-solid fa-chevron-right"></i>
                                    </button>
                                </div>
                            </>
                        )}
                    </>
                )}
            </main>

            <footer>
                {<p>&copy; {new Date().getFullYear()} Vinicius de Moura Avemaria</p>}
                <div className="socials-container">
                    <a href="https://github.com/ViniAvemaria" target="_blank" rel="noopener noreferrer">
                        <i className="fa-brands fa-github"></i>
                    </a>
                    <a href="https://www.linkedin.com/in/viniavemaria/" target="_blank" rel="noopener noreferrer">
                        <i className="fa-brands fa-linkedin"></i>
                    </a>
                </div>
            </footer>
        </>
    );
}

export default App;
