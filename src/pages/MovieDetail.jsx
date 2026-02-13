import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { MovieContext } from '../context/MovieContext';
import axios from 'axios';
import VideoModal from '../components/VideoModal';

const VIMEUS_KEY = import.meta.env.VITE_VIMEUS_KEY;

const getVimeusUrl = (type, tmdbId, season = null, episode = null) => {
  const baseUrl = 'https://vimeus.com/e';
  let url = '';
  
  if (type === 'pelicula') {
    url = `${baseUrl}/movie?tmdb=${tmdbId}&view_key=${VIMEUS_KEY}`;
  } else if (type === 'serie' || type === 'anime' || type === 'novela') {
    if (season && episode) {
      url = `${baseUrl}/${type}?tmdb=${tmdbId}&se=${season}&ep=${episode}&view_key=${VIMEUS_KEY}`;
    } else {
      url = `${baseUrl}/${type}?tmdb=${tmdbId}&view_key=${VIMEUS_KEY}`;
    }
  }
  
  return url;
};

const MovieDetail = () => {
  const { id } = useParams();
  const { customMovies } = useContext(MovieContext);
  const [movie, setMovie] = useState(null);
  const [seriesDetails, setSeriesDetails] = useState(null);
  const [seasons, setSeasons] = useState([]);
  const [episodes, setEpisodes] = useState([]);
  const [selectedSeason, setSelectedSeason] = useState(null);
  const [selectedEpisode, setSelectedEpisode] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Estados para el modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentVideoUrl, setCurrentVideoUrl] = useState('');
  const [currentVideoTitle, setCurrentVideoTitle] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      
      // Buscar en customMovies
      const customMovie = customMovies.find(m => m.tmdbId == id || m.id == id);
      
      if (customMovie) {
        setMovie(customMovie);
        
        // Si es serie, cargar temporadas y episodios
        if (customMovie.isSeries) {
          try {
            const tvResponse = await axios.get(
              `${import.meta.env.VITE_TMDB_BASE_URL}/tv/${customMovie.tmdbId}?api_key=${import.meta.env.VITE_TMDB_KEY}&language=es-MX`
            );
            setSeriesDetails(tvResponse.data);
            
            const seasonsList = tvResponse.data.seasons?.filter(s => s.season_number > 0) || [];
            setSeasons(seasonsList);
            
            if (seasonsList.length > 0) {
              setSelectedSeason(seasonsList[0].season_number);
              await loadEpisodes(customMovie.tmdbId, seasonsList[0].season_number);
            }
          } catch (error) {
            console.error('Error loading series:', error);
          }
        }
        setLoading(false);
        return;
      }

      // Buscar en TMDB
      try {
        const movieResponse = await axios.get(
          `${import.meta.env.VITE_TMDB_BASE_URL}/movie/${id}?api_key=${import.meta.env.VITE_TMDB_KEY}&language=es-MX`
        );
        setMovie({ ...movieResponse.data, isSeries: false, contentType: 'pelicula' });
      } catch {
        try {
          const tvResponse = await axios.get(
            `${import.meta.env.VITE_TMDB_BASE_URL}/tv/${id}?api_key=${import.meta.env.VITE_TMDB_KEY}&language=es-MX`
          );
          setMovie({ ...tvResponse.data, isSeries: true, contentType: 'serie' });
          setSeriesDetails(tvResponse.data);
          
          const seasonsList = tvResponse.data.seasons?.filter(s => s.season_number > 0) || [];
          setSeasons(seasonsList);
          
          if (seasonsList.length > 0) {
            setSelectedSeason(seasonsList[0].season_number);
            await loadEpisodes(id, seasonsList[0].season_number);
          }
        } catch {
          setMovie(null);
        }
      }
      setLoading(false);
    };

    fetchData();
  }, [id, customMovies]);

  const loadEpisodes = async (tvId, seasonNumber) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_TMDB_BASE_URL}/tv/${tvId}/season/${seasonNumber}?api_key=${import.meta.env.VITE_TMDB_KEY}&language=es-MX`
      );
      setEpisodes(response.data.episodes || []);
    } catch (error) {
      console.error('Error loading episodes:', error);
    }
  };

  const handleSeasonChange = async (seasonNumber) => {
    setSelectedSeason(seasonNumber);
    setSelectedEpisode(null);
    await loadEpisodes(movie.tmdbId, seasonNumber);
  };

  // Función para abrir el modal de reproducción
  const handlePlay = (seasonNum = null, episodeNum = null, episodeTitle = '') => {
    const url = getVimeusUrl(movie.contentType, movie.tmdbId, seasonNum, episodeNum);
    setCurrentVideoUrl(url);
    
    // Construir título para el modal
    let title = movie.title;
    if (seasonNum && episodeNum) {
      title = `${movie.title} - S${seasonNum}E${episodeNum}${episodeTitle ? ': ' + episodeTitle : ''}`;
    }
    setCurrentVideoTitle(title);
    setIsModalOpen(true);
  };

  // Función para cerrar el modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCurrentVideoUrl('');
  };

  if (loading) return <div className="loading-screen"><div className="loading-spinner"></div></div>;
  if (!movie) return <div className="error-screen"><h2>Contenido no encontrado</h2></div>;

  return (
    <div className="movie-detail-netflix">
      {/* Hero Section */}
      <div 
        className="detail-hero"
        style={{
          backgroundImage: `url(https://image.tmdb.org/t/p/original${movie.backdrop_path || movie.backdropPath})`
        }}
      >
        <div className="hero-gradient"></div>
        <div className="hero-content">
          <div className="content-wrapper">
            <div className="detail-poster">
              <img 
                src={`https://image.tmdb.org/t/p/w500${movie.poster_path || movie.posterPath}`} 
                alt={movie.title} 
              />
            </div>
            <div className="detail-info">
              <h1 className="detail-title">{movie.title}</h1>
              <div className="detail-metadata">
                <span className="year">{movie.release_date?.split('-')[0] || movie.first_air_date?.split('-')[0]}</span>
                <span className="rating">⭐ {movie.vote_average?.toFixed(1)}/10</span>
              </div>
              <p className="detail-overview">{movie.overview}</p>
              <button 
                onClick={() => handlePlay()} 
                className="play-btn"
              >
                <span className="play-icon">▶</span> Reproducir
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Episodios Section para Series */}
      {movie.isSeries && seasons.length > 0 && (
        <div className="episodes-section">
          <h2>Episodios</h2>
          
          {/* Season Tabs */}
          <div className="season-tabs">
            {seasons.map(season => (
              <button
                key={season.season_number}
                className={`season-tab ${selectedSeason === season.season_number ? 'active' : ''}`}
                onClick={() => handleSeasonChange(season.season_number)}
              >
                Temporada {season.season_number}
              </button>
            ))}
          </div>

          {/* Episodes Grid */}
          <div className="episodes-grid">
            {episodes.map(episode => (
              <div 
                key={episode.id} 
                className={`episode-card ${selectedEpisode === episode.episode_number ? 'selected' : ''}`}
                onClick={() => {
                  setSelectedEpisode(episode.episode_number);
                  handlePlay(selectedSeason, episode.episode_number, episode.name);
                }}
              >
                <div className="episode-thumbnail">
                  <img 
                    src={episode.still_path 
                      ? `https://image.tmdb.org/t/p/w300${episode.still_path}`
                      : `https://image.tmdb.org/t/p/w200${movie.posterPath}`
                    }
                    alt={episode.name}
                  />
                  <div className="episode-number-badge">{episode.episode_number}</div>
                  {selectedEpisode === episode.episode_number && (
                    <div className="episode-playing">
                      <span className="playing-icon">▶</span>
                    </div>
                  )}
                </div>
                <div className="episode-info">
                  <h4>{episode.episode_number}. {episode.name}</h4>
                  <p>{episode.overview}</p>
                  <span className="episode-rating">⭐ {episode.vote_average?.toFixed(1)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Video Modal */}
      <VideoModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        videoUrl={currentVideoUrl}
        title={currentVideoTitle}
      />
    </div>
  );
};

export default MovieDetail;