import { calculateHaversineMiles } from '../../../src/lib/qualification/index';

function evaluateGate7(candidate: any) {
  const gate = 'PROXIMITY_COMPETITOR';
  const comp = candidate.competitor;
  if (!comp || typeof comp !== 'object') {
    return {
      gate,
      passed: false,
      failureReason: 'No competitor data supplied for proximity verification',
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

// Tests
console.log('1. undefined comp:', evaluateGate7({}).passed === false);
console.log('2. null comp:', evaluateGate7({ competitor: null }).passed === false);
console.log('3. rank 2 comp:', evaluateGate7({ competitor: { rank: 2, distanceMiles: 1.0 } }).passed === false);
console.log('4. rank 1 no distance or coords:', evaluateGate7({ competitor: { rank: 1, name: 'Comp' } }).passed === false);
console.log('5. rank 1 distance NaN:', evaluateGate7({ competitor: { rank: 1, distanceMiles: NaN } }).passed === false);
console.log('6. rank 1 distance 5.1 miles:', evaluateGate7({ competitor: { rank: 1, distanceMiles: 5.1 } }).passed === false);
console.log('7. rank 1 distance 4.9 miles:', evaluateGate7({ competitor: { rank: 1, distanceMiles: 4.9 } }).passed === true);
console.log('8. rank 1 coords computed within 5 miles:', evaluateGate7({
  latitude: 33.6013,
  longitude: -111.8867,
  competitor: { rank: 1, latitude: 33.6138, longitude: -111.9431 }
}).passed === true);
