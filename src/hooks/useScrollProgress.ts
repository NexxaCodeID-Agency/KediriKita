"use client";
import { useEffect, useRef, MutableRefObject } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function useScrollProgress(
  triggerRef: MutableRefObject<HTMLElement | null>,
  onProgress: (progress: number) => void,
) {
  const cbRef = useRef(onProgress);

  useEffect(() => {
    cbRef.current = onProgress;
  }, [onProgress]);

  useEffect(() => {
    const el = triggerRef.current;
    if (!el) return;

    const st = ScrollTrigger.create({
      trigger: el,
      start: "top top",
      end: "bottom top",
      onUpdate: (self) => cbRef.current(self.progress),
    });

    return () => st.kill();
  }, [triggerRef]);
}
