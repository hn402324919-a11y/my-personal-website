"use client";

import { useEffect, useRef, useState, type CSSProperties, type ElementType } from "react";
import type { TweenVars } from "gsap";

type SplitTextProps = {
  text: string;
  className?: string;
  delay?: number;
  duration?: number;
  ease?: string;
  splitType?: "chars" | "words" | "lines" | "words, chars";
  from?: TweenVars;
  to?: TweenVars;
  threshold?: number;
  rootMargin?: string;
  textAlign?: CSSProperties["textAlign"];
  tag?: ElementType;
  id?: string;
  onLetterAnimationComplete?: () => void;
};

type SplitElement = HTMLElement & {
  _rbsplitInstance?: { revert: () => void } | null;
};

export default function SplitText({
  text,
  className = "",
  delay = 38,
  duration = 0.78,
  ease = "power3.out",
  splitType = "chars",
  from = { opacity: 0, y: 46 },
  to = { opacity: 1, y: 0 },
  threshold = 0.14,
  rootMargin = "-48px",
  textAlign = "left",
  tag = "p",
  id,
  onLetterAnimationComplete,
}: SplitTextProps) {
  const ref = useRef<SplitElement>(null);
  const animationCompletedRef = useRef(false);
  const onCompleteRef = useRef(onLetterAnimationComplete);
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    onCompleteRef.current = onLetterAnimationComplete;
  }, [onLetterAnimationComplete]);

  useEffect(() => {
    let active = true;
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updateMotion = () => setReduceMotion(motionQuery.matches);
    updateMotion();
    motionQuery.addEventListener("change", updateMotion);

    if (document.fonts.status === "loaded") {
      setFontsLoaded(true);
    } else {
      document.fonts.ready.then(() => {
        if (active) setFontsLoaded(true);
      });
    }

    return () => {
      active = false;
      motionQuery.removeEventListener("change", updateMotion);
    };
  }, []);

  useEffect(() => {
    let cancelled = false;
    let disposeAnimation: (() => void) | undefined;

    const setupAnimation = async () => {
      const element = ref.current;
      if (!element || !text || !fontsLoaded || reduceMotion || animationCompletedRef.current) return;

      const [{ gsap }, { ScrollTrigger }, { SplitText: GSAPSplitText }] = await Promise.all([
        import("gsap"),
        import("gsap/ScrollTrigger"),
        import("gsap/SplitText"),
      ]);

      if (cancelled || !ref.current) return;

      gsap.registerPlugin(ScrollTrigger, GSAPSplitText);

      if (element._rbsplitInstance) {
        element._rbsplitInstance.revert();
        element._rbsplitInstance = null;
      }

      const startPct = (1 - threshold) * 100;
      const marginMatch = /^(-?\d+(?:\.\d+)?)(px|em|rem|%)?$/.exec(rootMargin);
      const marginValue = marginMatch ? parseFloat(marginMatch[1]) : 0;
      const marginUnit = marginMatch?.[2] || "px";
      const sign = marginValue === 0 ? "" : marginValue < 0 ? `-=${Math.abs(marginValue)}${marginUnit}` : `+=${marginValue}${marginUnit}`;
      const start = `top ${startPct}%${sign}`;

      const splitInstance = new GSAPSplitText(element, {
        type: splitType,
        smartWrap: true,
        autoSplit: splitType === "lines",
        linesClass: "split-line",
        wordsClass: "split-word",
        charsClass: "split-char",
        reduceWhiteSpace: false,
        onSplit: (self) => {
          const targets = splitType.includes("chars") && self.chars.length
            ? self.chars
            : splitType.includes("words") && self.words.length
              ? self.words
              : self.lines;

          targets.forEach((target) => {
            target.style.willChange = "transform, opacity";
          });

          return gsap.fromTo(
            targets,
            { ...from },
            {
              ...to,
              duration,
              ease,
              stagger: delay / 1000,
              force3D: true,
              scrollTrigger: {
                trigger: element,
                start,
                once: true,
                fastScrollEnd: true,
                anticipatePin: 0.4,
              },
              onComplete: () => {
                targets.forEach((target) => {
                  target.style.willChange = "";
                });
                animationCompletedRef.current = true;
                onCompleteRef.current?.();
              },
            },
          );
        },
      });

      element._rbsplitInstance = splitInstance;

      disposeAnimation = () => {
        ScrollTrigger.getAll().forEach((trigger) => {
          if (trigger.trigger === element) trigger.kill();
        });
        splitInstance.revert();
        element._rbsplitInstance = null;
      };
    };

    void setupAnimation();

    return () => {
      cancelled = true;
      disposeAnimation?.();
    };
  }, [text, delay, duration, ease, splitType, JSON.stringify(from), JSON.stringify(to), threshold, rootMargin, fontsLoaded, reduceMotion]);

  const Tag = tag;
  return (
    <Tag
      ref={ref}
      id={id}
      className={`split-parent ${className}`}
      style={{ textAlign, overflow: "hidden", display: "inline-block", whiteSpace: "pre-line", wordWrap: "break-word" }}
    >
      {text}
    </Tag>
  );
}
