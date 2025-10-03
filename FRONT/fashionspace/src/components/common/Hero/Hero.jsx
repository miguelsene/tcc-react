import React from 'react';
import './Hero.css';

/*
  Componente de Hero reutilizável
  Props:
    - title: string ou ReactNode
    - subtitle: string ou ReactNode
    - eyebrow: string opcional (pequena etiqueta acima do título)
    - backgroundImage: url da imagem de fundo
    - actions: ReactNode (botões/links)
*/

export default function Hero({ title, subtitle, eyebrow, backgroundImage, actions }) {
  const style = backgroundImage
    ? { backgroundImage: `url(${backgroundImage})` }
    : undefined;

  return (
    <section className="site-hero" style={style} aria-label="Banner inicial">
      <div className="hero-inner">
        {eyebrow ? (
          <div className="hero-eyebrow">
            <i className="bi bi-stars" aria-hidden="true"></i>
            <span>{eyebrow}</span>
          </div>
        ) : null}
        {title ? <h1 className="hero-title">{title}</h1> : null}
        {subtitle ? <p className="hero-subtitle">{subtitle}</p> : null}
        {actions ? <div className="hero-actions">{actions}</div> : null}
      </div>
    </section>
  );
}
