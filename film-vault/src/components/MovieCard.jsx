import "./MovieCard.css";

function MovieCard({ movie }) {
    return (
        <>
            <div className="card-container">
                <img src={movie.Poster} alt="movie poster" />
                <p>
                    {movie.Title} ({movie.Year})
                </p>
            </div>
        </>
    );
}

export default MovieCard;
