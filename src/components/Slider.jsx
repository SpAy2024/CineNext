import React, { useState, useEffect, useContext } from 'react';
import { MovieContext } from '../context/MovieContext';
import { Link } from 'react-router-dom';

const Slider = () => {
  const { customMovies } = useContext(MovieContext);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Filtrar SOLO contenido con backdropPath válido para el slider
  const sliderMovies = customMovies.filter(movie => movie.backdropPath);

  useEffect(() => {
    if (sliderMovies.length === 0) return;
    
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev === sliderMovies.length - 1 ? 0 : prev + 1));
    }, 5000);
    
    return () => clearInterval(timer);
  }, [sliderMovies.length]);

  if (sliderMovies.length === 0) {
    return null; // No mostrar slider si no hay películas
  }

  const movie = sliderMovies[currentIndex];

  return (
    <div className="slider-container">
      <div
        className="slider-item active"
        style={{
          backgroundImage: `linear-gradient(to right, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.4) 100%), url(https://image.tmdb.org/t/p/original${movie.backdropPath})`
        }}
      >
        <div className="slider-content">
          <div className="slider-left">
            <h1 className="slider-title">{movie.title}</h1>
            
            <div className="slider-meta">
              <span className="slider-year">{movie.release_date?.split('-')[0] || '2025'}</span>
              <span className="slider-rating-badge">PG-13</span>
              <span className="slider-date">
                {movie.release_date ? new Date(movie.release_date).toLocaleDateString('es-ES', {
                  day: 'numeric',
                  month: 'numeric',
                  year: 'numeric'
                }) + ' (US)' : 'Fecha desconocida'}
              </span>
            </div>

            <div className="slider-genres">
              <span className="slider-genre">{movie.genre || 'Sin género'}</span>
              <span className="slider-duration">• 2h 30m</span>
            </div>

            <div className="slider-score">
              <span className="score-label">Puntuación de usuarios</span>
              <div className="score-value">
                <span className="score-number">{movie.vote_average?.toFixed(1) || '8.5'}</span>
                <span className="score-max">/10</span>
              </div>
            </div>

            <p className="slider-description">{movie.overview}</p>

            <div className="slider-buttons">
              <Link to={`/movie/${movie.tmdbId}`} className="slider-play-button">
                <span className="play-icon">▶</span> Reproducir
              </Link>
            </div>
          </div>
          
          <div className="slider-right">
            <img 
              src={`https://image.tmdb.org/t/p/w500${movie.posterPath}`}
              alt={movie.title}
              className="slider-poster"
              onError={(e) => {
                e.target.src = 'https://via.placeholder.com/500x750?text=No+Image';
              }}
            />
          </div>
        </div>
      </div>

      {sliderMovies.length > 1 && (
        <>
          <button 
            className="slider-arrow left" 
            onClick={() => setCurrentIndex(prev => (prev === 0 ? sliderMovies.length - 1 : prev - 1))}
          >
            ‹
          </button>
          <button 
            className="slider-arrow right" 
            onClick={() => setCurrentIndex(prev => (prev === sliderMovies.length - 1 ? 0 : prev + 1))}
          >
            ›
          </button>
          
          <div className="slider-dots">
            {sliderMovies.map((_, index) => (
              <button
                key={index}
                className={`slider-dot ${index === currentIndex ? 'active' : ''}`}
                onClick={() => setCurrentIndex(index)}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default Slider;