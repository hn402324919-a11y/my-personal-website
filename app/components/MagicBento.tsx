"use client";

import { Children, cloneElement, isValidElement, useEffect, useRef, type ReactElement, type ReactNode } from "react";

type MagicBentoProps = {
  children: ReactNode;
  className?: string;
  glowColor?: string;
  spotlightRadius?: number;
  particleCount?: number;
  enableStars?: boolean;
  enableMagnetism?: boolean;
  clickEffect?: boolean;
};

function createParticle(card: HTMLElement, glowColor: string) {
  const particle = document.createElement("span");
  const { width, height } = card.getBoundingClientRect();
  particle.className = "magic-particle";
  particle.style.left = `${Math.random() * width}px`;
  particle.style.top = `${Math.random() * height}px`;
  particle.style.background = `rgba(${glowColor}, 1)`;
  particle.style.boxShadow = `0 0 8px rgba(${glowColor}, .7)`;
  card.appendChild(particle);
  return particle;
}

export default function MagicBento({
  children,
  className = "",
  glowColor = "2, 158, 90",
  spotlightRadius = 300,
  particleCount = 6,
  enableStars = true,
  enableMagnetism = true,
  clickEffect = false,
}: MagicBentoProps) {
  const gridRef = useRef<HTMLDivElement>(null);
  const spotlightRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cancelled = false;
    let disposeEffects: (() => void) | undefined;

    const setupEffects = async () => {
    const grid = gridRef.current;
    const spotlight = spotlightRef.current;
    if (!grid || !spotlight) return;

    const canHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!canHover || reduceMotion) return;

    const { gsap } = await import("gsap");
    if (cancelled || !gridRef.current || !spotlightRef.current) return;

    const cards = Array.from(grid.querySelectorAll<HTMLElement>(".magic-bento-card"));
    const cleanups: Array<() => void> = [];
    const moveSpotlightX = gsap.quickTo(spotlight, "x", { duration: 0.18, ease: "power2.out" });
    const moveSpotlightY = gsap.quickTo(spotlight, "y", { duration: 0.18, ease: "power2.out" });
    const fadeSpotlight = gsap.quickTo(spotlight, "opacity", { duration: 0.22, ease: "power2.out" });

    const handleGridMove = (event: MouseEvent) => {
      const gridRect = grid.getBoundingClientRect();
      moveSpotlightX(event.clientX - gridRect.left);
      moveSpotlightY(event.clientY - gridRect.top);
      fadeSpotlight(0.72);

      cards.forEach((card) => {
        const rect = card.getBoundingClientRect();
        const relativeX = ((event.clientX - rect.left) / rect.width) * 100;
        const relativeY = ((event.clientY - rect.top) / rect.height) * 100;
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const edgeDistance = Math.max(0, Math.hypot(event.clientX - centerX, event.clientY - centerY) - Math.max(rect.width, rect.height) / 2);
        const intensity = Math.max(0, 1 - edgeDistance / spotlightRadius);
        card.style.setProperty("--glow-x", `${relativeX}%`);
        card.style.setProperty("--glow-y", `${relativeY}%`);
        card.style.setProperty("--glow-intensity", intensity.toFixed(3));
        card.style.setProperty("--glow-radius", `${spotlightRadius}px`);
      });
    };

    const handleGridLeave = () => {
      fadeSpotlight(0);
      spotlight.style.willChange = "";
      cards.forEach((card) => card.style.setProperty("--glow-intensity", "0"));
    };

    const handleGridEnter = () => {
      spotlight.style.willChange = "transform, opacity";
    };

    grid.addEventListener("mousemove", handleGridMove);
    grid.addEventListener("mouseenter", handleGridEnter);
    grid.addEventListener("mouseleave", handleGridLeave);
    cleanups.push(() => {
      grid.removeEventListener("mousemove", handleGridMove);
      grid.removeEventListener("mouseenter", handleGridEnter);
      grid.removeEventListener("mouseleave", handleGridLeave);
    });

    cards.forEach((card) => {
      const particles: HTMLElement[] = [];
      const moveCardX = gsap.quickTo(card, "x", { duration: 0.28, ease: "power3.out" });
      const moveCardY = gsap.quickTo(card, "y", { duration: 0.28, ease: "power3.out" });

      const clearParticles = () => {
        particles.splice(0).forEach((particle) => {
          gsap.killTweensOf(particle);
          particle.remove();
        });
      };

      const handleEnter = () => {
        card.style.willChange = "transform";
        if (!enableStars) return;
        for (let index = 0; index < particleCount; index += 1) {
          const particle = createParticle(card, glowColor);
          particles.push(particle);
          gsap.fromTo(
            particle,
            { scale: 0, opacity: 0 },
            {
              scale: 1,
              opacity: 0.85,
              duration: 0.28,
              delay: index * 0.045,
              ease: "back.out(1.7)",
            },
          );
          gsap.to(particle, {
            x: (Math.random() - 0.5) * 64,
            y: (Math.random() - 0.5) * 64,
            opacity: 0.25,
            duration: 1.8 + Math.random(),
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut",
          });
        }
      };

      const handleMove = (event: MouseEvent) => {
        if (!enableMagnetism) return;
        const rect = card.getBoundingClientRect();
        moveCardX((event.clientX - rect.left - rect.width / 2) * 0.018);
        moveCardY((event.clientY - rect.top - rect.height / 2) * 0.018);
      };

      const handleLeave = () => {
        moveCardX(0);
        moveCardY(0);
        clearParticles();
        window.setTimeout(() => {
          card.style.willChange = "";
        }, 300);
      };

      const handleClick = (event: MouseEvent) => {
        if (!clickEffect) return;
        const rect = card.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        const maxDistance = Math.max(
          Math.hypot(x, y),
          Math.hypot(x - rect.width, y),
          Math.hypot(x, y - rect.height),
          Math.hypot(x - rect.width, y - rect.height),
        );
        const ripple = document.createElement("span");
        ripple.className = "magic-ripple";
        ripple.style.width = `${maxDistance * 2}px`;
        ripple.style.height = `${maxDistance * 2}px`;
        ripple.style.left = `${x - maxDistance}px`;
        ripple.style.top = `${y - maxDistance}px`;
        ripple.style.background = `radial-gradient(circle, rgba(${glowColor}, .38), rgba(${glowColor}, .12) 36%, transparent 70%)`;
        card.appendChild(ripple);
        gsap.fromTo(ripple, { scale: 0, opacity: 1 }, { scale: 1, opacity: 0, duration: 0.72, ease: "power2.out", onComplete: () => ripple.remove() });
      };

      card.addEventListener("mouseenter", handleEnter);
      card.addEventListener("mousemove", handleMove);
      card.addEventListener("mouseleave", handleLeave);
      card.addEventListener("click", handleClick);
      cleanups.push(() => {
        card.removeEventListener("mouseenter", handleEnter);
        card.removeEventListener("mousemove", handleMove);
        card.removeEventListener("mouseleave", handleLeave);
        card.removeEventListener("click", handleClick);
        gsap.killTweensOf(card);
        clearParticles();
      });
    });

    disposeEffects = () => {
      cleanups.forEach((cleanup) => cleanup());
      gsap.killTweensOf(spotlight);
    };
    };

    void setupEffects();

    return () => {
      cancelled = true;
      disposeEffects?.();
    };
  }, [clickEffect, enableMagnetism, enableStars, glowColor, particleCount, spotlightRadius]);

  const enhancedChildren = Children.map(children, (child) => {
    if (!isValidElement<{ className?: string }>(child)) return child;
    const element = child as ReactElement<{ className?: string }>;
    return cloneElement(element, {
      className: `${element.props.className ?? ""} magic-bento-card magic-bento-card--border-glow`.trim(),
    });
  });

  return (
    <div ref={gridRef} className={`bento-section ${className}`}>
      <div ref={spotlightRef} className="bento-spotlight" aria-hidden="true" />
      {enhancedChildren}
    </div>
  );
}
