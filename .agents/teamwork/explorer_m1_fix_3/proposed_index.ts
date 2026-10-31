/**
 * Unified 7-Point Qualification & Disqualification Engine
 *
 * Implements the sequential Directed Acyclic Graph (DAG) gates:
 * 1. Gate 1: Affluent Zip Code Validation (Median HHI > $120k)
 * 2. Gate 2: Google Maps Local Rank (#4, #5, or #6 strictly)
 * 3. Gate 3: Paid Google Ads Signal (Sponsored verification)
 * 4. Gate 4: Clinical Specialization (Implants/All-on-4 vs Medicaid/Peds/Routine)
 * 5. Gate 5: DSO & Corporate Chain Blacklist (5-Tier Detection)
 * 6. Gate 6: Solo Owner / Founder Licensure (CMS NPPES NPI-1)
 * 7. Gate 7: Proximity Competitor (#1 within 5.0 miles strictly)
 */

import {
  CandidatePractice,
  DoctorVerification,
  DsoCheckResult,
  ClinicalSpecializationResult,
  GateEvaluationResult,
  QualificationGate,
  QualificationPipelineResult,
  CompetitorResult,
} from './types';
import { isAffluentZip, getAffluentZipInfo } from './affluent-zips';
import { verifySoloDoctor } from './npi-verifier';
import { checkDsoAffiliation } from './dso-filter';
import { scoreClinicalSpecialization } from './clinical-filter';

// Re-export all submodules
export * from './types';
export * from './affluent-zips';
export * from './npi-verifier';
export * from './dso-filter';
export * from './clinical-filter';

/**
 * Calculates great-circle distance between two coordinate pairs in statute miles using the Haversine formula.
 */
export function calculateHaversineMiles(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 3958.8; // Earth's radius in statute miles
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * Evaluates a single specific qualification gate for a candidate practice.
 */
export async function evaluateGate(
  gate: QualificationGate,
  candidate: CandidatePractice
): Promise<GateEvaluationResult> {
  switch (gate) {
    case 'AFFLUENT_ZIP': {
      const isAffluent = isAffluentZip(candidate.zipCode);
      const zipInfo = getAffluentZipInfo(candidate.zipCode);
      if (!isAffluent) {
        return {
          gate,
          passed: false,
          failureReason: `Zip code ${candidate.zipCode} is not in the verified high-wealth repository (Median HHI must exceed $120,000)`,
          details: { zipCode: candidate.zipCode },
        };
      }
      return {
        gate,
        passed: true,
        details: { zipCode: candidate.zipCode, metro: zipInfo?.metro, medianHhi: zipInfo?.medianHhi },
      };
    }

    case 'MAPS_RANK': {
      const rank = candidate.mapsRank;
      if (rank === undefined || rank === null) {
        return {
          gate,
          passed: false,
          failureReason: 'Google Maps rank is missing or undefined',
        };
      }
      if (typeof rank !== 'number' || isNaN(rank) || !Number.isInteger(rank)) {
        return {
          gate,
          passed: false,
          failureReason: `Google Maps rank must be a valid integer between 4 and 6 (received: ${rank})`,
          details: { rank },
        };
      }
      // Strictly must be #4, #5, or #6
      if (rank < 4) {
        return {
          gate,
          passed: false,
          failureReason: `Google Maps rank #${rank} is already in the Top 3 Map Pack (Disqualified: low acquisition urgency)`,
          details: { rank },
        };
      }
      if (rank > 6) {
        return {
          gate,
          passed: false,
          failureReason: `Google Maps rank #${rank} exceeds the #4-#6 overflow window (Disqualified: too far back to close gap in 30 days)`,
          details: { rank },
        };
      }
      return {
        gate,
        passed: true,
        details: { rank },
      };
    }

    case 'PAID_ADS': {
      const hasAds = Boolean(candidate.hasSponsoredAd);
      const hasKeywords = Boolean(candidate.adKeywords && candidate.adKeywords.length > 0);
      const hasCreativeCount = Boolean(candidate.adCreativeCount && candidate.adCreativeCount > 0);

      const passes = hasAds || (hasKeywords && hasCreativeCount);
      if (!passes) {
        return {
          gate,
          passed: false,
          failureReason: 'No active paid Google Ads signal detected (clinic lacks active PPC budget)',
          details: { hasSponsoredAd: candidate.hasSponsoredAd, keywords: candidate.adKeywords },
        };
      }
      return {
        gate,
        passed: true,
        details: {
          hasSponsoredAd: candidate.hasSponsoredAd,
          adKeywords: candidate.adKeywords,
          adCreativeCount: candidate.adCreativeCount,
        },
      };
    }

    case 'CLINICAL_SPECIALIZATION': {
      const html = candidate.htmlContent || '';
      const result = scoreClinicalSpecialization(html);
      if (result.disqualified || !result.qualified) {
        return {
          gate,
          passed: false,
          failureReason: result.disqualificationReason || 'Failed clinical specialization criteria',
          details: result,
        };
      }
      return {
        gate,
        passed: true,
        details: result,
      };
    }

    case 'DSO_FILTER': {
      const result = checkDsoAffiliation(candidate.domain, candidate.htmlContent, candidate.name);
      if (result.isDso) {
        return {
          gate,
          passed: false,
          failureReason: result.reason || `Disqualified as DSO / corporate chain: ${result.matchedDsoName}`,
          details: result,
        };
      }
      return {
        gate,
        passed: true,
        details: result,
      };
    }

    case 'SOLO_DOCTOR': {
      const doctorName = candidate.doctorName || '';
      if (!doctorName) {
        return {
          gate,
          passed: false,
          failureReason: 'No doctor name provided for NPI licensure verification',
        };
      }

      const state = candidate.state || '';
      const result = await verifySoloDoctor(doctorName, state, candidate.address);
      if (!result.verified) {
        return {
          gate,
          passed: false,
          failureReason: result.disqualificationReason || `Doctor ${doctorName} failed CMS NPI-1 verification`,
          details: result,
        };
      }
      return {
        gate,
        passed: true,
        details: result,
      };
    }

    case 'PROXIMITY_COMPETITOR': {
      const comp = candidate.competitor;
      if (!comp || typeof comp !== 'object') {
        return {
          gate,
          passed: false,
          failureReason: 'No competitor data supplied for proximity verification',
        };
      }

      if (!comp.name || typeof comp.name !== 'string' || comp.name.trim() === '') {
        return {
          gate,
          passed: false,
          failureReason: 'Competitor name is missing or invalid',
        };
      }

      // Acceptance criterion 5: strictly #1 competitor
      if (comp.rank !== 1) {
        return {
          gate,
          passed: false,
          failureReason: `Competitor rank is #${comp.rank}. Requirement mandates strictly rank #1 competitor.`,
          details: { competitorRank: comp.rank, competitorName: comp.name },
        };
      }

      // Check distance (if coordinates provided or pre-calculated)
      let distance = comp.distanceMiles;
      if (
        (distance === undefined || typeof distance !== 'number' || isNaN(distance)) &&
        typeof candidate.latitude === 'number' && !isNaN(candidate.latitude) &&
        typeof candidate.longitude === 'number' && !isNaN(candidate.longitude) &&
        typeof comp.latitude === 'number' && !isNaN(comp.latitude) &&
        typeof comp.longitude === 'number' && !isNaN(comp.longitude)
      ) {
        distance = calculateHaversineMiles(
          candidate.latitude,
          candidate.longitude,
          comp.latitude,
          comp.longitude
        );
      }

      // Strictly require verified finite distance >= 0
      if (distance === undefined || typeof distance !== 'number' || isNaN(distance) || distance < 0) {
        return {
          gate,
          passed: false,
          failureReason: 'Unable to verify competitor distance: missing valid distanceMiles and complete coordinates',
          details: { competitorName: comp.name, competitorRank: comp.rank },
        };
      }

      if (distance > 5.0) {
        return {
          gate,
          passed: false,
          failureReason: `Competitor distance ${distance.toFixed(1)} miles exceeds strict 5.0-mile radius limit`,
          details: { distanceMiles: distance, competitorName: comp.name },
        };
      }

      return {
        gate,
        passed: true,
        details: { competitorName: comp.name, rank: comp.rank, distanceMiles: distance },
      };
    }

    default:
      return {
        gate,
        passed: false,
        failureReason: `Unknown gate: ${gate}`,
      };
  }
}

/**
 * Full sequential DAG qualification pipeline.
 *
 * Evaluates candidate practices through all 7 gates.
 *
 * @param candidate Candidate practice data
 * @param stopOnFirstFailure If true, halts evaluation immediately upon first gate failure
 */
export async function qualifyPractice(
  candidate: CandidatePractice,
  stopOnFirstFailure: boolean = true
): Promise<QualificationPipelineResult> {
  const startTime = Date.now();

  if (!candidate || typeof candidate !== 'object') {
    return {
      qualified: false,
      candidateName: '',
      candidateDomain: '',
      candidateZip: '',
      failedGate: 'AFFLUENT_ZIP',
      disqualificationReason: 'Candidate practice data is null or undefined',
      gateResults: {} as any,
      evaluationDurationMs: 0,
    };
  }

  const gates: QualificationGate[] = [
    'AFFLUENT_ZIP',
    'MAPS_RANK',
    'PAID_ADS',
    'CLINICAL_SPECIALIZATION',
    'DSO_FILTER',
    'SOLO_DOCTOR',
    'PROXIMITY_COMPETITOR',
  ];

  const gateResults: Record<QualificationGate, GateEvaluationResult> = {} as any;
  let overallQualified = true;
  let failedGate: QualificationGate | undefined;
  let disqualificationReason: string | undefined;

  let verifiedDoctor: DoctorVerification | undefined;
  let dsoEvaluation: DsoCheckResult | undefined;
  let clinicalEvaluation: ClinicalSpecializationResult | undefined;
  const affluentZipInfo = getAffluentZipInfo(candidate.zipCode) || undefined;

  for (const gate of gates) {
    const evalResult = await evaluateGate(gate, candidate);
    gateResults[gate] = evalResult;

    if (gate === 'SOLO_DOCTOR' && evalResult.details) {
      verifiedDoctor = evalResult.details as DoctorVerification;
    }
    if (gate === 'DSO_FILTER' && evalResult.details) {
      dsoEvaluation = evalResult.details as DsoCheckResult;
    }
    if (gate === 'CLINICAL_SPECIALIZATION' && evalResult.details) {
      clinicalEvaluation = evalResult.details as ClinicalSpecializationResult;
    }

    if (!evalResult.passed) {
      overallQualified = false;
      if (!failedGate) {
        failedGate = gate;
        disqualificationReason = evalResult.failureReason;
      }
      if (stopOnFirstFailure) {
        break;
      }
    }
  }

  return {
    qualified: overallQualified,
    candidateName: candidate.name,
    candidateDomain: candidate.domain,
    candidateZip: candidate.zipCode,
    failedGate,
    disqualificationReason,
    gateResults,
    evaluationDurationMs: Date.now() - startTime,
    verifiedDoctor,
    dsoEvaluation,
    clinicalEvaluation,
    affluentZipInfo,
  };
}
