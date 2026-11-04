## 2026-11-04T12:13:36Z
You are E2E Test Writer 1.
Your working directory is /home/pwn/geo-engine/.agents/teamwork/test_writer_e2e_1.
You MUST read /home/pwn/geo-engine/.agents/teamwork/ORIGINAL_REQUEST.md first (especially the section starting at line 149).
Also read /home/pwn/geo-engine/.agents/teamwork/orchestrator_5/TEST_INFRA.md.

Examine existing test scripts in `scripts/` (such as `scripts/clinician-browser-journey.mjs`) and `tests/` for Playwright patterns with Chrome executable `/run/current-system/sw/bin/google-chrome`.

Your mission is to write a comprehensive, automated headless Chrome test suite in `scripts/verify-nexus-v5.mjs`:
1. Use Playwright (`playwright` / `rebrowser-playwright`) with `executablePath: '/run/current-system/sw/bin/google-chrome'` and `headless: true`.
2. Listen to `page.on('console')` and `page.on('pageerror')` to record all console output and assert 0 console errors.
3. Test all requirements:
   - R1: Hero headline exact match ("Ensure AI Search Recommends Your Clinic Over Local Competitors"), exact subheadline match, CTA button "[ Request Your Zip Code Audit ]", smooth scrolling to `#audit-intake` and focus on `#practiceName`.
   - R2: Verify the 4 clinical growth pillars are visible with exact titles (Geo-Visibility Grid Tracking & Zip Code Benchmarking, 0-Error MedicalClinic Schema ASTs, Automated Review Loops & Front-Desk Engine, Strict Zip Code Exclusivity).
   - R3: Doctor intake card with all 6 fields (practiceName, doctorName, domain, cityZip, email, phone). Test empty submission -> validation error. Test valid submission -> check POST to `/api/lead` returns 200 with dispatch to `name@nexusrank1.com` -> check in-card confirmation state and sonner toast.
   - R4: ROI Math section: assert $20,000 to $50,000 full-arch case values, click each of the 4 specialty toggles (All-on-4 Implants, Facial Plastic Surgery, Orthopedics, MedSpa), verify dynamic calculations update.
   - R5: Clinical FAQ section: verify Medical Board Compliance, HIPAA Zero-PHI, and 48-Hour deployment answers.
   - Multi-viewport tests: Desktop (1440x900), Tablet (768x1024), and Mobile (375x812).
   - Static export verification: Serve `dist-netlify/` using an ephemeral Node.js `http` server on an unused port (e.g. 3457), load with headless Chrome, assert HTTP 200, proper DOM render, and 0 console errors.
4. When `scripts/verify-nexus-v5.mjs` is written and ready, create `/home/pwn/geo-engine/.agents/teamwork/orchestrator_5/TEST_READY.md` documenting test suite execution command, test inventory, and coverage.
5. Write your handoff report to `/home/pwn/geo-engine/.agents/teamwork/test_writer_e2e_1/handoff.md`.
6. Send a message back to the orchestrator when finished.
