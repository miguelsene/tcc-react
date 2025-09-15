import React, { useEffect, useState } from 'react';
import './PageTransition.css';

const PageTransition = ({ children, isLoading = false }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 50);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="page-loading">
        <div className="loading-spinner"></div>
        <div className="loading-text">Carregando<span className="loading-dots"></span></div>
      </div>
    );
  }

  return (
    <div className={`page-transition ${isVisible ? 'page-visible' : ''}`}>
      {children}
    </div>
  );
};

export default PageTransition;