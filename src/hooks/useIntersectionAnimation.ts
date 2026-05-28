"use client";

import { useEffect, useRef } from 'react';

interface UseIntersectionObserverAnimationOptions {
  once?: boolean;
  rootMargin?: string;
  delay?: number;
}

export function useIntersectionObserverAnimation<T extends HTMLElement>(
  options: UseIntersectionObserverAnimationOptions = {}
) {
  const { once = true, rootMargin = '0px', delay = 0 } = options;
  const ref = useRef<T>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            element.classList.add('is-visible');
          }, delay);
          if (once) {
            observer.unobserve(element);
          }
        }
      },
      { rootMargin }
    );

    observer.observe(element);

    return () => {
      observer.unobserve(element);
    };
  }, [ref, once, rootMargin, delay]);

  return ref;
}
