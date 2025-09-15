import React from 'react';
import AnimatedElement from './AnimatedElement';

// Exemplo de como usar as novas animações
const AnimationExamples = () => {
  return (
    <div className="animation-examples">
      {/* Animações básicas */}
      <AnimatedElement animation="fade-in-up" delay={0}>
        <h2>Título com fade-in-up</h2>
      </AnimatedElement>

      <AnimatedElement animation="fade-in-left" delay={200}>
        <p>Parágrafo com fade-in-left e delay</p>
      </AnimatedElement>

      <AnimatedElement animation="scale-in-bounce" delay={400}>
        <div className="card">
          <h3>Card com scale-in-bounce</h3>
          <p>Conteúdo do card</p>
        </div>
      </AnimatedElement>

      {/* Animações em sequência */}
      <div className="staggered-container">
        <AnimatedElement animation="fade-in-up" delay={0}>
          <div className="item">Item 1</div>
        </AnimatedElement>
        <AnimatedElement animation="fade-in-up" delay={100}>
          <div className="item">Item 2</div>
        </AnimatedElement>
        <AnimatedElement animation="fade-in-up" delay={200}>
          <div className="item">Item 3</div>
        </AnimatedElement>
      </div>

      {/* Elementos com classes CSS diretas */}
      <div className="scroll-animate">
        <h3>Elemento com scroll-animate</h3>
      </div>

      <div className="scroll-animate-left" data-delay="300">
        <p>Elemento com delay via data-attribute</p>
      </div>

      {/* Botões com animações */}
      <button className="btn btn-primary btn-animate hover-lift">
        Botão Animado
      </button>

      <button className="btn btn-secondary hover-scale">
        Botão com Hover Scale
      </button>

      {/* Cards com animações */}
      <div className="card card-animate hover-lift">
        <h4>Card Animado</h4>
        <p>Este card tem animações de hover</p>
      </div>

      {/* Elementos com animações contínuas */}
      <div className="animate-float">
        <div className="floating-element">Elemento Flutuante</div>
      </div>

      <div className="animate-pulse">
        <div className="pulsing-element">Elemento Pulsante</div>
      </div>

      {/* Texto com gradiente animado */}
      <h2 className="text-gradient-animate">
        Texto com Gradiente Animado
      </h2>

      {/* Loading states */}
      <div className="loading-spinner"></div>
      <div className="skeleton-loading" style={{width: '200px', height: '20px'}}></div>
    </div>
  );
};

export default AnimationExamples;