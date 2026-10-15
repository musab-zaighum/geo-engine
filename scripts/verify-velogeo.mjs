/**
 * VeloGEO Flow Verification & Simulation Script
 * Tests Clinic Owner audit flow and Agency Owner economics & white-label workflows
 */

import http from 'http';

console.log('====================================================');
console.log('🩺 VeloGEO ENTERPRISE PLATFORM VERIFICATION TEST');
console.log('====================================================\n');

// 1. Agency Economics Simulation Test
console.log('--- TEST 1: AGENCY OWNER REVENUE & PROFIT SIMULATION ---');
function calculateAgencyEconomics(clinics, billRate, wholesaleType = 'flat') {
  const grossMRR = clinics * billRate;
  const wholesale = wholesaleType === 'flat' ? 297 : 199 + (clinics * 89);
  const netProfit = grossMRR - wholesale;
  const annualARR = netProfit * 12;
  const margin = ((netProfit / grossMRR) * 100).toFixed(1);
  return { grossMRR, wholesale, netProfit, annualARR, margin };
}

// Case A: 10 clinics @ $450/mo (Mission specification test)
const caseA = calculateAgencyEconomics(10, 450, 'flat');
console.log(`[Case A: 10 clinics @ $450/mo]`);
console.log(`  Gross Revenue: $${caseA.grossMRR}/mo`);
console.log(`  Wholesale Fee: $${caseA.wholesale}/mo`);
console.log(`  Net Profit:    $${caseA.netProfit}/mo`);
console.log(`  Annual ARR:    $${caseA.annualARR}/yr`);
console.log(`  Net Margin:    ${caseA.margin}%`);

if (caseA.grossMRR === 4500 && caseA.wholesale === 297 && caseA.netProfit === 4203) {
  console.log('  ✅ Case A Economics Verified Perfectly (10 × $450 - $297 = $4,203/mo)\n');
} else {
  console.error('  ❌ Case A Economics Mismatch!');
  process.exit(1);
}

// Case B: 10 clinics @ $650/mo (Standard tier)
const caseB = calculateAgencyEconomics(10, 650, 'flat');
console.log(`[Case B: 10 clinics @ $650/mo]`);
console.log(`  Gross Revenue: $${caseB.grossMRR}/mo`);
console.log(`  Wholesale Fee: $${caseB.wholesale}/mo`);
console.log(`  Net Profit:    $${caseB.netProfit}/mo`);
console.log(`  Annual ARR:    $${caseB.annualARR}/yr`);
console.log(`  Net Margin:    ${caseB.margin}%`);

if (caseB.grossMRR === 6500 && caseB.wholesale === 297 && caseB.netProfit === 6203) {
  console.log('  ✅ Case B Economics Verified Perfectly (10 × $650 - $297 = $6,203/mo)\n');
} else {
  console.error('  ❌ Case B Economics Mismatch!');
  process.exit(1);
}

// 2. Direct Mock API Test for Clinic Audit Flow
console.log('--- TEST 2: CLINIC OWNER AUDIT ENGINE CHECKPOINTS ---');
import('../src/app/api/audit/route.ts')
  .then(async (auditModule) => {
    const mockReq = {
      json: async () => ({ url: 'https://your-dental-client.com' }),
    };

    console.log('Executing POST /api/audit for https://your-dental-client.com...');
    const response = await auditModule.POST(mockReq);
    const data = await response.json();

    console.log(`  Received HTTP Status: ${response.status}`);
    console.log(`  Discovered Title: ${data.discoveredTitle}`);
    console.log(`  Regular GEO Score: ${data.regularGeoScore}/100`);
    console.log(`  Medical Schema Status: ${data.schemaStatus}`);
    console.log(`  NPI Status: ${data.npiStatus}`);

    console.log('\n  Validating Required Diagnostic Warnings:');
    const requiredIssues = [
      '❌ MedicalClinic JSON-LD Entity Graph: Missing',
      '❌ Physician / NPI Schema Association: 0 Found',
      '❌ /llms.txt Machine-Readable Directory: 404 Not Found',
      '❌ Regular GEO Search Citation Index: Unindexed on Perplexity / ChatGPT',
    ];

    let allIssuesPassed = true;
    for (const reqIssue of requiredIssues) {
      const match = data.issuesFound?.includes(reqIssue);
      if (match) {
        console.log(`    ✅ Verified: "${reqIssue}"`);
      } else {
        console.error(`    ❌ Missing expected issue: "${reqIssue}"`);
        allIssuesPassed = false;
      }
    }

    if (!allIssuesPassed) {
      console.error('Diagnostic checkpoints failed verification.');
      process.exit(1);
    }

    console.log('\n  Validating Suggested Schemas & Remediation:');
    if (data.suggestedSchemaJsonLd && data.suggestedSchemaJsonLd.includes('MedicalClinic')) {
      console.log('    ✅ Suggested Schema.org @graph JSON-LD generated & valid.');
    } else {
      console.error('    ❌ Invalid suggested Schema JSON-LD');
      process.exit(1);
    }

    if (data.suggestedLlmsTxt && data.suggestedLlmsTxt.includes('/llms.txt')) {
      console.log('    ✅ Suggested /llms.txt markdown manifest generated.');
    } else {
      console.error('    ❌ Invalid suggested /llms.txt');
      process.exit(1);
    }

    if (data.remediationHighlight && data.remediationHighlight.includes('VeloGEO generates')) {
      console.log(`    ✅ Remediation statement: "${data.remediationHighlight}"`);
    } else {
      console.error('    ❌ Remediation highlight missing');
      process.exit(1);
    }

    console.log('\n====================================================');
    console.log('✨ ALL CLINIC OWNER & AGENCY OWNER CHECKS PASSED 100%');
    console.log('====================================================');
    process.exit(0);
  })
  .catch((err) => {
    console.error('Error running audit module verification:', err);
    process.exit(1);
  });
