"use client";

import { useLayoutEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

type MotionSection = {
  selector: string;
  title: string;
  cards: string;
  visuals: string;
};

const sections: MotionSection[] = [
  {
    selector: "#about",
    title: ".heading h2",
    cards: ".id-card, .lead, .timeline article, .education-block, .tools",
    visuals: ".portrait",
  },
  {
    selector: "#work",
    title: ".heading h2",
    cards: ".tilted-card-figure, .work-manifesto, .work-orbit",
    visuals: ".project-card",
  },
  {
    selector: "#strengths",
    title: ".heading h2",
    cards: ".strength-card-shell",
    visuals: ".strength-visual",
  },
  {
    selector: "#contact",
    title: ".contact-content h2",
    cards: ".contact-actions > .magic-bento-card",
    visuals: ".contact-actions",
  },
];

const heroSplitParentSelector = ".hero-display .split-parent";
const heroSplitReadyEvent = "splittext:ready";
const heroTitleAnimationEvent = "portfolio:hero-title-animation";

function heroSplitTextIsReady() {
  const parents = Array.from(document.querySelectorAll<HTMLElement>(heroSplitParentSelector));
  return parents.length > 0 && parents.every((parent) => parent.querySelector(".split-char"));
}

function buildSectionMotion(section: MotionSection, isDesktop: boolean) {
  const root = document.querySelector<HTMLElement>(section.selector);
  if (!root) return;

  const title = root.querySelector<HTMLElement>(section.title);
  const cards = gsap.utils.toArray<HTMLElement>(section.cards, root);
  const visuals = gsap.utils.toArray<HTMLElement>(section.visuals, root);
  const trigger = title ?? root;

  const timeline = gsap.timeline({
    defaults: { ease: "power4.out" },
    scrollTrigger: {
      trigger,
      start: isDesktop ? "top 84%" : "top 90%",
      once: true,
    },
  });

  if (title) {
    timeline.fromTo(
      title,
      {
        autoAlpha: 0,
        yPercent: isDesktop ? 88 : 58,
        rotateX: isDesktop ? -16 : -8,
        clipPath: "inset(100% 0 0 0)",
        transformOrigin: "50% 100%",
        willChange: "transform, opacity, clip-path",
      },
      {
        autoAlpha: 1,
        yPercent: 0,
        rotateX: 0,
        clipPath: "inset(0% 0 0 0)",
        duration: isDesktop ? 1.45 : 1.05,
        clearProps: "willChange",
      },
    );
  }

  if (cards.length) {
    timeline.fromTo(
      cards,
      {
        autoAlpha: 0,
        y: isDesktop ? 78 : 46,
        scale: isDesktop ? 0.965 : 0.985,
        willChange: "transform, opacity",
      },
      {
        autoAlpha: 1,
        y: 0,
        scale: 1,
        duration: isDesktop ? 1.18 : 0.88,
        stagger: isDesktop ? 0.17 : 0.11,
        ease: "power3.out",
        clearProps: "willChange",
      },
      title ? "-=0.62" : 0,
    );
  }

  if (visuals.length) {
    timeline.fromTo(
      visuals,
      {
        clipPath: isDesktop
          ? "inset(9% 6% 9% 6% round 18px)"
          : "inset(6% 4% 6% 4% round 14px)",
        willChange: "clip-path",
      },
      {
        clipPath: "inset(0% 0% 0% 0% round 0px)",
        duration: isDesktop ? 1.32 : 0.92,
        stagger: isDesktop ? 0.14 : 0.08,
        ease: "power3.inOut",
        clearProps: "willChange",
      },
      cards.length ? "-=0.92" : "-=0.4",
    );
  }

  if (!isDesktop) return;

  const parallaxImages = gsap.utils.toArray<HTMLImageElement>(
    ".portrait img, .project-card img, .strength-visual img",
    root,
  );

  parallaxImages.forEach((image) => {
    gsap.fromTo(
      image,
      { yPercent: -2, scale: 1.025 },
      {
        yPercent: 3,
        scale: 1,
        ease: "none",
        scrollTrigger: {
          trigger: image.closest(".portrait, .project-card, .strength-visual") ?? image,
          start: "top bottom",
          end: "bottom top",
          scrub: 1.25,
        },
      },
    );
  });
}

export default function PortfolioMotion() {
  useLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const html = document.documentElement;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let active = true;
    let context: gsap.Context | undefined;
    let readyFrame: number | undefined;

    if (reduceMotion) {
      html.classList.add("motion-reduced");
      gsap.set(".opening-sequence", { display: "none" });
      return () => html.classList.remove("motion-reduced");
    }

    html.classList.add("motion-ready");

    const cancelReadyFrame = () => {
      if (readyFrame === undefined) return;
      window.cancelAnimationFrame(readyFrame);
      readyFrame = undefined;
    };

    const startPortfolioMotion = () => {
      if (!active || context) return;
      cancelReadyFrame();

      context = gsap.context(() => {
        const opening = gsap.timeline({
          defaults: { ease: "power4.inOut" },
          onComplete: () => {
            gsap.set(".opening-sequence", { display: "none" });
            ScrollTrigger.refresh();
          },
        });

        gsap.set(
          [
            ".nav",
            ".hero-kickers",
            ".hero-disciplines",
            ".hero-lower",
            ".hero-meta",
            ".hero-index",
          ],
          { autoAlpha: 0 },
        );
        gsap.set(".hero-portrait", { scale: 1.09, transformOrigin: "50% 48%" });

        opening
          .fromTo(
            ".opening-mark__line",
            { yPercent: 125, autoAlpha: 0 },
            {
              yPercent: 0,
              autoAlpha: 1,
              duration: 0.56,
              stagger: 0.075,
              ease: "power4.out",
            },
          )
          .fromTo(
            ".opening-rail span",
            { scaleX: 0 },
            { scaleX: 1, duration: 0.72, transformOrigin: "0% 50%", ease: "power3.inOut" },
            "-=0.37",
          )
          .to(
            ".opening-mark",
            { autoAlpha: 0, y: -22, duration: 0.3, ease: "power2.in" },
            "+=0.14",
          )
          .to(
            ".opening-panel--top",
            { yPercent: -101, duration: 0.78 },
            "-=0.07",
          )
          .to(
            ".opening-panel--bottom",
            { yPercent: 101, duration: 0.78 },
            "<",
          )
          .addLabel("heroEnter", ">-=0.05")
          .to(
            ".hero-portrait",
            { scale: 1, duration: 1.24, ease: "power3.out" },
            "heroEnter-=0.32",
          )
          .fromTo(
            ".nav",
            { y: -42, autoAlpha: 0 },
            { y: 0, autoAlpha: 1, duration: 0.66, ease: "power3.out" },
            "heroEnter",
          )
          .fromTo(
            ".hero-kickers",
            { y: -24, autoAlpha: 0 },
            { y: 0, autoAlpha: 1, duration: 0.57, ease: "power3.out" },
            "heroEnter+=0.06",
          )
          .to(
            {},
            {
              duration: 0.77,
              onStart: () => {
                window.dispatchEvent(new CustomEvent(heroTitleAnimationEvent));
              },
            },
            "heroEnter+=0.21",
          )
          .fromTo(
            ".hero-index",
            { x: -42, autoAlpha: 0 },
            { x: 0, autoAlpha: 1, duration: 0.47, ease: "power3.out" },
            "heroEnter+=0.6",
          )
          .fromTo(
            ".hero-disciplines",
            { x: 46, autoAlpha: 0 },
            { x: 0, autoAlpha: 1, duration: 0.53, ease: "power3.out" },
            "heroEnter+=0.6",
          )
          .fromTo(
            [".hero-lower", ".hero-meta"],
            { y: 28, autoAlpha: 0 },
            {
              y: 0,
              autoAlpha: 1,
              duration: 0.53,
              stagger: 0.08,
              ease: "power3.out",
            },
            "heroEnter+=0.77",
          );

        const matchMedia = gsap.matchMedia();
        matchMedia.add("(min-width: 768px)", () => {
          sections.forEach((section) => buildSectionMotion(section, true));
        });
        matchMedia.add("(max-width: 767px)", () => {
          sections.forEach((section) => buildSectionMotion(section, false));
        });
      });
    };

    const startWhenHeroSplitTextIsReady = () => {
      cancelReadyFrame();
      readyFrame = window.requestAnimationFrame(() => {
        readyFrame = undefined;
        if (heroSplitTextIsReady()) {
          startPortfolioMotion();
        }
      });
    };

    const heroDisplay = document.querySelector(".hero-display");
    heroDisplay?.addEventListener(heroSplitReadyEvent, startWhenHeroSplitTextIsReady);
    startWhenHeroSplitTextIsReady();

    return () => {
      active = false;
      cancelReadyFrame();
      heroDisplay?.removeEventListener(heroSplitReadyEvent, startWhenHeroSplitTextIsReady);
      context?.revert();
      html.classList.remove("motion-ready");
    };
  }, []);

  return (
    <div className="opening-sequence" aria-hidden="true">
      <div className="opening-panel opening-panel--top" />
      <div className="opening-panel opening-panel--bottom" />
      <div className="opening-mark">
        <span className="opening-mark__line">CHENYNII</span>
        <span className="opening-mark__line opening-mark__line--accent">PORTFOLIO · 2017—2026</span>
        <span className="opening-rail"><span /></span>
      </div>
    </div>
  );
}
