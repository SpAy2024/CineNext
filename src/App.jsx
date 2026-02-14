import React from 'react';

function App() {
  return (
    <div style={{
      background: '#141414',
      color: '#e50914',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '2rem',
      fontFamily: 'Arial, sans-serif'
    }}>
      <h1>🎬 CINENEXT</h1>
      <p style={{ color: 'white', fontSize: '1.2rem' }}>
        ¡React funciona correctamente!
      </p>
      <p style={{ color: '#666', fontSize: '1rem', marginTop: '20px' }}>
        Versión de React: {React.version}
      </p>
    </div>
  );
}

export default App;
