# /set-market - Switch the Target Country/Market for the Job Search

You are switching the workspace's active job-search market. The user provides a market
code or name as `$ARGUMENTS` (e.g. `/set-market uk`, `/set-market Canada`,
`/set-market de`). With no arguments, list the available markets from
`markets/README.md` and ask the user to choose.

The market system is additive: everything market-specific lives in `markets/` and in the
portal skills' `enabled:` frontmatter flags. Core workflow specs in `.claude/skills/`
are never edited by this command.

Follow these steps **in order**.

---

## Step 0: Resolve the Market

1. Read `markets/README.md` (the index) to map the user's input to a market code.
2. Read `markets/<code>.md` for the resolved market. If there is no such file, say so,
   offer the closest match, and stop. Never invent a market file's contents.
3. Read the current state from `markets/CURRENT.json` (create with `{"code": null}` if
   missing). If the requested market is already active, confirm and stop.

## Step 1: Show the Market Summary and Confirm

Present to the user before changing anything:

- Country, languages, default CV language
- The portal skills that will be **enabled** (those listed in the market file that are
  already installed under `.agents/skills/`)
- The portal skills that are **not installed yet** and where they come from (source fork
  + path). Fetching third-party code requires the user's explicit approval — see Step 2.
- Portal skills that will be **disabled** (currently enabled portals not listed in the
  market file — including the Danish demo boards when leaving the Denmark market)
- The CV conventions highlights from the market file

Ask: "Switch to this market?" If no, stop.

## Step 2: Install Missing Portal Skills (only with explicit approval)

For each portal the market file lists that is not yet installed:

1. State the source fork, the path (`.agents/skills/<portal>-search`), and any ToS/robots
   note from the market file.
2. Fetch the portal skill folder's contents (SKILL.md and `cli/`) from the source fork.
3. **Review before installing.** Check the CLI source for: honest identifying User-Agent,
   robots.txt compliance, no credential exfiltration, no unexpected outbound endpoints.
   Summarize the review for the user in 2-3 lines.
4. Copy the folder into `.agents/skills/` only after the user approves this specific
   portal. If the user declines, leave it out and note it — the market still works via
   WebSearch fallback and the remaining portals.
5. Set `enabled: true` in the installed skill's frontmatter.

## Step 3: Flip Portal Enabled Flags

For every portal skill installed under `.agents/skills/`:

- `enabled: true` if the portal is listed in the market file
- `enabled: false` otherwise (with a one-line comment `# disabled: not in <code> market`)

This is what actually routes `/scrape` — it auto-discovers portals and honors the toggle.
Report the final enabled/disabled table to the user.

## Step 4: Update Profile Locale

Update the locale-dependent profile fields (these live in `CLAUDE.md` and
`.claude/skills/job-application-assistant/01-candidate-profile.md` — keep the two in
agreement):

- **Location** — ask the user for their city/region in the new market (do not reuse the
  old country's location). Update `[YOUR_CITY]`/`[YOUR_COUNTRY]` equivalents.
- **CV language** — set from the market file's default unless the user says otherwise.
- **Languages table** — flag any market language the profile does not declare.
- **Deal-breakers** — leave untouched, but surface any market file notes that interact
  with them (e.g. visa sponsorship registers where relevant).

Also update market-dependent example cities in `.claude/skills/job-scraper/search-queries.md`
if its queries name locations.

## Step 5: Record and Report

1. Write `markets/CURRENT.json` with `{"code": "<code>", "switched": "<ISO date>"}`.
2. Append a line to `CHANGELOG.md`'s local section if one exists — no, skip changelog
   edits; instead report the switch summary:
   - active market
   - portals enabled / disabled / newly installed
   - profile fields changed
   - conventions the drafting workflow will now follow (from the market file)
3. Remind the user: previously scraped postings and the tracker are history, not
   garbage — `/rank` still scores them; nothing needs deleting.

## Guardrails

- Never delete a portal skill directory during a market switch — only flip flags.
  Installing and uninstalling both need explicit user approval; flag-flipping does not.
- Third-party portal code is never installed without the Step 2 review + approval.
- The Danish demo boards ship `enabled: false` — the Denmark market file simply lists
  them as enabled-at-activation.
- If the user wants a market with no file yet, guide them: the market file format is
  documented in `markets/README.md`, and new portal skills are generated with
  `/add-portal` following the portal-skill contract.
