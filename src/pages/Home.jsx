import React, { useContext, useState, useMemo } from 'react';
import { MovieContext } from '../context/MovieContext';
import Row from '../components/Row';
import Hero from '../components/Hero';
import Slider from '../components/Slider';
import ContentTabs from '../components/ContentTabs';

const Home = () => {
  const { customMovies } = useContext(MovieContext);
  const [activeTab, setActiveTab] = useState('todos');

  const counts = useMemo(() => ({
    todos: customMovies.length,
    pelicula: customMovies.filter(m => m.contentType === 'pelicula').length,
    serie: customMovies.filter(m => m.contentType === 'serie').length,
    anime: customMovies.filter(m => m.contentType === 'anime').length,
    novela: customMovies.filter(m => m.contentType === 'novela').length
  }), [customMovies]);

  const filteredMovies = useMemo(() => {
    if (activeTab === 'todos') return customMovies;
    return customMovies.filter(m => m.contentType === activeTab);
  }, [customMovies, activeTab]);

  const latestMovies = [...filteredMovies].reverse().slice(0, 10);
  const topRatedMovies = [...filteredMovies]
    .filter(m => m.vote_average > 0)
    .sort((a, b) => b.vote_average - a.vote_average)
    .slice(0, 10);

  return (
    <div className="home">
      <Slider />
      <ContentTabs activeTab={activeTab} onTabChange={setActiveTab} counts={counts} />
      
      {customMovies.length > 0 ? (
        <>
          {latestMovies.length > 0 && <Row title="🎬 Últimas Agregadas" movies={latestMovies} />}
          {topRatedMovies.length > 0 && <Row title="⭐ Mejor Calificadas" movies={topRatedMovies} />}
          <Row title="📽️ Todas" movies={filteredMovies} />
        </>
      ) : (
        <div className="no-movies">
          <div className="no-movies-content">
            <h2>🎬 No hay contenido agregado</h2>
            <p>Ve al panel de administración y agrega tus primeros títulos</p>
            <Link to="/admin" className="add-movies-btn">+ Agregar Contenido</Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;