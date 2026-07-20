"use client";

import { useEffect, useRef, useState, type PointerEvent, type ReactNode } from "react";
import { motion, useMotionValue, useReducedMotion, useSpring } from "motion/react";

type TiltedCardProps = {
  children: ReactNode;
  className?: string;
  rotateAmplitude?: number;
  scaleOnHover?: number;
};

const springValues = {
  damping: 30,
  stiffness: 120,
  mass: 1.6,
};

export default function TiltedCard({
  children,
  className = "",
  rotateAmplitude = 5,
  scaleOnHover = 1.012,
}: TiltedCardProps) {
  const ref = useRef<HTMLElement>(null);
  const reducedMotion = useReducedMotion();
  const [canHover, setCanHover] = useState(false);
  const rotateX = useSpring(useMotionValue(0), springValues);
  const rotateY = useSpring(useMotionValue(0), springValues);
  const scale = useSpring(1, springValues);

  useEffect(() => {
    const query = window.matchMedia("(hover: hover) and (pointer: fine)");
    const update = () => setCanHover(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  const reset = () => {
    scale.set(1);
    rotateX.set(0);
    rotateY.set(0);
  };

  const handlePointerMove = (event: PointerEvent<HTMLElement>) => {
    if (!ref.current || !canHover || reducedMotion) return;
    const rect = ref.current.getBoundingClientRect();
    const offsetX = event.clientX - rect.left - rect.width / 2;
    const offsetY = event.clientY - rect.top - rect.height / 2;
    rotateX.set((offsetY / (rect.height / 2)) * -rotateAmplitude);
    rotateY.set((offsetX / (rect.width / 2)) * rotateAmplitude);
  };

  const handlePointerEnter = () => {
    if (!canHover || reducedMotion) return;
    scale.set(scaleOnHover);
  };

  return (
    <figure
      ref={ref}
      className={`tilted-card-figure ${className}`}
      onPointerMove={handlePointerMove}
      onPointerEnter={handlePointerEnter}
      onPointerLeave={reset}
      onPointerCancel={reset}
    >
      <motion.div
        className="tilted-card-inner"
        style={reducedMotion ? undefined : { rotateX, rotateY, scale }}
      >
        {children}
      </motion.div>
    </figure>
  );
}
