import React from "react";
import {
  WorkGrid,
  BadgeCarousel,
  MotionButton,
} from "../components/Content.jsx";
export default function Home({ data, paused, onToggle, reduced }) {
  return (
    <div className="container">
      <section className={"hero"} id={"home"}>
        <div className={"hero-info"}>
          <div className={"hero-info-title"}>
            <span aria-hidden="true">◈</span>
            {
              "\n                    Cyber Security \u00b7 IT Professional\n                "
            }
          </div>
          <h1>
            {"Securing "}
            <span className={"gradient"}>{"Digital"}</span>
            {" Assets with "}
            <span className={"gradient"}>{"Expertise"}</span>
          </h1>
          <p>
            {
              "Completed the academic requirements for BSc (Hons) Cyber Security at SLTC Research University; graduation pending. Passionate about network security, threat analysis, penetration testing, and secure software development."
            }
          </p>
          <div className={"hero-buttons"}>
            <a href={"#contact"} className="hero-link">
              <span aria-hidden="true">↗</span>
              {" Contact Me"}
            </a>
            <a href={"/projects.html"} className="hero-link secondary">
              <span aria-hidden="true">↗</span>
              {" View Projects"}
            </a>
            <MotionButton
              paused={paused}
              onToggle={onToggle}
              reduced={reduced}
            />
          </div>
        </div>
        <div className={"cyber-stats"}>
          <div className={"stat-box cursor-hover"}>
            <h3>{"3+"}</h3>
            <p>{"Projects"}</p>
          </div>
          <div className={"stat-box cursor-hover"}>
            <h3>{"10+"}</h3>
            <p>{"Security Tools"}</p>
          </div>
          <div className={"stat-box cursor-hover"}>
            <h3>{"4"}</h3>
            <p>{"Programming Languages"}</p>
          </div>
          <div className={"stat-box cursor-hover"}>
            <h3>{"6 Mo"}</h3>
            <p>{"IT Experience"}</p>
          </div>
        </div>
      </section>
      <section className={"info-section"} id={"about"}>
        <h1 className={"section-title"}>
          {"About Me \ud83d\udc68\u200d\ud83d\udcbb"}
        </h1>
        <div className={"info-cards"}>
          <div className={"card cursor-hover"}>
            <div className={"card-icon"}>
              <span aria-hidden="true">↗</span>
            </div>
            <h1>{"Education"}</h1>
            <p>
              <strong>{"BSc (Hons) Cyber Security"}</strong>
              <br />
              {"\n                    SLTC Research University"}
              <br />
              {
                "\n                    Academic requirements completed \u00b7 Graduation pending"
              }
            </p>
            <p>
              <strong>{"G.C.E.(A/L) - Technology Stream"}</strong>
              <br />
              {"\n                    Govt Science College Matale"}
            </p>
          </div>
          <div className={"card cursor-hover"}>
            <div className={"card-icon"}>
              <span aria-hidden="true">↗</span>
            </div>
            <h1>{"Technical Expertise"}</h1>
            <p>
              {
                "\u2022 Cyber Security Tools: Nmap, Wireshark, Nessus, Metasploit"
              }
              <br />
              {
                "\n                    \u2022 Programming: Python, JavaScript, Dart, Java"
              }
              <br />
              {
                "\n                    \u2022 Development: Flutter, React, HTML, CSS"
              }
              <br />
              {"\n                    \u2022 OS: Linux (Ubuntu/Kali), Windows"}
            </p>
          </div>
          <div className={"card cursor-hover"}>
            <div className={"card-icon"}>
              <span aria-hidden="true">↗</span>
            </div>
            <h1>{"Professional Interests"}</h1>
            <p>
              {"\u2022 Bug Bounty Hunting"}
              <br />
              {
                "\n                    \u2022 Secure Software Development (SecDevOps)"
              }
              <br />
              {"\n                    \u2022 Threat Intelligence & Analysis"}
              <br />
              {"\n                    \u2022 Digital Forensics"}
              <br />
              {"\n                    \u2022 Vulnerability Management"}
            </p>
            <a className="work-button" href="/index.html#contact">
              Let's Connect ↗
            </a>
          </div>
          <div className={"card cursor-hover"}>
            <div className={"card-icon"}>
              <span aria-hidden="true">↗</span>
            </div>
            <h1>{"Soft Skills"}</h1>
            <p>
              {"\u2022 Communication & Leadership"}
              <br />
              {"\n                    \u2022 Problem Solving"}
              <br />
              {"\n                    \u2022 Team Collaboration"}
              <br />
              {"\n                    \u2022 Creativity in Security Solutions"}
              <br />
              {
                "\n                    \u2022 Adaptability & Continuous Learning"
              }
            </p>
            <p>
              {
                "Motivated, flexible, and ready to contribute to secure environments while expanding my expertise."
              }
            </p>
          </div>
        </div>
      </section>
      <section className={"skills-section"} id={"skills"}>
        <h1 className={"section-title"}>{"Technical Skills \ud83d\udd10"}</h1>
        <div className={"skills-container"}>
          <div className={"skill-category cursor-hover"}>
            <h2>
              <span aria-hidden="true">◈</span>
              {" Security Tools"}
            </h2>
            <div className={"skill-tags"}>
              <span className={"skill-tag cursor-hover"}>{"Nmap"}</span>
              <span className={"skill-tag cursor-hover"}>{"Wireshark"}</span>
              <span className={"skill-tag cursor-hover"}>{"Nessus"}</span>
              <span className={"skill-tag cursor-hover"}>{"Metasploit"}</span>
              <span className={"skill-tag cursor-hover"}>{"Burp Suite"}</span>
            </div>
          </div>
          <div className={"skill-category cursor-hover"}>
            <h2>
              <span aria-hidden="true">↗</span>
              {" Programming"}
            </h2>
            <div className={"skill-tags"}>
              <span className={"skill-tag cursor-hover"}>{"Python"}</span>
              <span className={"skill-tag cursor-hover"}>{"JavaScript"}</span>
              <span className={"skill-tag cursor-hover"}>{"Dart"}</span>
              <span className={"skill-tag cursor-hover"}>{"Java"}</span>
            </div>
          </div>
          <div className={"skill-category cursor-hover"}>
            <h2>
              <span aria-hidden="true">↗</span>
              {" Development"}
            </h2>
            <div className={"skill-tags"}>
              <span className={"skill-tag cursor-hover"}>{"Flutter"}</span>
              <span className={"skill-tag cursor-hover"}>{"React"}</span>
              <span className={"skill-tag cursor-hover"}>{"HTML/CSS"}</span>
              <span className={"skill-tag cursor-hover"}>{"Firebase"}</span>
              <span className={"skill-tag cursor-hover"}>{"MySQL"}</span>
            </div>
          </div>
          <div className={"skill-category cursor-hover"}>
            <h2>
              <span aria-hidden="true">↗</span>
              {" Security Domains"}
            </h2>
            <div className={"skill-tags"}>
              <span className={"skill-tag cursor-hover"}>
                {"Penetration Testing"}
              </span>
              <span className={"skill-tag cursor-hover"}>
                {"Network Security"}
              </span>
              <span className={"skill-tag cursor-hover"}>
                {"Threat Analysis"}
              </span>
              <span className={"skill-tag cursor-hover"}>
                {"Digital Forensics"}
              </span>
              <span className={"skill-tag cursor-hover"}>{"SecDevOps"}</span>
            </div>
          </div>
        </div>
      </section>
      <section className="work-section" id="projects">
        <div className="work-heading">
          <div>
            <p className="work-kicker">BUILD / EXPLORE / DOCUMENT</p>
            <h2>My work, in practice.</h2>
          </div>
          <a className="work-button" href="/projects.html">
            View all projects ↗
          </a>
        </div>
        <WorkGrid
          items={data.projects
            .filter((v) => v.status === "published")
            .slice(0, 3)}
          kind="projects"
        />
        <div className="work-callout">
          <div>
            <h3>Inside my security lab</h3>
            <p>
              Practical exercises, findings, and lessons from authorized lab
              environments.
            </p>
          </div>
          <a className="work-button" href="/labs.html">
            Explore lab practicals ↗
          </a>
        </div>
      </section>
      <BadgeCarousel badges={data.badges} />
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
          Discover the business ↗
        </a>
      </section>
      <section className={"experience-section"} id={"experience"}>
        <h1 className={"section-title"}>
          {"Experience & Certifications \ud83d\udcc4"}
        </h1>
        <div className={"timeline"}>
          <div className={"timeline-item cursor-hover"}>
            <div className={"timeline-date"}>{"6 Months"}</div>
            <div className={"timeline-content"}>
              <h3>{"IT Technical Support Officer"}</h3>
              <h4>{"Onimta Information Technology (Pvt) Ltd"}</h4>
              <p>
                {"\u2022 Installed and configured computer systems"}
                <br />
                {
                  "\n                        \u2022 Troubleshot hardware and software issues"
                }
                <br />
                {
                  "\n                        \u2022 Resolved technical and application problems"
                }
                <br />
                {
                  "\n                        \u2022 Provided remote and in-person support"
                }
              </p>
            </div>
          </div>
          <div className={"timeline-item cursor-hover"}>
            <div className={"timeline-date"}>{"2015"}</div>
            <div className={"timeline-content"}>
              <h3>{"Diploma in English"}</h3>
              <h4>{"High School Institute"}</h4>
              <p>
                {"\u2022 Successfully completed TVEC registered program"}
                <br />
                {
                  "\n                        \u2022 Enhanced communication skills"
                }
                <br />
                {
                  "\n                        \u2022 Developed professional writing abilities"
                }
              </p>
            </div>
          </div>
        </div>
      </section>
      <section className={"contact-section"} id={"contact"}>
        <h1 className={"section-title"}>{"Let's Connect \ud83e\udd1d"}</h1>
        <div className={"contact-container"}>
          <div className={"social-box cursor-hover"}>
            <h2>{"Contact Information"}</h2>
            <a href={"tel:+94752652360"} className={"cursor-hover"}>
              <span aria-hidden="true">↗</span>
              {" +94 75 265 2360"}
            </a>
            <a
              href={"mailto:malingawelagedara525@gmail.com"}
              className={"cursor-hover"}
            >
              <span aria-hidden="true">↗</span>
              {" malingawelagedara525@gmail.com"}
            </a>
            <a href={"#"} className={"cursor-hover"}>
              <span aria-hidden="true">↗</span>
              {" 99/4, Muwagala, Tenna, Matale"}
            </a>
            <div className={"social-icons"}>
              <a
                href={"https://github.com/maliwick"}
                rel="noopener noreferrer"
                target={"_blank"}
                className={"cursor-hover"}
              >
                <span aria-hidden="true">↗</span>
              </a>
              <a
                href={"https://www.linkedin.com/in/thisaramalinga523cyber"}
                rel="noopener noreferrer"
                target={"_blank"}
                className={"cursor-hover"}
              >
                <span aria-hidden="true">↗</span>
              </a>
              <a
                href={"mailto:malingawelagedara525@gmail.com"}
                className={"cursor-hover"}
              >
                <span aria-hidden="true">↗</span>
              </a>
            </div>
          </div>
          <div className={"contact-box cursor-hover"}>
            <h2>{"Quick Message"}</h2>
            <p>
              {
                "Looking for an internship in cyber security. Interested in network security, threat analysis, and penetration testing opportunities."
              }
            </p>
            <a
              className="work-button"
              href="https://docs.google.com/forms/d/e/1FAIpQLSe7ljXMh9tY1eUcDzJSzB5jk_IT38F61FSNP3DHEGJW70o3vg/viewform"
              target="_blank"
              rel="noopener noreferrer"
            >
              Send Message ↗
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
