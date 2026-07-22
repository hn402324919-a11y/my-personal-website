"use client";

import {
  useCallback,
  useEffect,
  useRef,
  type CSSProperties,
  type KeyboardEvent,
  type PointerEvent,
} from "react";
import "./LineSidebar.css";

const falloffCurves = {
  linear: (value: number) => value,
  smooth: (value: number) => value * value * (3 - 2 * value),
  sharp: (value: number) => value * value * value,
};

type LineSidebarProps = {
  items: string[];
  activeIndex: number;
  accentColor?: string;
  textColor?: string;
  markerColor?: string;
  proximityRadius?: number;
  maxShift?: number;
  markerLength?: number;
  markerGap?: number;
  tickScale?: number;
  itemGap?: number;
  fontSize?: number;
  smoothing?: number;
  falloff?: keyof typeof falloffCurves;
  motionEnabled?: boolean;
  ariaLabel: string;
  panelId: string;
  tabIdPrefix: string;
  onItemClick: (index: number, label: string) => void;
  onItemKeyDown: (event: KeyboardEvent<HTMLButtonElement>, index: number) => void;
  className?: string;
};

type SidebarStyle = CSSProperties & Record<`--${string}`, string | number>;

export default function LineSidebar({
  items,
  activeIndex,
  accentColor = "#03E885",
  textColor = "#929b96",
  markerColor = "#33423b",
  proximityRadius = 110,
  maxShift = 18,
  markerLength = 52,
  markerGap = 12,
  tickScale = 0.25,
  itemGap = 14,
  fontSize = 0.96,
  smoothing = 90,
  falloff = "smooth",
  motionEnabled = true,
  ariaLabel,
  panelId,
  tabIdPrefix,
  onItemClick,
  onItemKeyDown,
  className = "",
}: LineSidebarProps) {
  const listRef = useRef<HTMLUListElement>(null);
  const itemRefs = useRef<Array<HTMLLIElement | null>>([]);
  const targetsRef = useRef<number[]>([]);
  const currentRef = useRef<number[]>([]);
  const rafRef = useRef<number | null>(null);
  const lastRef = useRef(0);
  const activeRef = useRef(activeIndex);
  const reducedMotionRef = useRef(false);

  const applyEffects = useCallback(() => {
    itemRefs.current.forEach((item, index) => {
      const value = index === activeRef.current ? 1 : 0;
      currentRef.current[index] = value;
      targetsRef.current[index] = 0;
      item?.style.setProperty("--effect", String(value));
    });
  }, []);

  const startLoop = useCallback(() => {
    if (rafRef.current !== null) return;
    lastRef.current = performance.now();

    const tick = (now: number) => {
      const dt = Math.min((now - lastRef.current) / 1000, 0.05);
      lastRef.current = now;
      const tau = Math.max(smoothing, 1) / 1000;
      const amount = 1 - Math.exp(-dt / tau);
      let moving = false;

      itemRefs.current.forEach((item, index) => {
        if (!item) return;
        const target = Math.max(targetsRef.current[index] || 0, activeRef.current === index ? 1 : 0);
        const current = currentRef.current[index] || 0;
        const next = current + (target - current) * amount;
        const settled = Math.abs(target - next) < 0.0015;
        const value = settled ? target : next;
        currentRef.current[index] = value;
        item.style.setProperty("--effect", value.toFixed(4));
        if (!settled) moving = true;
      });

      rafRef.current = moving ? requestAnimationFrame(tick) : null;
    };

    rafRef.current = requestAnimationFrame(tick);
  }, [smoothing]);

  useEffect(() => {
    activeRef.current = activeIndex;
  }, [activeIndex]);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    reducedMotionRef.current = media.matches;
    const updatePreference = () => {
      reducedMotionRef.current = media.matches;
      if (media.matches) applyEffects();
    };
    media.addEventListener("change", updatePreference);
    return () => media.removeEventListener("change", updatePreference);
  }, [applyEffects]);

  useEffect(() => {
    if (!motionEnabled || reducedMotionRef.current) {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
      applyEffects();
      return;
    }
    startLoop();
  }, [activeIndex, applyEffects, motionEnabled, startLoop]);

  useEffect(
    () => () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    },
    [],
  );

  const handlePointerMove = useCallback(
    (event: PointerEvent<HTMLUListElement>) => {
      if (reducedMotionRef.current || window.matchMedia("(hover: none)").matches) return;
      const list = listRef.current;
      if (!list) return;
      const rect = list.getBoundingClientRect();
      const pointerY = event.clientY - rect.top;
      const ease = falloffCurves[falloff];

      itemRefs.current.forEach((item, index) => {
        if (!item) return;
        const center = item.offsetTop + item.offsetHeight / 2;
        const proximity = Math.max(0, 1 - Math.abs(pointerY - center) / proximityRadius);
        targetsRef.current[index] = ease(proximity);
      });
      startLoop();
    },
    [falloff, proximityRadius, startLoop],
  );

  const handlePointerLeave = useCallback(() => {
    targetsRef.current = items.map(() => 0);
    if (reducedMotionRef.current) applyEffects();
    else startLoop();
  }, [applyEffects, items, startLoop]);

  const style: SidebarStyle = {
    "--accent-color": accentColor,
    "--text-color": textColor,
    "--marker-color": markerColor,
    "--marker-length": `${markerLength}px`,
    "--marker-gap": `${markerGap}px`,
    "--tick-scale": tickScale,
    "--max-shift": `${maxShift}px`,
    "--item-gap": `${itemGap}px`,
    "--font-size": `${fontSize}rem`,
  };

  return (
    <nav className={`line-sidebar ${className}`.trim()} style={style} aria-label={ariaLabel}>
      <ul
        ref={listRef}
        className="line-sidebar__list"
        role="tablist"
        aria-orientation="vertical"
        onPointerMove={handlePointerMove}
        onPointerLeave={handlePointerLeave}
      >
        {items.map((label, index) => (
          <li
            key={`${label}-${index}`}
            ref={(element) => {
              itemRefs.current[index] = element;
            }}
            className="line-sidebar__item"
            data-active={activeIndex === index ? "true" : undefined}
          >
            <span className="line-sidebar__marker" aria-hidden="true" />
            <button
              id={`${tabIdPrefix}-${index}`}
              className="line-sidebar__button"
              type="button"
              role="tab"
              aria-selected={activeIndex === index}
              aria-controls={panelId}
              tabIndex={activeIndex === index ? 0 : -1}
              onClick={() => onItemClick(index, label)}
              onKeyDown={(event) => onItemKeyDown(event, index)}
            >
              <span className="line-sidebar__index">{String(index + 1).padStart(2, "0")}</span>
              <span className="line-sidebar__text">{label}</span>
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
}
