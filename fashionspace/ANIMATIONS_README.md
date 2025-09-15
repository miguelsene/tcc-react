# Sistema de Animações FashionSpace

## Visão Geral
Sistema completo de animações modernas e performáticas para o FashionSpace, incluindo animações de scroll, hover, transições de página e muito mais.

## Arquivos Principais
- `src/animations.css` - Todas as animações e keyframes
- `src/hooks/useScrollAnimation.js` - Hooks para animações de scroll
- `src/components/common/AnimatedElement.jsx` - Componente wrapper para animações
- `src/components/common/PageTransition.jsx` - Transições de página

## Classes de Animação Disponíveis

### Animações de Entrada
- `.animate-fade-in` - Fade simples
- `.animate-fade-in-up` - Fade com movimento para cima
- `.animate-fade-in-down` - Fade com movimento para baixo
- `.animate-fade-in-left` - Fade com movimento da esquerda
- `.animate-fade-in-right` - Fade com movimento da direita
- `.animate-scale-in` - Escala de entrada
- `.animate-scale-in-bounce` - Escala com bounce
- `.animate-slide-in-up` - Deslizar para cima
- `.animate-slide-in-down` - Deslizar para baixo
- `.animate-rotate-in` - Rotação de entrada
- `.animate-flip-in-x` - Flip no eixo X

### Animações Contínuas
- `.animate-pulse` - Pulsação
- `.animate-float` - Flutuação
- `.animate-glow` - Brilho
- `.animate-wave` - Ondulação
- `.animate-bounce` - Salto

### Animações de Hover
- `.hover-lift` - Elevação no hover
- `.hover-scale` - Escala no hover
- `.hover-rotate` - Rotação no hover
- `.hover-glow` - Brilho no hover

### Animações de Scroll
- `.scroll-animate` - Fade up no scroll
- `.scroll-animate-left` - Movimento da esquerda no scroll
- `.scroll-animate-right` - Movimento da direita no scroll
- `.scroll-animate-scale` - Escala no scroll
- `.scroll-animate-fade` - Fade simples no scroll
- `.scroll-animate-rotate` - Rotação no scroll

## Como Usar

### 1. Usando Classes CSS Diretamente
```jsx
<div className="scroll-animate">
  <h2>Título que anima no scroll</h2>
</div>

<button className="btn btn-primary hover-lift">
  Botão com hover
</button>
```

### 2. Usando o Componente AnimatedElement
```jsx
import AnimatedElement from './components/common/AnimatedElement';

<AnimatedElement animation="fade-in-up" delay={200}>
  <div className="card">
    <h3>Card Animado</h3>
  </div>
</AnimatedElement>
```

### 3. Usando Hooks Diretamente
```jsx
import { useScrollAnimation } from './hooks/useScrollAnimation';

const MyComponent = () => {
  const [ref, isVisible] = useScrollAnimation();
  
  return (
    <div ref={ref} className={isVisible ? 'animate-fade-in-up' : ''}>
      Conteúdo
    </div>
  );
};
```

### 4. Delays e Sequências
```jsx
// Com data-delay
<div className="scroll-animate" data-delay="300">
  Elemento com delay
</div>

// Com style
<div className="animate-fade-in-up" style={{animationDelay: '0.5s'}}>
  Elemento com delay inline
</div>
```

## Variáveis CSS Disponíveis
```css
:root {
  --animation-fast: 0.2s;
  --animation-normal: 0.3s;
  --animation-slow: 0.5s;
  --animation-extra-slow: 0.8s;
  --ease-out-quart: cubic-bezier(0.25, 1, 0.5, 1);
  --ease-in-out-quart: cubic-bezier(0.76, 0, 0.24, 1);
  --ease-bounce: cubic-bezier(0.68, -0.55, 0.265, 1.55);
  --ease-elastic: cubic-bezier(0.175, 0.885, 0.32, 1.275);
}
```

## Otimizações de Performance
- Uso de `transform3d` para aceleração GPU
- `will-change` para elementos que serão animados
- `backface-visibility: hidden` para evitar flickering
- Animações otimizadas para 60fps
- Suporte a `prefers-reduced-motion`

## Responsividade
- Animações adaptadas para dispositivos móveis
- Durações reduzidas em telas menores
- Movimentos menores em hover para touch devices

## Acessibilidade
- Respeita `prefers-reduced-motion: reduce`
- Animações podem ser desabilitadas globalmente
- Foco visível mantido durante animações

## Exemplos de Uso Comum

### Hero Section
```jsx
<div className="hero">
  <div className="hero-content animate-fade-in-up">
    <h1 style={{animationDelay: '0.2s'}}>Título</h1>
    <p style={{animationDelay: '0.4s'}}>Subtítulo</p>
    <div className="hero-actions" style={{animationDelay: '0.6s'}}>
      <button className="btn btn-primary hover-lift">Ação</button>
    </div>
  </div>
</div>
```

### Cards Grid
```jsx
<div className="cards-grid">
  {items.map((item, index) => (
    <div 
      key={item.id}
      className="card card-animate hover-lift scroll-animate"
      data-delay={index * 100}
    >
      <h3>{item.title}</h3>
      <p>{item.description}</p>
    </div>
  ))}
</div>
```

### Loading States
```jsx
<div className="loading-container">
  <div className="loading-spinner"></div>
  <div className="loading-text">
    Carregando<span className="loading-dots"></span>
  </div>
</div>
```

## Customização
Para criar animações customizadas, adicione no seu CSS:

```css
@keyframes minhaAnimacao {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

.minha-classe {
  animation: minhaAnimacao var(--animation-normal) var(--ease-out-quart) forwards;
}
```

## Suporte a Navegadores
- Chrome/Edge 88+
- Firefox 85+
- Safari 14+
- Fallbacks para navegadores mais antigos