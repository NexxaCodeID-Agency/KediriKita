"use client";

import React, { useState, useEffect, useRef } from "react";

interface LazySectionProps {
  children: React.ReactNode;
  threshold?: number;
  rootMargin?: string;
  className?: string;
  minHeight?: string;
}

/**
 * A wrapper component that only renders its children when it enters the viewport.
 * This helps reduce initial TBT and prevents heavy JS (like Three.js or GSAP) 
 * from running until the section is actually needed.
 */
export default function LazySection({
  children,
  threshold = 0.01,
  rootMargin = "300px 0px", // Load slightly before it enters the viewport
  className = "",
  minHeight = "100px",
}: LazySectionProps) {
  const [hasIntersected, setHasIntersected] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

useEffect(() => {
    if (hasIntersected) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setHasIntersected(true);
        }
      },
      { threshold, rootMargin }
    );

    const currentRef = sectionRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      // 🔴 Mematikan total instance observer biar hemat ram browser
      observer.disconnect(); 
    };
  }, [hasIntersected, threshold, rootMargin]);
  

  return (
    <div 
      ref={sectionRef} 
      className={className}
      style={!hasIntersected ? { minHeight } : {}}
    >
      {hasIntersected ? (
        children
      ) : (
        // Placeholder content can be added here if needed
        null
      )}
    </div>
  );
}
