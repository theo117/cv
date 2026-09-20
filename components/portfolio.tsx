import ProjectImage from "./project-image";
import {
  ArrowDown,
  ArrowUpRight,
  Download,
  Github,
  Linkedin,
  Mail,
  MapPin,
  Menu,
  Phone,
} from "lucide-react";

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
    problem:
      "Customer records, invoices, payments, and follow-ups were fragmented across spreadsheets, documents, and WhatsApp.",
    impact:
      "A structured quote-to-payment workflow with PDF invoices and practical business automation.",
    lesson:
      "Useful automation keeps each business action simple while making the next step obvious.",
    stack: ["Next.js", "Spring Boot", "REST", "JWT", "Vercel"],
    image: "/tradeflow.png",
    href: "https://github.com/theo117/TradeFlow_SA",
    liveHref: "https://tradeflow.teodordev.co.za",
  },
  {
    number: "02",
    name: "ChurchFlow",
    label: "Workflow product",
    summary:
      "A centralized administration system for members, ministries, attendance, donations, events, and operational reporting.",
    problem:
      "Recurring church administration was fragmented across spreadsheet-style records.",
    impact:
      "A single relational system designed around real weekly admin workflows.",
    lesson: "Small data-model decisions shape the speed of everyday work.",
    stack: ["Java", "Spring", "JPA", "MySQL"],
    image: "/img1.png",
    href: "https://github.com/theo117/church-management-system",
    liveHref: "https://church.teodordev.co.za",
  },
  {
    number: "03",
    name: "Desktop Point of Sale",
    label: "Packaged desktop app",
    summary:
      "An offline-capable sales system covering products, cart operations, transactions, local persistence, and Windows delivery.",
    problem:
      "Sales workflows need to continue when connectivity is unreliable.",
    impact: "A reviewable desktop product packaged as a Windows installer.",
    lesson:
      "Delivery and reliability are part of the product, not an afterthought.",
    stack: ["Java", "Swing", "JDBC", "MySQL", "MSI"],
    image: "/img3.png",
    href: "https://github.com/theo117/POS-App-v1",
    installerHref:
      "https://github.com/theo117/POS-App-v1/releases/download/pos-app-v1/JavaPOS-1.0.0.msi",
  },
] as const;

const journey = [
  {
    period: "2026 — Now",
    role: "Software Developer Intern",
    company: "Pinnacle ICT",
    copy: "Contributing to software development, debugging, testing, and application support while building practical experience with professional engineering workflows.",
    current: true,
  },
  {
    period: "2022 — 2025",
    role: "Software Developer",
    company: "Teodor Dev Tech",
    copy: "Delivering self-led and small-client software across Java, Spring Boot, React, Next.js, databases, deployment, and responsive web experiences.",
    current: false,
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

const capabilities = [
  {
    title: "Backend",
    detail: "Business logic & services",
    tools: "Java · Spring Boot · REST APIs · JPA · JWT",
  },
  {
    title: "Frontend",
    detail: "Interfaces people can use",
    tools: "React · Next.js · JavaScript · Responsive CSS",
  },
  {
    title: "Data & delivery",
    detail: "From persistence to release",
    tools: "PostgreSQL · MySQL · JDBC · Git · Vercel · MSI",
  },
];

export default function Portfolio() {
  return (
    <div className="site" id="top">
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <header className="topbar shell">
        <a className="brand" href="#top">
          <span className="monogram" aria-hidden="true">
            tn.
          </span>
          <span>Theodore Nelson</span>
        </a>
        <nav className="desktop-nav" aria-label="Main navigation">
          <a href="#work">Work</a>
          <a href="#experience">Experience</a>
          <a href="#about">About</a>
          <a href="#contact">Contact</a>
        </nav>
        <a className="nav-cv" href={links.cv} download>
          Download CV <Download size={15} />
        </a>
        <details className="mobile-nav">
          <summary aria-label="Navigation menu">
            <Menu size={21} />
          </summary>
          <nav aria-label="Mobile navigation">
            <a href="#work">Work</a>
            <a href="#experience">Experience</a>
            <a href="#about">About</a>
            <a href="#contact">Contact</a>
          </nav>
        </details>
      </header>

      <main id="main" tabIndex={-1}>
        <section className="hero shell" aria-labelledby="hero-title">
          <div className="hero-copy">
            <p className="eyebrow">Java & Full-Stack Developer</p>
            <p className="hero-name">Theodore Nelson</p>
            <h1 id="hero-title">
              Practical software for <em>everyday business.</em>
            </h1>
            <p className="hero-lede">
              I build business applications with Java, Spring Boot, and React.
              My background in IT support keeps the people using them at the
              centre of my work.
            </p>
            <div className="hero-actions">
              <a className="button primary" href="#work">
                View selected work <ArrowDown size={17} />
              </a>
              <a className="text-link" href={links.cv} download>
                Download CV <Download size={16} />
              </a>
            </div>
            <div className="hero-meta">
              <span>
                <MapPin size={14} /> Pretoria, South Africa
              </span>
              <a href={links.github} target="_blank" rel="noreferrer">
                GitHub <ArrowUpRight size={14} />
              </a>
              <a href={links.linkedin} target="_blank" rel="noreferrer">
                LinkedIn <ArrowUpRight size={14} />
              </a>
            </div>
          </div>
          <figure className="hero-feature">
            <div className="feature-label">
              <span>From the workbench</span>
              <span>Featured project</span>
            </div>
            <div className="hero-image-wrap">
              <ProjectImage
                src={projects[0].image}
                name={projects[0].name}
                priority
              />
            </div>
            <figcaption>
              <div>
                <strong>{projects[0].name}</strong>
                <span>Business operations, brought together.</span>
              </div>
              <a
                href={`#project-${projects[0].number}`}
                aria-label={`Explore ${projects[0].name}`}
              >
                <ArrowUpRight size={23} />
              </a>
            </figcaption>
          </figure>
        </section>

        <div className="intro-strip shell">
          <span className="availability">
            <i aria-hidden="true" /> Open to junior backend & full-stack roles
          </span>
          <span>IT foundations. Software focus. Practical delivery.</span>
        </div>

        <section className="work-section shell section" id="work">
          <div className="section-heading">
            <div>
              <p className="eyebrow">01 / Selected work</p>
              <h2>Built around real needs.</h2>
            </div>
            <p>
              Three applications. Different workflows.
              <br />
              The same care for making software useful.
            </p>
          </div>
          <div className="projects">
            {projects.map((project, index) => (
              <article
                className={`project ${index === 0 ? "featured-project" : "compact-project"}`}
                id={`project-${project.number}`}
                key={project.name}
              >
                <div className="project-visual">
                  <div className="project-label">
                    <span>
                      {project.number} / {project.label}
                    </span>
                    <span>{index === 2 ? "Desktop" : "Web application"}</span>
                  </div>
                  <ProjectImage src={project.image} name={project.name} />
                </div>
                <div className="project-copy">
                  <h3>{project.name}</h3>
                  <p className="project-summary">{project.summary}</p>
                  <dl className="project-facts">
                    <div>
                      <dt>The problem</dt>
                      <dd>{project.problem}</dd>
                    </div>
                    <div>
                      <dt>The implementation</dt>
                      <dd>{project.impact}</dd>
                    </div>
                    <div className="engineering-note">
                      <dt>Engineering note</dt>
                      <dd>{project.lesson}</dd>
                    </div>
                  </dl>
                  <p className="stack-label">Stack</p>
                  <ul
                    className="tags"
                    aria-label={`${project.name} technologies`}
                  >
                    {project.stack.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                  <div className="project-links">
                    <a href={project.href} target="_blank" rel="noreferrer">
                      GitHub <ArrowUpRight size={16} />
                    </a>
                    {"liveHref" in project && (
                      <a
                        href={project.liveHref}
                        target="_blank"
                        rel="noreferrer"
                      >
                        Live demo <ArrowUpRight size={16} />
                      </a>
                    )}
                    {"installerHref" in project && (
                      <a href={project.installerHref}>
                        Download Windows installer <Download size={16} />
                      </a>
                    )}
                    <a href={links.email}>
                      Request a walkthrough <ArrowUpRight size={16} />
                    </a>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="experience-section" id="experience">
          <div className="shell section experience-layout">
            <div className="experience-intro">
              <p className="eyebrow">02 / Experience</p>
              <h2>
                A foundation in support.
                <br />
                <em>A focus on software.</em>
              </h2>
              <p>
                Years of resolving incidents and helping users shaped how I
                approach development: understand the problem, make the solution
                clear, and think about what happens after release.
              </p>
              <a className="text-link" href={links.cv} download>
                View my full CV <Download size={16} />
              </a>
            </div>
            <div className="timeline">
              {journey.map((item, index) => (
                <article
                  className="experience-item"
                  data-current={item.current || undefined}
                  key={item.company}
                >
                  <div className="experience-meta">
                    <span>{item.period}</span>
                    <span>
                      {index < 2 ? "Software development" : "IT support"}
                    </span>
                  </div>
                  <h3>{item.role}</h3>
                  <p className="company">
                    {item.company}
                    {item.current && <span className="current">Current</span>}
                  </p>
                  <p>{item.copy}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="about-section shell section" id="about">
          <div className="section-heading">
            <div>
              <p className="eyebrow">03 / About & capabilities</p>
              <h2>
                Curious about how things work.
                <br />
                <em>Careful about how they’re used.</em>
              </h2>
            </div>
          </div>
          <div className="about-layout">
            <div className="about-copy">
              <p>
                I’m Theodore, a developer based in Pretoria. Through Teodor Dev
                Tech and my internship at Pinnacle ICT, I’m building on my IT
                background with hands-on software development.
              </p>
              <p>
                I like working through everyday business problems: the records
                that need organising, the steps that can be simpler, and the
                small details that make an application easier to support.
              </p>
              <p className="learning-note">
                <span>Currently developing</span>Deeper Spring architecture,
                testing, and production delivery.
              </p>
            </div>
            <div className="capabilities">
              {capabilities.map((group, index) => (
                <div className="capability" key={group.title}>
                  <span className="capability-number">0{index + 1}</span>
                  <div>
                    <h3>{group.title}</h3>
                    <p>{group.detail}</p>
                    <p className="capability-tools">{group.tools}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="qualifications">
            <div>
              <p className="eyebrow">Education & credentials</p>
              <p>
                A formal foundation.
                <br />
                Continued learning.
              </p>
            </div>
            <div className="credential-list">
              <a href="/system-development-nqf6.pdf" download>
                <span className="credential-year">2024</span>
                <span>
                  <strong>Systems Development · NQF 6</strong>
                  <small>Boston City Campus</small>
                </span>
                <Download size={17} />
              </a>
              <a href="/system-support-nqf5.pdf" download>
                <span className="credential-year">2017</span>
                <span>
                  <strong>Systems Support · NQF 5</strong>
                  <small>MICT SETA</small>
                </span>
                <Download size={17} />
              </a>
              <a href="/mcts-certificate.pdf" download>
                <span className="credential-year">2012</span>
                <span>
                  <strong>Microsoft Certified IT Professional</strong>
                  <small>Torque IT</small>
                </span>
                <Download size={17} />
              </a>
            </div>
          </div>
        </section>

        <section className="contact-section" id="contact">
          <div className="shell contact-layout">
            <div>
              <p className="eyebrow">04 / Get in touch</p>
              <h2>
                Good software starts
                <br />
                with a <em>conversation.</em>
              </h2>
              <p>
                I’m looking for a junior backend or full-stack role where I can
                contribute, learn, and build useful software with a team.
              </p>
              <a className="button contact-button" href={links.email}>
                Let’s talk <ArrowUpRight size={18} />
              </a>
            </div>
            <div className="contact-details">
              <span className="availability">
                <i aria-hidden="true" /> Open to opportunities
              </span>
              <a href={links.email}>
                <Mail size={17} />
                <span>theodorelnelson@outlook.com</span>
                <ArrowUpRight size={16} />
              </a>
              <a href={links.phone}>
                <Phone size={17} />
                <span>+27 60 636 0886</span>
                <ArrowUpRight size={16} />
              </a>
              <p>
                <MapPin size={17} /> Pretoria, South Africa
              </p>
              <div className="contact-socials">
                <a href={links.github} target="_blank" rel="noreferrer">
                  <Github size={17} /> GitHub
                </a>
                <a href={links.linkedin} target="_blank" rel="noreferrer">
                  <Linkedin size={17} /> LinkedIn
                </a>
                <a href={links.cv} download>
                  <Download size={17} /> Download CV
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="shell">
        <a className="footer-name" href="#top">
          Theodore Nelson<span>Built with care in Pretoria.</span>
        </a>
        <p>Teodor Dev Tech</p>
        <a className="text-link" href="#top">
          Back to top <ArrowUpRight size={15} />
        </a>
      </footer>
    </div>
  );
}
