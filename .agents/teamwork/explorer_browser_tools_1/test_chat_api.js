const fs = require('fs');
const path = require('path');

async function testChatApi() {
  console.log('=== Starting Dedicated /api/chat Inquiries Test Suite ===');

  const inquiries = [
    {
      id: 'welcome_check',
      label: 'Welcome Message & Guarantee Reference',
      query: 'What are the direct practice pricing tiers and 1-patient ROI guarantee?',
      expectedMatches: ['$1,500', '0 ongoing monthly', 'Pillar 1: Geo-Visibility', '1 High-Ticket Patient', '90 days']
    },
    {
      id: 'pricing_terms',
      label: 'Clinician Pricing & Deployment Terms',
      query: 'Can you explain your pricing and the $1,500 one-time deployment terms?',
      expectedMatches: ['$1,500', 'One-Time', '0 ongoing monthly software fees', 'Concierge Setup']
    },
    {
      id: 'timeline_concierge',
      label: 'Implementation Timeline & Concierge Installation',
      query: 'What is the implementation timeline and how do we paste code on WordPress, Webflow, or Squarespace?',
      expectedMatches: ['WordPress', 'Webflow', 'Squarespace', '24 hours', 'WPCode']
    },
    {
      id: 'competitor_displacement',
      label: 'Google Ads Competitor Displacement & Geo-Grid',
      query: 'How does your Geo-Grid Radar displace competitors who spend $100/click on Google Ads?',
      expectedMatches: ['Competitor', 'Geo-Visibility', 'ChatGPT', 'Perplexity', 'Schema']
    },
    {
      id: 'surgeon_pitch',
      label: 'Surgeon Clinical Inquiry Pitch Script',
      query: 'Give me a clinical outreach pitch script for a Specialist Plastic Surgeon',
      expectedMatches: ['Subject:', 'Dr. [Last Name]', 'NPI licensure', 'Schema.org JSON-LD', '/llms.txt']
    }
  ];

  const results = {
    timestamp: new Date().toISOString(),
    endpoint: 'http://localhost:3000/api/chat',
    tests: []
  };

  for (const item of inquiries) {
    console.log(`\nTesting: [${item.label}]`);
    console.log(`  Query: "${item.query}"`);
    const startTime = Date.now();

    try {
      const res = await fetch('http://localhost:3000/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: item.query })
      });

      const elapsedMs = Date.now() - startTime;
      const data = await res.json();
      const reply = data.reply || (data.message && data.message.content) || '';

      const matched = item.expectedMatches.filter(m => reply.toLowerCase().includes(m.toLowerCase()));
      const passed = res.status === 200 && reply.length > 100;

      console.log(`  Status: ${res.status} (${elapsedMs}ms)`);
      console.log(`  Reply Length: ${reply.length} chars`);
      console.log(`  Matched Keyphrases (${matched.length}/${item.expectedMatches.length}): ${matched.join(', ')}`);
      console.log(`  Pass: ${passed ? '✓ YES' : '✗ NO'}`);
      console.log(`  Snippet: ${reply.substring(0, 150).replace(/\n/g, ' ')}...`);

      results.tests.push({
        id: item.id,
        label: item.label,
        query: item.query,
        status: res.status,
        elapsedMs,
        replyLength: reply.length,
        fullReply: reply,
        expectedMatches: item.expectedMatches,
        matchedPhrases: matched,
        passed
      });
    } catch (err) {
      console.error(`  Error: ${err.message}`);
      results.tests.push({
        id: item.id,
        label: item.label,
        query: item.query,
        error: err.message,
        passed: false
      });
    }
  }

  const outPath = path.join(__dirname, 'chat_api_results.json');
  fs.writeFileSync(outPath, JSON.stringify(results, null, 2));
  console.log(`\nResults written to ${outPath}`);
  return results;
}

testChatApi();
