import { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import Lenis from 'lenis';

import { WordReveal } from './components/WordReveal/WordReveal';
import { Bubble } from './components/canvasui/Bubble';
import { assetPath } from './lib/assetPath';
import './css/styles.css';

gsap.registerPlugin(ScrollTrigger, useGSAP);

function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  // GSAP Configuration
  const gsapY = 40;
  const gsapDuration = 0.8;
  const gsapScrub = 1.5;
  const gsapBlur = 15;
  const gsapTextStagger = 0.02;
  const gsapLerp = 0.05;

  const appRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    // 0. Initialize Lenis for smooth scrolling
    const scroller = document.querySelector('.bend-scroll-container') as HTMLElement;
    if (!scroller) return;

    const lenis = new Lenis({
      wrapper: scroller,
      content: scroller.querySelector('.site-main') as HTMLElement || undefined,
      lerp: gsapLerp, // Using the UI control for smoothness
      wheelMultiplier: 1,
    });

    lenis.on('scroll', ScrollTrigger.update);

    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0, 0);

    // ScrollTrigger needs to know about the custom scroll container
    ScrollTrigger.defaults({
      scroller: '.bend-scroll-container'
    });

    // 0.5. Section Snapping (1 scroll = 1 section feel)
    ScrollTrigger.create({
      trigger: scroller,
      scroller: scroller,
      start: 'top top',
      end: 'bottom bottom',
      snap: {
        snapTo: '.section-hero, .section-block' as any,
        duration: { min: 0.2, max: 0.8 },
        delay: 0.1, // Wait 100ms after scroll stop before snapping
        ease: 'power2.inOut'
      }
    });

    // 1. Hero action row fade
    gsap.fromTo('.hero-action-row', 
      { y: gsapY, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: gsapDuration,
        ease: 'power3.out',
        delay: 0.2
      }
    );

    // 1b. Hero Word Reveal (Scrubbed)
    const wordContainers = gsap.utils.toArray('.word-reveal-container') as HTMLElement[];
    wordContainers.forEach(container => {
      const words = container.querySelectorAll('.reveal-word');
      gsap.to(words, {
        opacity: 1,
        stagger: gsapTextStagger,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: container,
          scroller: '.bend-scroll-container',
          start: 'top 85%',
          end: 'bottom 40%',
          scrub: gsapScrub
        }
      });
    });

    // 2. Section block reveals
    const sections = gsap.utils.toArray('.section-block') as HTMLElement[];
    sections.forEach((section) => {
      gsap.fromTo(section, 
        { y: gsapY, opacity: 0 },
        {
          scrollTrigger: {
            trigger: section,
            start: 'top 85%',
            toggleActions: 'play none none reverse'
          },
          y: 0,
          opacity: 1,
          duration: gsapDuration,
          ease: 'power2.out'
        }
      );
    });

    // 3. Project item image reveals
    const projects = gsap.utils.toArray('.project-item') as HTMLElement[];
    projects.forEach((project) => {
      // Image Blur-to-Sharp Reveal
      const img = project.querySelector('.project-real-img');
      if (img) {
        gsap.fromTo(img,
          { filter: `blur(${gsapBlur}px)`, opacity: 0, scale: 1.1 },
          {
            filter: 'blur(0px)',
            opacity: 1,
            scale: 1,
            ease: 'none', // Linear ease makes the reveal feel slower and more gradual
            scrollTrigger: {
              trigger: project,
              scroller: '.bend-scroll-container',
              start: 'top 100%', // Start exactly when it enters the viewport
              end: 'top 30%', // Extend the end point slightly higher to stretch the duration
              scrub: gsapScrub
            }
          }
        );
      }
    });

    // 4. Process row stagger
    const processRows = gsap.utils.toArray('.process-row-item') as HTMLElement[];
    processRows.forEach((row) => {
      gsap.fromTo(row, 
        { x: -30, opacity: 0 },
        {
          scrollTrigger: {
            trigger: row,
            start: 'top 90%',
            toggleActions: 'play none none reverse'
          },
          x: 0,
          opacity: 1,
          duration: gsapDuration,
          ease: 'power2.out'
        }
      );
    });

    return () => {
      lenis.destroy();
    };
  }, { scope: appRef, dependencies: [gsapY, gsapDuration, gsapScrub, gsapBlur, gsapTextStagger, gsapLerp] });

  useEffect(() => {
    const handleHashChange = () => {
      setIsMenuOpen(false);
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  return (
    <div ref={appRef} className="app-container">
      <Bubble
        size={30}
        trail={24}
        follow={0.5}
        blend={14}
        speed={2}
        refraction={80}
        dispersion={1}
        frost={0}
        shine={0.25}
        rim={0.5}
        iridescence={1}
        intensity={0.9}
        tintStrength={0}
        tint={[1, 1, 1]}
        colorA={[0.2902, 0.4549, 0.7216]}
        colorB={[0.4118, 0.4118, 0.4157]}
        style={{ width: "100%", height: "100vh", position: "fixed", top: 0, left: 0 }}
      >
        <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", backgroundColor: "var(--bg-main)" }}>
          {/* Sticky Editorial Header */}
          <header className="site-header" id="siteHeader">
            <div className="header-container">
          <a href="#hero" className="brand-link" aria-label="Linh Ta — Home">
            <span>LINH TA</span>
          </a>

          {/* Desktop Nav Menu */}
          <nav className="nav-menu" aria-label="Primary Navigation">
            <a href="#work" className="nav-item">Work</a>
            <a href="#process" className="nav-item">Process</a>
            <a href="#experience" className="nav-item">Experience</a>
            <a href="#about" className="nav-item">About</a>
            <a href="#contact" className="nav-item">Contact</a>
          </nav>

          {/* Mobile Hamburger Toggle Button */}
          <button 
            className="mobile-menu-toggle" 
            id="mobileMenuToggle" 
            aria-label="Toggle navigation menu" 
            aria-expanded={isMenuOpen}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? 'CLOSE' : 'MENU'}
          </button>
        </div>
      </header>

      {/* Mobile Nav Drawer */}
      <div className={`mobile-nav-drawer ${isMenuOpen ? 'is-open' : ''}`} id="mobileNavDrawer" aria-hidden={!isMenuOpen}>
        <nav className="mobile-nav-links" aria-label="Mobile Navigation">
          <a href="#work" className="mobile-nav-item" onClick={() => setIsMenuOpen(false)}>
            <span className="mobile-nav-num">01</span>
            <span>Work</span>
          </a>
          <a href="#process" className="mobile-nav-item" onClick={() => setIsMenuOpen(false)}>
            <span className="mobile-nav-num">02</span>
            <span>Process</span>
          </a>
          <a href="#experience" className="mobile-nav-item" onClick={() => setIsMenuOpen(false)}>
            <span className="mobile-nav-num">03</span>
            <span>Experience</span>
          </a>
          <a href="#about" className="mobile-nav-item" onClick={() => setIsMenuOpen(false)}>
            <span className="mobile-nav-num">04</span>
            <span>About</span>
          </a>
          <a href="#contact" className="mobile-nav-item" onClick={() => setIsMenuOpen(false)}>
            <span className="mobile-nav-num">05</span>
            <span>Contact ↗</span>
          </a>
        </nav>
        <div className="mobile-nav-footer font-mono">
          <span>LINH TA • HANOI, VIETNAM (UTC+7)</span>
        </div>
      </div>

      <div className="bend-scroll-container" style={{ position: "relative", width: "100%", height: "100%", overflow: "auto" }}>
        {/* Accessible Skip Link */}
        <a href="#work" className="skip-link">Skip to main content</a>

        {/* Main Content Container */}
        <main className="site-main" id="main-content">
          {/* 1. HERO */}
          <section className="section-hero" id="hero">
            <div className="container-inner">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'relative' }}>
                <div className="hero-content" style={{ zIndex: 2, position: 'relative', flex: 1 }}>
                  <p className="hero-meta-tagline font-mono">// PRODUCT DESIGNER & FOUNDER</p>
                  <h1 className="hero-headline word-reveal-container" id="heroHeadline">
                    <WordReveal text="I turn complex systems into" />{' '}
                    <span className="serif-italic reveal-word" style={{ display: 'inline-block', opacity: 0.2 }}>clear</span>{' '}
                    <WordReveal text="digital products." />
                  </h1>
                  <p className="hero-lead-text word-reveal-container">
                    <WordReveal text="Product Designer and Founder based in Hanoi, Vietnam. I work across product strategy, UX architecture, interaction systems, and complex AI workflows — transforming operational friction into intuitive, structured experiences." />
                  </p>
                  <div className="hero-action-row">
                    <a href="#work" className="hero-scroll-btn">
                      <span>View selected work</span>
                      <span aria-hidden="true">↓</span>
                    </a>
                    <span className="hero-location-text font-mono">HANOI, VIETNAM • UTC+7</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* 2. SELECTED WORK */}
          <section className="section-block section-work" id="work">
            <div className="container-inner">
              <div className="section-eyebrow-row">
                <span className="section-label">01 / SELECTED WORK</span>
              </div>
              <div className="section-work-intro">
                <h2 className="section-heading-large word-reveal-container">
                  <WordReveal text="Products shaped from real complexity." />
                </h2>
                <p className="section-desc-p word-reveal-container">
                  <WordReveal text="Selected digital products designed across AI research, enterprise asset management, legal technology, and education platforms." />
                </p>
              </div>

              {/* Projects Stream */}
              <div className="projects-stream">
                {/* PROJECT 01: HIVO */}
                <article className="project-item" id="project-hivo">
                  <div className="project-media-wrapper aspect-16-9" id="hivoMediaWrapper">
                    <img src={assetPath('assets/portfolio/hivo-cover.jpg')} alt="HIVO Digital Asset Management Interface" className="project-real-img" loading="eager" />
                  </div>
                  <div className="project-meta-row">
                    <div className="project-title-group">
                      <h3 className="project-name">HIVO</h3>
                      <span className="project-category-year">Enterprise / DAM • 2024—Current</span>
                    </div>
                    <p className="project-desc-text word-reveal-container">
                      <WordReveal text="Designing core workflows, approval systems, and reusable pattern libraries for an Australian Digital Asset Management platform serving enterprise permission tiers and brand operations." />
                    </p>
                    <a href="https://hivo.com.au" target="_blank" rel="noopener noreferrer" className="project-ext-link" aria-label="Visit HIVO website (opens in new tab)">
                      <span>hivo.com.au</span>
                      <span aria-hidden="true">↗</span>
                    </a>
                  </div>
                </article>

                {/* PROJECT 02: UNSWER */}
                <article className="project-item" id="project-unswer">
                  <div className="project-media-wrapper aspect-16-9">
                    <img src={assetPath('assets/portfolio/unswer-cover.jpg')} alt="Unswer Visual AI Research Workspace" className="project-real-img" loading="lazy" />
                  </div>
                  <div className="project-meta-row">
                    <div className="project-title-group">
                      <h3 className="project-name">Unswer</h3>
                      <span className="project-category-year">AI / Research / Product Design • 2025—Current</span>
                    </div>
                    <p className="project-desc-text word-reveal-container">
                      <WordReveal text="A visual AI research workspace designed to explore deep queries through branching reasoning, multi-perspective synthesis, and traceable citations instead of linear chat dead-ends." />
                    </p>
                    <a href="https://unswerai.ai.studio" target="_blank" rel="noopener noreferrer" className="project-ext-link" aria-label="Visit Unswer workspace (opens in new tab)">
                      <span>unswerai.ai.studio</span>
                      <span aria-hidden="true">↗</span>
                    </a>
                  </div>
                </article>

                {/* PROJECT 03: LUATVIETNAM */}
                <article className="project-item" id="project-luatvietnam">
                  <div className="project-media-wrapper aspect-16-9">
                    <img src={assetPath('assets/portfolio/luatvietnam-cover.jpg')} alt="LuatVietnam Legal Information Architecture" className="project-real-img" loading="lazy" />
                  </div>
                  <div className="project-meta-row">
                    <div className="project-title-group">
                      <h3 className="project-name">LuatVietnam</h3>
                      <span className="project-category-year">Legal Tech / Product Design • 2024—Current</span>
                    </div>
                    <p className="project-desc-text word-reveal-container">
                      <WordReveal text="Restructuring complex legal document discovery for millions of monthly users through behavioural telemetry, modular search interactions, and streamlined legal reference taxonomies. (Awarded 3rd Innovation Prize)." />
                    </p>
                    <a href="https://luatvietnam.vn" target="_blank" rel="noopener noreferrer" className="project-ext-link" aria-label="Visit LuatVietnam website (opens in new tab)">
                      <span>luatvietnam.vn</span>
                      <span aria-hidden="true">↗</span>
                    </a>
                  </div>
                </article>

                {/* PROJECT 04: WORKLAB */}
                <article className="project-item" id="project-worklab">
                  <div className="project-media-wrapper aspect-3-2">
                    <img src={assetPath('assets/portfolio/worklab-cover.jpg')} alt="Worklab Collaborative Platform" className="project-real-img" loading="lazy" />
                  </div>
                  <div className="project-meta-row">
                    <div className="project-title-group">
                      <h3 className="project-name">Worklab</h3>
                      <span className="project-category-year">Education / Platform Strategy • Current</span>
                    </div>
                    <p className="project-desc-text word-reveal-container">
                      <WordReveal text="A platform connecting students, academic educators, and enterprise companies through verified real-world project deliverables and clearer pathways from learning to employment." />
                    </p>
                    <span className="project-ext-link text-muted" style={{ borderBottom: "none", cursor: "default" }}>
                      <span>Platform Brief</span>
                    </span>
                  </div>
                </article>
              </div>
            </div>
          </section>

          {/* 3. PROCESS */}
          <section className="section-block section-process" id="process">
            <div className="container-inner">
              <div className="section-eyebrow-row">
                <span className="section-label">02 / PROCESS</span>
              </div>
              <div className="section-work-intro">
                <h2 className="section-heading-large word-reveal-container">
                  <WordReveal text="How I work" />
                </h2>
                <p className="section-desc-p word-reveal-container">
                  <WordReveal text="Good digital products start before screens are drawn. I break problems down into five continuous stages." />
                </p>
              </div>

              <div className="process-rows-list">
                <div className="process-row-item">
                  <span className="process-num">01</span>
                  <h3 className="process-title">Observe</h3>
                  <p className="process-desc">Understand what is really happening behind workflows, constraints, behavioral drop-offs, and user friction.</p>
                </div>
                <div className="process-row-item">
                  <span className="process-num">02</span>
                  <h3 className="process-title">Decode</h3>
                  <p className="process-desc">Find hidden dependencies, contradictory rules, and root causes beneath surface-level complaints.</p>
                </div>
                <div className="process-row-item">
                  <span className="process-num">03</span>
                  <h3 className="process-title">Structure</h3>
                  <p className="process-desc">Turn complexity into an actionable information architecture, deterministic state models, and reusable component rules.</p>
                </div>
                <div className="process-row-item">
                  <span className="process-num">04</span>
                  <h3 className="process-title">Build</h3>
                  <p className="process-desc">Translate system logic into high-craft interfaces, interactive prototypes, and production-ready implementations.</p>
                </div>
                <div className="process-row-item">
                  <span className="process-num">05</span>
                  <h3 className="process-title">Evolve</h3>
                  <p className="process-desc">Test with real user evidence, learn from product behaviour, and continuously iterate the system over time.</p>
                </div>
              </div>
            </div>
          </section>

          {/* 4. EXPERIENCE */}
          <section className="section-block section-experience" id="experience">
            <div className="container-inner">
              <div className="section-eyebrow-row">
                <span className="section-label">03 / EXPERIENCE</span>
              </div>
              <div className="section-work-intro">
                <h2 className="section-heading-large word-reveal-container">
                  <WordReveal text="Experience" />
                </h2>
                <p className="section-desc-p word-reveal-container">
                  <WordReveal text="A track record of designing complex digital systems across AI, healthcare, legal technology, and enterprise software." />
                </p>
              </div>

              <div className="experience-list">
                <div className="experience-entry">
                  <span className="exp-period">2025—Present</span>
                  <div className="exp-role-group">
                    <h3 className="exp-role-title">Founder & Product Designer</h3>
                    <span className="exp-company-name">Devxin • Hanoi</span>
                  </div>
                  <p className="exp-desc-text">Building and researching AI-enabled products, defining end-to-end user journeys, and creating production-ready design systems.</p>
                </div>
                <div className="experience-entry">
                  <span className="exp-period">2024—Present</span>
                  <div className="exp-role-group">
                    <h3 className="exp-role-title">Product Designer</h3>
                    <span className="exp-company-name">LuatVietnam (CTC Tech) • Hanoi</span>
                  </div>
                  <p className="exp-desc-text">Improving legal-information products through user behaviour analytics, UX restructuring, and modular interaction patterns (Awarded 3rd Innovation Prize).</p>
                </div>
                <div className="experience-entry">
                  <span className="exp-period">2024—Present</span>
                  <div className="exp-role-group">
                    <h3 className="exp-role-title">UX/UI Designer</h3>
                    <span className="exp-company-name">HIVO • Perth, Australia (Remote)</span>
                  </div>
                  <p className="exp-desc-text">Designing workflows and design systems for an enterprise Digital Asset Management platform used across multi-tier organizational permission models.</p>
                </div>
                <div className="experience-entry">
                  <span className="exp-period">2022—Present</span>
                  <div className="exp-role-group">
                    <h3 className="exp-role-title">Independent UX/UI Designer</h3>
                    <span className="exp-company-name">Freelance • International Clients</span>
                  </div>
                  <p className="exp-desc-text">Product and interface work across healthcare, enterprise, and recruitment platforms (TopCV SRP, Ecospace/Hitachi emissions management, Airzai Dubai, HODO).</p>
                </div>
                <div className="experience-entry">
                  <span className="exp-period">2021—2022</span>
                  <div className="exp-role-group">
                    <h3 className="exp-role-title">Product Design & UX/UI Leader</h3>
                    <span className="exp-company-name">Savis Technology Group • Hanoi</span>
                  </div>
                  <p className="exp-desc-text">Led a design team of 5 delivering portal, OCR, eKYC, and digital signature platforms for government and enterprise clients (Ministry of Health, VTV).</p>
                </div>
                <div className="experience-entry">
                  <span className="exp-period">2017—2021</span>
                  <div className="exp-role-group">
                    <h3 className="exp-role-title">Graphic & UI Design</h3>
                    <span className="exp-company-name">Earlier Roles • Hanoi</span>
                  </div>
                  <p className="exp-desc-text">Visual design, marketing campaigns, and foundational digital interfaces for retail and corporate organizations.</p>
                </div>
                <div className="experience-entry">
                  <span className="exp-period">Dec 2023</span>
                  <div className="exp-role-group">
                    <h3 className="exp-role-title">B.Eng. in Automotive Engineering</h3>
                    <span className="exp-company-name">Hanoi University of Science and Technology (HUST)</span>
                  </div>
                  <p className="exp-desc-text">Formal engineering training in complex physical architectures and mechanical systems that directly grounds my systems-first design philosophy.</p>
                </div>
              </div>
            </div>
          </section>

          {/* 5. ABOUT */}
          <section className="section-block section-about" id="about">
            <div className="container-inner">
              <div className="section-eyebrow-row">
                <span className="section-label">04 / ABOUT</span>
              </div>

              <div className="about-grid-layout">
                <div className="about-headline-col">
                  <h2 className="about-main-title word-reveal-container">
                    <WordReveal text="Designer by profession." /><br />
                    <WordReveal text="Engineer by training." /><br />
                    <span className="serif-italic reveal-word" style={{display: 'inline-block', opacity: 0.2}}>Builder</span>{' '}
                    <span className="serif-italic reveal-word" style={{display: 'inline-block', opacity: 0.2}}>by</span>{' '}
                    <span className="serif-italic reveal-word" style={{display: 'inline-block', opacity: 0.2}}>curiosity.</span>
                  </h2>
                </div>
                <div className="about-bio-col">
                  <p className="about-paragraph word-reveal-container">
                    <WordReveal text="I’m a Product Designer and Founder based in Hanoi. I work across product strategy, UX architecture, interaction design, and technology — with a dedicated focus on complex workflows, enterprise platforms, design systems, and emerging AI products." />
                  </p>
                  <p className="about-paragraph word-reveal-container">
                    <WordReveal text="My background in Automotive Engineering from Hanoi University of Science and Technology (HUST) shaped how I approach software design: understand how the entire system functions, break down root constraints, and make every component work together cleanly." />
                  </p>
                  <div className="about-meta-list font-mono">
                    <div className="about-meta-row">
                      <span className="meta-label">NAME</span>
                      <span className="meta-val">Linh Ta</span>
                    </div>
                    <div className="about-meta-row">
                      <span className="meta-label">ROLE</span>
                      <span className="meta-val">Product Designer / Founder</span>
                    </div>
                    <div className="about-meta-row">
                      <span className="meta-label">LOCATION</span>
                      <span className="meta-val">Hanoi, Vietnam (UTC+7)</span>
                    </div>
                    <div className="about-meta-row">
                      <span className="meta-label">FOCUS</span>
                      <span className="meta-val">Complex Systems, AI & Enterprise UX</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* 6. CONTACT */}
          <section className="section-block section-contact" id="contact">
            <div className="container-inner">
              <div className="section-eyebrow-row">
                <span className="section-label">05 / CONTACT</span>
              </div>

              <div className="contact-layout">
                <div className="contact-cta-col">
                  <h2 className="contact-cta-title word-reveal-container">
                    <WordReveal text="Have something" />{' '}
                    <span className="serif-italic reveal-word" style={{ display: 'inline-block', opacity: 0.2 }}>complex</span>{' '}
                    <WordReveal text="to build?" />
                  </h2>
                  <p className="section-desc-p word-reveal-container" style={{ marginTop: 16 }}>
                    <WordReveal text="I’m always interested in discussing products where systems, workflows, and technology need to become clearer." />
                  </p>
                </div>
                <div className="contact-links-list">
                  <a href="mailto:tunglinhlinhtinh50@gmail.com" className="contact-link-entry" aria-label="Send email to Linh Ta">
                    <span className="contact-type-label">EMAIL</span>
                    <span>tunglinhlinhtinh50@gmail.com</span>
                    <span className="contact-arrow-icon" aria-hidden="true">→</span>
                  </a>
                  <a href="https://devxin.net" target="_blank" rel="noopener noreferrer" className="contact-link-entry" aria-label="Visit Devxin website (opens in new tab)">
                    <span className="contact-type-label">DEVXIN</span>
                    <span>devxin.net</span>
                    <span className="contact-arrow-icon" aria-hidden="true">↗</span>
                  </a>
                  <a href="https://linh241.github.io/Pro5LinhTa" target="_blank" rel="noopener noreferrer" className="contact-link-entry" aria-label="View portfolio on GitHub (opens in new tab)">
                    <span className="contact-type-label">PORTFOLIO</span>
                    <span>linh241.github.io/Pro5LinhTa</span>
                    <span className="contact-arrow-icon" aria-hidden="true">↗</span>
                  </a>
                  <a href="https://www.linkedin.com/in/t%E1%BA%A1-linh-2b8285190/" target="_blank" rel="noopener noreferrer" className="contact-link-entry" aria-label="Visit Linh Ta's LinkedIn profile (opens in new tab)">
                    <span className="contact-type-label">LINKEDIN</span>
                    <span>linkedin.com/in/tạ-linh-2b8285190</span>
                    <span className="contact-arrow-icon" aria-hidden="true">↗</span>
                  </a>
                  <div className="contact-link-entry" style={{ cursor: "default" }}>
                    <span className="contact-type-label">LOCATION</span>
                    <span>Hanoi, Vietnam (UTC+7)</span>
                    <span></span>
                  </div>
                </div>
              </div>
            </div>
          </section>

        </main>

        {/* Clean Editorial Footer */}
        <footer className="site-footer">
          <div className="footer-inner-container">
            <span>LINH TA — PRODUCT DESIGNER & FOUNDER • HANOI, VIETNAM • © 2026</span>
            <a href="#hero" className="footer-back-top" aria-label="Back to top of page">
              <span>BACK TO TOP ↑</span>
            </a>
          </div>
        </footer>
      </div>
        </div>
      </Bubble>
    </div>
  );
}

export default App;
