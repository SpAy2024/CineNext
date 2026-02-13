import React, { useRef } from 'react';
import MovieCard from './MovieCard';

const Row = ({ title, movies }) => {
  const rowRef = useRef(null);

  const handleClick = (direction) => {
    if (rowRef.current) {
      const scrollAmount = direction === 'left' ? -window.innerWidth : window.innerWidth;
      rowRef.current.scrollLeft += scrollAmount;
    }
  };

  if (!movies || movies.length === 0) return null;

  return (
    <div className="row">
      <h2 className="row-title">{title}</h2>
      <div className="row-scroll-container">
        <button className="row-arrow left" onClick={() => handleClick('left')}>‹</button>
        <div className="row-posters" ref={rowRef}>
          {movies.map(movie => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
        <button className="row-arrow right" onClick={() => handleClick('right')}>›</button>
      </div>
    </div>
  );
};

export default Row;