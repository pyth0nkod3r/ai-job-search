---
framework_version: 1.2.6
---

# Interview Prep

## STAR Candidates (Complete Manually)

The candidate should fill in the S/T/A/R for each before using in interviews. The
situation, task, and result skeleton below is grounded in profile data; the candidate
owns the specific numbers, dates, and details.

### 1. Cube-OS Agentic App Builder (Egoras) — agentic AI product work

- **Source:** Egoras freelance role, 2026, current
- **What happened:** Built the backend of a prompt-to-app agent inside the cube-os
  fintech product — the agent takes a user's natural-language request and ships a
  working Next.js app (full-stack or single-side). Also built the frontend interface
  for the app builder.
- **Why it matters:** STARTER for "tell me about an AI/agent project you built", "describe
  a feature you owned end-to-end", "how do you integrate AI into a product?".
- **S/T/A/R stub:**
  - Situation: cube-os needed a way for users to generate a working web app from a prompt,
    on top of the existing fintech product surface.
  - Task: Owned the implementation — both the agent's backend and the user-facing
    interface — without a senior engineer hand-holding.
  - Action: Built the Next.js prompt-to-app agent end-to-end and shipped it inside the
    product. (Candidate to add: how the prompt was structured, how output was validated,
    how the model was chosen, what the iteration cycle looked like.)
  - Result: (Candidate to add: how many apps built, what user feedback landed, what
    shipped downstream.)

### 2. GFA Bundle Cut (africacreativemarketglobal.com) — performance engineering

- **Source:** GFA Technologies, 2025 onward
- **What happened:** Cut the JS bundle size by over 80% on africacreativemarketglobal.com
  and acmhackathon.com by decoupling image assets from the JS bundle, converting PNG to
  WebP, and adding lazy-loading.
- **Why it matters:** STARTER for "describe a performance win", "tell me about a
  measurable improvement you shipped", "frontend optimization".
- **S/T/A/R stub:**
  - Situation: The client site shipped with a heavy JS bundle dominated by image
    references, hurting time-to-interactive and Lighthouse scores.
  - Task: Reduce bundle size and improve perceived load time.
  - Action: Decoupled image assets out of the JS bundle, converted PNG assets to WebP,
    added route-level lazy-loading. (Candidate to add: before/after Lighthouse numbers,
    before/after bundle size in KB, before/after TTI / TBT if measured.)
  - Result: 80%+ bundle size reduction. (Candidate to add: Lighthouse score change,
    user-facing metric change, any business impact.)

### 3. Egoras API Integration — collaborative testing

- **Source:** Egoras freelance role, 2026
- **What happened:** During the cube-os frontend↔backend integration, validated released
  endpoints against the frontend to confirm every expected form field was captured and
  accurately processed before reaching the database. Surfaced mismatches to the backend
  developer.
- **Why it matters:** STARTER for "describe a time you caught a bug before it shipped",
  "how do you work with backend engineers", "describe a cross-functional collaboration".
- **S/T/A/R stub:**
  - Situation: cube-os's frontend design specified a set of form fields; the backend
    implementation was being developed in parallel by another engineer.
  - Task: Catch field-mapping bugs before they hit the database.
  - Action: Tested each released endpoint against the frontend contract; surfaced
    mismatches with the backend developer before integration was finalized. (Candidate
    to add: how many endpoints, how many rounds of iteration, what tooling.)
  - Result: (Candidate to add: bugs caught, rework avoided, integration velocity gain.)

### 4. Field Service Engineering at MP Infrastructure — systems / operations

- **Source:** MP Infrastructure Limited, 2024-2025
- **What happened:** Installed, maintained, troubleshot, and repaired passive telecom
  equipment at base transmission stations. Ran planned preventive maintenance across
  the BTS portfolio.
- **Why it matters:** STARTER for "describe field experience", "how do you handle
  operational pressure", "tell me about a time you diagnosed a problem under time
  pressure".
- **S/T/A/R stub:**
  - Situation: (Candidate to add.)
  - Task: (Candidate to add.)
  - Action: (Candidate to add: specific BTS, specific issue, specific fix.)
  - Result: (Candidate to add: uptime outcome, escalation count, time-to-repair.)

### 5. Interview Platform — full-stack ownership

- **Source:** Independent project, 2024-2025 (live at
  https://interview-platform-f5n3.onrender.com/)
- **What happened:** Built a real-time coding interview platform end-to-end: user
  registration, session-link joining, interactive code editor with syntax highlighting,
  live video streaming, live chat, and a results panel for coding-test output.
  Interviewer-side controls: generate sessions, toggle live video, deactivate user
  editor, observe candidate code in real time.
- **Why it matters:** STARTER for "describe an end-to-end project you owned",
  "tell me about a real-time application you built", "have you shipped something
  with WebRTC / live collaboration?".
- **S/T/A/R stub:**
  - Situation: (Candidate to add: what problem this solved for you or for users.)
  - Task: (Candidate to add: scope of the build, the hardest part.)
  - Action: (Candidate to add: stack choices, what was hard, what you'd do differently.)
  - Result: (Candidate to add: users, usage, any interviews actually conducted on it.)

## Common Interview Questions — Quick Answers (grounded in profile)

> "Why are you looking to leave your current role?"
Open to offers because I'm looking for a role with more scope and a stronger AI/agentic
product surface. The cube-os app builder at Egoras is the kind of work I want to do more
of, and the right full-time role will let me focus there.

> "Tell me about a time you worked across disciplines."
BEng in Electronic and Computer Engineering → NDT inspection on pipelines → telecom BTS
field engineering → full-stack software → agentic AI product work. The through-line is
"end-to-end ownership with systems thinking" — software that has to interact with the
physical world, or with users, in a way you can ship and see.

> "What's the biggest technical win on your CV?"
Cutting a client's JS bundle by 80%+ on africacreativemarketglobal.com — three concrete
moves (asset decoupling, PNG→WebP, lazy-loading) with a measured before/after.

> "Where do you see yourself in 3-5 years?"
In a role with more scope — technical lead, founding engineer, or product engineer with
end-to-end ownership — at a company that values full-stack generalists and is building
something at the intersection of AI and a real product surface.

> "Why are you willing to relocate?"
Early career, no dependents tied to a specific city, and the strongest opportunities for
this kind of profile are in markets outside Nigeria. Port Harcourt is home but not the
limit.

## Calibration From Past Applications

- No prior applications in `documents/applications/`. Calibration will populate after the
  first `/outcome` records land.
