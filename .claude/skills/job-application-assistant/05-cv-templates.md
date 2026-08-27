---
framework_version: 1.2.6
---

# CV Templates

## Profile Statement Templates

These are role-flavored openers for the master CV. Pick the one whose opening sentence
structure matches the posting's core ask. Never stack or splice them. Each is grounded in
the candidate's actual data.

### Template A — Full-Stack Engineer (default, most postings)

> Full-stack engineer with a BEng in Electronic and Computer Engineering and a record of
> shipping end-to-end products — from a BEng thesis on ultrasonic-sensor navigation, to
> Eka Legal and the Interview Platform, to a Next.js prompt-to-app agent integrated into
> a fintech product. Comfortable owning the surface area from API to UI, and happy to
> pair that with performance work that ships measured wins (cut a client's JS bundle by
> 80%+ through asset decoupling, format conversion, and lazy-loading). Open to roles
> that value a generalist who can carry both software and adjacent systems thinking.

### Template B — Frontend-leaning role

> Frontend engineer with three years building React/Next.js interfaces for fintech,
> hackathon platforms, and client SaaS products. Owned the frontend for Eka Legal
> (end-to-end legal consultation), the Interview Platform (real-time coding interviews
> with live video and code sync), and a prompt-to-app agent built into the cube-os
> fintech product. Most recent performance work: 80%+ JS bundle cut on
> africacreativemarketglobal.com by decoupling image assets from the JS bundle, swapping
> PNG to WebP, and adding lazy-loading.

### Template C — Agentic AI / AI Engineer (when posting mentions LLM, agents, builders)

> Software engineer with hands-on agentic product experience: built the backend of a
> Next.js prompt-to-web-app agent that takes a plain-language request and ships a working
> full-stack or single-side app, integrated into the cube-os fintech product. The
> implementation lives in production alongside frontend, API, and CI/CD work I also own
> across the rest of the cube-os surface area. BEng in Electronic and Computer
> Engineering; my path into AI came through shipping full-stack first, not through
> research.

### Template D — Embedded / IoT / Hardware-adjacent software

> Software engineer with a BEng in Electronic and Computer Engineering and a final-year
> project on ultrasonic-sensor navigation for visually-impaired users. ASNT-aligned
> NDE Ultrasonic Testing Level II (per SNT-TC-1A 2015), with 2+ years of UT field
> experience on pipelines. Since then I've built software (Django/React/Next.js
> full-stack, agentic AI in production) while carrying forward the systems-engineering
> instincts from the degree and from field engineering work on telecom base stations.

### Template E — Data Engineer / Analytics (NEW; was missing before Podcast Pipeline)

> Data engineer with a production-grade end-to-end pipeline I built and operate solo:
> fetches, parses, and stores podcast metadata from 450+ RSS feeds across 17
> categories every 6 hours, with a live Streamlit dashboard at macmkboy.dpdns.org.
> Self-hosted on Azure (5 Docker services via Coolify, Kestra orchestration, Postgres
> primary with Azure SQL failover, GitHub Actions CI/CD, SMTP failure notifications,
> self-healing feed handling). Completed the 3MTT × Data Science Nigeria × WesOnline
> DeepTech Ready data engineering program. Comfortable owning the stack end-to-end
> from RSS ingestion to SQL views to dashboard — and happy to pair that with the
> full-stack and agentic AI work in the rest of my portfolio.

### Template F — Early-career graduate (no specific leaning)

> BEng Electronic and Computer Engineering (Nnamdi Azikiwe University, Awka), now a
> full-stack engineer with three years across software, data engineering, and field
> engineering. Most recent: freelance frontend on the cube-os fintech product (UI, API
> testing, integration), with an agentic prompt-to-app builder shipped as a feature
> inside it. Before that: the Podcast Downloader Pipeline (a self-built, deployed,
> monitored data engineering project), the Eka Legal legal-consultation app, the
> Interview Platform, and frontend at GFA Technologies.

## Selection Rule

The drafter picks the template whose opening sentence structure matches the posting's
core ask:

- **"Full-Stack Engineer" / "Software Engineer"** → Template A
- **"Frontend" / "React" / "Next.js"** → Template B
- **"AI Engineer" / "Agentic" / "LLM" / "Prompt-to-X"** → Template C
- **"Embedded" / "IoT" / "Sensor" / "Robotics"** → Template D
- **"Data Engineer" / "Analytics" / "ETL" / "Pipeline" / "Python"** → Template E
- **No clear leaning / early-career / general SDE** → Template F (or A)

Never use a template whose primary claim is unsupported by the role's actual demands.
"Agentic" wording in a posting that is a straightforward frontend role is stretch, and
the drafter should drop down to Template A or B. "Data engineer" wording in a
straightforward backend role is also stretch — drop to Template A.

The candidate's strongest honest claims, in order:
1. **End-to-end product engineer with a live, deployed data pipeline and an agentic AI
   product in production** (Templates A, C, E)
2. **Full-stack with hardware/embedded exposure** (Template D)
3. **Quantified performance win (80%+ bundle cut)** (Template B)
4. **Continuously learning generalist** (Template F)

## Other CV Content Notes

- **Certifications section**:
  - Azure certs (DP-900, AI-900, both June 2024) — include when the posting's domain
    touches cloud, data, or AI; omit when irrelevant.
  - Python for Everybody Specialization (Sep 2021) — include for Python roles; keep
    brief (one line: "5-course specialization, U-Mich") rather than listing all 5.
  - Meta Backend / Full Stack track (2022–2024) — include for backend / full-stack
    roles; can be condensed to a single line "Meta Backend / Full Stack
    Professional Certificate track (8 courses, 2022–2024)".
  - Stanford Code in Place (2025) — strong signal; one line.
  - 3MTT DeepTech Ready (Dec 2025) — include for data / DE roles; tie directly to
    the Podcast Pipeline project.
  - Aspire Leaders Program (Nov 2024) — soft signal; include when the posting
    values leadership / critical thinking / global context.
  - AI DevTools Zoomcamp (Feb 2026) — include for AI engineering / agentic roles.
  - NDE UT Level II (Nov 2021) — include only for hardware-adjacent, NDT, oil &
    gas, energy, infrastructure roles. Real certification, not exposure.
  - CIPMN PM cert (SUPA programme) — list alongside the technical certs as
    "Project Management certification (CIPMN, via ITF's SUPA programme) — Reg.
    No. SUPA/NO.08972".
  - 16 Coursera course certs (2021–2024) — DO NOT list individually on the
    CV. The Meta track and the U-Mich Python specialization are the
    recruiter-facing representations. The full file set stays in
    `documents/certifications/` for the drafter to reference.
- **Engineering & Tools (Niche) block**: include for hardware-adjacent, telecom, NDT,
  energy, oil & gas, infrastructure roles. Omit for pure consumer-product software
  roles where the UTG / P&ID line reads as noise.
- **Research Experience line**: include the BEng thesis for hardware-adjacent and
  research-engineering roles. Optional for pure-software roles where it adds little.
- **Other live projects block** (Commuta, Science of Trade, AFCFTA, ACM main site):
  include as a one-line list. These are shipping evidence, not a portfolio — keep them
  condensed.
- **Independent Projects block**: lead with the Podcast Downloader Pipeline (it's
  the strongest current technical artifact), then Eka Legal, then Interview Platform.
  The data pipeline is the "show, don't tell" piece.
