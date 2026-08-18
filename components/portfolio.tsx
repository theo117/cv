"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import {
  ArrowDown,
  ArrowUpRight,
  Check,
  ChevronRight,
  Code2,
  Copy,
  Download,
  Github,
  Linkedin,
  Mail,
  MapPin,
  Menu,
  Moon,
  Phone,
  Sparkles,
  Sun,
  X,
} from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const links = {
  github: "https://github.com/theo117",
  linkedin: "https://www.linkedin.com/in/theodore-nelson-90b05144/",
  email: "mailto:theodorelnelson@outlook.com",
  phone: "tel:+27606360886",
  cv: "/Theodore_Nelson_CV_Junior_Developer.pdf",
};

const projects = [
  {
    number: "01",
    name: "TradeFlow SA",
    label: "Live business platform",
    summary:
      "A live operations platform that helps South African service businesses manage customers, products, quotes, invoices, payments, and communication in one place.",
    problem: "Customer records, invoices, payments, and follow-ups were fragmented across spreadsheets, documents, and WhatsApp.",
    impact: "A structured quote-to-payment workflow with PDF invoices and practical business automation.",
    lesson: "Useful automation keeps each business action simple while making the next step obvious.",
    stack: ["Next.js", "Spring Boot", "REST", "JWT", "Vercel"],
    image: "/im1.png",
    accent: "violet",
    href: "https://tradeflow.teodordev.co.za/",
    cta: "Open live project",
  },
  {
    number: "02",
    name: "ChurchFlow",
    label: "Workflow product",
    summary:
      "A centralized administration system for members, ministries, attendance, donations, events, and operational reporting.",
    problem: "Recurring church administration was fragmented across spreadsheet-style records.",
    impact: "A single relational system designed around real weekly admin workflows.",
    lesson: "Small data-model decisions shape the speed of everyday work.",
    stack: ["Java", "Spring", "JPA", "MySQL"],
    image: "/img1.png",
    accent: "mint",
    href: links.github,
    cta: "View on GitHub",
  },
  {
    number: "03",
    name: "Desktop Point of Sale",
    label: "Packaged desktop app",
    summary:
      "An offline-capable sales system covering products, cart operations, transactions, local persistence, and Windows delivery.",
    problem: "Sales workflows need to continue when connectivity is unreliable.",
    impact: "A reviewable desktop product packaged as an installer—not just source code.",
    lesson: "Delivery and reliability are part of the product, not an afterthought.",
    stack: ["Java", "Swing", "JDBC", "MySQL", "MSI"],
    image: "/img3.png",
    accent: "amber",
    href: "https://github.com/theo117/POS-App-v1",
    cta: "View on GitHub",
  },
] as const;

const journey = [
  {
    period: "Jul 2026 — Now",
    role: "IT Intern",
    company: "Pinnacle ICT",
    copy: "Supporting day-to-day IT operations, troubleshooting technical issues, and applying systems knowledge in a professional ICT environment.",
    current: true,
  },
  {
    period: "2022 — Now",
    role: "Software Developer",
    company: "Teodor Dev Tech",
    copy: "Delivering self-led and small-client software across Java, Spring Boot, React, Next.js, databases, deployment, and responsive web experiences.",
    current: true,
  },
  {
    period: "2018 — 2022",
    role: "IT Technician",
    company: "Adcock Ingram",
    copy: "Owned end-user support across workstations, software, networks, printers, and access—building production-minded troubleshooting habits.",
    current: false,
  },
  {
    period: "2012 — 2015",
    role: "IT Technician",
    company: "Netsurit",
    copy: "Built a foundation in managed IT services, incident resolution, documentation, and clear communication with users and teams.",
    current: false,
  },
];

const skills = [
  ["Java", "Primary language"],
  ["Spring Boot", "Backend systems"],
  ["REST APIs", "Service design"],
  ["PostgreSQL", "Relational data"],
  ["React", "Product interfaces"],
  ["Next.js", "Full-stack web"],
  ["JavaScript", "Web fundamentals"],
  ["Git", "Version control"],
];

const principles = [
  "Start with the workflow, not the framework.",
  "Make the happy path obvious and the edge cases safe.",
  "Ship software that someone else can run, review, and maintain.",
];

function usePortfolioMotion(root: React.RefObject<HTMLDivElement | null>, reduced: boolean | null) {
  useEffect(() => {
    if (reduced) return;
    gsap.registerPlugin(ScrollTrigger);
    const context = gsap.context(() => {
      gsap.from("[data-hero]", {
        y: 28,
        opacity: 0,
        duration: 1,
        stagger: 0.1,
        ease: "power3.out",
      });
      gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach((element) => {
        gsap.from(element, {
          y: 48,
          opacity: 0,
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: { trigger: element, start: "top 86%", once: true },
        });
      });
      gsap.utils.toArray<HTMLElement>("[data-parallax]").forEach((element) => {
        gsap.to(element, {
          yPercent: -7,
          ease: "none",
          scrollTrigger: { trigger: element, scrub: 1, start: "top bottom", end: "bottom top" },
        });
      });
      gsap.from(".journey-line", {
        scaleY: 0,
        transformOrigin: "top",
        ease: "none",
        scrollTrigger: { trigger: ".journey-list", scrub: 0.6, start: "top 75%", end: "bottom 70%" },
      });
    }, root);
    return () => context.revert();
  }, [reduced, root]);
}

export default function Portfolio() {
  const root = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const [menuOpen, setMenuOpen] = useState(false);
  const [light, setLight] = useState(false);
  const [copied, setCopied] = useState(false);
  usePortfolioMotion(root, reduced);

  const copyEmail = async () => {
    await navigator.clipboard.writeText("theodorelnelson@outlook.com");
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  };

  return (
    <div ref={root} className={light ? "site light" : "site"}>
      <div className="noise" aria-hidden="true" />
      <header className="topbar">
        <a className="brand" href="#top" aria-label="Theodore Nelson, home">
          <span className="brand-mark">
            <Image src="/favicon-v2.svg" alt="" width={30} height={30} priority />
          </span>
          <span className="brand-name">Theodore Nelson</span>
        </a>
        <nav className="desktop-nav" aria-label="Main navigation">
          <a href="#work">Work</a>
          <a href="#journey">Journey</a>
          <a href="#stack">Stack</a>
          <a href="#contact">Contact</a>
        </nav>
        <div className="top-actions">
          <span className="availability"><i /> Available for opportunities</span>
          <button className="icon-button" onClick={() => setLight((value) => !value)} aria-label="Toggle color theme">
            {light ? <Moon size={16} /> : <Sun size={16} />}
          </button>
          <button className="menu-button" onClick={() => setMenuOpen(true)} aria-label="Open menu">
            <Menu size={19} />
          </button>
        </div>
      </header>

      <AnimatePresence>
        {menuOpen ? (
          <motion.div className="mobile-menu" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <button className="menu-close" onClick={() => setMenuOpen(false)} aria-label="Close menu"><X /></button>
            {["work", "journey", "stack", "contact"].map((item, index) => (
              <motion.a
                href={`#${item}`}
                key={item}
                onClick={() => setMenuOpen(false)}
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: index * 0.06 }}
              >
                <span>0{index + 1}</span>{item}
              </motion.a>
            ))}
          </motion.div>
        ) : null}
      </AnimatePresence>

      <main id="top">
        <section className="hero shell">
          <div className="hero-glow" aria-hidden="true" />
          <div className="hero-copy">
            <div className="eyebrow" data-hero>
              <span>Java + Full-Stack Developer</span>
              <span>Pretoria, South Africa</span>
            </div>
            <h1 data-hero>
              I build software that
              <span className="gradient-text"> makes work flow.</span>
            </h1>
            <p className="hero-lede" data-hero>
              From Spring Boot services to polished product interfaces—practical, maintainable software built around real business problems.
            </p>
            <div className="hero-actions" data-hero>
              <a className="button primary" href="#work">Explore selected work <ArrowDown size={17} /></a>
              <a className="button secondary" href={links.cv} download>Download résumé <Download size={17} /></a>
            </div>
            <div className="hero-meta" data-hero>
              <a href={links.github} target="_blank" rel="noreferrer"><Github size={17} /> GitHub</a>
              <a href={links.linkedin} target="_blank" rel="noreferrer"><Linkedin size={17} /> LinkedIn</a>
              <button onClick={copyEmail}>{copied ? <Check size={17} /> : <Copy size={17} />} {copied ? "Copied" : "Copy email"}</button>
            </div>
          </div>

          <div className="hero-visual" data-hero data-parallax>
            <div className="orbit orbit-one" />
            <div className="orbit orbit-two" />
            <div className="code-window">
              <div className="window-bar">
                <div><i /><i /><i /></div>
                <span>DeveloperProfile.java</span>
                <Sparkles size={14} />
              </div>
              <pre aria-label="Java code describing Theodore's profile"><code>
                <span className="purple">public record</span> Developer(<br />
                {"  "}<span className="blue">String</span> focus,<br />
                {"  "}<span className="blue">List&lt;String&gt;</span> stack,<br />
                {"  "}<span className="blue">boolean</span> available<br />
                {") {}"}<br /><br />
                <span className="muted">{"// Build for people. Ship with care."}</span><br />
                <span className="purple">return new</span> Developer(<br />
                {"  "}<span className="green">&quot;Business software&quot;</span>,<br />
                {"  "}List.of(<span className="green">&quot;Java&quot;</span>, <span className="green">&quot;React&quot;</span>),<br />
                {"  "}<span className="amber">true</span><br />
                {");"}
              </code></pre>
              <div className="code-status">
                <span><Check size={14} /> Build successful</span>
                <span>42 ms</span>
              </div>
            </div>
            <motion.div
              className="float-card float-card-one"
              animate={reduced ? undefined : { y: [0, -9, 0] }}
              transition={{ repeat: Infinity, duration: 4.2, ease: "easeInOut" }}
            >
              <Code2 size={18} /><div><b>8+ technologies</b><span>Across the stack</span></div>
            </motion.div>
            <motion.div
              className="float-card float-card-two"
              animate={reduced ? undefined : { y: [0, 8, 0] }}
              transition={{ repeat: Infinity, duration: 5.2, ease: "easeInOut" }}
            >
              <span className="mini-avatar">TN</span><div><b>Open to work</b><span>Junior backend / full stack</span></div>
            </motion.div>
          </div>
        </section>

        <section className="signal-strip" aria-label="Professional highlights">
          <div className="shell signal-grid">
            <div><strong>10+</strong><span>years in technology</span></div>
            <div><strong>2022</strong><span>building software since</span></div>
            <div><strong>3</strong><span>product formats shipped</span></div>
            <div><strong>01</strong><span>mission: useful software</span></div>
          </div>
        </section>

        <section className="work-section shell" id="work">
          <div className="section-heading" data-reveal>
            <div><p className="kicker">01 / Proof of work</p><h2>Products, not practice.</h2></div>
            <p>Selected systems framed by the problem, the engineering decisions, and the value they create.</p>
          </div>
          <div className="projects">
            {projects.map((project) => (
              <article className={`project-card accent-${project.accent}`} key={project.name} data-reveal>
                <div className="project-copy">
                  <div className="project-topline"><span>{project.number}</span><span>{project.label}</span></div>
                  <h3>{project.name}</h3>
                  <p className="project-summary">{project.summary}</p>
                  <div className="project-facts">
                    <div><span>Problem</span><p>{project.problem}</p></div>
                    <div><span>Business impact</span><p>{project.impact}</p></div>
                    <div><span>Lesson</span><p>{project.lesson}</p></div>
                  </div>
                  <div className="badges">{project.stack.map((item) => <span key={item}>{item}</span>)}</div>
                  <div className="project-links">
                    <a href={project.href} target="_blank" rel="noreferrer">{project.cta} <ArrowUpRight size={16} /></a>
                    <a href={links.email}>Request a walkthrough <ChevronRight size={16} /></a>
                  </div>
                </div>
                <div className="project-preview" data-parallax>
                  <div className="preview-toolbar"><i /><i /><i /><span>{project.name.toLowerCase().replaceAll(" ", "-")}.app</span></div>
                  <Image src={project.image} alt={`${project.name} application interface`} width={1307} height={619} sizes="(max-width: 900px) 100vw, 54vw" />
                  <div className="preview-shine" />
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="journey-section" id="journey">
          <div className="shell">
            <div className="section-heading light-heading" data-reveal>
              <div><p className="kicker">02 / Career signal</p><h2>Built on real-world troubleshooting.</h2></div>
              <p>Software engineering backed by years of understanding users, resolving incidents, and keeping technology working.</p>
            </div>
            <div className="journey-layout">
              <div className="journey-sticky" data-reveal>
                <p className="big-quote">“I don’t just write the feature. I think about the person who has to use it—and the person who has to support it.”</p>
                <a href={links.cv} download>Full career history <Download size={16} /></a>
              </div>
              <div className="journey-list">
                <div className="journey-line" aria-hidden="true" />
                {journey.map((item) => (
                  <article className="journey-item" key={`${item.company}-${item.period}`} data-reveal>
                    <i className={item.current ? "current" : ""} />
                    <p className="journey-period">{item.period}</p>
                    <h3>{item.role}</h3>
                    <p className="journey-company">{item.company}{item.current ? <span>Current</span> : null}</p>
                    <p>{item.copy}</p>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="stack-section shell" id="stack">
          <div className="section-heading" data-reveal>
            <div><p className="kicker">03 / Engineering system</p><h2>Tools chosen for the job.</h2></div>
            <p>Backend depth, frontend craft, and the discipline to connect both into useful products.</p>
          </div>
          <div className="stack-grid">
            <div className="stack-panel" data-reveal>
              <div className="panel-label"><span>Core stack</span><span>08 capabilities</span></div>
              <div className="skill-list">
                {skills.map(([skill, use], index) => (
                  <div className="skill-row" key={skill}>
                    <span className="skill-index">0{index + 1}</span>
                    <strong>{skill}</strong>
                    <span>{use}</span>
                    <ArrowUpRight size={15} />
                  </div>
                ))}
              </div>
            </div>
            <div className="terminal-panel" data-reveal>
              <div className="terminal-top"><div><i /><i /><i /></div><span>theodore@dev — philosophy</span></div>
              <div className="terminal-body">
                <p><span className="prompt">~ $</span> cat principles.txt</p>
                {principles.map((principle, index) => <p className="terminal-output" key={principle}><span>{index + 1}.</span> {principle}</p>)}
                <p><span className="prompt">~ $</span> current-focus --verbose</p>
                <div className="focus-output">
                  <span>LEARNING</span>
                  <strong>Deeper Spring architecture, testing, and production delivery.</strong>
                </div>
                <p className="cursor-line"><span className="prompt">~ $</span><i /></p>
              </div>
            </div>
          </div>
        </section>

        <section className="credential-section shell" data-reveal>
          <div className="credential-intro">
            <p className="kicker">Qualified foundation</p>
            <h2>Formal learning.<br />Practical delivery.</h2>
          </div>
          <div className="credential-list">
            <a href="/system-development-nqf6.pdf" download><span>2024</span><div><strong>Systems Development · NQF 6</strong><small>Boston City Campus</small></div><Download size={18} /></a>
            <a href="/system-support-nqf5.pdf" download><span>2017</span><div><strong>Systems Support · NQF 5</strong><small>MICT SETA</small></div><Download size={18} /></a>
            <a href="/mcts-certificate.pdf" download><span>2012</span><div><strong>Microsoft Certified IT Professional</strong><small>Torque IT</small></div><Download size={18} /></a>
          </div>
        </section>

        <section className="contact-section" id="contact">
          <div className="contact-orb" aria-hidden="true" />
          <div className="shell contact-inner" data-reveal>
            <span className="availability large"><i /> Available for junior backend & full-stack roles</span>
            <h2>Let’s build something<br /><span>useful.</span></h2>
            <p>I’m ready to bring practical delivery, calm problem-solving, and a genuine appetite for growth to a strong engineering team.</p>
            <div className="contact-actions">
              <a className="button primary light-button" href={links.email}>Start a conversation <ArrowUpRight size={17} /></a>
              <a className="button contact-secondary" href={links.cv} download>Download résumé <Download size={17} /></a>
            </div>
            <div className="contact-grid">
              <a href={links.email}><Mail size={16} /><span>Email</span><strong>theodorelnelson@outlook.com</strong></a>
              <a href={links.phone}><Phone size={16} /><span>Phone</span><strong>+27 60 636 0886</strong></a>
              <div><MapPin size={16} /><span>Based in</span><strong>Pretoria, South Africa</strong></div>
              <a href={links.linkedin} target="_blank" rel="noreferrer"><Linkedin size={16} /><span>Connect</span><strong>LinkedIn profile</strong></a>
            </div>
          </div>
        </section>
      </main>

      <footer>
        <div className="shell footer-inner">
          <div>
            <span className="brand-mark">
              <Image src="/favicon-v2.svg" alt="" width={30} height={30} />
            </span>
            <p>Powered by Teodor Dev Tech.</p>
          </div>
          <p>Java · Spring Boot · React · Next.js</p>
          <a href="#top">Back to top <ArrowUpRight size={14} /></a>
        </div>
      </footer>
    </div>
  );
}
