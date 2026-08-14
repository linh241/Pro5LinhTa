import { useState, useRef } from 'react';
import gsap from 'gsap';
import { Observer } from 'gsap/Observer';
import { useGSAP } from '@gsap/react';

import { Cloth } from './components/canvasui/Cloth';
import { AudioPlayer } from './components/AudioPlayer/AudioPlayer';
import { DitheredObject } from './components/canvasui/DitheredObject';
import type { DitheredObjectOptions } from './components/canvasui/DitheredObject';
import { assetPath } from './lib/assetPath';
import './css/styles.css';

gsap.registerPlugin(Observer, useGSAP);

// ─── Section configuration ─────────────────────────────────────────
const SECTIONS_CONFIG = [
  { id: 'hero', name: 'Home', type: 'vertical' as const },
  { id: 'work', name: 'Work', type: 'horizontal' as const, panels: 5 }, // intro + 4 projects
  { id: 'process', name: 'Process', type: 'vertical' as const },
  { id: 'experience', name: 'Experience', type: 'vertical' as const },
  { id: 'about', name: 'About', type: 'vertical' as const },
  { id: 'contact', name: 'Contact', type: 'vertical' as const },
];

function AppClone() {
  const [activeSectionIdx, setActiveSectionIdx] = useState(0);

  const [ditherOptions] = useState<Required<DitheredObjectOptions>>({
    src: assetPath('the_hand.glb'),
    method: 'halftone',
    gridSize: 1,
    pixelSizeRatio: 1,
    grayscale: true,
    invert: false,
    dither: true,
    background: '',
    highlight: '#000000', // Black
    environmentIntensity: 0.15,
    roughness: 0.18,
    scale: 4.1,
    xOffset: 0.0,
    yOffset: -0.3,
    rotationX: 1.68,
    rotationY: 4.95,
    rotationZ: 2.15,
    floatIntensity: 0.0,
    rotationIntensity: 0.2,
    floatSpeed: 1.0,
    orbit: true,
    zoom: false,
    autoRotate: false,
    autoRotateSpeed: 2,
    fov: 62,
    cameraDistance: 4.4,
    dracoDecoderPath: 'https://www.gstatic.com/draco/versioned/decoders/1.5.7/',
    onLoad: null,
    onError: null,
  });

  const appRef = useRef<HTMLDivElement>(null);

  // Navigation state
  const animating = useRef(false);
  const sectionIndex = useRef(0);
  const panelIndex = useRef(0);

  useGSAP(() => {
    const sections = gsap.utils.toArray<HTMLElement>('.fullpage-section');
    if (!sections.length) return;

    // Initial positions ─ stack all sections below
    gsap.set(sections, {
      zIndex: (i) => sections.length - i,
      yPercent: (i) => (i === 0 ? 0 : 100),
      autoAlpha: (i) => (i === 0 ? 1 : 0),
    });

    // Helper to get horizontal wrapper
    function getWrapper(sectionEl: HTMLElement) {
      return sectionEl.querySelector<HTMLElement>('.horizontal-wrapper');
    }

    // ─── Line-by-line slide reveal helper ────────────────────────
    function animateSectionContent(container: HTMLElement, dir = 1) {
      const lines = container.querySelectorAll<HTMLElement>('.line-reveal, .slow-reveal-line, .process-row-item, .experience-entry, .contact-link-entry');
      if (lines.length) {
        gsap.fromTo(
          lines,
          { y: dir > 0 ? 40 : -40, opacity: 0, filter: 'blur(10px)' },
          { y: 0, opacity: 1, filter: 'blur(0px)', stagger: 0.12, duration: 1.3, ease: 'power2.inOut', delay: 0.2 }
        );
      }
    }

    function animateToPanel(wrapper: HTMLElement, panelIdx: number, dir: number) {
      const targetX = -panelIdx * window.innerWidth;
      animating.current = true;

      const tl = gsap.timeline({
        delay: 0.3, // 0.3s delay on scroll as requested
        onComplete: () => { animating.current = false; },
      });

      tl.to(wrapper, {
        x: targetX,
        duration: 1.2,
        ease: 'power3.inOut',
      }, 0);

      // Animate content inside landing panel
      const panels = wrapper.querySelectorAll<HTMLElement>('.horizontal-panel');
      const activePanel = panels[panelIdx];
      if (!activePanel) return;

      const lines = activePanel.querySelectorAll<HTMLElement>('.line-reveal, .slow-reveal-line, .h-project-meta > *');
      if (lines.length) {
        tl.fromTo(
          lines,
          { opacity: 0, y: dir > 0 ? 35 : -35, filter: 'blur(8px)' },
          { opacity: 1, y: 0, filter: 'blur(0px)', stagger: 0.12, duration: 1.2, ease: 'power2.inOut' },
          0.35
        );
      }

      const imgEl = activePanel.querySelector<HTMLElement>('.h-project-img');
      if (imgEl) {
        tl.fromTo(imgEl,
          { scale: 1.08, opacity: 0 },
          { scale: 1, opacity: 1, duration: 1.3, ease: 'power2.inOut' },
          0.05
        );
      }
    }

    // ─── Vertical section transition ─────────────────────────────
    function gotoSection(nextSectionIdx: number, direction: number, entryPanelIdx = 0) {
      if (nextSectionIdx < 0 || nextSectionIdx >= sections.length) {
        animating.current = false;
        return;
      }

      animating.current = true;
      const currentSec = sections[sectionIndex.current];
      const nextSec = sections[nextSectionIdx];

      // Update active section state for nav menu
      setActiveSectionIdx(nextSectionIdx);

      // If entering horizontal section, set wrapper offset
      const config = SECTIONS_CONFIG[nextSectionIdx];
      if (config?.type === 'horizontal') {
        const wrapper = getWrapper(nextSec);
        if (wrapper) gsap.set(wrapper, { x: -entryPanelIdx * window.innerWidth });
        panelIndex.current = entryPanelIdx;
      }

      gsap.set(nextSec, { autoAlpha: 1 });

      const tl = gsap.timeline({
        delay: 0.3, // 0.3s delay on scroll as requested
        onComplete: () => {
          animating.current = false;
          gsap.set(currentSec, { autoAlpha: 0 });
          sectionIndex.current = nextSectionIdx;
        },
      });

      if (direction === 1) {
        tl.fromTo(nextSec, { yPercent: 100 }, { yPercent: 0, duration: 1.2, ease: 'power3.inOut' }, 0)
          .to(currentSec, { yPercent: -100, duration: 1.2, ease: 'power3.inOut' }, 0);
      } else {
        tl.fromTo(nextSec, { yPercent: -100 }, { yPercent: 0, duration: 1.2, ease: 'power3.inOut' }, 0)
          .to(currentSec, { yPercent: 100, duration: 1.2, ease: 'power3.inOut' }, 0);
      }

      // Animate lines in landing section
      animateSectionContent(nextSec, direction);
    }

    // Expose gotoSection to window for nav clicks
    (window as any).__gotoSection = gotoSection;

    // ─── Observer setup ───────────────────────────────────────────
    Observer.create({
      type: 'wheel,touch,pointer',
      wheelSpeed: -1,
      tolerance: 20,
      preventDefault: true,
      target: window,

      onUp: () => {
        if (animating.current) return;
        const cfg = SECTIONS_CONFIG[sectionIndex.current];

        if (cfg?.type === 'horizontal') {
          const totalPanels = cfg.panels;
          if (panelIndex.current < totalPanels - 1) {
            const nextPanel = panelIndex.current + 1;
            panelIndex.current = nextPanel;
            const wrapper = getWrapper(sections[sectionIndex.current]);
            if (wrapper) animateToPanel(wrapper, nextPanel, 1);
          } else {
            gotoSection(sectionIndex.current + 1, 1, 0);
          }
        } else {
          gotoSection(sectionIndex.current + 1, 1, 0);
        }
      },

      onDown: () => {
        if (animating.current) return;
        const cfg = SECTIONS_CONFIG[sectionIndex.current];

        if (cfg?.type === 'horizontal') {
          if (panelIndex.current > 0) {
            const prevPanel = panelIndex.current - 1;
            panelIndex.current = prevPanel;
            const wrapper = getWrapper(sections[sectionIndex.current]);
            if (wrapper) animateToPanel(wrapper, prevPanel, -1);
          } else {
            gotoSection(sectionIndex.current - 1, -1, 0);
          }
        } else {
          const prevCfg = SECTIONS_CONFIG[sectionIndex.current - 1];
          const entryPanel = prevCfg?.type === 'horizontal' ? (prevCfg.panels - 1) : 0;
          gotoSection(sectionIndex.current - 1, -1, entryPanel);
        }
      },
    });

    // Initial hero animations
    gsap.fromTo('.hero-action-row',
      { y: 40, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.9, ease: 'power3.out', delay: 0.6 }
    );
    gsap.fromTo(
      sections[0].querySelectorAll('.line-reveal'),
      { opacity: 0, y: 25 },
      { opacity: 1, y: 0, stagger: 0.1, duration: 0.8, ease: 'power3.out', delay: 0.25 }
    );
  }, { scope: appRef });

  const handleNavClick = (targetIdx: number) => {
    if (targetIdx === activeSectionIdx) return;
    const dir = targetIdx > activeSectionIdx ? 1 : -1;
    if ((window as any).__gotoSection) {
      (window as any).__gotoSection(targetIdx, dir, 0);
    }
  };

  return (
    <div ref={appRef} className="app-container">
      {/* Audio Player Toggle for Interstellar Theme */}
      <AudioPlayer />

      {/* ─── FIXED HEADER & VERTICAL NAV MENU (OUTSIDE CLOTH EFFECT) ─── */}
      <header className="site-header-fixed">
        {/* Far-left Brand Logo */}
        <button
          onClick={() => handleNavClick(0)}
          className="brand-link-fixed"
          aria-label="Linh Ta — Home"
          style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center' }}
        >
          <img src={assetPath('logo.svg?v=2')} alt="Linh Ta Logo" style={{ height: '24px', width: 'auto', display: 'block' }} />
        </button>

        {/* Far-right Vertical Nav Menu */}
        <nav className="vertical-nav-menu" aria-label="Primary Navigation">
          {SECTIONS_CONFIG.slice(1).map((sec, i) => {
            const secIdx = i + 1; // 1: Work, 2: Process, 3: Experience, 4: About, 5: Contact
            const isActive = activeSectionIdx === secIdx;
            return (
              <button
                key={sec.id}
                onClick={() => handleNavClick(secIdx)}
                className={`nav-item-v ${isActive ? 'active' : ''}`}
                aria-label={`Go to ${sec.name}`}
              >
                {isActive && <span className="active-dot" aria-hidden="true" />}
                <span>{sec.name}</span>
              </button>
            );
          })}
        </nav>
      </header>

      {/* ─── CLOTH EFFECT BACKGROUND ─── */}
      <Cloth
        wind={4.2}
        speed={0.4}
        amplitude={59}
        drape={66}
        brush={1.8}
        brushSize={180}
        damping={1.2}
        light={0.4}
        sheen={0.08}
        shadow={0.15}
        cornerRadius={0}
        perspective={1500}
        pin="top"
        backing="auto"
        style={{ width: '100%', height: '100vh', position: 'fixed', top: 0, left: 0 }}
      >
        <div className="fullpage-container">

          {/* ─── 1. HERO ────────────────────────────────────────── */}
          <section className="fullpage-section section-hero" id="hero">
            <div className="container-inner" style={{ paddingTop: '100px' }}>
              <div className="hero-split-container">
                {/* Hero Text Content on the Left */}
                <div className="hero-content">
                  <p className="hero-meta-tagline font-mono line-reveal">// LINH TA — PRODUCT DESIGNER &amp; DEVXIN FOUNDER</p>
                  <h1 className="hero-headline line-reveal">
                    I turn complex systems into <span className="serif-italic">clear</span> digital products.
                  </h1>
                  <p className="hero-lead-text line-reveal">
                    Hi, I'm Linh Ta, a Product Designer and Founder based in Hanoi, Vietnam. I work across product strategy, UX architecture, interaction systems, and complex AI workflows — transforming operational friction into intuitive, structured experiences.
                  </p>
                  <div className="hero-action-row">
                    <button onClick={() => handleNavClick(1)} className="hero-scroll-btn" style={{ cursor: 'pointer' }}>
                      <span>View selected work</span>
                      <span aria-hidden="true">↓</span>
                    </button>
                    <a
                      href={assetPath('Linh_Ta_Resume_2026.pdf')}
                      download="Linh_Ta_Resume_2026.pdf"
                      className="hero-scroll-btn"
                      style={{ textDecoration: 'none', cursor: 'pointer' }}
                    >
                      <span>Download CV</span>
                      <span aria-hidden="true">↓</span>
                    </a>
                    <span className="hero-location-text font-mono">HANOI, VIETNAM • UTC+7</span>
                  </div>
                </div>

                {/* 3D Dithered Object on the Right (No clip, live tunable options) */}
                <div className="hero-3d-col">
                  <DitheredObject
                    {...ditherOptions}
                    style={{ width: '100%', height: '100%', opacity: 0.55, mixBlendMode: 'multiply' }}
                  />
                </div>
              </div>
            </div>
          </section>

          {/* ─── 2. WORK (horizontal carousel with 4 projects) ── */}
          <section className="fullpage-section section-work-horizontal" id="work">
            <div className="horizontal-wrapper">

              {/* Panel 0 — Section intro */}
              <div className="horizontal-panel">
                <div className="container-inner" style={{ paddingTop: '100px' }}>
                  <div className="section-eyebrow-row">
                    <span className="section-label">01 / SELECTED WORK</span>
                  </div>
                  <div className="h-intro-layout">
                    <h2 className="section-heading-large line-reveal" style={{ maxWidth: '720px' }}>
                      Products shaped from real complexity.
                    </h2>
                    <div className="h-intro-right">
                      <p className="section-desc-p line-reveal">
                        Selected digital products designed across AI research, enterprise asset management, legal technology, and education platforms.
                      </p>
                      <p className="h-scroll-hint font-mono line-reveal">
                        SCROLL TO EXPLORE →
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Panel 1 — HIVO */}
              <div className="horizontal-panel">
                <div className="h-project-fullscreen">
                  <div className="h-project-img-col">
                    <div className="h-project-img">
                      <img src={assetPath('assets/portfolio/HIVO-cover.png')} alt="HIVO Digital Asset Management" loading="eager" />
                    </div>
                  </div>
                  <div className="h-project-meta">
                    <span className="section-label line-reveal">01 / HIVO</span>
                    <h3 className="h-project-name line-reveal">HIVO</h3>
                    <p className="h-project-category line-reveal">Enterprise / DAM • 2024—Current</p>
                    <p className="h-project-desc line-reveal">
                      Designing core workflows, approval systems, and reusable pattern libraries for an Australian Digital Asset Management platform serving enterprise permission tiers and brand operations.
                    </p>
                    <a href="https://hivo.com.au" target="_blank" rel="noopener noreferrer" className="project-ext-link line-reveal">
                      <span>hivo.com.au</span>
                      <span aria-hidden="true">↗</span>
                    </a>
                  </div>
                </div>
              </div>

              {/* Panel 2 — UNSWER */}
              <div className="horizontal-panel">
                <div className="h-project-fullscreen">
                  <div className="h-project-img-col">
                    <div className="h-project-img">
                      <img src={assetPath('assets/portfolio/Unswer-cover.png')} alt="Unswer AI Research Workspace" loading="lazy" />
                    </div>
                  </div>
                  <div className="h-project-meta">
                    <span className="section-label line-reveal">02 / UNSWER</span>
                    <h3 className="h-project-name line-reveal">Unswer</h3>
                    <p className="h-project-category line-reveal">AI / Research / Product Design • 2025—Current</p>
                    <p className="h-project-desc line-reveal">
                      A visual AI research workspace designed to explore deep queries through branching reasoning, multi-perspective synthesis, and traceable citations instead of linear chat dead-ends.
                    </p>
                    <a href="https://unswerai.ai.studio" target="_blank" rel="noopener noreferrer" className="project-ext-link line-reveal">
                      <span>unswerai.ai.studio</span>
                      <span aria-hidden="true">↗</span>
                    </a>
                  </div>
                </div>
              </div>

              {/* Panel 3 — LUATVIETNAM */}
              <div className="horizontal-panel">
                <div className="h-project-fullscreen">
                  <div className="h-project-img-col">
                    <div className="h-project-img">
                      <img src={assetPath('assets/portfolio/Luatvietnam-cover.png')} alt="LuatVietnam Legal Information Architecture" loading="lazy" />
                    </div>
                  </div>
                  <div className="h-project-meta">
                    <span className="section-label line-reveal">03 / LUATVIETNAM</span>
                    <h3 className="h-project-name line-reveal">LuatVietnam</h3>
                    <p className="h-project-category line-reveal">Legal Tech / Product Design • 2024—Current</p>
                    <p className="h-project-desc line-reveal">
                      Restructuring complex legal document discovery for millions of monthly users through behavioural telemetry, modular search interactions, and streamlined legal reference taxonomies. (Awarded 3rd Innovation Prize).
                    </p>
                    <a href="https://luatvietnammisa.aicongvu.gov.vn/" target="_blank" rel="noopener noreferrer" className="project-ext-link line-reveal">
                      <span>luatvietnammisa.aicongvu.gov.vn</span>
                      <span aria-hidden="true">↗</span>
                    </a>
                  </div>
                </div>
              </div>

              {/* Panel 4 — WORKLAB */}
              <div className="horizontal-panel">
                <div className="h-project-fullscreen">
                  <div className="h-project-img-col">
                    <div className="h-project-img">
                      <img src={assetPath('assets/portfolio/Worklab-cover.png')} alt="Worklab Collaborative Platform" loading="lazy" />
                    </div>
                  </div>
                  <div className="h-project-meta">
                    <span className="section-label line-reveal">04 / WORKLAB</span>
                    <h3 className="h-project-name line-reveal">Worklab</h3>
                    <p className="h-project-category line-reveal">Education / Platform Strategy • Current</p>
                    <p className="h-project-desc line-reveal">
                      A platform connecting students, academic educators, and enterprise companies through verified real-world project deliverables and clearer pathways from learning to employment.
                    </p>
                    <span className="project-ext-link text-muted line-reveal" style={{ borderBottom: "none", cursor: "default" }}>
                      <span>Platform Brief</span>
                    </span>
                  </div>
                </div>
              </div>

            </div>{/* /horizontal-wrapper */}
          </section>

          {/* ─── 3. PROCESS (Redesigned Split Layout) ─────────────── */}
          <section className="fullpage-section section-block section-process" id="process">
            <div className="container-inner" style={{ paddingTop: '100px', height: '100%', overflowY: 'auto', paddingBottom: '100px' }}>
              <div className="split-section-grid">
                {/* Left Col: Header & Description */}
                <div className="split-left-col">
                  <div className="section-eyebrow-row">
                    <span className="section-label">02 / PROCESS</span>
                  </div>
                  <h2 className="section-heading-large line-reveal">
                    How I work
                  </h2>
                  <p className="section-desc-p line-reveal">
                    Good digital products start before screens are drawn. I break problems down into five continuous stages.
                  </p>
                </div>

                {/* Right Col: Process Information Rows */}
                <div className="split-right-col">
                  <div className="process-rows-list">
                    <div className="process-row-item line-reveal">
                      <span className="process-num">01</span>
                      <h3 className="process-title">Observe</h3>
                      <p className="process-desc">Understand what is really happening behind workflows, constraints, behavioral drop-offs, and user friction.</p>
                    </div>
                    <div className="process-row-item line-reveal">
                      <span className="process-num">02</span>
                      <h3 className="process-title">Decode</h3>
                      <p className="process-desc">Find hidden dependencies, contradictory rules, and root causes beneath surface-level complaints.</p>
                    </div>
                    <div className="process-row-item line-reveal">
                      <span className="process-num">03</span>
                      <h3 className="process-title">Structure</h3>
                      <p className="process-desc">Turn complexity into an actionable information architecture, deterministic state models, and reusable component rules.</p>
                    </div>
                    <div className="process-row-item line-reveal">
                      <span className="process-num">04</span>
                      <h3 className="process-title">Build</h3>
                      <p className="process-desc">Translate system logic into high-craft interfaces, interactive prototypes, and production-ready implementations.</p>
                    </div>
                    <div className="process-row-item line-reveal">
                      <span className="process-num">05</span>
                      <h3 className="process-title">Evolve</h3>
                      <p className="process-desc">Test with real user evidence, learn from product behaviour, and continuously iterate the system over time.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* ─── 4. EXPERIENCE (Complete 7 Entries) ──────────── */}
          <section className="fullpage-section section-block section-experience" id="experience">
            <div className="container-inner" style={{ paddingTop: '100px', height: '100%', overflowY: 'auto', paddingBottom: '100px' }}>
              <div className="split-section-grid">
                {/* Left Col: Header & Description */}
                <div className="split-left-col">
                  <div className="section-eyebrow-row">
                    <span className="section-label">03 / EXPERIENCE</span>
                  </div>
                  <h2 className="section-heading-large line-reveal">
                    Experience
                  </h2>
                  <p className="section-desc-p line-reveal">
                    A track record of designing complex digital systems across AI, healthcare, legal technology, and enterprise software.
                  </p>
                </div>

                {/* Right Col: Full Experience Entries Table */}
                <div className="split-right-col">
                  <div className="experience-list">
                    <div className="experience-entry line-reveal">
                      <span className="exp-period">2025—Present</span>
                      <div className="exp-role-group">
                        <h3 className="exp-role-title">Founder &amp; Product Designer</h3>
                        <span className="exp-company-name">Devxin • Hanoi</span>
                      </div>
                      <p className="exp-desc-text">Building and researching AI-enabled products, defining end-to-end user journeys, and creating production-ready design systems.</p>
                    </div>

                    <div className="experience-entry line-reveal">
                      <span className="exp-period">2024—Present</span>
                      <div className="exp-role-group">
                        <h3 className="exp-role-title">Product Designer</h3>
                        <span className="exp-company-name">LuatVietnam (CTC Tech) • Hanoi</span>
                      </div>
                      <p className="exp-desc-text">Improving legal-information products through user behaviour analytics, UX restructuring, and modular interaction patterns (Awarded 3rd Innovation Prize).</p>
                    </div>

                    <div className="experience-entry line-reveal">
                      <span className="exp-period">2024—Present</span>
                      <div className="exp-role-group">
                        <h3 className="exp-role-title">UX/UI Designer</h3>
                        <span className="exp-company-name">HIVO • Perth, Australia (Remote)</span>
                      </div>
                      <p className="exp-desc-text">Designing workflows and design systems for an enterprise Digital Asset Management platform used across multi-tier organizational permission models.</p>
                    </div>

                    <div className="experience-entry line-reveal">
                      <span className="exp-period">2022—Present</span>
                      <div className="exp-role-group">
                        <h3 className="exp-role-title">Independent UX/UI Designer</h3>
                        <span className="exp-company-name">Freelance • International Clients</span>
                      </div>
                      <p className="exp-desc-text">Product and interface work across healthcare, enterprise, and recruitment platforms (TopCV SRP, Ecospace/Hitachi emissions management, Airzai Dubai, HODO).</p>
                    </div>

                    <div className="experience-entry line-reveal">
                      <span className="exp-period">2021—2022</span>
                      <div className="exp-role-group">
                        <h3 className="exp-role-title">Product Design &amp; UX/UI Leader</h3>
                        <span className="exp-company-name">Savis Technology Group • Hanoi</span>
                      </div>
                      <p className="exp-desc-text">Led a design team of 5 delivering portal, OCR, eKYC, and digital signature platforms for government and enterprise clients (Ministry of Health, VTV).</p>
                    </div>

                    <div className="experience-entry line-reveal">
                      <span className="exp-period">2017—2021</span>
                      <div className="exp-role-group">
                        <h3 className="exp-role-title">Graphic &amp; UI Design</h3>
                        <span className="exp-company-name">Earlier Roles • Hanoi</span>
                      </div>
                      <p className="exp-desc-text">Visual design, marketing campaigns, and foundational digital interfaces for retail and corporate organizations.</p>
                    </div>

                    <div className="experience-entry line-reveal">
                      <span className="exp-period">Dec 2023</span>
                      <div className="exp-role-group">
                        <h3 className="exp-role-title">B.Eng. in Automotive Engineering</h3>
                        <span className="exp-company-name">Hanoi University of Science and Technology (HUST)</span>
                      </div>
                      <p className="exp-desc-text">Formal engineering training in complex physical architectures and mechanical systems that directly grounds my systems-first design philosophy.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* ─── 5. ABOUT ───────────────────────────────────────── */}
          <section className="fullpage-section section-block section-about" id="about">
            <div className="container-inner" style={{ paddingTop: '100px', height: '100%', overflowY: 'auto', paddingBottom: '100px' }}>
              <div className="section-eyebrow-row">
                <span className="section-label">04 / ABOUT</span>
              </div>
              <div className="about-grid-layout">
                <div className="about-headline-col">
                  <h2 className="about-main-title line-reveal">
                    I'm Linh Ta.<br />
                    Designer by profession.<br />
                    Engineer by training.<br />
                    <span className="serif-italic">Builder by curiosity.</span>
                  </h2>

                  <div className="about-portrait-card line-reveal">
                    <img
                      src={assetPath('assets/linh-ta-portrait.jpg')}
                      alt="Linh Ta — Product Designer &amp; Founder"
                      className="about-portrait-img"
                      loading="lazy"
                    />
                    <span className="about-portrait-badge font-mono">LINH TA • AVATAR</span>
                  </div>
                </div>
                <div className="about-bio-col">
                  <p className="about-paragraph line-reveal">
                    I'm a Product Designer and Founder based in Hanoi. I work across product strategy, UX architecture, interaction design, and technology — with a dedicated focus on complex workflows, enterprise platforms, design systems, and emerging AI products.
                  </p>
                  <p className="about-paragraph line-reveal">
                    My background in Automotive Engineering from Hanoi University of Science and Technology (HUST) shaped how I approach software design: understand how the entire system functions, break down root constraints, and make every component work together cleanly.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* ─── 6. CONTACT (Complete Information Listing) ──────── */}
          <section className="fullpage-section section-block section-contact" id="contact">
            <div className="container-inner" style={{ paddingTop: '100px', height: '100%', overflowY: 'auto', paddingBottom: '100px' }}>
              <div className="section-eyebrow-row">
                <span className="section-label">05 / CONTACT</span>
              </div>
              <div className="contact-layout">
                <div className="contact-cta-col">
                  <h2 className="contact-cta-title line-reveal">
                    Have something <span className="serif-italic">complex</span> to build?
                  </h2>
                  <p className="section-desc-p line-reveal" style={{ marginTop: 16 }}>
                    I'm always interested in discussing products where systems, workflows, and technology need to become clearer.
                  </p>
                </div>
                <div className="contact-links-list">
                  <a href="mailto:tunglinhlinhtinh50@gmail.com" className="contact-link-entry line-reveal">
                    <span className="contact-type-label">EMAIL</span>
                    <span>tunglinhlinhtinh50@gmail.com</span>
                    <span className="contact-arrow-icon" aria-hidden="true">→</span>
                  </a>
                  <a href={assetPath('Linh_Ta_Resume_2026.pdf')} download="Linh_Ta_Resume_2026.pdf" className="contact-link-entry line-reveal">
                    <span className="contact-type-label">RESUME / CV</span>
                    <span>Download CV (PDF)</span>
                    <span className="contact-arrow-icon" aria-hidden="true">↓</span>
                  </a>
                  <a href="https://devxin.net" target="_blank" rel="noopener noreferrer" className="contact-link-entry line-reveal">
                    <span className="contact-type-label">DEVXIN</span>
                    <span>devxin.net</span>
                    <span className="contact-arrow-icon" aria-hidden="true">↗</span>
                  </a>
                  <a href="https://linh241.github.io/Pro5LinhTa" target="_blank" rel="noopener noreferrer" className="contact-link-entry line-reveal">
                    <span className="contact-type-label">PORTFOLIO</span>
                    <span>linh241.github.io/Pro5LinhTa</span>
                    <span className="contact-arrow-icon" aria-hidden="true">↗</span>
                  </a>
                  <a href="https://www.linkedin.com/in/t%E1%BA%A1-linh-2b8285190/" target="_blank" rel="noopener noreferrer" className="contact-link-entry line-reveal">
                    <span className="contact-type-label">LINKEDIN</span>
                    <span>linkedin.com/in/tạ-linh-2b8285190</span>
                    <span className="contact-arrow-icon" aria-hidden="true">↗</span>
                  </a>
                  <div className="contact-link-entry line-reveal" style={{ cursor: "default" }}>
                    <span className="contact-type-label">LOCATION</span>
                    <span>Hanoi, Vietnam (UTC+7)</span>
                    <span></span>
                  </div>
                </div>
              </div>
              <footer className="site-footer" style={{ marginTop: '120px', borderTop: '1px solid var(--border-color)', paddingTop: '32px' }}>
                <div className="footer-inner-container">
                  <span>LINH TA — PRODUCT DESIGNER &amp; FOUNDER • HANOI, VIETNAM • © 2026</span>
                </div>
              </footer>
            </div>
          </section>

        </div>
      </Cloth>
    </div>
  );
}

export default AppClone;
