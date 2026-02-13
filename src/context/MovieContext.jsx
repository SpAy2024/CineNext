import React, { createContext, useState, useEffect } from 'react';

export const MovieContext = createContext();

export const MovieProvider = ({ children }) => {
  const [customMovies, setCustomMovies] = useState(() => {
    const saved = localStorage.getItem('customMovies');
    return saved ? JSON.parse(saved) : [];
  });

  const addCustomMovie = (movieData) => {
    const newMovie = {
      ...movieData,
      id: Date.now(),
      addedAt: new Date().toISOString()
    };
    const updated = [...customMovies, newMovie];
    setCustomMovies(updated);
    localStorage.setItem('customMovies', JSON.stringify(updated));
    return newMovie;
  };

  const removeCustomMovie = (id) => {
    const updated = customMovies.filter(movie => movie.id !== id);
    setCustomMovies(updated);
    localStorage.setItem('customMovies', JSON.stringify(updated));
  };

  const updateCustomMovie = (id, updatedData) => {
    const updated = customMovies.map(movie => 
      movie.id === id ? { ...movie, ...updatedData } : movie
    );
    setCustomMovies(updated);
    localStorage.setItem('customMovies', JSON.stringify(updated));
  };

  return (
    <MovieContext.Provider value={{
      customMovies,
      addCustomMovie,
      removeCustomMovie,
      updateCustomMovie
    }}>
      {children}
    </MovieContext.Provider>
  );
};