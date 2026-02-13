import React from 'react';
import { Link } from 'react-router-dom';

const MovieCard = ({ movie }) => {
  return (
    <div className="movie-card">
      <Link to={`/movie/${movie.tmdbId}`}>
        <img 
          src={`https://image.tmdb.org/t/p/w500${movie.posterPath}`}
          alt={movie.title}
        />
        <div className="movie-info">
          <h3>{movie.title}</h3>
          {movie.vote_average > 0 && <p>⭐ {movie.vote_average.toFixed(1)}</p>}
        </div>
      </Link>
    </div>
  );
};

export default MovieCard;