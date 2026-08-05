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
  startEvent?: string;
  onLetterAnimationComplete?: () => void;
};

type SplitElement = HTMLElement & {
  _rbsplitInstance?: { revert: () => void } | null;
};

type SplitAnimation = {
  kill: () => void;
  scrollTrigger?: { kill: () => void };
};

const defaultFrom: TweenVars = { opacity: 0, y: 46 };
const defaultTo: TweenVars = { opacity: 1, y: 0 };
const getStartEventKey = (eventName: string) => `__splitTextStart:${eventName}`;

export default function SplitText({
  text,
  className = "",
  delay = 38,
  duration = 0.78,
  ease = "power3.out",
  splitType = "chars",
  from = defaultFrom,
  to = defaultTo,
  threshold = 0.14,
  rootMargin = "-48px",
  textAlign = "left",
  tag = "p",
  id,
  startEvent,
  onLetterAnimationComplete,
}: SplitTextProps) {
  const ref = useRef<SplitElement>(null);
  const onCompleteRef = useRef(onLetterAnimationComplete);
  const [fontsLoaded, setFontsLoaded] = useState(
    () => typeof document !== "undefined" && document.fonts.status === "loaded",
  );

  useEffect(() => {
    onCompleteRef.current = onLetterAnimationComplete;
  }, [onLetterAnimationComplete]);

  useEffect(() => {
    let active = true;

    if (!fontsLoaded) {
      document.fonts.ready.then(() => {
        if (active) setFontsLoaded(true);
      });
    }

    return () => {
      active = false;
    };
  }, [fontsLoaded]);

  useEffect(() => {
    let cancelled = false;
    let disposeAnimation: (() => void) | undefined;

    const setupAnimation = async () => {
      const element = ref.current;
      if (!element || !text || !fontsLoaded) return;

      const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reduceMotion) return;

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
      let animation: SplitAnimation | undefined;
      let removeStartListener: (() => void) | undefined;

      const splitInstance = new GSAPSplitText(element, {
        type: splitType,
        smartWrap: true,
        autoSplit: splitType === "lines",
        linesClass: "split-line",
        wordsClass: "split-word",
        charsClass: "split-char",
        reduceWhiteSpace: false,
        onSplit: (self) => {
          element.dispatchEvent(new CustomEvent("splittext:ready", { bubbles: true }));

          const targets = splitType.includes("chars") && self.chars.length
            ? self.chars
            : splitType.includes("words") && self.words.length
              ? self.words
              : self.lines;

          targets.forEach((target) => {
            target.style.willChange = "transform, opacity";
          });

          const clearTargets = () => {
            targets.forEach((target) => {
              target.style.willChange = "";
            });
          };

          const animateTargets = () => {
            animation?.kill();
            animation = gsap.fromTo(
              targets,
              { ...from },
              {
                ...to,
                duration,
                ease,
                stagger: delay / 1000,
                force3D: true,
                onComplete: () => {
                  clearTargets();
                  onCompleteRef.current?.();
                },
              },
            );

            return animation;
          };

          if (startEvent) {
            const startState = (window as Window & Record<string, boolean | "skip" | undefined>)[getStartEventKey(startEvent)];

            if (startState === "skip") {
              clearTargets();
              return undefined;
            }

            gsap.set(targets, { ...from });

            if (startState) {
              return animateTargets();
            }

            const startAnimation = () => {
              if (!cancelled) animateTargets();
            };
            window.addEventListener(startEvent, startAnimation, { once: true });
            removeStartListener = () => window.removeEventListener(startEvent, startAnimation);
            return undefined;
          }

          animation = gsap.fromTo(
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
                clearTargets();
                onCompleteRef.current?.();
              },
            },
          );

          return animation;
        },
      });

      element._rbsplitInstance = splitInstance;

      disposeAnimation = () => {
        removeStartListener?.();
        animation?.scrollTrigger?.kill();
        animation?.kill();
        splitInstance.revert();
        element._rbsplitInstance = null;
      };
    };

    void setupAnimation();

    return () => {
      cancelled = true;
      disposeAnimation?.();
    };
  }, [text, delay, duration, ease, splitType, from, to, threshold, rootMargin, fontsLoaded, startEvent]);

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
