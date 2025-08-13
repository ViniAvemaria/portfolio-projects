import { useState, useContext } from "react";
import { FavoritesContext } from "../contexts/FavoritesContext";
import "./MovieInfo.css";

function MovieInfo({ movieInfo, setMovieInfo }) {
    const { favorites, addFavorite, removeFavorite } = useContext(FavoritesContext);
    const [favButton, setFavButton] = useState(() => {
        return favorites.some((movie) => movie.imdbID === movieInfo.imdbID);
    });

    const toggleFavorite = () => {
        setFavButton((prev) => {
            if (prev) {
                removeFavorite(movieInfo.imdbID);
            } else {
                addFavorite(movieInfo);
            }
            return !prev;
        });
    };

    return (
        <div className="info-container">
            <div className="buttons-wrapper">
                <button onClick={toggleFavorite} id="favorite-btn">
                    <i className="fa-solid fa-star"></i>
                    <p>{favButton ? <>Remove</> : <>Add</>}</p>
                </button>
                <button id="close-btn" onClick={() => setMovieInfo(null)}>
                    <i className="fa-solid fa-xmark"></i>
                </button>
            </div>
            <div className="info-card">
                <img src={movieInfo.Poster} alt="movie poster" />
                <div className="details-wrapper">
                    <div>
                        <h2>{movieInfo.Title}</h2>
                        <h3>
                            {movieInfo.Year} | {movieInfo.Rated} | {movieInfo.Runtime}
                        </h3>
                    </div>
                    <h4>{movieInfo.Genre}</h4>
                    <div className="rating-wrapper">
                        <h4>
                            <span className="highlight">IMDb</span> {movieInfo.imdbRating}/10
                        </h4>
                        <h4>
                            <span className="highlight">Metacritic</span> {movieInfo.Metascore}/100
                        </h4>
                    </div>
                    <p>{movieInfo.Plot}</p>
                    <h4>
                        <span className="highlight">Director</span> {movieInfo.Director}
                    </h4>
                    <h4>
                        <span className="highlight">Actors</span> {movieInfo.Actors}
                    </h4>
                </div>
            </div>
        </div>
    );
}

export default MovieInfo;
