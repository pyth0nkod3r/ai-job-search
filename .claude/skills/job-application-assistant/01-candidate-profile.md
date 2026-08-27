---
framework_version: 1.1.1
---

# Candidate Profile

## Identity
- **Name:** Miracle Anyanwu
- **Location:** Port Harcourt, Rivers, Nigeria (willing to relocate; open to remote or on-site)
- **Phone:** +2347034323113
- **Email:** mac.mkboy1@gmail.com
- **LinkedIn:** https://linkedin.com/in/macmkboy
- **GitHub:** https://github.com/pyth0nkod3r
- **Twitter:** https://twitter.com/macmkboy
- **Status:** Open to offers
- **Constraints:** Willing to relocate
- **CV language:** English (default; switch via `/setup --section search`)

### Languages

| Language | Level | Notes |
|----------|-------|-------|
| English | Native | Primary professional working language; all degree-level instruction, all remote work to date |
| Spanish | A1 (Beginner) | Self-study, beginner only - flagged in Language Gate |
| German | A1 (Beginner) | Self-study, beginner only - flagged in Language Gate |

## Education

| Degree | Year (graduation) | Institution | Key Topics |
|--------|-------------------|-------------|------------|
| BEng Electronic and Computer Engineering | 2021 (28 May 2021) | Nnamdi Azikiwe University, Awka, Anambra, Nigeria | Embedded systems, sensor integration, signal processing, ultrasonic sensing, network infrastructure |

> The cert is dated 2021; the BEng final-year project (ultrasonic-sensor navigation
> spectacles) is from 2018, when the candidate was in the final year of the
> programme. The 2018–2021 window appears to be the late stage of the BEng + early
> work transition (UNIZIK internship 2018, Montego 2023 sits much later after early
> work history).

## Research Experience

### BEng Final-Year Project — Sensor-Based Smart Navigation Spectacles for Visually-Impaired Persons
**Institution:** Nnamdi Azikiwe University, Awka
**Year:** 2018 (final year of BEng)
- Investigated the use of ultrasonic sensors in autonomous navigation systems, with the goal of building wearable navigation assistance for visually-impaired users.
- Focused on enhancing unassisted navigation through multi-sensor integration and acoustic feedback.
- Project report: https://drive.google.com/file/d/1fHH3ur6j6rsPVoCuQM8V16OAbUz7mh2/view?usp=sharing

## Professional Experience

### Frontend Developer (Freelance Contract) — Egoras Technologies Ltd
**Location:** On-site — Port Harcourt, Rivers, Nigeria
**Period:** January 2026 – Present
- Carrying out API testing and integration for the company's fintech product, validating released endpoints against the frontend to confirm every expected form field is captured and accurately processed before reaching the database.
- Building and improving UI/UX for the fintech platform.
- **Agentic AI capability (cube-os):** Built the backend of a prompt-to-web-app agent that takes a user's plain-language request and generates a Next.js application (full-stack or single-side) on demand. Also built the frontend interface for the app builder. Integrated into the existing cube-os product.

### Frontend Web Developer — GFA Technologies
**Location:** Remote — Abeokuta, Ogun, Nigeria
**Period:** January 2025 – Present *(part-time, evenings / contract, run in parallel with on-site engineering work)*
- Frontend engineering inside GFA's software agency, building interfaces for GFA clients.
- **Performance work (africacreativemarketglobal.com and acmhackathon.com):** Cut the JS bundle size by over 80% by decoupling image assets from the JavaScript bundle, converting PNG assets to WebP, and adding lazy-loading. Also contributed to feature development on these projects.
- Delivered modern, responsive web applications with semantic structure, following agile project planning and execution.

### Field Service Specialist Engineer — MP Infrastructure Limited
**Location:** On-site — Aba, Abia, Nigeria
**Period:** August 2024 – August 2025
- Installed, maintained, troubleshot and repaired passive telecommunication equipment at designated base transmission stations.
- Carried out planned preventive maintenance (PPM) on passive telecom equipment across the BTS portfolio.
- Operated within the field service operations team supporting the operator's network uptime targets.

### Frontend Developer Intern — Sand Technologies (ALX Ventures Partnership)
**Location:** Remote — San Francisco, CA, USA
**Period:** October 2024 – December 2024 (skills development agreement dated 1 Oct 2024)
- Collaborated with the frontend team to design and deliver a modern, responsive marketing site for Foovante Global under the ALX Ventures Partnership program.
- Three-month internship through ALX Ventures. Contract noted as "Skill Development Program" with discretionary $100 USD completion reward (per the SAND agreement, dated 1 Oct 2024).

### Ultrasonic Testing Technician — Montego Upstream Services
**Location:** On-site — Eleme, Rivers, Nigeria
**Period:** February 2023 – June 2023
- Conducted ultrasonic inspection tests on pipelines of varying thicknesses to quantify wall-thickness loss and corrosion extent.
- Interpreted piping and instrumentation diagrams (P&ID) and produced isometric sketches of tested pipelines to support inspection reporting.
- Operated Olympus Epoch 600 ultrasonic flaw detector, UTG (ultrasonic thickness gauge), Eddyfi Teletest Focus, magnetic particle testing gear.
- **NDE UT Level II certification** (Raydalink Limited, 12 Nov 2021, ASNT SNT-TC-1A 2015 Edition, valid until 11 Nov 2026) supports this line of work — 80 hrs training, 2 yrs experience recorded at issue.

### Network Engineering Intern — Nnamdi Azikiwe University
**Location:** On-site — Awka, Anambra, Nigeria
**Period:** April 2018 – November 2018
- Assisted the university's network engineering team with design, implementation, installation, configuration, maintenance and troubleshooting of campus network infrastructure and the Eduroam service.

## Independent Projects

### Podcast Downloader Pipeline — Data Engineering Capstone (3MTT × Data Science Nigeria × WesOnline, DeepTech Ready Cohort 2)
**Live dashboard:** http://macmkboy.dpdns.org
**Repository:** https://github.com/pyth0nkod3r/podcast-downloader-pipeline
**Program:** DeepTech Ready Mentorship, Cohort 2 (completed 25 May 2026)
- An automated ETL pipeline that fetches, parses, cleans and stores podcast metadata from 450+ RSS feeds across 17 categories every 6 hours.
- **Infrastructure (self-hosted):** 5 Docker services — pgdatabase, kestra, pgadmin, streamlit — on an Azure B2s VM (2 vCPU, 4 GB RAM, Debian 12), deployed via Coolify (self-hosted PaaS, Traefik reverse proxy, custom domain).
- **Orchestration:** 8 Kestra flows (4 for PostgreSQL, 4 for Azure SQL). Each pipeline stage is a flow: `init-schema` (12+ SQL views) → `seed-feeds` → `ingest-metadata` (every 6 h) → `refresh-analytics`. Custom Python translator converts Postgres SQL to T-SQL for the Azure SQL failover.
- **Data:** 19 metadata fields per episode, parsed from raw XML; SQL MERGE (upsert) used to handle feed refreshes without duplicates.
- **Streamlit dashboard:** KPIs, show-and-trend analytics, publishing heatmap (peak: Wednesdays 08:00-10:00), Pipeline Health and Feed Health observability tabs, self-healing feed auto-disable after 5 consecutive failures.
- **CI/CD:** GitHub Actions validates YAML via yamllint and deploys flows to Kestra; SMTP email notifications on deploy success/failure; Coolify webhook auto-rebuilds the Streamlit app on push.
- **Resilience:** Auto-failover from local Postgres to Azure SQL if local DB is down; user is warned in the Streamlit sidebar when the failover is active.
- **Cost control:** Spot-instance VM with auto-shutdown rules.

### Eka Legal — End-to-End Legal Consultation App
**Live:** https://eka-legal.onrender.com
- Full-stack web application. Users can register, log in, book appointments, upload documents, and chat with the admin.
- Admin: invited via dedicated link, manages user documents, responds to client chat and support messages, confirms appointments, and updates users on case state.
- Stack: backend + frontend (Django / DRF + relational database per skill profile).

### Interview Platform — End-to-End Coding Interview App
**Live:** https://interview-platform-f5n3.onrender.com/
- Real-time coding interview platform. Users register and join interview sessions via an interviewer-generated link.
- Features: interactive code editor with syntax highlighting, live video streaming, live chat with notifications, results panel for coding-test output.
- Interviewer controls: generate sessions, toggle live video, deactivate user editor, observe candidate code in real time.

### Africa Creative Market Hackathon — Frontend Web App
**Live:** https://acm-hackathon.vercel.app/
- User registration for hackathon teams; organization-as-partner registration; contact-channel to admins. API fully integrated with backend services and database.

### Africa Creative Market Hackathon — Admin Frontend
- Admin login, view registered teams / user messages / partnership requests, PDF/CSV data export, message response.

### Other live projects
- Commuta Forum: https://commuta.vercel.app
- Science of Trade Conference: https://scienceoftradeconference.com
- AFCFTA Hackathon: https://afcftahackathon.com
- Africa Creative Market main site: https://africacreativemarket.netlify.app
- More at: https://github.com/pyth0nkod3r

## Technical Skills

### Programming & IT
- **HTML / CSS** — fluent
- **Tailwind / Bootstrap** — fluent
- **JavaScript** — fluent
- **React** — fluent
- **Python** — fluent (5-course U-Mich specialization + Meta Professional Certificate track)
- **Django / DRF** — fluent (Meta Django Web Framework, Aug 2023; The Full Stack, May 2024; Back-End Developer Capstone, Jun 2024)
- **MySQL / PostgreSQL** — fluent
- **SQL / T-SQL** — working proficiency (incl. cross-dialect translation: Postgres ↔ T-SQL in the Podcast Pipeline)
- **Git / GitHub** — fluent (active contributor; GitHub Actions CI/CD)
- **Linux / WSL** — comfortable
- **Docker** — fluent (5-service production deployment on Azure VM, plus local dev environments)
- **Kestra / Airflow** — working proficiency (chose Kestra over Airflow in the Podcast Pipeline for the YAML cleanliness)
- **Streamlit** — fluent (production dashboard at macmkboy.dpdns.org)
- **Microsoft Azure / AWS** — Azure: foundational (DP-900 + AI-900, both June 2024); VM deployment, Azure SQL as failover target
- **CI/CD (GitHub Actions)** — working proficiency (yamllint, deploy flows, SMTP notifications)
- **Coolify** — working proficiency (self-hosting PaaS for the Podcast Pipeline stack)
- **OOP** — fluent
- **REST API integration** — fluent
- **Microsoft Office** — fluent
- **Meta Backend / Full Stack track** — complete (Intro to Front-End, Programming in Python, Version Control, Django, The Full Stack, Back-End Developer Capstone)
- **AI tooling** — working proficiency (AI DevTools Zoomcamp, DataTalks.Club, Feb 2026 — agents, MCP, automation)

### Engineering & Tools (Niche)
- Ultrasonic Thickness Gauge (UTG) — NDE Level II certified, ASNT SNT-TC-1A 2015
- Olympus Epoch 600 Ultrasonic Flaw Detector
- Eddyfi Teletest Focus
- P&ID interpretation
- Isometric sketching
- Magnetic Particle Testing
- Digital Multimeter
- Galooli RMS

## Certifications

### Microsoft / Azure
| Certification | Issuer | Date | Notes |
|---|---|---|---|
| Microsoft Certified: Azure Data Fundamentals (DP-900) | Microsoft (Certiport) | 18 Jun 2024 | Score: 895/700; Transcript ID wkPEv-2FMV |
| Microsoft Certified: Azure AI Fundamentals (AI-900) | Microsoft (Certiport) | 28 Jun 2024 | Score: 795/700; Transcript ID 5xmG-4wBC |

### Python / University of Michigan (Coursera)
| Certification | Issuer | Date | Specialization |
|---|---|---|---|
| Python for Everybody Specialization (5 courses) | University of Michigan / Coursera | 10 Sep 2021 | Specialization ID V26M93X6SWC7 |
| – Programming for Everybody (Getting Started with Python) | U-Mich / Coursera | 26 Apr 2021 | |
| – Python Data Structures | U-Mich / Coursera | 13 Jun 2021 | |
| – Using Python to Access Web Data | U-Mich / Coursera | 6 Jul 2021 | |
| – Using Databases with Python | U-Mich / Coursera | 7 Sep 2021 | |
| – Capstone: Retrieving, Processing, and Visualizing Data with Python | U-Mich / Coursera | 10 Sep 2021 | |

### Meta Backend / Full Stack (Coursera)
| Certification | Issuer | Date |
|---|---|---|
| Introduction to Front-End Development | Meta / Coursera | 14 Jul 2023 |
| Programming in Python | Meta / Coursera | 6 Mar 2023 |
| Version Control | Meta / Coursera | 5 Apr 2023 |
| Introduction to Back-End Development | Meta / Coursera | 24 Dec 2022 |
| Django Web Framework | Meta / Coursera | 8 Aug 2023 |
| Introduction to Databases for Back-End Development | Meta / Coursera | 19 Jul 2023 |
| The Full Stack | Meta / Coursera | 3 May 2024 |
| Back-End Developer Capstone | Meta / Coursera | 19 Jun 2024 |
| APIs | Meta / Coursera | 25 Mar 2024 |

### Other Coursera / Online
| Certification | Issuer | Date |
|---|---|---|
| Crash Course on Python | Google / Coursera | 8 Jan 2022 |
| Python Data Structures (alt listing) | U-Mich / Coursera | 13 Jun 2021 |
| Python Basics: Create a Guessing Number Game (project) | Coursera Project Network | 3 Nov 2021 |
| Beginning with Me | The American Dream Academy / Coursera | 11 Dec 2022 |

### Programs / Capstones
| Certification | Issuer | Date | Notes |
|---|---|---|---|
| AI DevTools Zoomcamp | DataTalks.Club | 9 Feb 2026 | Certificate #13C604; AI agents, automation, MCP |
| Aspire Leaders Program | Aspire Institute (Harvard-based) | Nov 2024 | 30 hrs coursework; critical thinking, communication, social impact |
| DeepTech Ready Mentorship, Cohort 2 (Data Engineering) | 3MTT × Data Science Nigeria × WesOnline | 1 Dec 2025 (completion); 25 May 2026 (capstone presentation) | Data engineering track; capstoned with the Podcast Downloader Pipeline |
| Code in Place (CS106A) | Stanford University | 20 Apr – 5 Jun 2025 | Diagnostic Badge + Final Project Badge |

### Engineering / Field
| Certification | Issuer | Date | Notes |
|---|---|---|---|
| NDE Ultrasonic Testing Level II (per ASNT SNT-TC-1A 2015) | Raydalink Limited | 12 Nov 2021 | Cert RDL/UT/11/18/21; valid until 11 Nov 2026; 80 hrs training, 2 yrs experience; composite score 81.63 |

### Professional Membership
| Membership | Issuer | Notes |
|---|---|---|
| Project Management certification (CIPMN, via ITF's SUPA programme) | Chartered Institute of Project Managers of Nigeria (CIPMN) | Registration No. SUPA/NO.08972 — issued through ITF's Skill-Up Artisans programme, which included project management among its courses |

## Awards
- None recorded at this time.

## References
- Available on request. The Sand Technologies / ALX Ventures Skills Development Agreement (1 Oct 2024) is on file under `documents/references/`.

## Notes for the Drafter
- The candidate is a **bridge profile** spanning frontend, full-stack, data engineering, and field-engineering work. The strongest differentiators in priority order:
  1. **Egoras prompt-to-app agent** (agentic AI product, current)
  2. **Podcast Downloader Pipeline** (full data engineering project with live dashboard, Azure-VM production deployment, Docker + Kestra + Postgres + Streamlit + Azure SQL failover, CI/CD, self-healing)
  3. **Eka Legal / Interview Platform** (full-stack end-to-end ownership)
  4. **GFA 80%+ JS bundle cut** (quantified performance win)
  5. **NDE UT Level II** (real engineering certification, not just exposure)
- The Podcast Pipeline is a recent, fully-built, live data engineering project — it is now a *stronger* fit signal than Eka Legal for any data engineering / analytics role, and the drafter should re-prioritize accordingly. For DE roles, lead with the pipeline. For full-stack / frontend roles, lead with Eka Legal / Interview Platform / GFA. For agentic AI, lead with the cube-os agent.
- Cross-discipline markers (UTG, P&ID, BTS) are evidence of operating in physical-infrastructure environments, not filler. Include on the CV when the role benefits; keep in the profile when irrelevant.
- "Continuously learning" is now well-grounded: 16+ Coursera certs across 3 institutions, Stanford CS106A, 3MTT DeepTech Ready, Aspire Leaders Program, AI DevTools Zoomcamp. Self-funded.
- Spanish and German are A1-only. The Language Gate will flag any posting that requires them. Do not auto-reject — surface to the user.
- The Sandbox agreement (SKILL-3) explicitly notes the work was unpaid (skills development, $100 USD discretionary completion reward) — frame as internship/skills-development program, never as paid employment.
- The Portfolio's "What I Am Learning" section is a strong fit signal for growth-stage roles: Data Engineering, Backend Architecture, DevOps & Cloud, AI & Automation. Use it as evidence of direction-of-growth when the posting's "nice to haves" overlap.
- The candidate's strongest honest claim is now: **"end-to-end product engineer with a live, deployed data pipeline and an agentic AI product in production."** Recompute the strong-fit profile statements in `05-cv-templates.md` to reflect this.
