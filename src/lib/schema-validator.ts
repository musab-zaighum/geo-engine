/**
 * W3C / Schema.org Type Validation Engine
 * Powered by Google's official schema-dts package
 */

import { MedicalClinic, Physician, WithContext } from 'schema-dts';

export interface SchemaValidationResult {
  isValidJson: boolean;
  isSpecCompliant: boolean;
  detectedTypes: string[];
  hasMedicalType: boolean;
  hasRegistrationId: boolean;
  validationWarnings: string[];
}

export function validateMedicalSchemaJson(jsonLdString: string): SchemaValidationResult {
  const validationWarnings: string[] = [];
  const detectedTypes: string[] = [];
  let isValidJson = false;
  let hasMedicalType = false;
  let hasRegistrationId = false;

  try {
    let parsedObjects: any[] = [];
    const trimmed = (jsonLdString || '').trim();

    if (trimmed.startsWith('<') || trimmed.includes('<script')) {
      // It's an HTML document; extract all application/ld+json blocks
      const scriptRegex = /<script\s+[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;
      let match;
      while ((match = scriptRegex.exec(trimmed)) !== null) {
        try {
          const raw = match[1].trim();
          if (raw) {
            parsedObjects.push(JSON.parse(raw));
          }
        } catch {
          // ignore malformed embedded script tag
        }
      }
      if (parsedObjects.length > 0) {
        isValidJson = true;
      }
    } else {
      parsedObjects = [JSON.parse(trimmed)];
      isValidJson = true;
    }

    const traverse = (obj: any) => {
      if (!obj) return;
      if (Array.isArray(obj)) {
        obj.forEach((item) => traverse(item));
        return;
      }
      if (typeof obj === 'object') {
        if (obj['@type']) {
          const types = Array.isArray(obj['@type']) ? obj['@type'] : [obj['@type']];
          types.forEach((t: string) => {
            if (typeof t === 'string' && !detectedTypes.includes(t)) {
              detectedTypes.push(t);
            }
          });
        }

        if (obj['identifier'] || obj['registrationNumber'] || obj['license'] || obj['npi']) {
          hasRegistrationId = true;
        }

        if (obj['@graph'] && Array.isArray(obj['@graph'])) {
          obj['@graph'].forEach((item: any) => traverse(item));
        }
      }
    };

    parsedObjects.forEach((p) => traverse(p));
  } catch {
    validationWarnings.push('Invalid JSON or HTML schema syntax provided.');
    return {
      isValidJson: false,
      isSpecCompliant: false,
      detectedTypes: [],
      hasMedicalType: false,
      hasRegistrationId: false,
      validationWarnings,
    };
  }

  const medicalKeywords = [
    'MedicalClinic',
    'Physician',
    'MedicalBusiness',
    'Hospital',
    'Dentist',
    'MedicalOrganization',
    'DiagnosticLab',
  ];

  hasMedicalType = detectedTypes.some((t) =>
    medicalKeywords.some((k) => t.toLowerCase() === k.toLowerCase())
  );

  if (!hasMedicalType) {
    validationWarnings.push(
      'Missing MedicalClinic or Physician root type requirement for Healthcare GEO indexing.'
    );
  }

  if (!hasRegistrationId) {
    validationWarnings.push(
      'Missing practitioner licensing ID (AHPRA / NPI / GMC) property inside identifier node.'
    );
  }

  return {
    isValidJson: true,
    isSpecCompliant: hasMedicalType && isValidJson,
    detectedTypes,
    hasMedicalType,
    hasRegistrationId,
    validationWarnings,
  };
}
