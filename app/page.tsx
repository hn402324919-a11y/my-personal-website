"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState, type CSSProperties, type KeyboardEvent } from "react";
import SplitText from "./components/SplitText";
import TiltedCard from "./components/TiltedCard";
import PortfolioMotion from "./components/PortfolioMotion";
import MagicBento from "./components/MagicBento";
import ColorBends from "./components/ColorBends";
import SpecularFrame from "./components/SpecularFrame";
import LineSidebar from "./components/LineSidebar";

type Project = {
  id: string;
  key: string;
  category: string;
  title: string;
  subtitle: string;
  cover: string;
  intro: string;
  role: string;
  achievement?: string;
  tags: string[];
  cases: { label: string; src: string | string[]; alt: string; focus?: number }[];
};

const projects: Project[] = [
  {
    id: "experience",
    key: "1",
    category: "体验 / 界面",
    title: "从复杂系统到直觉体验",
    subtitle: "品牌体验升级 × Web3 聚合资产平台 × 品牌定制小程序",
    cover: "/work/card-3.jpg",
    intro:
      "覆盖多种行业场景，在复杂业务约束中建立清晰、可信且可扩展的产品体验。",
    role:
      "独立负责金融行业、女装行业等全站设计，为提升界面美观与用户体验，独立完成方案输出到项目落地工作，并与各方团队保持紧密协作，高效协调资源分配。",
    achievement:
      "主导整体设计方向与体验策略，搭建 Web & App 双端体验体系；完成 AScoin 钱包、理财、社交聊天等 10 项功能的全链路设计，推动 APP 用户增长至 300,000+，月交易额千万+。",
    tags: ["UX STRATEGY", "APP UI", "DESIGN SYSTEM"],
    cases: [
      { label: "Heychic 品牌体验升级", src: "/work/project-heychic.jpg", alt: "Heychic 品牌体验升级设计全案" },
      { label: "AScoin 区块链交易平台", src: "/work/project-3.jpg", alt: "AScoin 区块链交易平台设计全案" },
      { label: "小 CK 小程序商城方案", src: "/work/project-4.jpg", alt: "CHARLES & KEITH 小程序商城设计全案" },
    ],
  },
  {
    id: "campaign",
    key: "2",
    category: "营销 / 运营",
    title: "让品牌活动被看见、被参与",
    subtitle: "伊利及旗下品牌 × 5 款营销互动游戏",
    cover: "/work/card-5.jpg",
    intro:
      "围绕节点营销、会员运营与品牌传播，建立从活动机制、视觉概念到多触点物料的一致体验。",
    role:
      "配合运营及品牌商家完成日常与节日营销推广设计，覆盖互动小游戏、小程序 Banner、活动专题页、线上社群海报与线下宣传物料。",
    achievement:
      "独立完成 5+ 小程序营销活动；完成 50+ 个伊利、美素佳儿、贝亲日常运营活动海报支持。",
    tags: ["CAMPAIGN", "H5 GAME", "VISUAL DESIGN"],
    cases: [
      { label: "伊利冬奥新春拉新促活", src: "/work/project-campaign-01-winter-olympics.jpg", alt: "伊利冬奥新春拉新促活设计" },
      { label: "伊利植选扫码抽奖活动", src: "/work/project-campaign-02-zhixuan.jpg", alt: "伊利植选扫码抽奖活动设计" },
      { label: "伊利拉新抽红包活动", src: "/work/project-campaign-03-red-packet.jpg", alt: "伊利拉新抽红包活动设计" },
      { label: "伊利 QQ 星亲子打卡", src: "/work/project-campaign-04-qq-star.jpg", alt: "伊利 QQ 星亲子打卡设计" },
      { label: "日常UI及运营海报", src: "/work/project-campaign-05-daily-ui.jpg", alt: "日常 UI 及运营海报合集" },
    ],
  },
  {
    id: "enterprise",
    key: "3",
    category: "B 端 / 网页",
    title: "把企业能力转译为清晰价值",
    subtitle: "数字增长服务平台 × 企业官网体系",
    cover: "/work/card-9.jpg",
    intro:
      "面向企业客户重新组织服务能力、产品价值与信任信息，用清晰的页面秩序支撑获客与品牌表达。",
    role:
      "梳理产品与服务信息架构，完成官网视觉体系、核心页面与多业务场景页面设计，并在设计规范下保持内容扩展的一致性。",
    achievement:
      "ESD 官网获得《亚洲网页设计奖》；完成火星人集成灶官网设计；通过设计方案的产出，与比亚迪电子达成项目合作。",
    tags: ["B2B WEB", "INFORMATION ARCHITECTURE", "WEB UI"],
    cases: [
      { label: "锐鲨企业官网", src: "/work/project-9.jpg", alt: "锐鲨企业官网设计" },
      {
        label: "比亚迪电子官网设计方案",
        src: [
          "/work/project-byd-electronics-01.jpg",
          "/work/project-byd-electronics-02.jpg",
          "/work/project-byd-electronics-03.jpg",
        ],
        alt: "比亚迪电子官网设计方案",
      },
      { label: "ESD 音响官网", src: "/work/project-esd-audio.jpg", alt: "ESD 音响官网设计全案" },
    ],
  },
];

const jobs = [
  ["2024.02-2026.06", "嗨希科技", "设计管理负责人", "产品体验与设计体系建设"],
  ["2022.06 — 2024.01", "杭州燧人科技", "高级 UI 设计师", "复杂产品体验与视觉设计"],
  ["2018.07 — 2022.05", "蘑菇街", "高级 UI 设计师", "电商、营销与品牌体验"],
  ["2017.01 — 2018.04", "杭州博采网络科技股份有限公司", "UI 设计师", "企业官网与数字产品设计"],
];

const strengths = [
  { number: "01", title: "跨业务设计经验", text: "拥有 9 年互联网产品设计经验，覆盖 B 端平台、企业管理系统、官网、电商与运营活动等多个业务方向。", visual: "collage" },
  { number: "02", title: "端到端产品能力", text: "具备完整的需求分析、用户研究与信息架构能力，可独立完成从需求到上线的全流程设计。", visual: "flow" },
  { number: "03", title: "设计体系建设", text: "具有设计规范建设经验，能够沉淀组件库、提升设计效率，并降低研发沟通成本。", visual: "system" },
  { number: "04", title: "业务价值意识", text: "站在业务目标角度进行设计，通过体验优化推动转化率、效率与品牌价值提升。", visual: "value" },
];

const orbitCopy = "PRODUCT · BRAND · SYSTEM · EXPERIENCE · ";

function ProjectVisual({ item }: { item: Project }) {
  if (item.id === "experience") {
    return (
      <div className="project-composite experience-composite" aria-hidden="true">
        <div className="experience-phone-empty"><span /></div>
        <div className="laptop laptop-front"><span className="laptop-screen" /></div>
      </div>
    );
  }

  if (item.id === "campaign") {
    return (
      <div className="project-composite campaign-composite" aria-hidden="true">
        <span className="campaign-tile tile-left" />
        <span className="campaign-tile tile-right" />
        <div className="campaign-phone"><span className="campaign-screen" /></div>
      </div>
    );
  }

  if (item.id === "enterprise") {
    return (
      <div className="project-composite enterprise-composite" aria-hidden="true">
        <div className="enterprise-monitor"><span className="enterprise-screen" /></div>
      </div>
    );
  }

  return <img src={item.cover} alt="" />;
}

function StrengthVisual({ type }: { type: string }) {
  if (type === "collage") {
    return (
      <div className="strength-visual visual-collage" aria-hidden="true">
        <div className="collage-group">
          <img className="collage-a" src="/work/card-3.jpg" alt="" />
          <img className="collage-b" src="/work/card-5.jpg" alt="" />
          <img className="collage-c" src="/work/project-esd-audio.jpg" alt="" />
        </div>
      </div>
    );
  }

  if (type === "flow") {
    return (
      <div className="strength-visual visual-flow" aria-hidden="true">
        <div className="flow-frame">
          <span><b>01</b>洞察</span><span><b>02</b>架构</span><span><b>03</b>视觉</span><span><b>04</b>落地</span>
          <i className="flow-line" />
        </div>
      </div>
    );
  }

  if (type === "system") {
    return (
      <div className="strength-visual visual-system" aria-hidden="true">
        <img src="/work/strength-design-system-green.png" alt="" />
      </div>
    );
  }

  return (
    <div className="strength-visual visual-value" aria-hidden="true">
      <div className="value-orbit">
        <i className="value-ring ring-one" /><i className="value-ring ring-two" /><i className="value-ring ring-three" />
        <b>业务目标</b>
        <span className="value-node node-one">体验</span><span className="value-node node-two">效率</span>
        <span className="value-node node-three">转化</span><span className="value-node node-four">品牌</span>
      </div>
    </div>
  );
}

const tools = ["Figma", "Sketch", "Photoshop", "Illustrator", "After Effects", "ChatGPT", "Codex", "Figma AI"];
const backgroundColors = ["#03E885"];
const getCaseSources = (src: string | string[]) => Array.isArray(src) ? src : [src];

export default function Home() {
  const [fixed, setFixed] = useState(false);
  const [contactActive, setContactActive] = useState(false);
  const [project, setProject] = useState<Project | null>(null);
  const [activeCase, setActiveCase] = useState(0);
  const [caseMotion, setCaseMotion] = useState(false);
  const [copied, setCopied] = useState(false);
  const modalScrollRef = useRef<HTMLDivElement>(null);
  const caseNavRef = useRef<HTMLDivElement>(null);
  const caseStageRef = useRef<HTMLDivElement>(null);
  const shouldAlignCaseRef = useRef(false);

  const alignActiveCase = useCallback(() => {
    const scroller = modalScrollRef.current;
    const stage = caseStageRef.current;
    if (!scroller || !stage) return;

    const scrollerRect = scroller.getBoundingClientRect();
    const stageRect = stage.getBoundingClientRect();
    const isMobile = window.matchMedia("(max-width: 900px)").matches;
    const navigationHeight = isMobile ? (caseNavRef.current?.getBoundingClientRect().height ?? 0) : 0;
    const topOffset = isMobile ? navigationHeight + 4 : 28;
    const nextScrollTop = scroller.scrollTop + stageRect.top - scrollerRect.top - topOffset;

    scroller.scrollTop = Math.max(0, nextScrollTop);
  }, []);

  useLayoutEffect(() => {
    if (!project || !shouldAlignCaseRef.current) return;
    shouldAlignCaseRef.current = false;
    alignActiveCase();
  }, [activeCase, project, alignActiveCase]);

  useEffect(() => {
    const update = () => setFixed(window.scrollY > window.innerHeight * 0.78);
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  useEffect(() => {
    const contact = document.getElementById("contact");
    if (!contact) return;
    const observer = new IntersectionObserver(
      ([entry]) => setContactActive(entry.isIntersecting),
      { threshold: 0.05 },
    );
    observer.observe(contact);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    const revealItems = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]"));
    if (!revealItems.length) return;

    root.classList.add("reveal-ready");

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      revealItems.forEach((item) => item.classList.add("is-visible"));
      return () => root.classList.remove("reveal-ready");
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" },
    );

    revealItems.forEach((item) => observer.observe(item));

    return () => {
      observer.disconnect();
      root.classList.remove("reveal-ready");
    };
  }, []);

  useEffect(() => {
    if (!project) return;
    const escape = (event: KeyboardEvent) => event.key === "Escape" && setProject(null);
    const old = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", escape);
    return () => {
      document.body.style.overflow = old;
      window.removeEventListener("keydown", escape);
    };
  }, [project]);

  const copyWechat = async () => {
    await navigator.clipboard.writeText("chenynii");
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  };

  const openProject = (item: Project) => {
    setCaseMotion(false);
    setActiveCase(0);
    setProject(item);
  };

  const selectCase = (index: number) => {
    if (index === activeCase) return;
    shouldAlignCaseRef.current = true;
    setCaseMotion(true);
    setActiveCase(index);
  };

  const handleCaseKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    const lastIndex = project ? project.cases.length - 1 : 0;
    let nextIndex = index;
    if (event.key === "ArrowRight") nextIndex = index === lastIndex ? 0 : index + 1;
    if (event.key === "ArrowLeft") nextIndex = index === 0 ? lastIndex : index - 1;
    if (event.key === "Home") nextIndex = 0;
    if (event.key === "End") nextIndex = lastIndex;
    if (nextIndex === index) return;

    event.preventDefault();
    selectCase(nextIndex);
    const buttons = event.currentTarget
      .closest('[role="tablist"]')
      ?.querySelectorAll<HTMLButtonElement>('[role="tab"]');
    buttons?.[nextIndex]?.focus();
  };

  return (
    <main>
      <PortfolioMotion />
      <div className="site-bends">
        <ColorBends
          colors={backgroundColors}
          rotation={112}
          autoRotate={0.35}
          speed={0.13}
          scale={1.15}
          frequency={0.86}
          warpStrength={0.74}
          mouseInfluence={0.22}
          parallax={0.18}
          noise={0.045}
          iterations={2}
          intensity={1.02}
          bandWidth={5.4}
          transparent
        />
      </div>
      <a className="skip" href="#content">跳到主要内容</a>
      <nav className={`nav ${fixed ? "is-fixed" : ""}`} aria-label="主导航">
        <a className="brand" href="#top" aria-label="回到首页">CHENYNII<i /></a>
        <div className="navlinks">
          <a href="#about">关于</a><a href="#work">作品</a><a href="#strengths">优势</a>
        </div>
        <a className="btn btn-sm" href="#contact">联系我 <span>↗</span></a>
      </nav>

      <header className="hero" id="top">
        <div className="hero-portrait" aria-hidden="true">
          <img src="/hero/chenynii-editorial-v2.png" alt="" />
        </div>
        <div className="veil" />
        <div className="hero-content shell">
          <div className="hero-kickers" aria-hidden="true" data-reveal="fade">
            <p>CHENYNII PORTFOLIO<br />SELECTED WORK · 2017—2026</p>
            <p>UI / UX DESIGN<br />BRAND EXPERIENCE</p>
            <p>HANGZHOU, CN<br />AVAILABLE FOR CONTACT</p>
          </div>
          <div className="hero-editorial">
            <p className="hero-index" aria-hidden="true">2017-2026</p>
            <h1 className="hero-display" aria-label="Digital Designer">
              <SplitText tag="span" className="hero-digital" text="DIGITAL" delay={62} duration={0.9} rootMargin="0px" />
              <SplitText tag="span" className="hero-designer" text="Designer" delay={58} duration={0.9} rootMargin="0px" textAlign="right" />
            </h1>
            <div className="hero-disciplines" aria-hidden="true" data-reveal="right" data-reveal-order="1">
              <span>UI/UX DESIGN</span>
              <span>PRODUCT EXPERIENCE</span>
              <span>BRAND IDENTITY</span>
              <span>DESIGN SYSTEM</span>
            </div>
          </div>
          <div className="hero-lower" data-reveal data-reveal-order="2">
            <p>为复杂产品建立秩序，<br />为品牌创造可感知的价值。</p>
            <div><a className="btn" href="#work">查看精选作品 <span>↓</span></a><a className="text-link" href="#about">了解我的经历 ↘</a></div>
          </div>
        </div>
        <div className="hero-meta shell" aria-hidden="true" data-reveal="fade" data-reveal-order="3"><span>CHENYNII © 2026</span><span>SCROLL TO EXPLORE</span><span>30°16&apos;N · 120°12&apos;E</span></div>
      </header>

      <div id="content">
        <section className="about section shell" id="about">
          <div className="heading"><p className="eyebrow" data-reveal="fade">PROFILE / EXPERIENCE</p><SplitText tag="h2" text={"设计不是装饰，\n而是解决问题的方式。"} /></div>
          <div className="about-layout">
            <aside className="id-card" data-reveal="left">
              <div className="portrait">
                <img src="/profile/chenynii-photo-2843.jpg" alt="陈旖旎个人照片" />
              </div>
              <div className="id-name">
                <div><strong>陈旖旎</strong><span>CHENYNII</span></div>
                <div className="id-birth"><b>1995年12月</b><small>30</small></div>
              </div>
              <div className="id-row"><span>杭州电子科技大学</span><span>产品设计</span></div>
              <div className="id-row"><a href="tel:15988806213">159 8880 6213 ↗</a><button onClick={copyWechat}>{copied ? "微信已复制" : "微信 · chenynii"}</button></div>
            </aside>
            <div>
              <p className="lead" data-reveal="right">我是一名兼具产品思维与品牌意识的设计师。过去 9 年，我持续在复杂业务中寻找清晰路径，将用户需求、商业目标与视觉表达连接起来。</p>
              <div className="timeline">
                {jobs.map(([period, company, role, detail], index) => (
                  <article key={period} data-reveal data-reveal-order={index + 1}><p>{period}</p><div><h3>{company}</h3><span>{detail}</span></div><strong>{role}</strong></article>
                ))}
              </div>
              <div className="subrow" data-reveal><p className="eyebrow">EDUCATION / 2013—2017</p><div><h3>杭州电子科技大学 · 产品设计</h3><p>学院文艺部学生会 · 科技创新奖 · 优秀毕业设计</p></div></div>
              <div className="subrow" data-reveal data-reveal-order="1"><p className="eyebrow">SELECTED TOOLS</p><div className="chips">{tools.map((x) => <span key={x}>{x}</span>)}</div></div>
            </div>
          </div>
        </section>

        <section className="work section" id="work">
          <div className="shell">
            <div className="heading split"><div><p className="eyebrow" data-reveal="fade">SELECTED WORK</p><SplitText tag="h2" text={"项目不是画面合集，\n而是一段完整的推演。"} /></div><p data-reveal="right">从产品体验到品牌活动，再到企业服务平台。<br />点击卡片，查看完整项目长图与设计说明。</p></div>
            <div className="project-grid">
              {projects.map((item) => (
                <TiltedCard className={item.id} key={item.id} rotateAmplitude={4.5} scaleOnHover={1.012}>
                  <button className="project-card" data-reveal="scale" data-reveal-order={item.key} onClick={() => openProject(item)} aria-label={`查看${item.category}项目详情`}>
                    <SpecularFrame radius={5} proximity={220} intensity={1.35} />
                    <ProjectVisual item={item} /><span className="shade" />
                    <span className="card-top"><span>{item.category}</span></span>
                    <span className="card-copy"><strong>{item.title}</strong><small>{item.subtitle}</small></span>
                    <span className="card-open">打开项目 ↗</span>
                  </button>
                </TiltedCard>
              ))}
              <a className="work-manifesto" href="#strengths" data-reveal="scale" data-reveal-order="2">
                <SpecularFrame radius={5} proximity={220} intensity={1.2} />
                <span className="manifesto-kicker">DESIGN POSITION / 09Y</span>
                <h3>Building clarity for complex products,<br />creating value <em>years ahead.</em></h3>
                <span className="manifesto-foot">PRODUCT × EXPERIENCE × BRAND <b>↗</b></span>
              </a>
              <article className="work-orbit" data-reveal="scale" data-reveal-order="3">
                <SpecularFrame radius={5} proximity={220} intensity={1.2} />
                <div className="orbit-mark" aria-label="Product, Brand, System, Experience">
                  <div className="orbit-copy" aria-hidden="true">
                    {[...orbitCopy].map((letter, index) => (
                      <span
                        key={`${letter}-${index}`}
                        style={{ "--orbit-angle": `${index * (360 / orbitCopy.length)}deg` } as CSSProperties}
                      >
                        {letter === " " ? "\u00A0" : letter}
                      </span>
                    ))}
                  </div>
                  <div className="orbit-globe" aria-hidden="true" />
                </div>
              </article>
            </div>
          </div>
        </section>

        <section className="strengths section shell" id="strengths">
          <div className="heading split"><div><p className="eyebrow" data-reveal="fade">WHY ME / CAPABILITIES</p><SplitText tag="h2" text={"从一张界面，\n看到完整业务。"} /></div><p data-reveal="right">不止交付视觉稿，也关注问题如何被定义、<br />方案如何落地，以及价值如何被验证。</p></div>
          <MagicBento className="strength-grid" spotlightRadius={320} particleCount={6}>
            {strengths.map((item, index) => <div className={`strength-card-shell strength-${item.number}`} key={item.number}><SpecularFrame radius={14} className="strength-hover-cover" coverParent /><article data-reveal="scale" data-reveal-order={index + 1}><span className="strength-index">{item.number}</span><StrengthVisual type={item.visual} /><div className="strength-copy"><h3>{item.title}</h3><p>{item.text}</p></div></article></div>)}
          </MagicBento>
        </section>

        <section className={`contact ${contactActive ? "is-active" : ""}`} id="contact">
          <div className="contact-flow">
            <ColorBends
              colors={backgroundColors}
              rotation={18}
              autoRotate={0.55}
              speed={0.18}
              scale={1.08}
              frequency={0.78}
              warpStrength={0.92}
              mouseInfluence={0.16}
              parallax={0.12}
              noise={0.035}
              iterations={2}
              intensity={0.92}
              bandWidth={5}
              transparent
            />
          </div>
          <div className="grid" />
          <div className="contact-content shell">
            <p className="eyebrow" data-reveal="fade">OPEN FOR A CONVERSATION</p>
            <h2><SplitText tag="span" text="期待您的联系" /><SplitText tag="span" className="split-accent" text="。" delay={0} /></h2>
            <p data-reveal data-reveal-order="1">如果你正在寻找一位理解产品、业务与品牌的设计伙伴，我们可以从一次对话开始。</p>
            <MagicBento className="contact-actions" spotlightRadius={360} particleCount={4} clickEffect>
              <a href="tel:15988806213" data-reveal="fade" data-reveal-order="2"><SpecularFrame radius={14} /><span className="contact-label">电话</span><strong>159 8880 6213</strong><i>↗</i></a>
              <button onClick={copyWechat} data-reveal="fade" data-reveal-order="3"><SpecularFrame radius={14} /><span className="contact-label">微信</span><strong>{copied ? "已复制 chenynii" : "chenynii"}</strong><i>↗</i></button>
            </MagicBento>
          </div>
          <footer className="shell" data-reveal="fade" data-reveal-order="4"><span>CHENYNII · UI / BRAND DESIGNER</span><span>UI × BRAND × EXPERIENCE</span><span>© 2026 ALL RIGHTS RESERVED</span></footer>
        </section>
      </div>

      {project && (
        <div className="modal" role="dialog" aria-modal="true" aria-labelledby="modal-title">
          <div className="modal-scroll" ref={modalScrollRef}>
            <button className="close" onClick={() => setProject(null)} aria-label="关闭项目详情"><SpecularFrame radius={14} /><span>关闭</span> ×</button>
            <header className="modal-head shell">
              <p className="eyebrow">PROJECT {project.key} / {project.category}</p><SplitText tag="h2" id="modal-title" text={project.title} rootMargin="0px" /><p className="modal-intro">{project.intro}</p>
              <div className="modal-meta"><div><span>项目职责</span><p>{project.role}</p></div>{project.achievement && <div><span>项目成就</span><p>{project.achievement}</p></div>}</div>
              <div className="tags">{project.tags.map((x) => <span key={x}>{x}</span>)}</div>
            </header>
            <div className="case-study-layout shell" data-motion={caseMotion ? "on" : "off"}>
              <div className="project-case-nav" ref={caseNavRef}>
                <LineSidebar
                  className="project-case-sidebar"
                  items={project.cases.map((item) => item.label)}
                  activeIndex={activeCase}
                  ariaLabel={`${project.title}案例切换`}
                  panelId="active-project-case"
                  tabIdPrefix={`case-tab-${project.id}`}
                  motionEnabled={caseMotion}
                  accentColor="#03E885"
                  textColor="#929b96"
                  markerColor="#33423b"
                  proximityRadius={110}
                  maxShift={18}
                  markerLength={52}
                  markerGap={12}
                  tickScale={0.25}
                  itemGap={14}
                  fontSize={0.96}
                  smoothing={90}
                  onItemClick={selectCase}
                  onItemKeyDown={handleCaseKeyDown}
                />
              </div>
              <div className="case-stage" ref={caseStageRef}>
                <div
                  key={`${project.id}-${activeCase}`}
                  className="gallery"
                  id="active-project-case"
                  role="tabpanel"
                  aria-labelledby={`case-tab-${project.id}-${activeCase}`}
                >
                  {getCaseSources(project.cases[activeCase].src).map((src, imageIndex, sources) => (
                    <figure key={`${project.cases[activeCase].label}-${src}`}>
                      <img
                        src={src}
                        alt={`${project.cases[activeCase].alt}${sources.length > 1 ? ` ${imageIndex + 1}` : ""}`}
                        loading="lazy"
                      />
                      <figcaption>
                        {project.cases[activeCase].label}{sources.length > 1 ? ` · ${String(imageIndex + 1).padStart(2, "0")}` : ""} / {project.cases[activeCase].alt}
                      </figcaption>
                    </figure>
                  ))}
                </div>
              </div>
            </div>
            <div className="modal-end shell"><span>END OF PROJECT</span><button onClick={() => setProject(null)}>返回精选作品 ↑</button></div>
          </div>
        </div>
      )}
    </main>
  );
}
