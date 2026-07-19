"use client";

import React, { useState, useEffect, useRef } from "react";

const SHIMMER_CSS = `
  @keyframes _shimmer {
    0% { background-position: -200% 0; }
    100% { background-position: 200% 0; }
  }
`;

function DefaultSkeleton() {
  return (
    <div className="w-full h-full flex items-center justify-center" style={{ minHeight: "inherit" }}>
      <style dangerouslySetInnerHTML={{ __html: SHIMMER_CSS }} />
      <div className="space-y-4 w-full max-w-md px-6">
        <div style={{ height: 12, borderRadius: 9999, width: "40%", margin: "0 auto", background: "linear-gradient(90deg, rgba(212,160,23,0.04) 25%, rgba(212,160,23,0.1) 50%, rgba(212,160,23,0.04) 75%)", backgroundSize: "200% 100%", animation: "_shimmer 1.8s ease-in-out infinite" }} />
        <div style={{ height: 28, borderRadius: 8, width: "60%", margin: "0 auto", background: "linear-gradient(90deg, rgba(255,255,255,0.02) 25%, rgba(255,255,255,0.05) 50%, rgba(255,255,255,0.02) 75%)", backgroundSize: "200% 100%", animation: "_shimmer 1.8s ease-in-out infinite", animationDelay: "100ms" }} />
        <div style={{ height: 12, borderRadius: 9999, width: "50%", margin: "0 auto", background: "linear-gradient(90deg, rgba(255,255,255,0.02) 25%, rgba(255,255,255,0.04) 50%, rgba(255,255,255,0.02) 75%)", backgroundSize: "200% 100%", animation: "_shimmer 1.8s ease-in-out infinite", animationDelay: "200ms" }} />
      </div>
    </div>
  );
}

interface LazySectionProps {
  children: React.ReactNode;
  threshold?: number;
  rootMargin?: string;
  className?: string;
  minHeight?: string;
  fallback?: React.ReactNode;
}

export default function LazySection({
  children,
  threshold = 0.01,
  rootMargin = "300px 0px",
  className = "",
  minHeight = "100px",
  fallback,
}: LazySectionProps) {
  const [hasIntersected, setHasIntersected] = useState(false);
  const [renderedHeight, setRenderedHeight] = useState<string | undefined>(undefined);
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
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [hasIntersected, threshold, rootMargin]);

  useEffect(() => {
    if (!hasIntersected || !sectionRef.current) return;
    const h = sectionRef.current.offsetHeight;
    if (h > 0) setRenderedHeight(`${h}px`);
  }, [hasIntersected]);

  const currentMinHeight = renderedHeight ?? minHeight;

  return (
    <div
      ref={sectionRef}
      className={className}
      style={{ minHeight: currentMinHeight }}
    >
      {hasIntersected ? (
        children
      ) : (
        fallback ?? <DefaultSkeleton />
      )}
    </div>
  );
}
