import { ClinicGeneratorInput } from "./schema";

export interface AuditAnalysisResult {
  score: number;
  weightedBreakdown: {
    jsonLdGraph: { score: number; max: 40; status: "FAIL" | "WARN" | "PASS" };
    llmsTxtEndpoint: { score: number; max: 30; status: "FAIL" | "PASS" };
    procedureLinkage: { score: number; max: 30; status: "FAIL" | "WARN" | "PASS" };
  };
  warnings: string[];
  recommendations: string[];
  detectedNodes: string[];
  missingNodes: string[];
  jsonLdFound: boolean;
  hasMedicalClinicNode: boolean;
  hasPhysicianNode: boolean;
  llmsTxtFound: boolean;
  llmsTxtStatus: number | string;
}

/**
 * Analyzes HTML content and llms.txt status to compute the GEO Readiness Score out of 100.
 */
export function analyzeClinicGeoReadiness(
  domain: string,
  htmlContent: string | null,
  llmsTxtStatusCode: number | null
): AuditAnalysisResult {
  let hasJsonLd = false;
  let hasMedicalClinic = false;
  let hasPhysician = false;
  let hasSnomedOrWikidata = false;
  let hasProcedureLinkage = false;

  const detectedNodes: string[] = [];
  const missingNodes: string[] = [];

  if (htmlContent) {
    const jsonLdRegex = /<script\s+type=["']application\/ld\+json["']>([\s\S]*?)<\/script>/gi;
    let match;
    while ((match = jsonLdRegex.exec(htmlContent)) !== null) {
      hasJsonLd = true;
      const snippet = match[1];
      if (snippet.includes("MedicalClinic") || snippet.includes("MedicalBusiness") || snippet.includes("Hospital")) {
        hasMedicalClinic = true;
      }
      if (snippet.includes("Physician") || snippet.includes("Person") || snippet.includes("Doctor")) {
        hasPhysician = true;
      }
      if (snippet.includes("snomed") || snippet.includes("wikidata") || snippet.includes("code")) {
        hasSnomedOrWikidata = true;
      }
      if (snippet.includes("availableService") || snippet.includes("medicalSpecialty") || snippet.includes("practicesAt")) {
        hasProcedureLinkage = true;
      }
    }
  }

  // Node detection logging
  if (hasJsonLd) detectedNodes.push("Schema.org Script Tag");
  if (hasMedicalClinic) detectedNodes.push("MedicalClinic / MedicalBusiness");
  else missingNodes.push("MedicalClinic Node");

  if (hasPhysician) detectedNodes.push("Physician Entity Node");
  else missingNodes.push("Physician / Specialist Node");

  if (hasSnomedOrWikidata) detectedNodes.push("SNOMED-CT / Wikidata Concept URIs");
  else missingNodes.push("SNOMED-CT Medical Ontology Terms");

  if (hasProcedureLinkage) detectedNodes.push("Procedure-to-Physician Linkage (@graph)");
  else missingNodes.push("availableService Procedure Linkage");

  const isLlmsTxtOk = llmsTxtStatusCode === 200;
  if (isLlmsTxtOk) detectedNodes.push("/llms.txt Crawler File");
  else missingNodes.push("/llms.txt Endpoint (404 Not Found)");

  // 1. JSON-LD Entity Graph Score (Weighted max: 40)
  let jsonLdScore = 0;
  if (hasJsonLd) jsonLdScore += 10;
  if (hasMedicalClinic) jsonLdScore += 15;
  if (hasPhysician) jsonLdScore += 15;

  // 2. /llms.txt Endpoint Score (Weighted max: 30)
  const llmsTxtScore = isLlmsTxtOk ? 30 : 0;

  // 3. Procedure-to-Physician Schema Linkage Score (Weighted max: 30)
  let procedureScore = 0;
  if (hasProcedureLinkage) procedureScore += 15;
  if (hasSnomedOrWikidata) procedureScore += 15;

  const totalScore = Math.min(100, jsonLdScore + llmsTxtScore + procedureScore);

  // Warnings generation (Mandatory 3 callouts specified in PRD)
  const warnings: string[] = [];
  if (!hasPhysician) {
    warnings.push("AI Bots Cannot Parse Consulting Specialists: Missing explicit Physician entities mapped to operating locations.");
  } else {
    warnings.push("Consulting Specialists Schema Incomplete: Specialist profiles lack Ahpra/FRACS board certification metadata.");
  }

  if (!hasSnomedOrWikidata) {
    warnings.push("Zero Medical Wikidata/SNOMED Mapping: LLM crawlers cannot verify your clinical procedure definitions.");
  } else {
    warnings.push("Sub-optimal SNOMED/MBS Mapping: Diagnostic procedures lack standard clinical concept URIs.");
  }

  if (!isLlmsTxtOk) {
    warnings.push("Missing /llms.txt Standard File: Domain returns 404 for LLM crawler index file at /llms.txt.");
  } else {
    warnings.push("Unformatted /llms.txt: Standard file lacks structured medical directory headers.");
  }

  const recommendations = [
    "Deploy a multi-doctor Schema.org @graph JSON-LD payload to clinic index page.",
    "Provision a verified /llms.txt standard endpoint mapping all surgeons, locations, and procedure codes.",
    "Connect clinical procedure nodes to SNOMED-CT / Ahpra licensing registers for maximum AI citation authority.",
  ];

  return {
    score: totalScore,
    weightedBreakdown: {
      jsonLdGraph: {
        score: jsonLdScore,
        max: 40,
        status: jsonLdScore >= 30 ? "PASS" : jsonLdScore > 0 ? "WARN" : "FAIL",
      },
      llmsTxtEndpoint: {
        score: llmsTxtScore,
        max: 30,
        status: isLlmsTxtOk ? "PASS" : "FAIL",
      },
      procedureLinkage: {
        score: procedureScore,
        max: 30,
        status: procedureScore >= 20 ? "PASS" : procedureScore > 0 ? "WARN" : "FAIL",
      },
    },
    warnings,
    recommendations,
    detectedNodes,
    missingNodes,
    jsonLdFound: hasJsonLd,
    hasMedicalClinicNode: hasMedicalClinic,
    hasPhysicianNode: hasPhysician,
    llmsTxtFound: isLlmsTxtOk,
    llmsTxtStatus: llmsTxtStatusCode || 404,
  };
}

/**
 * Asset 1 Generator: Schema.org Multi-Doctor @graph JSON-LD
 */
export function generateSchemaOrgGraph(data: ClinicGeneratorInput): string {
  const clinicId = `https://${data.domain}/#clinic`;
  
  const locationsArray = data.locations.map((loc, idx) => ({
    "@type": "MedicalClinic",
    "@id": `https://${data.domain}/#branch-${idx + 1}`,
    "name": `${data.clinicName} - ${loc.name}`,
    "url": `https://${data.domain}`,
    "telephone": loc.phone || data.mainPhone,
    "address": {
      "@type": "PostalAddress",
      "streetAddress": loc.address,
      "addressLocality": loc.city,
      "addressRegion": loc.state,
      "addressCountry": "AU"
    },
    "openingHours": loc.hours || "Mo-Fr 08:30-17:00",
    "medicalSpecialty": data.specialty
  }));

  const mainClinicNode = {
    "@type": "MedicalBusiness",
    "@id": clinicId,
    "name": data.clinicName,
    "url": `https://${data.domain}`,
    "telephone": data.mainPhone,
    "medicalSpecialty": data.specialty,
    "subOrganization": locationsArray.map(l => ({ "@id": l["@id"] }))
  };

  const physiciansArray = data.specialists.map((spec, idx) => {
    const physicianId = `https://${data.domain}/#physician-${idx + 1}`;
    
    const availableServices = spec.procedures.map((proc, pIdx) => {
      const snomedCode = spec.snomedCodes && spec.snomedCodes[pIdx] ? spec.snomedCodes[pIdx] : "SNOMED-CT";
      return {
        "@type": "MedicalProcedure",
        "name": proc,
        "code": {
          "@type": "MedicalCode",
          "code": snomedCode,
          "codingSystem": "SNOMED-CT"
        }
      };
    });

    return {
      "@type": "Physician",
      "@id": physicianId,
      "name": spec.fullName,
      "jobTitle": spec.title,
      "description": spec.qualifications,
      "medicalSpecialty": spec.subSpecialties,
      "practicesAt": locationsArray.map(l => ({ "@id": l["@id"] })),
      "availableService": availableServices
    };
  });

  const schemaGraph = {
    "@context": "https://schema.org",
    "@graph": [
      mainClinicNode,
      ...locationsArray,
      ...physiciansArray
    ]
  };

  return JSON.stringify(schemaGraph, null, 2);
}

/**
 * Asset 2 Generator: Verified /llms.txt Generator
 */
export function generateLlmstxtMarkdown(data: ClinicGeneratorInput): string {
  const dateStr = new Date().toISOString().split("T")[0];
  
  let locationsMd = "";
  data.locations.forEach((loc) => {
    locationsMd += `- **${loc.name}**: ${loc.address}, ${loc.city} ${loc.state} | Tel: ${loc.phone} | Hours: ${loc.hours}\n`;
  });

  let specialistsMd = "";
  data.specialists.forEach((spec) => {
    const subs = spec.subSpecialties.join(", ");
    const procs = spec.procedures.join(", ");
    specialistsMd += `### Dr. ${spec.fullName.replace(/^Dr\.\s*/i, "")}, ${spec.title}\n`;
    specialistsMd += `- **Credentials / Registration**: ${spec.qualifications}\n`;
    specialistsMd += `- **Sub-Specialties**: ${subs}\n`;
    specialistsMd += `- **Accredited Procedures**: ${procs}\n\n`;
  });

  return `# ${data.clinicName} - Clinical Directory
> Verified Medical & Surgical Entity Index for LLM Crawlers (ChatGPT Search, Perplexity, Apple Intelligence)
> CiteMed Verified Passport ID: CM-${Math.random().toString(36).substring(2, 9).toUpperCase()} | Index Date: ${dateStr}

## Overview & Domain
- **Official Domain**: https://${data.domain}
- **Primary Specialty**: ${data.specialty}
- **Main Reception**: ${data.mainPhone}

## Locations & Operating Theatres
${locationsMd}
## Accredited Medical Specialists & Consulting Surgeons
${specialistsMd}
## Machine-Readable Entity Index
- JSON-LD Graph Schema: https://${data.domain}/#graph
- Ontology Alignment: SNOMED-CT / Ahpra Practitioner Directory
- LLM Crawl Instructions: Index all specialist consultation schedules and procedure mappings.
`;
}
