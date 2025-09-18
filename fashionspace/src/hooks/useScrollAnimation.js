import { useEffect, useRef, useState, useCallback } from 'react';

export const useScrollAnimation = (threshold = 0.1, rootMargin = '0px', triggerOnce = true) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (triggerOnce) {
            observer.unobserve(entry.target);
          }
        } else if (!triggerOnce) {
          setIsVisible(false);
        }
      },
      { threshold, rootMargin }
    );

    const currentRef = ref.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [threshold, rootMargin, triggerOnce]);

  return [ref, isVisible];
};

export const useScrollAnimationMultiple = () => {
  useEffect(() => {
    const selector = '.scroll-animate, .scroll-animate-left, .scroll-animate-right, .scroll-animate-scale, .scroll-animate-fade, .scroll-animate-rotate';

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            const delay = Number(entry.target.dataset.delay || 0);
            if (delay > 0) {
              setTimeout(() => {
                entry.target.classList.add('visible');
              }, delay);
            }
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );

    const observeEl = (el) => {
      if (!el || el.classList.contains('visible')) return;
      observer.observe(el);
    };

    // Observar elementos existentes
    document.querySelectorAll(selector).forEach(observeEl);

    // Observar novos elementos adicionados dinamicamente
    const mo = new MutationObserver((mutations) => {
      for (const m of mutations) {
        if (m.type === 'childList') {
          m.addedNodes.forEach((node) => {
            if (node.nodeType === 1) {
              if (node.matches && node.matches(selector)) observeEl(node);
              node.querySelectorAll && node.querySelectorAll(selector).forEach(observeEl);
            }
          });
        }
        if (m.type === 'attributes' && m.target.matches && m.target.matches(selector)) {
          observeEl(m.target);
        }
      }
    });

    mo.observe(document.body, { childList: true, subtree: true, attributes: false });

    return () => {
      observer.disconnect();
      mo.disconnect();
    };
  }, []);
};

export const useParallax = (speed = 0.5) => {
  const [offset, setOffset] = useState(0);
  const ref = useRef();

  const handleScroll = useCallback(() => {
    if (ref.current) {
      const scrolled = window.pageYOffset;
      const rate = scrolled * speed;
      setOffset(rate);
    }
  }, [speed]);

  useEffect(() => {
    let ticking = false;
    
    const requestTick = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', requestTick, { passive: true });
    return () => window.removeEventListener('scroll', requestTick);
  }, [handleScroll]);

  return [ref, offset];
};

export const useStaggeredAnimation = (elements, delay = 100) => {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const children = entry.target.children;
            Array.from(children).forEach((child, index) => {
              setTimeout(() => {
                child.classList.add('visible');
              }, index * delay);
            });
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    elements.forEach((el) => {
      if (el) observer.observe(el);
    });

    return () => {
      elements.forEach((el) => {
        if (el) observer.unobserve(el);
      });
    };
  }, [elements, delay]);
};