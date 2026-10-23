import { useEffect, useState, Suspense, useCallback } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import {
  LINKS,
  SELECTED_PROJECTS,
  TECH_TOOLKIT,
  EXPERIENCE,
  EDUCATION,
  CLOUD_LABS,
  CREATIVE_WORK,
  YOUTUBE_VIDEOS,
} from "./data.js";
import { ProjectVisual } from "./ProjectVisuals.jsx";
import { SceneContent } from "./Scene3D.jsx";

const Arrow = () => <span aria-hidden="true" style={{ display: "inline-block" }}>↗</span>;

// Custom hooks with derived initial state (zero oxlint warnings)
function useIsMobile(bp = 768) {
  const [isMobile, setIsMobile] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia(`(max-width: ${bp}px)`).matches;
  });

  useEffect(() => {
    const m = window.matchMedia(`(max-width: ${bp}px)`);
    const handler = (e) => setIsMobile(e.matches);
    m.addEventListener("change", handler);
    return () => m.removeEventListener("change", handler);
  }, [bp]);

  return isMobile;
}

function useWebGLAvailable() {
  const [ok] = useState(() => {
    if (typeof document === "undefined") return true;
    try {
      const c = document.createElement("canvas");
      return !!(c.getContext("webgl") || c.getContext("experimental-webgl"));
    } catch {
      return false;
    }
  });

  return ok;
}

// High-fidelity, zero-dependency Web Audio synthesizer
let sharedAudioCtx = null;

function getAudioContext() {
  if (typeof window === "undefined") return null;
  const AudioCtx = window.AudioContext || window.webkitAudioContext;
  if (!AudioCtx) return null;
  if (!sharedAudioCtx) {
    sharedAudioCtx = new AudioCtx();
  }
  if (sharedAudioCtx.state === "suspended") {
    sharedAudioCtx.resume().catch(() => {});
  }
  return sharedAudioCtx;
}

function playBlipSound(type = "hover", soundEnabled = true) {
  if (!soundEnabled || typeof window === "undefined") return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    if (ctx.state === "suspended") {
      ctx.resume().catch(() => {});
    }

    const t = ctx.currentTime;
    const masterGain = ctx.createGain();
    masterGain.connect(ctx.destination);

    if (type === "hover") {
      // Crisp, glassy sci-fi blip (clearly audible at 0.08)
      const osc = ctx.createOscillator();
      osc.type = "sine";
      osc.frequency.setValueAtTime(840, t);
      osc.frequency.exponentialRampToValueAtTime(560, t + 0.045);

      masterGain.gain.setValueAtTime(0.08, t);
      masterGain.gain.exponentialRampToValueAtTime(0.0001, t + 0.05);

      osc.connect(masterGain);
      osc.start(t);
      osc.stop(t + 0.05);
    } else if (type === "click" || type === "open") {
      // Melodic dual-tone chime (harmonic C5 to G5 chime, clear and rich)
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      osc1.type = "sine";
      osc2.type = "triangle";

      osc1.frequency.setValueAtTime(523.25, t);
      osc1.frequency.exponentialRampToValueAtTime(783.99, t + 0.09);

      osc2.frequency.setValueAtTime(1046.5, t);
      osc2.frequency.exponentialRampToValueAtTime(1318.5, t + 0.09);

      const sparkleGain = ctx.createGain();
      sparkleGain.gain.setValueAtTime(0.045, t);
      sparkleGain.gain.exponentialRampToValueAtTime(0.0001, t + 0.1);
      osc2.connect(sparkleGain);
      sparkleGain.connect(ctx.destination);

      masterGain.gain.setValueAtTime(0.12, t);
      masterGain.gain.exponentialRampToValueAtTime(0.0001, t + 0.12);

      osc1.connect(masterGain);
      osc1.start(t);
      osc1.stop(t + 0.12);
      osc2.start(t);
      osc2.stop(t + 0.1);
    } else if (type === "close") {
      // Soft dismiss blip
      const osc = ctx.createOscillator();
      osc.type = "sine";
      osc.frequency.setValueAtTime(620, t);
      osc.frequency.exponentialRampToValueAtTime(340, t + 0.06);

      masterGain.gain.setValueAtTime(0.08, t);
      masterGain.gain.exponentialRampToValueAtTime(0.0001, t + 0.07);

      osc.connect(masterGain);
      osc.start(t);
      osc.stop(t + 0.07);
    }
  } catch {
    // Gracefully handle any browser audio policy restrictions
  }
}

// Modal Backdrop Wrapper
function PanelWrap({ kicker, title, subtitle, onClose, children }) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  return (
    <div className="backdrop" role="dialog" aria-modal="true" aria-labelledby="modal-panel-title" onClick={onClose}>
      <div className="panel" onClick={(e) => e.stopPropagation()}>
        <div className="panel-head">
          <div>
            <div className="panel-kicker">{kicker}</div>
            <h2 id="modal-panel-title">{title}</h2>
            {subtitle && <div className="panel-sub">{subtitle}</div>}
          </div>
          <button className="panel-close" onClick={onClose} aria-label="Close dialog">
            ✕
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

// 01: Projects Panel
function ProjectsPanel({ onClose }) {
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");
  const filters = ["All", "Web", "Systems", "Java"];

  const filtered = SELECTED_PROJECTS.filter((p) => {
    const matchesFilter = filter === "All" || p.filter === filter;
    const q = search.toLowerCase().trim();
    const matchesSearch =
      !q ||
      p.title.toLowerCase().includes(q) ||
      p.desc.toLowerCase().includes(q) ||
      p.stack.some((s) => s.toLowerCase().includes(q));
    return matchesFilter && matchesSearch;
  });

  return (
    <PanelWrap
      kicker="01 • Projects"
      title="Featured Engineering Work"
      subtitle="Full-stack web applications, cloud architectures, desktop tools, and systems experiments."
      onClose={onClose}
    >
      <div className="filter-bar">
        <div className="filter-row" role="group" aria-label="Filter projects">
          {filters.map((f) => (
            <button
              key={f}
              className="filter-pill"
              aria-pressed={filter === f}
              onClick={() => setFilter(f)}
            >
              {f}
            </button>
          ))}
        </div>
        <div className="search-wrap">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            className="search-input"
            placeholder="Search by tech or keyword (e.g. React, AWS)..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="projects-grid">
        {filtered.map((p) => (
          <article key={p.id} className="pcard">
            <div className="pcard-media">
              <ProjectVisual id={p.id} />
              {p.live && (
                <span className="pcard-live">
                  <span className="pulse-dot" /> Live
                </span>
              )}
              {p.badge && <span className="pcard-badge">{p.badge}</span>}
            </div>
            <div className="pcard-body">
              <div className="pcard-kicker">
                {p.n} • {p.category}
              </div>
              <h3>{p.title}</h3>
              <p className="pcard-desc">{p.desc}</p>

              <div className="tags">
                {p.stack.map((s) => (
                  <span key={s} className="tag">
                    {s}
                  </span>
                ))}
              </div>

              <div className="actions">
                {p.live && (
                  <a className="btn btn-p" href={p.live} target="_blank" rel="noreferrer">
                    Live Demo <Arrow />
                  </a>
                )}
                {p.repo && (
                  <a className="btn btn-g" href={p.repo} target="_blank" rel="noreferrer">
                    GitHub Code
                  </a>
                )}
              </div>
            </div>
          </article>
        ))}
      </div>
      {filtered.length === 0 && (
        <div style={{ textAlign: "center", padding: "40px 20px", color: "var(--text-muted)" }}>
          No projects found matching "{search}".
        </div>
      )}
    </PanelWrap>
  );
}

// 02: Systems & Cloud Panel
function SystemsPanel({ onClose }) {
  return (
    <PanelWrap
      kicker="02 • Infrastructure"
      title="Systems, Cloud & Networking"
      subtitle="Hands-on infrastructure deployments, virtual private clouds, database architecture, and network security tunnels."
      onClose={onClose}
    >
      <div className="arch-grid">
        {CLOUD_LABS.map((lab) => (
          <div key={lab.title} className="arch-card">
            <div className="arch-header">
              <span className="arch-badge">{lab.badge}</span>
              {lab.github && (
                <a className="mono" href={lab.github} target="_blank" rel="noreferrer" style={{ color: "var(--accent)" }}>
                  GitHub ↗
                </a>
              )}
            </div>
            <h4>{lab.title}</h4>
            <p>{lab.desc}</p>
            <div className="tags">
              {lab.tech.map((t) => (
                <span key={t} className="tag">
                  {t}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      <h3 style={{ margin: "28px 0 14px", fontSize: 18, color: "var(--text)", fontWeight: 600 }}>Technical Toolkit</h3>
      <div className="toolkit-grid">
        {TECH_TOOLKIT.map((group) => (
          <div key={group.category} className="toolkit-card">
            <div className="toolkit-title">{group.category}</div>
            <div className="tags">
              {group.skills.map((s) => (
                <span key={s} className="tag">
                  {s}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </PanelWrap>
  );
}

// 03: About Panel
function AboutPanel({ onClose }) {
  return (
    <PanelWrap
      kicker="03 • Story"
      title="About Bryson"
      subtitle="Computer Engineering student with a systems-first approach to building software."
      onClose={onClose}
    >
      <div className="bio-box">
        <p className="bio-lead">
          Hi, I’m Bryson Prakash Almeida. I’m currently pursuing my B.Tech in Computer Engineering at Fr. Conceicao Rodrigues College
          of Engineering (Fr. CRCE), having completed my Diploma in Cloud Computing & Big Data with 89.47% Distinction at Vidyavaridhi Polytechnic.
        </p>
        <p className="bio-text">
          I enjoy understanding how computer systems function from the ground up — not just writing frontend interfaces, but understanding
          how data flows through the Linux kernel, across virtual private clouds, and over encrypted network tunnels. I love building
          practical applications that solve real community challenges, automating infrastructure, and exploring creative visual media.
        </p>
      </div>

      <h3 style={{ margin: "22px 0 12px", fontSize: 18, color: "var(--text)", fontWeight: 600 }}>Core Principles & How I Work</h3>
      <div className="arch-grid">
        <div className="arch-card">
          <h4>Systems-First Thinking</h4>
          <p>
            Understanding network protocols, kernel routing, and operating system mechanics ensures that applications scale reliably and remain secure under production workloads.
          </p>
        </div>
        <div className="arch-card">
          <h4>Hands-On Deployment</h4>
          <p>
            Belief in practical implementation: testing real cloud VPCs on AWS, deploying Docker containers, and managing database connections in real environments.
          </p>
        </div>
        <div className="arch-card">
          <h4>Creative Clarity</h4>
          <p>
            Blending software engineering with video storytelling and motion design allows technical concepts to be communicated clearly to both developers and end-users.
          </p>
        </div>
      </div>
    </PanelWrap>
  );
}

// 04: Creative Panel
function CreativePanel({ onClose }) {
  return (
    <PanelWrap
      kicker="04 • Media"
      title="Video Editing & Motion Design"
      subtitle="Creative storytelling and visual editing created alongside engineering."
      onClose={onClose}
    >
      <div className="resume-actions-bar">
        <div>
          <b style={{ color: "var(--text)", fontSize: 15 }}>YouTube Channel: @sauceop8165</b>
          <div style={{ color: "var(--text-muted)", fontSize: 13, marginTop: 2 }}>
            Short-form reels, creative showreels, and video editing work.
          </div>
        </div>
        <a className="btn btn-p" href={LINKS.youtube} target="_blank" rel="noreferrer">
          Visit Channel <Arrow />
        </a>
      </div>

      <div className="arch-grid">
        {CREATIVE_WORK.map((work) => (
          <div key={work.id} className="arch-card">
            <span className="mono" style={{ color: "var(--accent)" }}>
              {work.role}
            </span>
            <h4>{work.title}</h4>
            <p>{work.desc}</p>
            <div className="tags">
              {work.tools.map((t) => (
                <span key={t} className="tag">
                  {t}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      {YOUTUBE_VIDEOS.length > 0 && (
        <div style={{ marginTop: 24 }}>
          <h3 style={{ fontSize: 18, marginBottom: 12 }}>Featured Videos</h3>
          <div className="projects-grid">
            {YOUTUBE_VIDEOS.map((v) => (
              <div key={v.id} className="pcard">
                <div style={{ aspectRatio: "16/9" }}>
                  <iframe
                    src={`https://www.youtube.com/embed/${v.id}`}
                    title={v.title}
                    loading="lazy"
                    allowFullScreen
                    style={{ width: "100%", height: "100%", border: 0 }}
                  />
                </div>
                <div className="pcard-body">
                  <b>{v.title}</b>
                  <a className="mono" href={`https://www.youtube.com/watch?v=${v.id}`} target="_blank" rel="noreferrer">
                    Watch on YouTube ↗
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </PanelWrap>
  );
}

// 05: Resume Panel
function ResumePanel({ onClose }) {
  const [tab, setTab] = useState("overview");

  return (
    <PanelWrap
      kicker="05 • Credentials"
      title="Curriculum Vitae"
      subtitle="B.Tech Computer Engineering (Fr. CRCE) • Cloud Computing Diploma (89.47%) • Software & Systems Developer."
      onClose={onClose}
    >
      <div className="resume-actions-bar">
        <div>
          <b style={{ color: "var(--text)", fontSize: 15 }}>Bryson_Prakash_Almeida_CV_Final.pdf</b>
          <div style={{ color: "var(--text-muted)", fontSize: 13, marginTop: 2 }}>
            Official resume document ready for engineering roles and internships.
          </div>
        </div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <a className="btn btn-p" href="/Bryson_Prakash_Almeida_CV_Final.pdf" target="_blank" rel="noreferrer">
            Open PDF <Arrow />
          </a>
          <a className="btn btn-g" href="/Bryson_Prakash_Almeida_CV_Final.pdf" download="Bryson_Prakash_Almeida_CV.pdf">
            Download File
          </a>
        </div>
      </div>

      <div className="resume-tabs">
        <button
          className={`resume-tab-btn ${tab === "overview" ? "active" : ""}`}
          onClick={() => setTab("overview")}
        >
          Overview
        </button>
        <button
          className={`resume-tab-btn ${tab === "education" ? "active" : ""}`}
          onClick={() => setTab("education")}
        >
          Education
        </button>
        <button
          className={`resume-tab-btn ${tab === "skills" ? "active" : ""}`}
          onClick={() => setTab("skills")}
        >
          Technical Skills
        </button>
        <button
          className={`resume-tab-btn ${tab === "experience" ? "active" : ""}`}
          onClick={() => setTab("experience")}
        >
          Experience
        </button>
      </div>

      {tab === "overview" && (
        <div className="bio-box">
          <p className="bio-lead">
            Computer Engineer skilled in full-stack web development, cloud computing (AWS & GCP), Linux environments,
            database architecture, and network security.
          </p>
          <div className="resume-stat-grid">
            <div className="resume-stat-card">
              <div className="mono" style={{ color: "var(--accent)" }}>89.47% DISTINCTION</div>
              <div className="resume-stat-title">Diploma in Cloud Computing & Big Data</div>
            </div>
            <div className="resume-stat-card">
              <div className="mono" style={{ color: "var(--cyan)" }}>B.TECH CANDIDATE</div>
              <div className="resume-stat-title">Fr. Conceicao Rodrigues College (CRCE)</div>
            </div>
            <div className="resume-stat-card">
              <div className="mono" style={{ color: "var(--emerald)" }}>SYSTEMS & CLOUD</div>
              <div className="resume-stat-title">AWS, Docker, Linux, Java, React, Python</div>
            </div>
          </div>
        </div>
      )}

      {tab === "education" && (
        <div className="edu-grid">
          {EDUCATION.map((e) => (
            <div key={e.degree} className="edu-card">
              <b>{e.degree}</b>
              <span className="school">{e.institution}</span>
              <span className="meta">{e.period} • {e.score}</span>
              <p>{e.details}</p>
            </div>
          ))}
        </div>
      )}

      {tab === "skills" && (
        <div className="toolkit-grid">
          {TECH_TOOLKIT.map((g) => (
            <div key={g.category} className="toolkit-card">
              <div className="toolkit-title">{g.category}</div>
              <div className="tags">
                {g.skills.map((s) => (
                  <span key={s} className="tag">
                    {s}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === "experience" && (
        <div className="arch-card">
          <h4>{EXPERIENCE[0].role} — {EXPERIENCE[0].org}</h4>
          <span className="mono" style={{ color: "var(--accent)" }}>{EXPERIENCE[0].period}</span>
          <ul style={{ margin: "10px 0 0", paddingLeft: 18, color: "var(--text-muted)", fontSize: 13.5, lineHeight: 1.75 }}>
            {EXPERIENCE[0].points.map((p) => (
              <li key={p}>{p}</li>
            ))}
          </ul>
        </div>
      )}
    </PanelWrap>
  );
}

// 06: GitHub Live Explorer Panel
const FALLBACK_REPOS = [
  {
    name: "crave-food-delivery",
    html_url: "https://github.com/brysonnn1704/crave-food-delivery",
    description: "Crave Food Delivery Web Application inspired by Zomato, built with React, Vite, and real OpenStreetMap data.",
    language: "JavaScript",
    updated_at: "2026-10-13T11:41:37Z",
  },
  {
    name: "RAKSHA-ZONE",
    html_url: "https://github.com/brysonnn1704/RAKSHA-ZONE",
    description: "GIS decision-support platform for SIH (Ministry of Home Affairs / NDRF Disaster Management).",
    language: "TypeScript",
    updated_at: "2026-10-13T11:32:35Z",
  },
  {
    name: "trainwise-mumbai",
    html_url: "https://github.com/brysonnn1704/trainwise-mumbai",
    description: "TrainWise Mumbai - m-Indicator-inspired commuter app for Mumbai local trains, buses and metro.",
    language: "JavaScript",
    updated_at: "2026-10-13T11:13:51Z",
  },
  {
    name: "React-Royal-Enfield-Clone-10914",
    html_url: "https://github.com/brysonnn1704/React-Royal-Enfield-Clone-10914",
    description: "A React recreation of the Royal Enfield brand experience with sleek interactive models.",
    language: "JavaScript",
    updated_at: "2026-10-02T14:04:44Z",
  },
  {
    name: "BankMANCRCE",
    html_url: "https://github.com/brysonnn1704/BankMANCRCE",
    description: "Desktop banking system built with JavaFX, MySQL, and Google OAuth with admin oversight dashboard.",
    language: "Java",
    updated_at: "2026-03-01T15:00:00Z",
  },
  {
    name: "digital-literacy-app",
    html_url: "https://github.com/brysonnn1704/digital-literacy-app",
    description: "Full-stack digital literacy platform designed for elderly users with scam awareness & accessibility UI.",
    language: "JavaScript",
    updated_at: "2026-03-26T13:08:16Z",
  },
  {
    name: "Restaurant-Billing-System",
    html_url: "https://github.com/brysonnn1704/Restaurant-Billing-System",
    description: "WebApplication for Restaurant Billing System with Customer end and Restaurant Administrator.",
    language: "Python",
    updated_at: "2026-03-19T16:30:24Z",
  },
  {
    name: "lab5-rds-listmonk",
    html_url: "https://github.com/brysonnn1704/lab5-rds-listmonk",
    description: "Cloud Computing Lab – Listmonk EC2 application connected to AWS RDS PostgreSQL in a VPC.",
    language: "Go",
    updated_at: "2026-08-19T17:42:53Z",
  },
  {
    name: "assignment2-dynamodb-crud",
    html_url: "https://github.com/brysonnn1704/assignment2-dynamodb-crud",
    description: "DynamoDB CRUD operations, single-table design, and automated Boto3 Python workflows.",
    language: "Python",
    updated_at: "2026-08-19T20:05:26Z",
  },
  {
    name: "Calorie-Tracker-10914",
    html_url: "https://github.com/brysonnn1704/Calorie-Tracker-10914",
    description: "Nutrition budgeting web application with macro breakdowns and daily tracking.",
    language: "JavaScript",
    updated_at: "2026-02-25T05:15:38Z",
  },
];

function GitHubPanel({ onClose }) {
  const [repos, setRepos] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    fetch("https://api.github.com/users/brysonnn1704/repos?per_page=100&sort=updated")
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (!alive) return;
        if (Array.isArray(data) && data.length > 0) {
          const filtered = data
            .filter((x) => !x.fork && x.name !== "brysonnn1704")
            .sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at))
            .slice(0, 14);
          setRepos(filtered);
        } else {
          setRepos(FALLBACK_REPOS);
        }
      })
      .catch(() => {
        if (alive) setRepos(FALLBACK_REPOS);
      })
      .finally(() => {
        if (alive) setLoading(false);
      });

    return () => {
      alive = false;
    };
  }, []);

  return (
    <PanelWrap
      kicker="06 • Repositories"
      title="GitHub Explorer"
      subtitle="Public repositories and experimental codebases on github.com/brysonnn1704."
      onClose={onClose}
    >
      <div className="resume-actions-bar">
        <div>
          <b style={{ color: "var(--text)" }}>Profile: @brysonnn1704 on GitHub</b>
          <div style={{ color: "var(--text-muted)", fontSize: 13, marginTop: 2 }}>
            Repositories are updated automatically from GitHub commits.
          </div>
        </div>
        <a className="btn btn-p" href={LINKS.github} target="_blank" rel="noreferrer">
          View Profile <Arrow />
        </a>
      </div>

      {loading ? (
        <div style={{ padding: 40, textAlign: "center", color: "var(--text-muted)", fontFamily: "var(--mono)" }}>
          Loading repositories from GitHub...
        </div>
      ) : (
        <div className="gh-grid">
          {repos?.map((r) => (
            <a key={r.name} href={r.html_url} target="_blank" rel="noreferrer" className="gh">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span>{r.language ?? "Code"}</span>
                <span>{new Date(r.updated_at).toLocaleDateString()}</span>
              </div>
              <b>{r.name}</b>
              <span className="desc">{r.description || "Experimental repository and codebase."}</span>
              <span className="mono" style={{ color: "var(--accent)", marginTop: "auto" }}>
                Open Repository ↗
              </span>
            </a>
          ))}
        </div>
      )}
    </PanelWrap>
  );
}

// 07: Contact Panel
function ContactPanel({ onClose, onToast }) {
  const handleCopyEmail = () => {
    navigator.clipboard?.writeText(LINKS.email);
    onToast("Email copied to clipboard!");
  };

  return (
    <PanelWrap
      kicker="07 • Connect"
      title="Get In Touch"
      subtitle="Open for software engineering internships, technical collaborations, and discussions."
      onClose={onClose}
    >
      <div className="contact-grid">
        <div className="contact-card" style={{ cursor: "pointer" }} onClick={handleCopyEmail}>
          <div className="contact-icon">✉️</div>
          <div className="contact-info">
            <b>Email</b>
            <small>{LINKS.email}</small>
            <span className="mono" style={{ color: "var(--accent)", marginTop: 4 }}>
              Click to copy address
            </span>
          </div>
        </div>

        <a className="contact-card" href={LINKS.github} target="_blank" rel="noreferrer">
          <div className="contact-icon">🐙</div>
          <div className="contact-info">
            <b>GitHub</b>
            <small>github.com/brysonnn1704</small>
            <span className="mono" style={{ color: "var(--accent)", marginTop: 4 }}>
              Explore repositories <Arrow />
            </span>
          </div>
        </a>

        <a className="contact-card" href={LINKS.youtube} target="_blank" rel="noreferrer">
          <div className="contact-icon">🎥</div>
          <div className="contact-info">
            <b>YouTube</b>
            <small>youtube.com/@sauceop8165</small>
            <span className="mono" style={{ color: "var(--accent)", marginTop: 4 }}>
              Watch video edits <Arrow />
            </span>
          </div>
        </a>

        <a className="contact-card" href="/Bryson_Prakash_Almeida_CV_Final.pdf" target="_blank" rel="noreferrer">
          <div className="contact-icon">📄</div>
          <div className="contact-info">
            <b>Curriculum Vitae</b>
            <small>Bryson_Prakash_Almeida_CV_Final.pdf</small>
            <span className="mono" style={{ color: "var(--accent)", marginTop: 4 }}>
              View / Download <Arrow />
            </span>
          </div>
        </a>
      </div>
    </PanelWrap>
  );
}

// Main Portfolio Application Component
export default function App() {
  const [panel, setPanel] = useState(null);
  const [menu, setMenu] = useState(false);
  const [hovered, setHovered] = useState(null);
  const [clickedStation, setClickedStation] = useState(null);
  const [soundEnabled, setSoundEnabled] = useState(() => {
    if (typeof window === "undefined") return true;
    const saved = localStorage.getItem("bryson_audio_enabled");
    return saved !== null ? saved === "true" : true;
  });
  const [forceMobileMode, setForceMobileMode] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  // Check prefers-reduced-motion
  const [reducedMotion] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  });

  // Keep sound preference in localStorage
  useEffect(() => {
    localStorage.setItem("bryson_audio_enabled", String(soundEnabled));
  }, [soundEnabled]);

  // Unlock Web Audio context seamlessly on any user interaction
  useEffect(() => {
    const unlockAudio = () => {
      const ctx = getAudioContext();
      if (ctx && ctx.state === "suspended") {
        ctx.resume().catch(() => {});
      }
    };
    window.addEventListener("pointerdown", unlockAudio, { passive: true });
    window.addEventListener("keydown", unlockAudio, { passive: true });
    window.addEventListener("click", unlockAudio, { passive: true });
    return () => {
      window.removeEventListener("pointerdown", unlockAudio);
      window.removeEventListener("keydown", unlockAudio);
      window.removeEventListener("click", unlockAudio);
    };
  }, []);

  const isMobileScreen = useIsMobile(768);
  const webglAvailable = useWebGLAvailable();
  const isFallback = (isMobileScreen || !webglAvailable || forceMobileMode);

  const openPanel = useCallback((id) => {
    setClickedStation(id);
    setPanel(id);
    playBlipSound("click", soundEnabled);
  }, [soundEnabled]);

  const closePanel = useCallback(() => {
    setPanel(null);
    playBlipSound("close", soundEnabled);
  }, [soundEnabled]);

  const showToast = useCallback((msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  }, []);

  const triggerBlip = useCallback((type) => {
    playBlipSound(type, soundEnabled);
  }, [soundEnabled]);

  const toggleSound = useCallback(() => {
    setSoundEnabled((prev) => {
      const next = !prev;
      if (next) {
        playBlipSound("click", true);
        showToast("Audio effects enabled");
      } else {
        showToast("Audio muted");
      }
      return next;
    });
  }, [showToast]);

  const stations = [
    { id: "projects", label: "Projects", icon: "💻", n: "01" },
    { id: "systems", label: "Systems & Cloud", icon: "☁️", n: "02" },
    { id: "resume", label: "Resume", icon: "📄", n: "03" },
    { id: "creative", label: "Creative", icon: "🎥", n: "04" },
    { id: "about", label: "About", icon: "🪪", n: "05" },
    { id: "github", label: "GitHub", icon: "⚡", n: "06" },
  ];

  const labelMap = {
    projects: "01 • MONITOR — Selected Projects (Click to open)",
    systems: "02 • BLADE SERVER — Cloud & Systems Architecture (Click)",
    resume: "03 • NOTEBOOK — Curriculum Vitae & Resume (Click)",
    creative: "04 • CAMERA — Video Editing & YouTube Media (Click)",
    about: "05 • ID BADGE — About Bryson & Journey (Click)",
    github: "06 • TERMINAL — Live GitHub Repositories (Click)",
  };

  // Keyboard Shortcuts
  useEffect(() => {
    const handleKey = (e) => {
      if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA") return;
      if (e.key === "Escape") {
        setPanel(null);
        setMenu(false);
      } else if (e.key === "1") openPanel("projects");
      else if (e.key === "2") openPanel("systems");
      else if (e.key === "3") openPanel("resume");
      else if (e.key === "4") openPanel("creative");
      else if (e.key === "5") openPanel("about");
      else if (e.key === "6") openPanel("github");
      else if (e.key === "7") openPanel("contact");
      else if (e.key === "m" || e.key === "M") toggleSound();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [openPanel, toggleSound]);

  return (
    <div>
      <a className="skip" href="#main">
        Skip to main content
      </a>

      {/* Header Topbar */}
      <header className="topbar">
        <div className="brand-group">
          <a
            className="brand"
            href="#"
            onClick={(e) => {
              e.preventDefault();
              setPanel(null);
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
          >
            BRYSON <span>ALMEIDA</span>
          </a>
          <span className="brand-badge">
            <span className="live-dot" /> B.Tech Fr. CRCE
          </span>
        </div>

        {/* Desktop Quick Nav */}
        <nav className="top-nav" aria-label="Main Navigation">
          <button
            className={`top-nav-btn ${panel === "projects" ? "active" : ""}`}
            onMouseEnter={() => triggerBlip("hover")}
            onClick={() => openPanel("projects")}
          >
            Projects
          </button>
          <button
            className={`top-nav-btn ${panel === "systems" ? "active" : ""}`}
            onMouseEnter={() => triggerBlip("hover")}
            onClick={() => openPanel("systems")}
          >
            Systems
          </button>
          <button
            className={`top-nav-btn ${panel === "about" ? "active" : ""}`}
            onMouseEnter={() => triggerBlip("hover")}
            onClick={() => openPanel("about")}
          >
            About
          </button>
          <button
            className={`top-nav-btn ${panel === "creative" ? "active" : ""}`}
            onMouseEnter={() => triggerBlip("hover")}
            onClick={() => openPanel("creative")}
          >
            Creative
          </button>
          <button
            className={`top-nav-btn ${panel === "resume" ? "active" : ""}`}
            onMouseEnter={() => triggerBlip("hover")}
            onClick={() => openPanel("resume")}
          >
            Resume
          </button>
          <button
            className={`top-nav-btn ${panel === "contact" ? "active" : ""}`}
            onMouseEnter={() => triggerBlip("hover")}
            onClick={() => openPanel("contact")}
          >
            Contact
          </button>
        </nav>

        {/* Action Tools */}
        <div className="top-actions">
          <button
            className="btn-icon"
            onClick={toggleSound}
            aria-label={soundEnabled ? "Mute audio" : "Enable sound"}
            title={soundEnabled ? "Audio ON (press M to mute)" : "Audio OFF (press M to enable)"}
          >
            {soundEnabled ? "🔊" : "🔇"}
          </button>

          <a
            className="btn-cv-header"
            href="/Bryson_Prakash_Almeida_CV_Final.pdf"
            target="_blank"
            rel="noreferrer"
          >
            Resume PDF
          </a>

          <button
            className="menu-btn"
            onClick={() => setMenu((v) => !v)}
            aria-expanded={menu}
            aria-label="Toggle menu"
          >
            MENU {menu ? "✕" : "≡"}
          </button>
        </div>
      </header>

      {/* Main Workspace */}
      <main className="workspace" id="main">
        {isFallback ? (
          /* Mobile / Fallback Card View */
          <div className="mobile-container">
            <div className="bio-box">
              <span className="mono" style={{ color: "var(--accent)" }}>
                PORTFOLIO • BRYSON PRAKASH ALMEIDA
              </span>
              <h1 className="mobile-title">
                Bryson Almeida
              </h1>
              <p className="mobile-desc">
                Computer Engineering student at Fr. CRCE, holding a Diploma with 89.47% distinction in Cloud Computing
                & Big Data. Specializing in Systems, Cloud Infrastructure, and Full-Stack Web Development.
              </p>
              <div style={{ display: "flex", gap: "var(--space-2)", flexWrap: "wrap" }}>
                <button className="btn btn-p" onClick={() => openPanel("projects")}>
                  Explore Projects <Arrow />
                </button>
                <a className="btn btn-g" href="/Bryson_Prakash_Almeida_CV_Final.pdf" target="_blank" rel="noreferrer">
                  Download CV (PDF)
                </a>
                {webglAvailable && (
                  <button
                    className="btn btn-g"
                    onClick={() => setForceMobileMode((v) => !v)}
                  >
                    Switch to 3D Desk
                  </button>
                )}
              </div>
            </div>

            <div className="mobile-grid">
              {stations.map((s) => (
                <button key={s.id} className="mobile-station-card" onClick={() => openPanel(s.id)}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: 22 }}>{s.icon}</span>
                    <span className="mono">{s.n}</span>
                  </div>
                  <h4>{s.label}</h4>
                  <span className="mono" style={{ color: "var(--accent)" }}>Open Station ↗</span>
                </button>
              ))}
            </div>
          </div>
        ) : (
          /* Desktop 3D Canvas Scene — Rock Solid, Zero Auto-Rotate, Easy Clicks */
          <>
            <div className="canvas-wrap">
              <Canvas
                camera={{ position: [0, 2.4, 5.4], fov: 42 }}
                dpr={[1, 1.75]}
                gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
                shadows
                onCreated={({ gl }) => {
                  gl.setClearColor("#07090D");
                }}
              >
                <Suspense fallback={null}>
                  <SceneContent
                    onPick={openPanel}
                    hovered={hovered}
                    setHovered={setHovered}
                    playBlip={triggerBlip}
                    clickedStation={clickedStation}
                    reducedMotion={reducedMotion}
                  />
                  <OrbitControls
                    enablePan={false}
                    enableDamping
                    dampingFactor={0.08}
                    minDistance={3.2}
                    maxDistance={8.2}
                    minPolarAngle={0.16}
                    maxPolarAngle={Math.PI / 2.3}
                    target={[0, 0.08, 0]}
                    rotateSpeed={0.55}
                    zoomSpeed={0.8}
                    autoRotate={false}
                  />
                </Suspense>
              </Canvas>
            </div>

            {/* Hover Indicator Pill at Top */}
            <div className={`hover-label ${hovered ? "" : "hidden"}`} role="status" aria-live="polite">
              <span className="dot" aria-hidden="true" />
              <span>{hovered ? labelMap[hovered] : "Hover an object"}</span>
            </div>

            {/* Bottom Station Dock: Fast 1-Click Access to Every Section */}
            <div className="station-dock-wrap">
              <div className="station-dock" role="navigation" aria-label="3D Stations">
                {stations.map((s) => (
                  <button
                    key={s.id}
                    className={`station-dock-btn ${hovered === s.id ? "active" : ""}`}
                    aria-label={`Open ${s.label} station (${s.n})`}
                    onMouseEnter={() => {
                      setHovered(s.id);
                      triggerBlip("hover");
                    }}
                    onMouseLeave={() => setHovered(null)}
                    onClick={() => openPanel(s.id)}
                  >
                    <span className="dock-icon">{s.icon}</span>
                    <span>{s.label}</span>
                  </button>
                ))}
              </div>
              <div className="dock-hint">
                Click any 3D station or dock button • Drag to orbit desk
              </div>
            </div>
          </>
        )}
      </main>

      {/* Footer Minimal */}
      <footer className="footer">
        <span>BRYSON PRAKASH ALMEIDA • Computer Engineering • Systems & Cloud • © 2026</span>
        <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
          <a href={LINKS.github} target="_blank" rel="noreferrer">
            GitHub
          </a>
          <a href={LINKS.youtube} target="_blank" rel="noreferrer">
            YouTube
          </a>
          <a href="/Bryson_Prakash_Almeida_CV_Final.pdf" target="_blank" rel="noreferrer">
            Curriculum Vitae
          </a>
          <a href={`mailto:${LINKS.email}`}>Email Me</a>
        </div>
      </footer>

      {/* Mobile Drawer Menu */}
      {menu && (
        <div className="sheet" role="dialog" aria-modal="true" aria-label="Navigation Menu">
          <div className="sheet-bg" onClick={() => setMenu(false)} />
          <div className="sheet-panel">
            <div className="sheet-title">WORKSPACE DIRECTORY</div>
            {stations.map((s) => (
              <button
                key={s.id}
                onClick={() => {
                  setMenu(false);
                  openPanel(s.id);
                }}
              >
                <span>{s.icon} {s.n} — {s.label}</span>
                <Arrow />
              </button>
            ))}
            <button
              onClick={() => {
                setMenu(false);
                openPanel("contact");
              }}
            >
              <span>✉️ 07 — Contact</span>
              <Arrow />
            </button>
            <a href={LINKS.github} target="_blank" rel="noreferrer">
              <span>GitHub Profile</span>
              <Arrow />
            </a>
            <a href={LINKS.youtube} target="_blank" rel="noreferrer">
              <span>YouTube Channel</span>
              <Arrow />
            </a>
            <button
              className="panel-close"
              style={{ marginTop: 12, width: "100%", borderRadius: "var(--radius-full)" }}
              onClick={() => setMenu(false)}
            >
              Close Menu
            </button>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toastMessage && (
        <div className="toast" role="status">
          <span>✨</span> {toastMessage}
        </div>
      )}

      {/* Modal Dialog Panels */}
      {panel === "projects" && <ProjectsPanel onClose={closePanel} />}
      {panel === "systems" && <SystemsPanel onClose={closePanel} />}
      {panel === "about" && <AboutPanel onClose={closePanel} />}
      {panel === "creative" && <CreativePanel onClose={closePanel} />}
      {panel === "resume" && <ResumePanel onClose={closePanel} />}
      {panel === "github" && <GitHubPanel onClose={closePanel} />}
      {panel === "contact" && <ContactPanel onClose={closePanel} onToast={showToast} />}
    </div>
  );
}
