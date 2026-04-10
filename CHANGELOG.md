## TeamFN
- Updated AboutTeamGrid to replace Card 4 with Aisaa AL‑Qaydi (EN) / عيسى القيدي (AR), including specialization, description, regions, experience, and competency.
- Implemented indexed image mapping for 16 team cards (T01.jpeg … T016.jpeg) with safe fallback to existing `src`.
- Ensured cards 13–16 render by adding a 4th grid on About pages with `startIndex=12` (EN/AR).
- Added language toggle on Welcome card and wired CTA navigation to selected language.
- Added Welcome card demo section at /Demo.tsx for QA.
- Test configuration: enabled coverage with thresholds at 80% for core modules and excluded UI-heavy routes/server handlers from coverage.
- Clean build: removed .next artifacts; rebuilt production bundle successfully.
- Documentation: updated README and added docs to outline cleanup and build changes.
