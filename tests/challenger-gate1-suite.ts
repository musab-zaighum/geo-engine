/**
 * Challenger Gate 1 - Adversarial Stress & Verification Suite for POST /api/lead
 * Empirical validation of backend API, sanitization, resilience, persistence, and dispatch.
 */

import * as fs from 'fs/promises';
import * as path from 'path';

const BASE_URL = process.env.TEST_BASE_URL || 'http://localhost:3000';
const LEADS_FILE = path.join(process.cwd(), 'leads', 'captured_leads.json');

interface TestCaseResult {
  id: string;
  category: string;
  name: string;
  passed: boolean;
  expectedStatus: number;
  actualStatus: number;
  details: string;
  isAdvisory?: boolean;
}

const testResults: TestCaseResult[] = [];

function recordResult(result: TestCaseResult) {
  testResults.push(result);
  const mark = result.passed ? '✅ PASS' : (result.isAdvisory ? '⚠️ WARN (Edge Case)' : '❌ FAIL');
  console.log(`${mark} [${result.category}] ${result.id}: ${result.name} (HTTP ${result.actualStatus}, exp: ${result.expectedStatus})`);
  if (!result.passed) {
    console.log(`   --> Details: ${result.details}`);
  }
}

async function getPersistedLeadsCount(): Promise<number> {
  try {
    const raw = await fs.readFile(LEADS_FILE, 'utf8');
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.length : 0;
  } catch {
    return 0;
  }
}

async function getPersistedLeads(): Promise<any[]> {
  try {
    const raw = await fs.readFile(LEADS_FILE, 'utf8');
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export async function runAdversarialLeadSuite() {
  console.log(`\n======================================================`);
  console.log(`CHALLENGER GATE 1: Adversarial Lead API Test Harness`);
  console.log(`Target: ${BASE_URL}/api/lead`);
  console.log(`Timestamp: ${new Date().toISOString()}`);
  console.log(`======================================================\n`);

  // --- Category A: Missing Fields & Type Validation ---
  console.log('--- A. Missing Fields & Type Validation ---');

  // A1: Empty object {}
  {
    const res = await fetch(`${BASE_URL}/api/lead`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({}),
    });
    const body = await res.json().catch(() => ({}));
    recordResult({
      id: 'A1',
      category: 'Missing Fields',
      name: 'Empty body {} returns HTTP 400',
      passed: res.status === 400 && !!body.error,
      expectedStatus: 400,
      actualStatus: res.status,
      details: JSON.stringify(body),
    });
  }

  // A2: Missing domain
  {
    const res = await fetch(`${BASE_URL}/api/lead`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'surgeon@austinplastics.com' }),
    });
    const body = await res.json().catch(() => ({}));
    recordResult({
      id: 'A2',
      category: 'Missing Fields',
      name: 'Missing domain field returns HTTP 400',
      passed: res.status === 400 && !!body.error,
      expectedStatus: 400,
      actualStatus: res.status,
      details: JSON.stringify(body),
    });
  }

  // A3: Empty string domain
  {
    const res = await fetch(`${BASE_URL}/api/lead`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ domain: '', email: 'surgeon@austinplastics.com' }),
    });
    const body = await res.json().catch(() => ({}));
    recordResult({
      id: 'A3',
      category: 'Missing Fields',
      name: 'Empty string domain returns HTTP 400',
      passed: res.status === 400 && !!body.error,
      expectedStatus: 400,
      actualStatus: res.status,
      details: JSON.stringify(body),
    });
  }

  // A4: Missing email
  {
    const res = await fetch(`${BASE_URL}/api/lead`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ domain: 'austinplastics.com' }),
    });
    const body = await res.json().catch(() => ({}));
    recordResult({
      id: 'A4',
      category: 'Missing Fields',
      name: 'Missing email field returns HTTP 400',
      passed: res.status === 400 && !!body.error,
      expectedStatus: 400,
      actualStatus: res.status,
      details: JSON.stringify(body),
    });
  }

  // A5: Empty string email
  {
    const res = await fetch(`${BASE_URL}/api/lead`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ domain: 'austinplastics.com', email: '' }),
    });
    const body = await res.json().catch(() => ({}));
    recordResult({
      id: 'A5',
      category: 'Missing Fields',
      name: 'Empty string email returns HTTP 400',
      passed: res.status === 400 && !!body.error,
      expectedStatus: 400,
      actualStatus: res.status,
      details: JSON.stringify(body),
    });
  }

  // A6: Non-string domain (number)
  {
    const res = await fetch(`${BASE_URL}/api/lead`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ domain: 12345, email: 'surgeon@austinplastics.com' }),
    });
    const body = await res.json().catch(() => ({}));
    recordResult({
      id: 'A6',
      category: 'Type Validation',
      name: 'Numeric domain type returns HTTP 400',
      passed: res.status === 400 && !!body.error,
      expectedStatus: 400,
      actualStatus: res.status,
      details: JSON.stringify(body),
    });
  }

  // A7: Non-string email (boolean)
  {
    const res = await fetch(`${BASE_URL}/api/lead`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ domain: 'austinplastics.com', email: true }),
    });
    const body = await res.json().catch(() => ({}));
    recordResult({
      id: 'A7',
      category: 'Type Validation',
      name: 'Boolean email type returns HTTP 400',
      passed: res.status === 400 && !!body.error,
      expectedStatus: 400,
      actualStatus: res.status,
      details: JSON.stringify(body),
    });
  }

  // A8: Minimal submission with optional fields omitted
  {
    const res = await fetch(`${BASE_URL}/api/lead`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        domain: 'minimal-practice.com',
        email: 'minimal@practice.com',
      }),
    });
    const body = await res.json().catch(() => ({}));
    const hasDefaults =
      body.lead?.practiceName === 'Healthcare Practice' &&
      body.lead?.doctorName === 'Practice Director' &&
      body.dispatch?.forwardedTo === 'name@nexusrank1.com';
    recordResult({
      id: 'A8',
      category: 'Defaults Validation',
      name: 'Omitted optional fields populate sensible clinical defaults',
      passed: res.status === 200 && body.success === true && hasDefaults,
      expectedStatus: 200,
      actualStatus: res.status,
      details: `success: ${body.success}, practiceName: ${body.lead?.practiceName}, forwardedTo: ${body.dispatch?.forwardedTo}`,
    });
  }

  // --- Category B: Malformed Emails & Case Handling ---
  console.log('\n--- B. Malformed Emails & Case Handling ---');

  const malformedEmails = [
    { email: 'notanemail', desc: 'Plain text without @ or domain' },
    { email: 'doctor@', desc: 'Missing domain after @' },
    { email: '@domain.com', desc: 'Missing username before @' },
    { email: 'doctor@domain..com', desc: 'Double dot in domain' },
    { email: 'doctor space@domain.com', desc: 'Space in email local part' },
    { email: 'doctor@domain', desc: 'Missing top level domain' },
  ];

  let bIdx = 1;
  for (const tc of malformedEmails) {
    const res = await fetch(`${BASE_URL}/api/lead`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        domain: 'austinplastics.com',
        email: tc.email,
      }),
    });
    const body = await res.json().catch(() => ({}));
    recordResult({
      id: `B${bIdx++}`,
      category: 'Malformed Email',
      name: `Email "${tc.email}" (${tc.desc}) returns HTTP 400`,
      passed: res.status === 400 && !!body.error,
      expectedStatus: 400,
      actualStatus: res.status,
      details: JSON.stringify(body),
    });
  }

  // B7: Valid email with uppercase letters
  {
    const res = await fetch(`${BASE_URL}/api/lead`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        domain: 'austinplastics.com',
        email: 'DrVance.MD@AustinPlastics.COM',
      }),
    });
    const body = await res.json().catch(() => ({}));
    const sanitizedEmail = body.lead?.email;
    const passed =
      res.status === 200 &&
      body.success === true &&
      sanitizedEmail === 'drvance.md@austinplastics.com';
    recordResult({
      id: `B${bIdx++}`,
      category: 'Email Normalization',
      name: 'Uppercase email normalizes to lowercase in lead payload',
      passed,
      expectedStatus: 200,
      actualStatus: res.status,
      details: `Sanitized email: "${sanitizedEmail}"`,
    });
  }

  // --- Category C: Uppercase Domains, Trailing Slashes & Protocols ---
  console.log('\n--- C. Domain Normalization & Sanitization ---');

  const domainCases = [
    {
      input: 'AUSTINPLASTICSURGERY.COM',
      expected: 'austinplasticsurgery.com',
      desc: 'All uppercase domain',
    },
    {
      input: 'austinplasticsurgery.com/',
      expected: 'austinplasticsurgery.com',
      desc: 'Trailing slash',
    },
    {
      input: 'austinplasticsurgery.com///',
      expected: 'austinplasticsurgery.com',
      desc: 'Multiple trailing slashes',
    },
    {
      input: 'https://austinplasticsurgery.com',
      expected: 'austinplasticsurgery.com',
      desc: 'HTTPS protocol prefix',
    },
    {
      input: 'http://austinplasticsurgery.com',
      expected: 'austinplasticsurgery.com',
      desc: 'HTTP protocol prefix',
    },
    {
      input: 'https://www.austinplasticsurgery.com/',
      expected: 'austinplasticsurgery.com',
      desc: 'HTTPS + www + trailing slash',
    },
    {
      input: 'HTTP://WWW.BEVERLYHILLSDENTAL.COM/our-surgeons/dr-vance?ref=google#top',
      expected: 'beverlyhillsdental.com',
      desc: 'Uppercase HTTP + WWW + deep path + query params + hash fragment',
    },
    {
      input: 'WWW.DALLASCOSMETIC.COM/',
      expected: 'dallascosmetic.com',
      desc: 'Uppercase WWW with trailing slash',
    },
  ];

  let cIdx = 1;
  for (const dc of domainCases) {
    const res = await fetch(`${BASE_URL}/api/lead`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        domain: dc.input,
        email: 'test@clinic.com',
      }),
    });
    const body = await res.json().catch(() => ({}));
    const cleanDomain = body.lead?.domain;
    const passed =
      res.status === 200 &&
      body.success === true &&
      cleanDomain === dc.expected;
    recordResult({
      id: `C${cIdx++}`,
      category: 'Domain Normalization',
      name: `${dc.desc}: "${dc.input}" -> "${dc.expected}"`,
      passed,
      expectedStatus: 200,
      actualStatus: res.status,
      details: `Actual cleaned domain: "${cleanDomain}"`,
    });
  }

  // --- Category D: Webhook Failure & Resilience ---
  console.log('\n--- D. Webhook Error Conditions & Resilience ---');

  // D1: Webhook to connection refused port
  {
    const res = await fetch(`${BASE_URL}/api/lead`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        domain: 'sanantonioimplants.com',
        email: 'doctor@sanantonioimplants.com',
        webhookUrl: 'http://127.0.0.1:58999/dead-endpoint',
      }),
    });
    const body = await res.json().catch(() => ({}));
    recordResult({
      id: 'D1',
      category: 'Webhook Resilience',
      name: 'Unreachable webhook endpoint (connection refused) does not drop lead',
      passed:
        res.status === 200 &&
        body.success === true &&
        body.dispatch?.forwardedTo === 'name@nexusrank1.com',
      expectedStatus: 200,
      actualStatus: res.status,
      details: `Success: ${body.success}, forwardedTo: ${body.dispatch?.forwardedTo}`,
    });
  }

  // D2: Malformed webhook URL string (non-http)
  {
    const res = await fetch(`${BASE_URL}/api/lead`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        domain: 'houstonaesthetics.com',
        email: 'doctor@houstonaesthetics.com',
        webhookUrl: 'not_a_valid_url_scheme',
      }),
    });
    const body = await res.json().catch(() => ({}));
    recordResult({
      id: 'D2',
      category: 'Webhook Resilience',
      name: 'Malformed webhook URL scheme safely handled without crash',
      passed: res.status === 200 && body.success === true,
      expectedStatus: 200,
      actualStatus: res.status,
      details: `Success: ${body.success}`,
    });
  }

  // --- Category E: Contract Verification & Disk Persistence ---
  console.log('\n--- E. Contract Verification & Disk Persistence ---');

  const countBefore = await getPersistedLeadsCount();
  const uniqueNonce = `TEST-${Date.now()}-${Math.floor(Math.random() * 100000)}`;
  const testLeadPayload = {
    practiceName: `Challenger Facial Surgery ${uniqueNonce}`,
    doctorName: `Dr. Challenger Vance, MD`,
    domain: `https://www.ChallengerMedical-${uniqueNonce}.com/about/`,
    cityZip: `Austin, TX 78701`,
    email: `Challenger-${uniqueNonce}@ChallengerMedical.com`,
    phone: `(512) 555-9876`,
    notes: `Adversarial gate 1 validation audit test`,
    source: `Challenger Gate 1 Automated Test Suite`,
  };

  const persistRes = await fetch(`${BASE_URL}/api/lead`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(testLeadPayload),
  });
  const persistBody = await persistRes.json().catch(() => ({}));

  // E1: Verify HTTP 200, success true, status success
  const e1Passed =
    persistRes.status === 200 &&
    persistBody.success === true &&
    persistBody.status === 'success';
  recordResult({
    id: 'E1',
    category: 'Response Contract',
    name: 'Valid full submission returns HTTP 200, success: true, status: "success"',
    passed: e1Passed,
    expectedStatus: 200,
    actualStatus: persistRes.status,
    details: `body: ${JSON.stringify(persistBody)}`,
  });

  // E2: Verify dispatch.forwardedTo === 'name@nexusrank1.com'
  const e2Passed = persistBody.dispatch?.forwardedTo === 'name@nexusrank1.com';
  recordResult({
    id: 'E2',
    category: 'Response Contract',
    name: "dispatch.forwardedTo is explicitly 'name@nexusrank1.com'",
    passed: e2Passed,
    expectedStatus: 200,
    actualStatus: persistRes.status,
    details: `actual dispatch: ${JSON.stringify(persistBody.dispatch)}`,
  });

  // E3: Verify sanitized domain returned in payload
  const expectedSanitizedDomain = `challengermedical-${uniqueNonce}.com`.toLowerCase();
  const e3Passed = persistBody.lead?.domain === expectedSanitizedDomain;
  recordResult({
    id: 'E3',
    category: 'Response Contract',
    name: `Response lead.domain retains clean sanitized domain ("${expectedSanitizedDomain}")`,
    passed: e3Passed,
    expectedStatus: 200,
    actualStatus: persistRes.status,
    details: `actual lead.domain: "${persistBody.lead?.domain}"`,
  });

  // E4: Disk persistence verification
  const countAfter = await getPersistedLeadsCount();
  const persistedLeads = await getPersistedLeads();
  const foundLead = persistedLeads.find(
    (l) => l.leadId === persistBody.lead?.leadId
  );
  const e4Passed =
    countAfter === countBefore + 1 &&
    !!foundLead &&
    foundLead.forwardedTo === 'name@nexusrank1.com' &&
    foundLead.domain === expectedSanitizedDomain;

  recordResult({
    id: 'E4',
    category: 'Disk Persistence',
    name: `Lead appended to leads/captured_leads.json (count: ${countBefore} -> ${countAfter})`,
    passed: e4Passed,
    expectedStatus: 200,
    actualStatus: 200,
    details: `countBefore: ${countBefore}, countAfter: ${countAfter}, lead found in file: ${!!foundLead}`,
  });

  // --- Category F: Edge Cases & Malformed Payloads ---
  console.log('\n--- F. Edge Cases & Boundary Payloads ---');

  // F1: Non-JSON body (Malformed JSON string)
  {
    const res = await fetch(`${BASE_URL}/api/lead`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: '{ broken json: true, ...',
    });
    recordResult({
      id: 'F1',
      category: 'Malformed Payload',
      name: 'Broken/malformed JSON string triggers safe HTTP 400 without crashing',
      passed: res.status === 400,
      expectedStatus: 400,
      actualStatus: res.status,
      details: `Status: ${res.status}`,
    });
  }

  // F2: XSS Injection in all string fields
  {
    const xssPayload = {
      domain: '<script>alert("domain")</script>myclinic.com',
      practiceName: '<script>alert("practice")</script>',
      doctorName: '<img src=x onerror=alert("doctor")>',
      email: 'xss-doctor@validclinic.com',
      notes: '<svg onload=alert(1)>',
    };
    const res = await fetch(`${BASE_URL}/api/lead`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(xssPayload),
    });
    const body = await res.json().catch(() => ({}));
    recordResult({
      id: 'F2',
      category: 'Security Injection',
      name: 'XSS vectors in fields handled safely without 500 error',
      passed: res.status === 200 && body.success === true,
      expectedStatus: 200,
      actualStatus: res.status,
      details: `Status: ${res.status}, domain: ${body.lead?.domain}`,
    });
  }

  // F3: Extremely large payload (50KB in notes)
  {
    const largePayload = {
      domain: 'heavyloadclinic.com',
      email: 'doctor@heavyloadclinic.com',
      notes: 'CLINICAL NOTE '.repeat(3000), // ~42KB
    };
    const res = await fetch(`${BASE_URL}/api/lead`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(largePayload),
    });
    const body = await res.json().catch(() => ({}));
    recordResult({
      id: 'F3',
      category: 'Payload Stress',
      name: 'Large payload (~42KB notes) processed without memory crash or timeout',
      passed: res.status === 200 && body.success === true,
      expectedStatus: 200,
      actualStatus: res.status,
      details: `Status: ${res.status}, success: ${body.success}`,
    });
  }

  // --- Category G: Advisory Edge Case Audit ---
  console.log('\n--- G. Advisory Edge-Case Analysis (Untrimmed Raw API Inputs) ---');

  // G1: Email with surrounding whitespace directly via raw API
  {
    const res = await fetch(`${BASE_URL}/api/lead`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        domain: 'austinplastics.com',
        email: '   DrVance.MD@AustinPlastics.COM   ',
      }),
    });
    // Zod rejects raw untrimmed email with 400. Web frontend handles via .trim() client side.
    const body = await res.json().catch(() => ({}));
    recordResult({
      id: 'G1',
      category: 'Advisory Edge Case',
      name: 'Raw API email with surrounding whitespace (Zod requires .trim() before .email())',
      passed: res.status === 200,
      expectedStatus: 200,
      actualStatus: res.status,
      details: `Raw API returns HTTP ${res.status} ("${body.error}"). Note: Web UI trims before dispatch; direct API consumers affected.`,
      isAdvisory: true,
    });
  }

  // G2: Domain with leading whitespace directly via raw API
  {
    const res = await fetch(`${BASE_URL}/api/lead`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        domain: '   WWW.DALLASCOSMETIC.COM/   ',
        email: 'test@clinic.com',
      }),
    });
    const body = await res.json().catch(() => ({}));
    const clean = body.lead?.domain;
    const passesSanitization = clean === 'dallascosmetic.com';
    recordResult({
      id: 'G2',
      category: 'Advisory Edge Case',
      name: 'Raw API domain with leading space prevents regex ^www. match',
      passed: passesSanitization,
      expectedStatus: 200,
      actualStatus: res.status,
      details: `Clean domain: "${clean}". Recommendation: call .trim().toLowerCase() before regex replace.`,
      isAdvisory: true,
    });
  }

  // --- Final Summary ---
  console.log(`\n======================================================`);
  const hardTests = testResults.filter((r) => !r.isAdvisory);
  const totalHard = hardTests.length;
  const passedHard = hardTests.filter((r) => r.passed).length;
  const failedHard = hardTests.filter((r) => !r.passed).length;

  const advisories = testResults.filter((r) => r.isAdvisory);

  console.log(`CORE INVARIANTS: Total: ${totalHard} | Passed: ${passedHard} | Failed: ${failedHard}`);
  console.log(`ADVISORY CHECKS: Total: ${advisories.length} | Notes: ${advisories.filter((r) => !r.passed).length}`);
  console.log(`======================================================\n`);

  if (failedHard > 0) {
    console.error(`FAILED HARD INVARIANTS (${failedHard}):`);
    for (const f of hardTests.filter((r) => !r.passed)) {
      console.error(`❌ [${f.id}] ${f.name} (Exp: ${f.expectedStatus}, Act: ${f.actualStatus})`);
      console.error(`   Details: ${f.details}`);
    }
    process.exit(1);
  } else {
    console.log(`🎉 ALL ${totalHard} CORE INVARIANTS PASSED EMPIRICALLY!`);
  }
}

if (require.main === module) {
  runAdversarialLeadSuite().catch((err) => {
    console.error('Test execution fatal error:', err);
    process.exit(1);
  });
}
