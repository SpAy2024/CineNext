import React, { useState, useContext } from 'react';
import { MovieContext } from '../context/MovieContext';
import axios from 'axios';
import { Link } from 'react-router-dom';

const AdminPanel = () => {
  const { addCustomMovie, customMovies, removeCustomMovie } = useContext(MovieContext);
  const [activeSection, setActiveSection] = useState('dashboard');
  const [searchResult, setSearchResult] = useState(null);
  const [searchType, setSearchType] = useState('movie');
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState(null);
  const [searchMode, setSearchMode] = useState('id'); // 'id' o 'title'
  const [titleSearchResults, setTitleSearchResults] = useState([]);
  const [showTitleResults, setShowTitleResults] = useState(false);
  const [formData, setFormData] = useState({
    tmdbId: '',
    searchTitle: '',
    genre: '',
    contentType: '',
    title: '',
    overview: '',
    posterPath: '',
    backdropPath: '',
    vote_average: 0,
    release_date: ''
  });

  // Estadísticas
  const stats = {
    totalMovies: customMovies.length,
    totalGenres: [...new Set(customMovies.map(m => m.genre).filter(Boolean))].length,
    avgRating: (customMovies.reduce((acc, m) => acc + (m.vote_average || 0), 0) / customMovies.length || 0).toFixed(1),
    recentAdded: customMovies.filter(m => {
      const added = new Date(m.addedAt || Date.now());
      const now = new Date();
      return (now - added) < 7 * 24 * 60 * 60 * 1000;
    }).length
  };

  const searchTMDBById = async () => {
    if (!formData.tmdbId) {
      setNotification({ type: 'error', message: 'Ingresa un ID de TMDB' });
      return;
    }

    // Validar que sea un número
    if (isNaN(formData.tmdbId)) {
      setNotification({ type: 'error', message: 'El ID debe ser un número válido' });
      return;
    }
    
    setLoading(true);
    setNotification(null);
    setSearchResult(null);
    
    try {
      // Intentar como película
      try {
        const movieResponse = await axios.get(
          `${import.meta.env.VITE_TMDB_BASE_URL}/movie/${formData.tmdbId}?api_key=${import.meta.env.VITE_TMDB_KEY}&language=es-MX`
        );
        setSearchType('movie');
        setSearchResult({ type: 'movie', data: movieResponse.data });
        setFormData(prev => ({
          ...prev,
          title: movieResponse.data.title,
          overview: movieResponse.data.overview,
          posterPath: movieResponse.data.poster_path,
          backdropPath: movieResponse.data.backdrop_path,
          vote_average: movieResponse.data.vote_average,
          release_date: movieResponse.data.release_date
        }));
        setLoading(false);
        return;
      } catch (movieError) {
        // Si no es película, intentar como serie
        try {
          const tvResponse = await axios.get(
            `${import.meta.env.VITE_TMDB_BASE_URL}/tv/${formData.tmdbId}?api_key=${import.meta.env.VITE_TMDB_KEY}&language=es-MX`
          );
          setSearchType('tv');
          setSearchResult({ type: 'tv', data: tvResponse.data });
          setFormData(prev => ({
            ...prev,
            title: tvResponse.data.name,
            overview: tvResponse.data.overview,
            posterPath: tvResponse.data.poster_path,
            backdropPath: tvResponse.data.backdrop_path,
            vote_average: tvResponse.data.vote_average,
            release_date: tvResponse.data.first_air_date
          }));
          setLoading(false);
        } catch (tvError) {
          setNotification({ type: 'error', message: 'Contenido no encontrado en TMDB' });
          setLoading(false);
        }
      }
    } catch (error) {
      setNotification({ type: 'error', message: 'Error en la búsqueda' });
      setLoading(false);
    }
  };

  const searchTMDBByTitle = async () => {
    if (!formData.searchTitle || formData.searchTitle.trim() === '') {
      setNotification({ type: 'error', message: 'Ingresa un título para buscar' });
      return;
    }
    
    setLoading(true);
    setNotification(null);
    setTitleSearchResults([]);
    setShowTitleResults(false);
    
    try {
      // Buscar películas
      const movieResponse = await axios.get(
        `${import.meta.env.VITE_TMDB_BASE_URL}/search/movie?api_key=${import.meta.env.VITE_TMDB_KEY}&language=es-MX&query=${encodeURIComponent(formData.searchTitle)}&page=1`
      );
      
      // Buscar series
      const tvResponse = await axios.get(
        `${import.meta.env.VITE_TMDB_BASE_URL}/search/tv?api_key=${import.meta.env.VITE_TMDB_KEY}&language=es-MX&query=${encodeURIComponent(formData.searchTitle)}&page=1`
      );
      
      const movies = movieResponse.data.results.map(item => ({
        ...item,
        media_type: 'movie',
        title: item.title,
        release_date: item.release_date
      }));
      
      const tvShows = tvResponse.data.results.map(item => ({
        ...item,
        media_type: 'tv',
        title: item.name,
        release_date: item.first_air_date
      }));
      
      const combined = [...movies, ...tvShows].sort((a, b) => b.popularity - a.popularity);
      
      if (combined.length === 0) {
        setNotification({ type: 'error', message: 'No se encontraron resultados' });
      } else {
        setTitleSearchResults(combined.slice(0, 10)); // Mostrar solo los primeros 10 resultados
        setShowTitleResults(true);
      }
    } catch (error) {
      setNotification({ type: 'error', message: 'Error en la búsqueda' });
    } finally {
      setLoading(false);
    }
  };

  const selectFromTitleSearch = (item) => {
    setSearchType(item.media_type);
    setSearchResult({ type: item.media_type, data: item });
    setFormData(prev => ({
      ...prev,
      tmdbId: item.id,
      title: item.title,
      overview: item.overview,
      posterPath: item.poster_path,
      backdropPath: item.backdrop_path,
      vote_average: item.vote_average || 0,
      release_date: item.release_date
    }));
    setShowTitleResults(false);
    setTitleSearchResults([]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.genre || !formData.contentType) {
      setNotification({ type: 'error', message: 'Completa todos los campos' });
      return;
    }

    if (!searchResult) {
      setNotification({ type: 'error', message: 'Debes buscar y seleccionar un contenido primero' });
      return;
    }

    addCustomMovie({
      ...formData,
      id: Date.now(),
      addedAt: new Date().toISOString(),
      isSeries: searchType === 'tv'
    });

    setNotification({ type: 'success', message: 'Contenido agregado exitosamente' });
    
    // Limpiar formulario
    setFormData({
      tmdbId: '', 
      searchTitle: '', 
      genre: '', 
      contentType: '', 
      title: '', 
      overview: '',
      posterPath: '', 
      backdropPath: '', 
      vote_average: 0, 
      release_date: ''
    });
    setSearchResult(null);
    setTitleSearchResults([]);
    setShowTitleResults(false);
    
    setTimeout(() => setNotification(null), 3000);
  };

  const handleModeChange = (mode) => {
    setSearchMode(mode);
    // Limpiar todo al cambiar de modo
    setFormData({
      ...formData,
      tmdbId: '',
      searchTitle: '',
    });
    setSearchResult(null);
    setTitleSearchResults([]);
    setShowTitleResults(false);
    setNotification(null);
  };

  const getSectionTitle = () => {
    switch(activeSection) {
      case 'dashboard': return 'Panel de Control';
      case 'add': return 'Agregar Contenido';
      case 'library': return 'Filmoteca';
      default: return '';
    }
  };

  return (
    <div className="movie-dashboard">
      {/* Sidebar */}
      <div className="dashboard-sidebar">
        <div className="sidebar-logo">
          <span className="logo-icon">🎬</span>
          <h2>CINEMA<span>ADMIN</span></h2>
        </div>
        <nav className="sidebar-nav">
          <button 
            className={activeSection === 'dashboard' ? 'active' : ''} 
            onClick={() => setActiveSection('dashboard')}
          >
            <span className="nav-icon">📊</span> Dashboard
          </button>
          <button 
            className={activeSection === 'add' ? 'active' : ''} 
            onClick={() => setActiveSection('add')}
          >
            <span className="nav-icon">➕</span> Agregar Contenido
          </button>
          <button 
            className={activeSection === 'library' ? 'active' : ''} 
            onClick={() => setActiveSection('library')}
          >
            <span className="nav-icon">🎥</span> Filmoteca
            <span className="nav-badge">{customMovies.length}</span>
          </button>
        </nav>
        <div className="sidebar-footer">
          <Link to="/" className="preview-link">
            <span className="nav-icon">👁️</span> Ver sitio
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="dashboard-main">
        <header className="dashboard-header">
          <h1>{getSectionTitle()}</h1>
          {notification && (
            <div className={`notification ${notification.type}`}>
              {notification.message}
            </div>
          )}
        </header>

        {/* Dashboard Section */}
        {activeSection === 'dashboard' && (
          <div className="dashboard-section">
            <div className="stats-grid">
              <div className="stat-card gradient-blue">
                <div className="stat-icon">🎬</div>
                <div className="stat-content">
                  <h3>{stats.totalMovies}</h3>
                  <p>Contenido total</p>
                </div>
              </div>
              <div className="stat-card gradient-purple">
                <div className="stat-icon">🎭</div>
                <div className="stat-content">
                  <h3>{stats.totalGenres}</h3>
                  <p>Géneros</p>
                </div>
              </div>
              <div className="stat-card gradient-gold">
                <div className="stat-icon">⭐</div>
                <div className="stat-content">
                  <h3>{stats.avgRating}</h3>
                  <p>Calificación promedio</p>
                </div>
              </div>
              <div className="stat-card gradient-red">
                <div className="stat-icon">📺</div>
                <div className="stat-content">
                  <h3>{stats.recentAdded}</h3>
                  <p>Agregados recientes</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Add Section */}
        {activeSection === 'add' && (
          <div className="add-movie-section">
            <div className="add-movie-form">
              <h2>Agregar nuevo contenido</h2>
              
              {/* Selector de modo de búsqueda */}
              <div className="search-mode-selector">
                <button 
                  className={`mode-btn ${searchMode === 'id' ? 'active' : ''}`}
                  onClick={() => handleModeChange('id')}
                  type="button"
                >
                  🔍 Buscar por ID
                </button>
                <button 
                  className={`mode-btn ${searchMode === 'title' ? 'active' : ''}`}
                  onClick={() => handleModeChange('title')}
                  type="button"
                >
                  📝 Buscar por título
                </button>
              </div>

              {/* Búsqueda por ID */}
              {searchMode === 'id' && (
                <div className="search-box">
                  <div className="search-input-group">
                    <input
                      type="number"
                      value={formData.tmdbId}
                      onChange={(e) => setFormData({ ...formData, tmdbId: e.target.value })}
                      placeholder="ID de TMDB (ej: 11891)"
                      disabled={loading}
                      min="1"
                      step="1"
                    />
                    <button onClick={searchTMDBById} disabled={loading} type="button">
                      {loading ? 'Buscando...' : 'Buscar'}
                    </button>
                  </div>
                  <small className="input-hint">Ingresa el ID numérico de TMDB</small>
                </div>
              )}

              {/* Búsqueda por título */}
              {searchMode === 'title' && (
                <div className="search-box">
                  <div className="search-input-group">
                    <input
                      type="text"
                      value={formData.searchTitle}
                      onChange={(e) => setFormData({ ...formData, searchTitle: e.target.value })}
                      placeholder="Título de película o serie (ej: Thor)"
                      disabled={loading}
                    />
                    <button onClick={searchTMDBByTitle} disabled={loading} type="button">
                      {loading ? 'Buscando...' : 'Buscar'}
                    </button>
                  </div>
                  
                  {/* Resultados de búsqueda por título */}
                  {showTitleResults && titleSearchResults.length > 0 && (
                    <div className="title-search-results">
                      <h4>Resultados encontrados:</h4>
                      <div className="results-grid">
                        {titleSearchResults.map((item) => (
                          <div 
                            key={`${item.media_type}-${item.id}`} 
                            className="result-item"
                            onClick={() => selectFromTitleSearch(item)}
                          >
                            <img 
                              src={item.poster_path 
                                ? `https://image.tmdb.org/t/p/w92${item.poster_path}` 
                                : 'https://via.placeholder.com/92x138?text=No+Image'} 
                              alt={item.title}
                            />
                            <div className="result-info">
                              <h5>{item.title}</h5>
                              <div className="result-meta">
                                <span className="media-badge">
                                  {item.media_type === 'movie' ? '🎬 Película' : '📺 Serie'}
                                </span>
                                <span>⭐ {item.vote_average?.toFixed(1) || 'N/A'}</span>
                                <span className="release-year">
                                  {item.release_date ? new Date(item.release_date).getFullYear() : 'N/A'}
                                </span>
                              </div>
                              <p className="result-overview">{item.overview?.substring(0, 100)}...</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Vista previa del contenido seleccionado */}
              {searchResult && (
                <div className="movie-preview-card">
                  <img 
                    src={searchResult.data.poster_path 
                      ? `https://image.tmdb.org/t/p/w200${searchResult.data.poster_path}` 
                      : 'https://via.placeholder.com/200x300?text=No+Image'} 
                    alt={searchResult.data.title || searchResult.data.name} 
                  />
                  <div className="preview-info">
                    <h4>{searchResult.data.title || searchResult.data.name}</h4>
                    <div className="preview-meta">
                      <span>⭐ {searchResult.data.vote_average?.toFixed(1) || 'N/A'}/10</span>
                      <span>📅 {searchResult.data.release_date || searchResult.data.first_air_date || 'N/A'}</span>
                    </div>
                    <p className="preview-overview">{searchResult.data.overview}</p>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label>Tipo de contenido *</label>
                  <select
                    value={formData.contentType}
                    onChange={(e) => setFormData({ ...formData, contentType: e.target.value })}
                    required
                  >
                    <option value="">Seleccionar</option>
                    <option value="pelicula">🎬 Película</option>
                    <option value="serie">📺 Serie</option>
                    <option value="anime">🗾 Anime</option>
                    <option value="novela">💕 Novela</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Género *</label>
                  <select
                    value={formData.genre}
                    onChange={(e) => setFormData({ ...formData, genre: e.target.value })}
                    required
                  >
                    <option value="">Seleccionar género</option>
                    <option value="Acción">💥 Acción</option>
                    <option value="Aventura">🏔️ Aventura</option>
                    <option value="Comedia">😂 Comedia</option>
                    <option value="Drama">🎭 Drama</option>
                    <option value="Ciencia Ficción">🚀 Ciencia Ficción</option>
                    <option value="Terror">👻 Terror</option>
                    <option value="Romántica">❤️ Romántica</option>
                    <option value="Western">🤠 Western</option>
                    <option value="Música">🎵 Música</option>
                  </select>
                </div>

                <button 
                  type="submit" 
                  className="submit-movie-btn" 
                  disabled={!searchResult || loading}
                >
                  {!searchResult 
                    ? '🔍 Primero busca un contenido' 
                    : '✅ Agregar Contenido'}
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Library Section */}
        {activeSection === 'library' && (
          <div className="library-section">
            <div className="library-header">
              <h2>Filmoteca</h2>
              <span className="movie-count">{customMovies.length} títulos</span>
            </div>
            
            {customMovies.length === 0 ? (
              <div className="empty-library">
                <p>No hay contenido en la filmoteca</p>
                <button onClick={() => setActiveSection('add')}>
                  Agregar primer contenido
                </button>
              </div>
            ) : (
              <div className="movies-grid-library">
                {customMovies.map(movie => (
                  <div key={movie.id} className="library-movie-card">
                    <div className="movie-card-poster">
                      <img 
                        src={movie.posterPath 
                          ? `https://image.tmdb.org/t/p/w200${movie.posterPath}` 
                          : 'https://via.placeholder.com/200x300?text=No+Image'} 
                        alt={movie.title} 
                      />
                      <div className="movie-card-overlay">
                        <Link to={`/movie/${movie.tmdbId}`} className="card-action-btn">👁️</Link>
                        <button 
                          onClick={() => removeCustomMovie(movie.id)} 
                          className="card-action-btn delete"
                          title="Eliminar"
                        >
                          🗑️
                        </button>
                      </div>
                      <div className="content-type-badge">
                        {movie.contentType === 'pelicula' && '🎬'}
                        {movie.contentType === 'serie' && '📺'}
                        {movie.contentType === 'anime' && '🗾'}
                        {movie.contentType === 'novela' && '💕'}
                      </div>
                    </div>
                    <div className="movie-card-info">
                      <h4>{movie.title}</h4>
                      <span className="movie-genre-tag">{movie.genre}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;
