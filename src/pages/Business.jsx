import React from "react";
import BusinessInquiry from "../components/BusinessInquiry.jsx";
export default function Business() {
  return (
    <div className="business-page">
      <section className={"hero section"} id={"home"}>
        <div className={"hero-copy"}>
          <div className={"eyebrow"}>
            <span className={"pulse"}></span>
            {" COMING SOON \u2022 MY FUTURE BUSINESS"}
          </div>
          <h1>
            {"Technology that works."}
            <br />
            <span>{"Support you can trust."}</span>
          </h1>
          <p className={"lead"}>
            {
              "PSudo IT Solution is the IT support business I plan to launch. I'm Thisara Malinga, and this page introduces the services I intend to offer. You can contact me to discuss future opportunities."
            }
          </p>
          <div className={"hero-actions"}>
            <a className={"button primary"} href={"#contact"}>
              {"Discuss a future inquiry "}
              <span>{"\u2197"}</span>
            </a>
            <a className={"button secondary"} href={"/projects.html"}>
              {"Explore my work"}
            </a>
          </div>
          <div className={"hero-proof"}>
            <div className={"proof-icon"}>{"\u2713"}</div>
            <span>
              {
                "Practical support. Security-minded approach. Clear communication."
              }
            </span>
          </div>
        </div>
        <div className={"hero-visual"}>
          <div className={"orbit orbit-one"}></div>
          <div className={"orbit orbit-two"}></div>
          <div className={"terminal"}>
            <div className={"terminal-top"}>
              <span></span>
              <span></span>
              <span></span>
              <label>{"psudo / support-console"}</label>
            </div>
            <div className={"terminal-body"}>
              <p className={"muted"}>{"# Keeping your technology running"}</p>
              <p>
                <span aria-hidden="true">↗</span>
                <b>{"diagnose"}</b>
                {"(issue) "}
                <em>{"\u2192"}</em>
                {" identify root cause"}
              </p>
              <p>
                <span aria-hidden="true">↗</span>
                <b>{"secure"}</b>
                {"(system) "}
                <em>{"\u2192"}</em>
                {" reduce risk"}
              </p>
              <p>
                <span aria-hidden="true">↗</span>
                <b>{"resolve"}</b>
                {"(problem) "}
                <em>{"\u2192"}</em>
                {" restore productivity"}
              </p>
              <div className={"status"}>
                <span className={"pulse"}></span>
                {" SUPPORT SYSTEM READY"}
              </div>
            </div>
          </div>
          <div className={"floating-card"}>
            <span className={"float-icon"}>{"\u2301"}</span>
            <div>
              <b>{"Security-minded"}</b>
              <small>{"Support & operations"}</small>
            </div>
          </div>
          <div className={"hero-grid"}></div>
        </div>
      </section>
      <section className={"trust-strip"}>
        <span>{"FOCUSED ON"}</span>
        <b>{"IT SUPPORT"}</b>
        <b>{"NETWORK TROUBLESHOOTING"}</b>
        <b>{"ENDPOINT SECURITY"}</b>
        <b>{"USER EXPERIENCE"}</b>
      </section>
      <section className={"section"} id={"services"}>
        <div className={"section-heading"}>
          <div>
            <div className={"eyebrow"}>{"WHAT I CAN HELP WITH"}</div>
            <h2>
              {"IT services for "}
              <span>{"real-world needs."}</span>
            </h2>
          </div>
          <p>
            {
              "Responsive technical assistance for individuals, small businesses, and teams that need dependable IT support."
            }
          </p>
        </div>
        <div className={"service-grid"}>
          <article className={"service-card"}>
            <div className={"service-icon"}>{"\u2318"}</div>
            <h3>{"Computer & Help Desk Support"}</h3>
            <p>
              {
                "Hardware and software troubleshooting, system setup, application issues, printers, email, and everyday user support."
              }
            </p>
            <a href={"#contact"}>
              {"Discuss your issue "}
              <span>{"\u2197"}</span>
            </a>
          </article>
          <article className={"service-card"}>
            <div className={"service-icon"}>{"\u2301"}</div>
            <h3>{"Network & Connectivity"}</h3>
            <p>
              {
                "Wi-Fi and LAN troubleshooting, basic network configuration, connectivity diagnosis, and network traffic analysis."
              }
            </p>
            <a href={"#contact"}>
              {"Discuss your issue "}
              <span>{"\u2197"}</span>
            </a>
          </article>
          <article className={"service-card"}>
            <div className={"service-icon"}>{"\u25c8"}</div>
            <h3>{"Security & System Hygiene"}</h3>
            <p>
              {
                "Security-minded system configuration, vulnerability assessment in authorized environments, and practical data-protection guidance."
              }
            </p>
            <a href={"#contact"}>
              {"Discuss your issue "}
              <span>{"\u2197"}</span>
            </a>
          </article>
          <article className={"service-card"}>
            <div className={"service-icon"}>{"\u25a4"}</div>
            <h3>{"IT Assets & Business Support"}</h3>
            <p>
              {
                "IT inventory documentation, equipment setup and handover, secure backup procedures, and procurement coordination support."
              }
            </p>
            <a href={"#contact"}>
              {"Discuss your issue "}
              <span>{"\u2197"}</span>
            </a>
          </article>
        </div>
        <p className={"fineprint"}>
          {
            "Service availability, scope, pricing, and any on-site or remote arrangements are confirmed after discussing your requirements. Security testing is performed only with explicit authorization."
          }
        </p>
      </section>
      <section className={"about-section"} id={"about"}>
        <div className={"section about-layout"}>
          <div className={"about-visual"}>
            <div className={"about-badge"}>
              {"IT SUPPORT"}
              <br />
              <strong>{"+ SECURITY"}</strong>
            </div>
            <div className={"big-monogram"}>
              {"TM"}
              <span>{"."}</span>
            </div>
            <div className={"about-caption"}>
              {"M. Thisara Malinga"}
              <br />
              <small>{"IT Support Professional"}</small>
            </div>
          </div>
          <div className={"about-copy"}>
            <div className={"eyebrow"}>{"ABOUT ME"}</div>
            <h2>
              {"Reliable support."}
              <br />
              <span>{"Security in every step."}</span>
            </h2>
            <p>
              {
                "I'm Thisara Malinga, an IT professional and Cyber Security degree candidate who has completed the academic requirements at SLTC Research University. My experience includes supporting end users, troubleshooting hardware and software, resolving network and application issues, and maintaining IT asset records."
              }
            </p>
            <p>
              {
                "I bring a security-aware mindset to everyday IT operations, including careful data handling, secure equipment handovers, and practical system configuration."
              }
            </p>
            <div className={"experience-list"}>
              <div>
                <span className={"timeline-dot"}></span>
                <div>
                  <b>{"Executive"}</b>
                  <small>
                    {"InfoPride Solutions \u00b7 May 2025 \u2013 Present"}
                  </small>
                </div>
              </div>
              <div>
                <span className={"timeline-dot"}></span>
                <div>
                  <b>{"IT Technical Support Officer"}</b>
                  <small>
                    {
                      "Onimta Information Technology (Pvt) Ltd \u00b7 6-month role"
                    }
                  </small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className={"section"} id={"skills"}>
        <div className={"section-heading"}>
          <div>
            <div className={"eyebrow"}>{"TECHNICAL TOOLKIT"}</div>
            <h2>
              {"Skills built through "}
              <span>{"hands-on work."}</span>
            </h2>
          </div>
          <p>
            {"A snapshot of the technologies and capabilities listed in my CV."}
          </p>
        </div>
        <div className={"skills-layout"}>
          <div className={"skill-panel"}>
            <h3>{"IT & Systems"}</h3>
            <div className={"tags"}>
              <span>{"Windows"}</span>
              <span>{"Linux (Ubuntu/Kali)"}</span>
              <span>{"Hardware troubleshooting"}</span>
              <span>{"Software support"}</span>
              <span>{"Help desk"}</span>
              <span>{"IT asset management"}</span>
            </div>
          </div>
          <div className={"skill-panel"}>
            <h3>{"Network & Security"}</h3>
            <div className={"tags"}>
              <span>{"Nmap"}</span>
              <span>{"Wireshark"}</span>
              <span>{"Nessus"}</span>
              <span>{"Metasploit"}</span>
              <span>{"Burp Suite"}</span>
              <span>{"Firewall configuration"}</span>
              <span>{"TCP/IP"}</span>
              <span>{"Vulnerability assessment"}</span>
            </div>
          </div>
          <div className={"skill-panel"}>
            <h3>{"Development"}</h3>
            <div className={"tags"}>
              <span>{"Python"}</span>
              <span>{"JavaScript"}</span>
              <span>{"Java"}</span>
              <span>{"React"}</span>
              <span>{"Flask / Django"}</span>
              <span>{"MySQL"}</span>
              <span>{"Flutter"}</span>
              <span>{"Firebase"}</span>
            </div>
          </div>
        </div>
      </section>
      <section className={"projects-section"} id={"projects"}>
        <div className={"section"}>
          <div className={"section-heading"}>
            <div>
              <div className={"eyebrow"}>{"SELECTED WORK"}</div>
              <h2>
                {"Projects that show "}
                <span>{"how I think."}</span>
              </h2>
            </div>
            <p>
              {
                "Academic and technical projects demonstrating application development, security awareness, and systems integration."
              }
            </p>
          </div>
          <div className={"project-grid"}>
            <article className={"project-card"}>
              <div className={"project-number"}>{"01 / APPLICATION"}</div>
              <div className={"project-art art-map"}>
                <span>{"\u25ce"}</span>
                <div className={"route-line"}></div>
              </div>
              <h3>{"Dynamic Itinerary Optimization"}</h3>
              <p>
                {
                  "Cross-platform travel planning app integrating Google Maps routing, Firebase notifications, and personalized itinerary logic informed by machine learning principles."
                }
              </p>
              <div className={"tags"}>
                <span>{"Flutter"}</span>
                <span>{"Python"}</span>
                <span>{"Firebase"}</span>
                <span>{"Google Maps API"}</span>
              </div>
            </article>
            <article className={"project-card"}>
              <div className={"project-number"}>{"02 / WEB & SECURITY"}</div>
              <div className={"project-art art-code"}>
                <span>{"{ }"}</span>
                <span aria-hidden="true">↗</span>
              </div>
              <h3>{"Online Quiz System"}</h3>
              <p>
                {
                  "Web-based quiz system with user authentication and database access practices designed to protect user profiles and quiz data integrity."
                }
              </p>
              <div className={"tags"}>
                <span>{"React"}</span>
                <span>{"Python"}</span>
                <span>{"Flask / Django"}</span>
                <span>{"MySQL"}</span>
              </div>
            </article>
            <article className={"project-card"}>
              <div className={"project-number"}>{"03 / HARDWARE & VISION"}</div>
              <div className={"project-art art-robot"}>
                <span>{"\u25c9"}</span>
                <span aria-hidden="true">↗</span>
              </div>
              <h3>{"Colour Arrow Following Robot"}</h3>
              <p>
                {
                  "Collaborative computer-vision project using real-time image processing and hardware-software integration."
                }
              </p>
              <div className={"tags"}>
                <span>{"Python"}</span>
                <span>{"OpenCV"}</span>
                <span>{"Arduino"}</span>
              </div>
            </article>
          </div>
        </div>
      </section>
      <section className={"section education"}>
        <div className={"section-heading"}>
          <div>
            <div className={"eyebrow"}>{"EDUCATION & CREDENTIALS"}</div>
            <h2>
              {"Learning with "}
              <span>{"purpose."}</span>
            </h2>
          </div>
        </div>
        <div className={"education-row"}>
          <div className={"edu-icon"}>{"\u25a3"}</div>
          <div>
            <h3>
              {"BSc (Hons) in Information Technology \u2014 Cyber Security"}
            </h3>
            <p>
              {
                "SLTC Research University \u00b7 Academic requirements completed \u00b7 Graduation pending"
              }
            </p>
          </div>
          <span className={"edu-status"}>{"GRADUATION PENDING"}</span>
        </div>
        <div className={"education-row"}>
          <div className={"edu-icon"}>{"\u25a3"}</div>
          <div>
            <h3>{"Diploma in English"}</h3>
            <p>{"High School Institute \u00b7 Jan 2015 \u2013 Dec 2015"}</p>
          </div>
        </div>
        <p className={"fineprint"}>
          {
            "Additional education: G.C.E. Advanced Level \u2014 Engineering Technology Stream (2018); G.C.E. Ordinary Level (2015)."
          }
        </p>
      </section>
      <section className={"contact-section"} id={"contact"}>
        <div className={"section contact-layout"}>
          <div>
            <div className={"eyebrow"}>{"LET'S TALK"}</div>
            <h2>
              {"Need IT support?"}
              <br />
              <span>{"Let's solve it."}</span>
            </h2>
            <p>
              {
                "Tell me a little about your technical issue or business needs. I'll get back to you to discuss the next steps."
              }
            </p>
            <div className={"contact-details"}>
              <a href={"mailto:malingawelagedara523@gmail.com"}>
                <span>{"\u2709"}</span>
                {" malingawelagedara523@gmail.com"}
              </a>
              <a href={"tel:+94752652360"}>
                <span>{"\u260e"}</span>
                {" +94 75 265 2360"}
              </a>
              <div>
                <span>{"\u2316"}</span>
                {" Matale, Sri Lanka \u00b7 Remote inquiries welcome"}
              </div>
            </div>
          </div>
          <BusinessInquiry />
        </div>
      </section>
    </div>
  );
}
