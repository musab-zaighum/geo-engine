import { NextResponse } from "next/server";
import { doctorProfileSchema, sanitizeSlug } from "@/lib/schema";

export { sanitizeSlug };

export function sanitizeText(input: any, maxLength = 2000): string {
  if (typeof input !== "string") return "";
  const stripped = input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    .replace(/<[^>]+>/g, "");
  return stripped.slice(0, maxLength).trim();
}

export async function POST(req: Request) {
  try {
    let body: any = {};
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({
        error: "Validation failed: Malformed JSON body",
        fieldErrors: { body: "A valid JSON object payload is required" }
      }, { status: 400 });
    }

    // Map potential legacy field names to standard schema
    const candidateData = {
      name: body?.name || body?.doctorName || "",
      specialty: body?.specialty || body?.category || "",
      clinicName: body?.clinicName || body?.practiceName || "",
      primaryService: body?.primaryService || body?.notes || "",
      location: body?.location || body?.city || null,
      website: body?.website || body?.url || null,
      phone: body?.phone || null,
      email: body?.email || null,
      notes: body?.notes || null,
      additionalClinics: body?.additionalClinics || []
    };

    // Strict Zod Validation Check
    const validationResult = doctorProfileSchema.safeParse(candidateData);

    if (!validationResult.success) {
      const fieldErrors: Record<string, string> = {};
      validationResult.error.issues.forEach((issue) => {
        const fieldName = issue.path[0] ? String(issue.path[0]) : "form";
        if (!fieldErrors[fieldName]) {
          fieldErrors[fieldName] = issue.message;
        }
      });

      return NextResponse.json({
        error: "Strict validation failed: Missing or invalid required fields.",
        fieldErrors
      }, { status: 400 });
    }

    const validated = validationResult.data;

    // Sanitize values
    const name = sanitizeText(validated.name, 120);
    const specialty = sanitizeText(validated.specialty, 80);
    const clinicName = sanitizeText(validated.clinicName, 120);
    const primaryService = sanitizeText(validated.primaryService, 3000);
    const location = validated.location ? sanitizeText(validated.location, 120) : null;
    const website = validated.website ? sanitizeText(validated.website, 200) : null;
    const phone = validated.phone ? sanitizeText(validated.phone, 50) : null;
    const email = validated.email ? sanitizeText(validated.email, 100) : null;

    // Build Slugs for multi-clinic doctor routing
    const doctorSlug = sanitizeSlug(name);
    const clinicSlug = sanitizeSlug(clinicName);
    const passportPath = `/p/${clinicSlug}/${doctorSlug}`;
    const legacySlug = doctorSlug;

    // 4. Build Linked @graph Schema (Gracefully handles optional location and website)
    const orgId = `https://aethergeo.ai/p/${clinicSlug}/${doctorSlug}#org`;
    const physicianId = `https://aethergeo.ai/p/${clinicSlug}/${doctorSlug}#physician`;
    const clinicId = `https://aethergeo.ai/p/${clinicSlug}#clinic`;

    const schemaOrgNode: any = {
      "@type": "MedicalClinic",
      "@id": clinicId,
      "name": clinicName,
      "url": website || `https://aethergeo.ai/p/${clinicSlug}`,
    };

    if (location) {
      schemaOrgNode["address"] = {
        "@type": "PostalAddress",
        "addressLocality": location,
        "addressCountry": "AU"
      };
    }

    if (phone) {
      schemaOrgNode["telephone"] = phone;
    }

    const physicianNode: any = {
      "@type": "Physician",
      "@id": physicianId,
      "name": name,
      "medicalSpecialty": specialty,
      "description": primaryService,
      "hospitalAffiliation": { "@id": clinicId },
      "url": website || `https://aethergeo.ai${passportPath}`,
    };

    if (phone) {
      physicianNode["telephone"] = phone;
    }

    if (email) {
      physicianNode["email"] = email;
    }

    // Additional clinics linked
    const additionalClinicNodes = (validated.additionalClinics || []).map((affil, idx) => {
      const affilSlug = affil.clinicSlug || sanitizeSlug(affil.clinicName);
      const affilId = `https://aethergeo.ai/p/${affilSlug}#clinic`;
      const node: any = {
        "@type": "MedicalClinic",
        "@id": affilId,
        "name": affil.clinicName,
        "url": affil.website || `https://aethergeo.ai/p/${affilSlug}/${doctorSlug}`
      };
      if (affil.location) {
        node["address"] = {
          "@type": "PostalAddress",
          "addressLocality": affil.location,
          "addressCountry": "AU"
        };
      }
      return node;
    });

    const schemaGraph = {
      "@context": "https://schema.org",
      "@graph": [
        schemaOrgNode,
        physicianNode,
        ...additionalClinicNodes
      ]
    };

    // 5. Build llms.txt standard digest (Gracefully handling optional fields)
    let llmsCapabilities = `- Specialty: ${specialty}\n- Primary Clinic: ${clinicName}`;
    if (location) {
      llmsCapabilities += `\n- Practice Location: ${location}`;
    } else {
      llmsCapabilities += `\n- Practice Location: Multi-Location Practice (Visiting Practitioner)`;
    }

    if (phone) {
      llmsCapabilities += `\n- Direct Intake: ${phone}`;
    }
    if (email) {
      llmsCapabilities += `\n- Official Inquiries: ${email}`;
    }
    if (website) {
      llmsCapabilities += `\n- Official Website: ${website}`;
    }

    let additionalClinicsMarkdown = "";
    if (validated.additionalClinics && validated.additionalClinics.length > 0) {
      additionalClinicsMarkdown = `\n\n## Affiliated Visiting Clinics\n` +
        validated.additionalClinics.map(c => `- ${c.clinicName}${c.location ? ` (${c.location})` : ""}: https://aethergeo.ai/p/${c.clinicSlug || sanitizeSlug(c.clinicName)}/${doctorSlug}`).join("\n");
    }

    const llmsTxt = `# ${name} (${specialty})\n> Verified Medical Practitioner & Multi-Clinic Generative Search Knowledge Digest.\n\n## Core Capabilities\n${llmsCapabilities}\n\n## Procedures & Specialty Services\n${primaryService}${additionalClinicsMarkdown}\n\n## Section Guides\n- [Official Credentials](https://aethergeo.ai${passportPath}#credentials)\n- [Booking & Intake](https://aethergeo.ai${passportPath}#booking)\n- [Clinic Affiliations](https://aethergeo.ai${passportPath}#clinics)`;

    const passportRecord = {
      doctorSlug,
      clinicSlug,
      passportPath,
      legacySlug,
      slug: legacySlug,
      name,
      specialty,
      clinicName,
      primaryService,
      location,
      website,
      phone,
      email,
      additionalClinics: validated.additionalClinics || [],
      threatScore: 96,
      isVerified: true,
      qrUrl: `https://aethergeo.ai${passportPath}`,
      schemaGraph,
      llmsTxt,
      robotsTxt: `User-agent: GPTBot\nAllow: ${passportPath}\n\nUser-agent: PerplexityBot\nAllow: ${passportPath}\n\nUser-agent: ClaudeBot\nAllow: ${passportPath}\n\nUser-agent: Applebot-Extended\nAllow: ${passportPath}`,
      updatedAt: new Date().toISOString()
    };

    return NextResponse.json(passportRecord, { status: 200 });
  } catch (err: any) {
    return NextResponse.json({
      error: "Internal error processing passport record",
      message: err?.message || "Unknown error"
    }, { status: 500 });
  }
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const rawSlug = searchParams.get("slug") || "dr-sarah-chen";
  const slug = sanitizeSlug(rawSlug);

  return NextResponse.json({
    slug,
    name: "Dr. Sarah Chen",
    specialty: "Diagnostic Radiology & Precision Imaging",
    clinicName: "Metropolitan Diagnostic & Surgical Clinic",
    threatScore: 96,
    isVerified: true,
    location: "Sydney CBD, NSW",
    phone: "+61 2 9231 0000",
    qrUrl: `https://aethergeo.ai/p/metro-clinic/${slug}`,
    llmsTxtUrl: `https://aethergeo.ai/p/metro-clinic/${slug}/llms.txt`,
    status: "active"
  }, { status: 200 });
}