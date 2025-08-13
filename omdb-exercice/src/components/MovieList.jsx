import { useState } from "react";
import axios from "axios";
import MovieCard from "./MovieCard";
import MovieInfo from "./MovieInfo";
import "./MovieList.css";

function MovieList({ movieList }) {
    const API_KEY = import.meta.env.VITE_OMDB_API_KEY;
    const [movieInfo, setMovieInfo] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const openMovieInfo = async (id) => {
        setLoading(true);

        try {
            const response = await axios.get("https://www.omdbapi.com/", {
                params: {
                    apikey: API_KEY,
                    i: id,
                },
            });

            if (response.data.Response === "True") {
                setMovieInfo(response.data);
            } else {
                setError(response.data.Error);
                setMovieInfo(null);
            }
        } catch (err) {
            setError(`Failed to fetch movie. ${err}`);
            setMovieInfo(null);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
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

            <div className="list-container">
                <ul className="movie-list">
                    {movieList.map((movie, index) => (
                        <li
                            key={index}
                            tabIndex={0}
                            role="button"
                            onClick={() => openMovieInfo(movie.imdbID)}
                            onKeyDown={(e) => {
                                if (e.key === "Enter" || e.key === " ") {
                                    openMovieInfo(movie.imdbID);
                                }
                            }}
                        >
                            <MovieCard movie={movie}></MovieCard>
                        </li>
                    ))}
                </ul>
            </div>

            {movieInfo && <MovieInfo movieInfo={movieInfo} setMovieInfo={setMovieInfo}></MovieInfo>}
        </>
    );
}

export default MovieList;
