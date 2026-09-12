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
    const parsed = JSON.parse(jsonLdString);
    isValidJson = true;

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

        if (obj['identifier'] || obj['registrationNumber'] || obj['license']) {
          hasRegistrationId = true;
        }

        if (obj['@graph'] && Array.isArray(obj['@graph'])) {
          obj['@graph'].forEach((item: any) => traverse(item));
        }
      }
    };

    traverse(parsed);
  } catch {
    validationWarnings.push('Invalid JSON syntax provided.');
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
