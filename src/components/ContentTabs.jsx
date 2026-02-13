import React from 'react';

const ContentTabs = ({ activeTab, onTabChange, counts }) => {
  const tabs = [
    { id: 'todos', label: '🍿 Todos', icon: '🍿' },
    { id: 'pelicula', label: '🎬 Películas', icon: '🎬' },
    { id: 'serie', label: '📺 Series', icon: '📺' },
    { id: 'anime', label: '🗾 Anime', icon: '🗾' },
    { id: 'novela', label: '💕 Novelas', icon: '💕' }
  ];

  return (
    <div className="content-tabs">
      <div className="tabs-container">
        {tabs.map(tab => (
          <button
            key={tab.id}
            className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => onTabChange(tab.id)}
          >
            <span className="tab-icon">{tab.icon}</span>
            <span className="tab-label">{tab.label}</span>
            {counts[tab.id] > 0 && <span className="tab-count">{counts[tab.id]}</span>}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ContentTabs;