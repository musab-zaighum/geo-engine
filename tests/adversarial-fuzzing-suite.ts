/**
 * Advanced Edge-Case & Adversarial Fuzzing Test Suite
 */

export {};


const BASE_URL = process.env.TEST_BASE_URL || 'http://localhost:3000';

interface DeepTestResult {
  endpoint: string;
  scenario: string;
  passed: boolean;
  notes: string;
}

const deepResults: DeepTestResult[] = [];

function logResult(endpoint: string, scenario: string, passed: boolean, notes: string) {
  deepResults.push({ endpoint, scenario, passed, notes });
  console.log(`${passed ? '✅ PASS' : '❌ FAIL'} [${endpoint}] ${scenario}: ${notes}`);
}

async function testAdvancedChat() {
  console.log('\n--- Advanced Fuzzing: /api/chat ---');

  // 1. Unicode & Null Byte Fuzzing
  try {
    const res = await fetch(`${BASE_URL}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: '🏥 🦷 \u0000\u001f\u007f Can dental implants be optimized in Austin?' }),
    });
    const data = await res.json().catch(() => ({}));
    const text = data.reply || '';
    logResult('/api/chat', 'Unicode, emoji & null bytes in message', res.status === 200 && text.length > 50, `Status ${res.status}, reply length: ${text.length}`);
  } catch (err: any) {
    logResult('/api/chat', 'Unicode, emoji & null bytes', false, err.message);
  }

  // 2. Only Assistant Message Array (No User Message)
  try {
    const res = await fetch(`${BASE_URL}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages: [{ role: 'assistant', content: 'Existing reply' }] }),
    });
    const data = await res.json().catch(() => ({}));
    logResult('/api/chat', 'Messages array with no user role', res.status === 200 && !!data.reply, `Status ${res.status}, defaulted to master advisor greeting`);
  } catch (err: any) {
    logResult('/api/chat', 'No user role', false, err.message);
  }

  // 3. Competitor displacement query: ClearChoice DSO
  try {
    const res = await fetch(`${BASE_URL}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: 'ClearChoice is outranking my solo practice for All-on-4. How do we steal back patients?' }),
    });
    const data = await res.json().catch(() => ({}));
    const reply = data.reply || '';
    const hasStrategy = reply.includes('Clinical Knowledge') || reply.includes('Competitor');
    const hasGuarantee = reply.includes('90-Day 1-Patient ROI Guarantee') || reply.includes('$1,500');
    logResult('/api/chat', 'DSO competitor displacement query', res.status === 200 && hasStrategy && hasGuarantee, `Status ${res.status}, strategy: ${hasStrategy}, guarantee: ${hasGuarantee}`);
  } catch (err: any) {
    logResult('/api/chat', 'Competitor displacement query', false, err.message);
  }
}

async function testAdvancedAuth() {
  console.log('\n--- Advanced Fuzzing: /api/auth ---');

  // 1. Passcode with leading/trailing spaces: "  VIP-2026  "
  try {
    const res = await fetch(`${BASE_URL}/api/auth`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ passcode: '  VIP-2026  ' }),
    });
    const data = await res.json().catch(() => ({}));
    logResult('/api/auth', 'Passcode with surrounding whitespace ("  VIP-2026  ")', res.status === 200 && data.authenticated === true, `Status ${res.status}, auth: ${data.authenticated}`);
  } catch (err: any) {
    logResult('/api/auth', 'Passcode whitespace', false, err.message);
  }

  // 2. Non-string types for passcode: number, boolean, null, array
  const badTypes = [12345, true, null, ['VIP-2026']];
  for (const b of badTypes) {
    try {
      const res = await fetch(`${BASE_URL}/api/auth`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ passcode: b }),
      });
      logResult('/api/auth', `Non-string passcode (${JSON.stringify(b)})`, res.status === 401, `Status ${res.status}`);
    } catch (err: any) {
      logResult('/api/auth', `Non-string passcode (${JSON.stringify(b)})`, false, err.message);
    }
  }

  // 3. GET /api/auth session check
  try {
    const res = await fetch(`${BASE_URL}/api/auth`, { method: 'GET' });
    const data = await res.json().catch(() => ({}));
    logResult('/api/auth', 'GET /api/auth unauthenticated session status', res.status === 200 && data.authenticated === false, `Status ${res.status}, auth: ${data.authenticated}`);
  } catch (err: any) {
    logResult('/api/auth', 'GET /api/auth', false, err.message);
  }

  // 4. DELETE /api/auth session clearing
  try {
    const res = await fetch(`${BASE_URL}/api/auth`, { method: 'DELETE' });
    const data = await res.json().catch(() => ({}));
    logResult('/api/auth', 'DELETE /api/auth logout session clear', res.status === 200 && data.authenticated === false, `Status ${res.status}`);
  } catch (err: any) {
    logResult('/api/auth', 'DELETE /api/auth', false, err.message);
  }
}

async function testAdvancedReportPdf() {
  console.log('\n--- Advanced Fuzzing: /api/report/pdf ---');

  // 1. Script injection in domain
  try {
    const res = await fetch(`${BASE_URL}/api/report/pdf?domain=%3Cscript%3Ealert(1)%3C%2Fscript%3E`, { method: 'GET' });
    const contentType = res.headers.get('content-type') || '';
    const safe = res.status === 200 && contentType.includes('application/pdf');
    logResult('/api/report/pdf', 'XSS in domain parameter', safe, `Status ${res.status}, Content-Type: ${contentType}`);
  } catch (err: any) {
    logResult('/api/report/pdf', 'XSS in domain', false, err.message);
  }

  // Small delay to allow chromium instance to cleanly exit
  await new Promise((r) => setTimeout(r, 1000));

  // 2. Full URL scheme input

  try {
    const res = await fetch(`${BASE_URL}/api/report/pdf?domain=https://mayoclinic.org/`, { method: 'GET' });
    const disposition = res.headers.get('content-disposition') || '';
    const clean = disposition.includes('mayoclinic.org-clinical-geo-audit.pdf');
    logResult('/api/report/pdf', 'Full URL scheme stripped cleanly from filename', res.status === 200 && clean, `Disposition: ${disposition}`);
  } catch (err: any) {
    logResult('/api/report/pdf', 'Full URL scheme stripping', false, err.message);
  }
}

async function testAdvancedLead() {
  console.log('\n--- Advanced Fuzzing: /api/lead ---');

  // 1. Lead with custom webhook URL that fails (connection refused)
  try {
    const res = await fetch(`${BASE_URL}/api/lead`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        domain: 'beverlyhillsdental.com',
        email: 'doctor@beverlyhillsdental.com',
        name: 'Dr. VIP',
        webhookUrl: 'http://127.0.0.1:54321/non-existent-webhook',
      }),
    });
    const data = await res.json().catch(() => ({}));
    logResult(
      '/api/lead',
      'Failing webhook delivery handles gracefully without dropping lead',
      res.status === 200 && data.success === true,
      `Status ${res.status}, success: ${data.success}`
    );
  } catch (err: any) {
    logResult('/api/lead', 'Failing webhook delivery', false, err.message);
  }

  // 2. Lead with full URL domain "https://austincosmeticdental.com/"
  try {
    const res = await fetch(`${BASE_URL}/api/lead`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        domain: 'https://austincosmeticdental.com/',
        email: 'contact@austin.com',
      }),
    });
    const data = await res.json().catch(() => ({}));
    const cleanDomain = data.lead?.domain === 'austincosmeticdental.com';
    logResult('/api/lead', 'Domain sanitization in lead payload', res.status === 200 && cleanDomain, `Clean domain: ${data.lead?.domain}`);
  } catch (err: any) {
    logResult('/api/lead', 'Domain sanitization in lead', false, err.message);
  }
}

async function run() {
  console.log('Running Advanced Edge-Case & Adversarial Fuzzing...');
  await testAdvancedChat();
  await testAdvancedAuth();
  await testAdvancedReportPdf();
  await testAdvancedLead();

  const passed = deepResults.filter((r) => r.passed).length;
  const failed = deepResults.filter((r) => !r.passed).length;
  console.log('\n=======================================');
  console.log(`ADVANCED FUZZING: Total: ${deepResults.length} | Passed: ${passed} | Failed: ${failed}`);
  console.log('=======================================');
}

run().catch(console.error);
