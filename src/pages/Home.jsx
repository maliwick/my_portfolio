import React from "react";
import { WorkGrid, BadgeCarousel } from "../components/Content.jsx";
import Icon from "../components/Icon.jsx";
const expertise = [
  [
    "Security tools",
    ["Nmap", "Wireshark", "Nessus", "Metasploit", "Burp Suite"],
    "shield",
  ],
  ["Programming", ["Python", "JavaScript", "Dart", "Java"], "code"],
  [
    "Development",
    ["Flutter", "React", "HTML/CSS", "Firebase", "MySQL"],
    "tools",
  ],
  [
    "Security domains",
    [
      "Penetration testing",
      "Network security",
      "Threat analysis",
      "Digital forensics",
      "SecDevOps",
    ],
    "book",
  ],
];
export default function Home({ data }) {
  const projects = data.projects.filter((v) => v.status === "published");
  const labs = data.labs.filter((v) => v.status === "published");
  return (
    <div className="container home-layout">
      <section className="hero" id="home">
        <div className="hero-info">
          <p className="hero-info-title">
            <Icon name="shield" /> CYBER SECURITY & IT
          </p>
          <p className="hero-name">M. T. Malinga</p>
          <h1>
            Building solutions.
            <br />
            <span className="gradient">Thinking security.</span>
          </h1>
          <p className="hero-summary">
            Cybersecurity, practical IT support, and secure software
            development. Explore the projects I build and the lessons I document
            along the way.
          </p>
          <div className="hero-buttons">
            <a href="/projects/" className="hero-link">
              View projects <Icon />
            </a>
            <a href="/index.html#contact" className="hero-link secondary">
              Contact me <Icon name="mail" />
            </a>
          </div>
          <div className="hero-meta">
            <span>Sri Lanka</span>
            <span>
              BSc (Hons) Cyber Security · Academic requirements completed
            </span>
          </div>
        </div>
        <div className="hero-focus">
          <span className="focus-label">MY FOCUS</span>
          <Icon name="shield" className="focus-shield" />
          <h2>
            Curiosity.
            <br />
            Practice.
            <br />
            Progress.
          </h2>
          <p>Networks · Systems · Applications</p>
          <div className="focus-links">
            <a href="/projects/">
              <strong>{projects.length}</strong>
              <span>Published projects</span>
              <Icon />
            </a>
            <a href="/labs/">
              <strong>{labs.filter((v) => !v.sample).length}</strong>
              <span>Published lab practicals</span>
              <Icon />
            </a>
          </div>
        </div>
      </section>
      <BadgeCarousel badges={data.badges} />
      <section className="skills-section" id="skills">
        <div className="section-heading">
          <p className="work-kicker">TOOLS & TECHNOLOGIES</p>
          <h2 className="section-title">Technical skills</h2>
          <p>A foundation across security, development, and everyday IT.</p>
        </div>
        <div className="skills-container">
          {expertise.map(([title, tags, icon]) => (
            <div className="skill-category" key={title}>
              <h3>
                <Icon name={icon} />
                {title}
              </h3>
              <div className="skill-tags">
                {tags.map((tag) => (
                  <span className="skill-tag" key={tag}>
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
      <section className="experience-section" id="experience">
        <div className="section-heading">
          <p className="work-kicker">HANDS-ON EXPERIENCE</p>
          <h2 className="section-title">Learning through real work.</h2>
        </div>
        <div className="timeline">
          <article className="timeline-item">
            <div className="timeline-date">6 months</div>
            <div className="timeline-content">
              <h3>IT Technical Support Officer</h3>
              <h4>Onimta Information Technology (Pvt) Ltd</h4>
              <p>
                Installed and configured computer systems, troubleshot hardware
                and software, and resolved technical and application problems
                through remote and in-person support.
              </p>
            </div>
          </article>
          <article className="timeline-item">
            <div className="timeline-date">2015</div>
            <div className="timeline-content">
              <h3>Diploma in English</h3>
              <h4>High School Institute</h4>
              <p>
                Completed a TVEC registered program, developing communication
                and professional writing skills.
              </p>
            </div>
          </article>
        </div>
      </section>
      <section className="info-section" id="about">
        <div className="section-heading">
          <p className="work-kicker">A LITTLE ABOUT ME</p>
          <h2 className="section-title">A practical approach to technology.</h2>
          <p>
            I enjoy solving problems, understanding how systems work, and making
            them more dependable.
          </p>
        </div>
        <div className="info-cards">
          <article className="card">
            <Icon name="book" />
            <h3>Education</h3>
            <p>
              <strong>BSc (Hons) Cyber Security</strong>
              <br />
              SLTC Research University
              <br />
              Academic requirements completed · Graduation pending
            </p>
            <p>
              G.C.E. (A/L), Technology Stream
              <br />
              Govt Science College Matale
            </p>
          </article>
          <article className="card">
            <Icon name="shield" />
            <h3>Security interests</h3>
            <p>
              Threat intelligence, digital forensics, vulnerability management,
              bug bounty learning, and secure software development.
            </p>
          </article>
          <article className="card">
            <Icon name="tools" />
            <h3>How I work</h3>
            <p>
              Clear communication, collaborative problem solving, and continuous
              learning. Comfortable working with Windows and Linux environments.
            </p>
          </article>
        </div>
      </section>
      <section className="work-section" id="projects">
        <div className="work-heading">
          <div>
            <p className="work-kicker">BUILD / EXPLORE / DOCUMENT</p>
            <h2>My work, in practice.</h2>
          </div>
          <a className="work-button" href="/projects/">
            All projects <Icon />
          </a>
        </div>
        <WorkGrid items={projects.slice(0, 3)} kind="projects" />
      </section>
      <section className="work-section" id="labs">
        <div className="work-callout">
          <div>
            <p className="work-kicker">INSIDE MY SECURITY LAB</p>
            <h2>Practice with purpose.</h2>
            <p>
              Exercises, findings, and lessons from authorized lab environments.
            </p>
          </div>
          <a className="work-button" href="/labs/">
            Explore lab practicals <Icon />
          </a>
        </div>
      </section>
      <section className="work-section business-teaser">
        <p className="work-kicker">MY NEXT CHAPTER · COMING SOON</p>
        <h2>
          PSudo IT Solution<span>.</span>
        </h2>
        <p>
          A future business built around practical IT support, dependable
          networks, and a security-aware approach.
        </p>
        <a className="work-button" href="/business/index.html">
          Discover the business <Icon />
        </a>
      </section>
      <section className="contact-section" id="contact">
        <div className="section-heading">
          <p className="work-kicker">LET'S CONNECT</p>
          <h2 className="section-title">Have an opportunity in mind?</h2>
          <p>
            Interested in cybersecurity opportunities, IT support, and
            thoughtful technical collaboration.
          </p>
        </div>
        <div className="contact-details">
          <div>
            <span>Email</span>
            <p>malingawelagedara525@gmail.com</p>
          </div>
          <div>
            <span>Phone</span>
            <p>+94 75 265 2360</p>
          </div>
          <div>
            <span>Based in</span>
            <p>Matale, Sri Lanka</p>
          </div>
        </div>
      </section>
    </div>
  );
}
