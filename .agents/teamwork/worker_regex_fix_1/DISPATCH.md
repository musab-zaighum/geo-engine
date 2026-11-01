## 2026-11-01T15:16:18Z
You are worker_regex_fix_1.
Your working directory is: /home/pwn/geo-engine/.agents/teamwork/worker_regex_fix_1/
Read /home/pwn/geo-engine/.agents/teamwork/ORIGINAL_REQUEST.md.
Read /home/pwn/geo-engine/.agents/teamwork/challenger_v4_1/handoff.md for the exact reproduction and defect details.

MANDATORY INTEGRITY WARNING:
DO NOT CHEAT. All implementations must be genuine. DO NOT hardcode test results, create dummy/facade implementations, or circumvent the intended task. A teamwork_preview_auditor will independently verify your work. Integrity violations WILL be detected and your work WILL be rejected.

Your task:
Fix the domain protocol stripping defect identified by challenger_v4_1:
1. In `src/components/InstantAuditBar.tsx`:
   - Locate the domain sanitization logic (around lines 195-205).
   - Update regexes to use the `/i` case-insensitive flag:
     `.replace(/^https?:\/\//i, '').replace(/^www\./i, '').replace(/\/.*$/, '').trim().toLowerCase()`
   - Ensure uppercase protocol inputs like `HTTPS://DENTALPRACTICE.COM` or `HTTP://MYCLINIC.COM` strip the protocol and result in clean domains like `dentalpractice.com`.
2. In `src/app/api/report/pdf/route.ts`:
   - Locate line 30 where domain is stripped:
     `.replace(/^https?:\/\//i, '').replace(/^www\./i, '').replace(/\/.*$/, '').trim().toLowerCase()`
   - Ensure the `/i` flag is present.
3. Test with node or curl to verify that uppercase URLs sanitize perfectly to clean lowercase domains.
4. Run `npx tsc --noEmit` and confirm 0 TypeScript errors.
5. Run `npm run build` and confirm all 15/15 routes compile cleanly.

Document your changes and verification in /home/pwn/geo-engine/.agents/teamwork/worker_regex_fix_1/handoff.md and send a completion message back to the orchestrator.
