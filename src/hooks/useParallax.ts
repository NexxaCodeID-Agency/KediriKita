'use client';
import { useEffect, MutableRefObject } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export interface ParallaxLayer {
  ref: MutableRefObject<HTMLElement | null>;
  speed: number;
}

export function useParallax(
  triggerRef: MutableRefObject<HTMLElement | null>,
  layers: ParallaxLayer[],
  maxTravel = 220
) {
  useEffect(() => {
    const trigger = triggerRef.current;
    if (!trigger) return;

    // Per CLAUDE.md: disable parallax on mobile, use static scroll
    if (window.innerWidth < 768) return;

    // `to` bukan `fromTo` — initial y = 0 agar tidak konflik dengan entrance animation
    const tweens = layers.map(({ ref, speed }) => {
      const el = ref.current;
      if (!el) return null;

      return gsap.to(el, {
        y: -(maxTravel * speed),
        ease: 'none',
        scrollTrigger: {
          trigger,
          start: 'top top',
          end: 'bottom top',
          scrub: 1.5, // lag ringan untuk kesan inertia
        },
      });
    });

    return () => {
      tweens.forEach((t) => t?.scrollTrigger?.kill());
    };
  }, [triggerRef, layers, maxTravel]);
}
