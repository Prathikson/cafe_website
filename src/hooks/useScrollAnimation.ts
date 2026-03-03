"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface ScrollAnimationOptions {
  from?: gsap.TweenVars;
  to?: gsap.TweenVars;
  trigger?: string;
  start?: string;
  stagger?: number;
}

export function useScrollAnimation(
  selector: string,
  options: ScrollAnimationOptions = {}
) {
  const containerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const {
      from = { opacity: 0, y: 50 },
      to = { opacity: 1, y: 0 },
      trigger,
      start = "top 75%",
      stagger: staggerAmount = 0.1,
    } = options;

    const ctx = gsap.context(() => {
      gsap.fromTo(selector, from, {
        ...to,
        stagger: staggerAmount,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: {
          trigger: trigger || containerRef.current,
          start,
          toggleActions: "play none none reverse",
        },
      });
    }, containerRef);

    return () => ctx.revert();
  }, [selector, options]);

  return containerRef;
}
