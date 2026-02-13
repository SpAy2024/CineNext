import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const SearchBar = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const searchRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const searchTMDB = async () => {
      if (searchTerm.length < 2) {
        setResults([]);
        return;
      }

      setLoading(true);
      try {
        const [movieRes, tvRes] = await Promise.all([
          axios.get(`${import.meta.env.VITE_TMDB_BASE_URL}/search/movie?api_key=${import.meta.env.VITE_TMDB_KEY}&query=${searchTerm}&language=es-MX&page=1`),
          axios.get(`${import.meta.env.VITE_TMDB_BASE_URL}/search/tv?api_key=${import.meta.env.VITE_TMDB_KEY}&query=${searchTerm}&language=es-MX&page=1`)
        ]);

        const combined = [
          ...movieRes.data.results.map(item => ({ ...item, media_type: 'movie' })),
          ...tvRes.data.results.map(item => ({ ...item, media_type: 'tv', title: item.name }))
        ].sort((a, b) => b.popularity - a.popularity).slice(0, 10);

        setResults(combined);
      } catch (error) {
        console.error('Error searching:', error);
      } finally {
        setLoading(false);
      }
    };

    const debounce = setTimeout(searchTMDB, 500);
    return () => clearTimeout(debounce);
  }, [searchTerm]);

  return (
    <div className="search-container" ref={searchRef}>
      <div className="search-input-wrapper">
        <input
          type="text"
          placeholder="Buscar películas, series..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          className="search-input"
        />
        <span className="search-icon">🔍</span>
        {loading && <span className="search-loading">⌛</span>}
      </div>

      {isOpen && results.length > 0 && (
        <div className="search-results">
          {results.map(item => (
            <Link
              key={`${item.media_type}-${item.id}`}
              to={`/movie/${item.id}`}
              className="search-result-item"
              onClick={() => setIsOpen(false)}
            >
              <img
                src={item.poster_path 
                  ? `https://image.tmdb.org/t/p/w92${item.poster_path}`
                  : 'https://via.placeholder.com/46x69?text=No+Image'
                }
                alt={item.title}
              />
              <div className="result-info">
                <h4>{item.title}</h4>
                <p>
                  {item.media_type === 'movie' ? '🎬 Película' : '📺 Serie'}
                  {item.release_date && ` • ${item.release_date.split('-')[0]}`}
                  {item.first_air_date && ` • ${item.first_air_date.split('-')[0]}`}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchBar;