import React from 'react';
import { useScrollAnimation } from '../../hooks/useScrollAnimation';

const AnimatedElement = ({ 
  children, 
  animation = 'fade-in-up', 
  delay = 0, 
  threshold = 0.1, 
  triggerOnce = true,
  className = '',
  ...props 
}) => {
  const [ref, isVisible] = useScrollAnimation(threshold, '0px', triggerOnce);

  const animationClass = isVisible ? `animate-${animation}` : `scroll-animate`;
  const delayStyle = delay > 0 ? { animationDelay: `${delay}ms` } : {};

  return (
    <div
      ref={ref}
      className={`${animationClass} ${className}`}
      style={delayStyle}
      {...props}
    >
      {children}
    </div>
  );
};

export default AnimatedElement;