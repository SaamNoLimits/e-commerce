"use client";

import React, { useState, useEffect } from 'react';

const ChatbotPopup: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isAnimated, setIsAnimated] = useState(true);
  const [isIframeLoaded, setIsIframeLoaded] = useState(false);
  const [styleElement, setStyleElement] = useState<HTMLStyleElement | null>(null);

  const toggleChatbot = () => {
    setIsOpen(!isOpen);
    setIsAnimated(false);
  };

  useEffect(() => {
    if (typeof document !== 'undefined' && !styleElement) {
      const newStyleElement = document.createElement("style");
      newStyleElement.id = 'chatbot-styles';
      newStyleElement.textContent = `
        @keyframes pulseAnimation {
          0% {
            transform: scale(1);
            box-shadow: 0 0 10px rgba(139, 69, 19, 0.8), 0 0 20px rgba(139, 69, 19, 0.5);
          }
          50% {
            transform: scale(1.05);
            box-shadow: 0 0 15px rgba(139, 69, 19, 1), 0 0 30px rgba(139, 69, 19, 0.7);
          }
          100% {
            transform: scale(1);
            box-shadow: 0 0 10px rgba(139, 69, 19, 0.8), 0 0 20px rgba(139, 69, 19, 0.5);
          }
        }

        @keyframes popUpAnimation {
          0% {
            transform: translateY(20px) scale(0.95);
            opacity: 0;
          }
          100% {
            transform: translateY(0) scale(1);
            opacity: 1;
          }
        }
      `;
      document.head.appendChild(newStyleElement);
      setStyleElement(newStyleElement);
    }

    return () => {
      if (styleElement && document.head.contains(styleElement)) {
        document.head.removeChild(styleElement);
      }
    };
  }, [styleElement]);

  return (
    <>
      <button
        onClick={toggleChatbot}
        aria-label="Toggle chatbot"
        className="chatbot-button"
        style={{
          position: 'fixed',
          bottom: '80px',
          left: '1700px',
          backgroundColor: 'transparent',
          border: 'none',
          cursor: 'pointer',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          borderRadius: '25px',
          boxShadow: '0 2px 6px rgba(0, 0, 0, 0.15)',
          animation: isAnimated ? 'pulseAnimation 1.5s infinite' : 'none',
          padding: '12px 24px',
          color: 'white',
          fontWeight: 'bold',
          fontSize: '18px',
          background: 'linear-gradient(45deg, #8B4513, #D2691E)',
          letterSpacing: '1px',
          zIndex: 1000,
          transition: 'transform 0.2s ease',
        }}
        onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
        onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
      >
        TerraChat
      </button>

      {isOpen && (
        <div
          style={{
            position: 'fixed',
            bottom: '80px',
            right: '20px',
            width: 'min(450px, 90vw)', // Augmentation de la largeur
            height: 'min(650px, 85vh)', // Augmentation de la hauteur
            borderRadius: '8px',
            backgroundColor: '#fff',
            zIndex: 1001,
            animation: 'popUpAnimation 0.3s ease-out',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
            border: '1px solid rgba(139, 69, 19, 0.2)',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {/* Titre du chatbot avec fond marron */}
          <div style={{
            backgroundColor: '#8B4513',
            color: 'white',
            padding: '12px 16px',
            fontSize: '18px',
            fontWeight: 'bold',
            textAlign: 'center',
            borderTopLeftRadius: '8px',
            borderTopRightRadius: '8px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
            <span>Assistant HandTerra</span>
            <button
              onClick={toggleChatbot}
              aria-label="Close chatbot"
              style={{
                background: 'transparent',
                border: 'none',
                color: 'white',
                fontSize: '16px',
                cursor: 'pointer',
                padding: '0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              ✖
            </button>
          </div>

          {/* Iframe avec taille augmentée */}
          <iframe
            src="http://localhost:3001"
            width="100%"
            height="100%"
            style={{
              border: 'none',
              flexGrow: 1,
              backgroundColor: isIframeLoaded ? 'transparent' : '#f5f5f5',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
            title="Chatbot Assistant"
            onLoad={() => setIsIframeLoaded(true)}
            sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
            loading="eager"
          >
            {!isIframeLoaded && (
              <div style={{
                color: '#666',
                fontSize: '16px',
              }}>
                Chargement de l'assistant...
              </div>
            )}
          </iframe>
        </div>
      )}
    </>
  );
};

export default ChatbotPopup;