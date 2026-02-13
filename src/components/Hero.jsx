import React, { useState, useEffect, useContext } from 'react';
import { MovieContext } from '../context/MovieContext';
import { Link } from 'react-router-dom';

const Hero = () => {
  const { customMovies } = useContext(MovieContext);
  const [heroMovie, setHeroMovie] = useState(null);

  useEffect(() => {
    if (customMovies.length > 0) {
      const randomMovie = customMovies[Math.floor(Math.random() * customMovies.length)];
      setHeroMovie(randomMovie);
    }
  }, [customMovies]);

  if (!heroMovie) {
    return (
      <div className="hero-placeholder">
        <div className="hero-placeholder-content">
          <h1>Bienvenido a Netflix Clone</h1>
          <p>Agrega películas desde el panel de administración</p>
          <Link to="/admin" className="hero-button">Comenzar</Link>
        </div>
      </div>
    );
  }

  return (
    <header 
      className="hero"
      style={{
        backgroundImage: `linear-gradient(to right, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.4) 100%), url(https://image.tmdb.org/t/p/original${heroMovie.backdropPath})`
      }}
    >
      <div className="hero-content">
        <h1>{heroMovie.title}</h1>
        <p>{heroMovie.overview}</p>
        <Link to={`/movie/${heroMovie.tmdbId}`} className="play-button">▶ Reproducir</Link>
      </div>
    </header>
  );
};

export default Hero;