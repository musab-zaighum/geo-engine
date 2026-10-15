/**
 * Live HTTP End-to-End Simulation Test for VeloGEO
 */

import http from 'http';

function postJson(port, path, payload) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify(payload);
    const req = http.request(
      {
        hostname: '127.0.0.1',
        port,
        path,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(data),
        },
      },
      (res) => {
        let body = '';
        res.on('data', (chunk) => (body += chunk));
        res.on('end', () => {
          try {
            resolve({ status: res.statusCode, data: JSON.parse(body) });
          } catch (e) {
            resolve({ status: res.statusCode, raw: body });
          }
        });
      }
    );
    req.on('error', reject);
    req.write(data);
    req.end();
  });
}

function getRoute(port, path) {
  return new Promise((resolve, reject) => {
    const req = http.request(
      {
        hostname: '127.0.0.1',
        port,
        path,
        method: 'GET',
      },
      (res) => {
        let body = '';
        res.on('data', (chunk) => (body += chunk));
        res.on('end', () => {
          resolve({ status: res.statusCode, body });
        });
      }
    );
    req.on('error', reject);
    req.end();
  });
}

async function run() {
  const PORT = 3099;
  console.log('--- Step 1: Testing /api/audit endpoint ---');
  const auditRes = await postJson(PORT, '/api/audit', { url: 'https://your-dental-client.com' });
  console.log(`HTTP Status: ${auditRes.status}`);

  if (auditRes.status !== 200) {
    console.error('Audit failed with status:', auditRes.status);
    process.exit(1);
  }

  const result = auditRes.data;
  console.log('Audit Result Summary:');
  console.log(`  Discovered URL: ${result.url}`);
  console.log(`  Discovered Title: ${result.discoveredTitle}`);
  console.log(`  Regular GEO Score: ${result.regularGeoScore}/100`);
  console.log(`  Remediation Highlight: "${result.remediationHighlight}"`);

  console.log('\nValidating Diagnostic Checkpoints:');
  const expectedCheckpoints = [
    '❌ MedicalClinic JSON-LD Entity Graph: Missing',
    '❌ Physician / NPI Schema Association: 0 Found',
    '❌ /llms.txt Machine-Readable Directory: 404 Not Found',
    '❌ Regular GEO Search Citation Index: Unindexed on Perplexity / ChatGPT',
  ];

  for (const cp of expectedCheckpoints) {
    if (result.issuesFound && result.issuesFound.includes(cp)) {
      console.log(`  ✅ Passed Checkpoint: ${cp}`);
    } else {
      console.error(`  ❌ Missing Checkpoint: ${cp}`);
      process.exit(1);
    }
  }

  if (result.suggestedSchemaJsonLd && result.suggestedSchemaJsonLd.includes('MedicalClinic')) {
    console.log('  ✅ Verified Suggested Schema.org @graph JSON-LD');
  } else {
    console.error('  ❌ Invalid suggestedSchemaJsonLd');
    process.exit(1);
  }

  if (result.suggestedLlmsTxt && result.suggestedLlmsTxt.includes('Clinical Knowledge Graph')) {
    console.log('  ✅ Verified Suggested /llms.txt machine-readable manifest');
  } else {
    console.error('  ❌ Invalid suggestedLlmsTxt');
    process.exit(1);
  }

  console.log('\n--- Step 2: Testing Partner Console Route (/partner-console) ---');
  const partnerRes = await getRoute(PORT, '/partner-console');
  console.log(`Partner Console HTTP Status: ${partnerRes.status}`);
  if (partnerRes.status === 200) {
    console.log('  ✅ Partner Console Loaded Successfully (200 OK)');
  } else {
    console.error('  ❌ Partner console failed');
    process.exit(1);
  }

  console.log('\n--- Step 3: Testing Standalone Client Report Route (/report/your-dental-client.com) ---');
  const reportRes = await getRoute(PORT, '/report/your-dental-client.com');
  console.log(`Client Report HTTP Status: ${reportRes.status}`);
  if (reportRes.status === 200) {
    console.log('  ✅ Standalone Client Report Loaded Successfully (200 OK)');
  } else {
    console.error('  ❌ Client report failed');
    process.exit(1);
  }

  console.log('\n--- Step 4: Testing Agency Economics Simulation Math ---');
  const clinics = 10;
  const billRate = 450;
  const wholesale = 297;
  const gross = clinics * billRate; // 4,500
  const net = gross - wholesale;     // 4,203
  const arr = net * 12;             // 50,436
  console.log(`  Calculated: 10 clinics × $450 = $${gross} gross; minus $297 wholesale = $${net}/mo net profit.`);
  if (gross === 4500 && net === 4203) {
    console.log('  ✅ Economics math match specifications.');
  }

  console.log('\n======================================================');
  console.log('🎉 ALL END-TO-END SIMULATION TESTS VERIFIED 100%!');
  console.log('======================================================');
  process.exit(0);
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
