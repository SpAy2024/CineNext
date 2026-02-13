import React, { useEffect, useRef } from 'react';

const VideoModal = ({ isOpen, onClose, videoUrl, title }) => {
  const modalRef = useRef(null);

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose();
    };
    
    if (isOpen) {
      document.addEventListener('keydown', handleEsc);
      document.body.style.overflow = 'hidden';
    }
    
    return () => {
      document.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  const handleFullScreen = () => {
    const iframe = modalRef.current?.querySelector('iframe');
    if (iframe) {
      if (iframe.requestFullscreen) {
        iframe.requestFullscreen();
      } else if (iframe.webkitRequestFullscreen) {
        iframe.webkitRequestFullscreen();
      } else if (iframe.msRequestFullscreen) {
        iframe.msRequestFullscreen();
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="video-modal-overlay" onClick={onClose}>
      <div className="video-modal-content" onClick={e => e.stopPropagation()}>
        <div className="video-modal-header">
          <h3>{title}</h3>
          <div className="modal-controls">
            <button onClick={handleFullScreen} className="modal-btn fullscreen-btn" title="Pantalla completa">
              ⛶
            </button>
            <button onClick={onClose} className="modal-btn close-btn" title="Cerrar">
              ✕
            </button>
          </div>
        </div>
        <div className="video-modal-body" ref={modalRef}>
          <iframe
            src={videoUrl}
            title={title}
            width="100%"
            height="100%"
            frameBorder="0"
            allowFullScreen
          />
        </div>
      </div>
    </div>
  );
};

export default VideoModal;