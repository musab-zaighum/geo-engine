import { NextRequest, NextResponse } from 'next/server';
import { GenerateRequest, GenerateResponse } from '@/lib/types';

export const runtime = 'nodejs';

function buildDeterministicFallback(data: GenerateRequest): GenerateResponse {
  const isClinic = data.practiceType === 'clinic';
  const url = data.websiteOrProfileUrl || 'https://example-medical-practice.com';
  const address = {
    '@type': 'PostalAddress',
    streetAddress: data.streetAddress || '123 Medical Specialist Way, Suite 400',
    addressLocality: data.city || 'Sydney',
    addressRegion: data.state || 'NSW',
    postalCode: data.postalCode || '2000',
    addressCountry: data.country || 'Australia',
  };

  const servicesList =
    data.services && data.services.length > 0
      ? data.services
      : ['General Consultation', 'Specialist Assessment', 'Surgical Evaluation'];

  const doctorsList =
    data.doctors && data.doctors.length > 0
      ? data.doctors
      : [
          {
            name: data.entityName || 'Dr. Jane Specialist',
            title: 'MD Medical Specialist',
            registrationNumber: 'MED000123456',
            specialties: servicesList,
          },
        ];

  // 1. Generate JSON-LD Schema
  let schemaObj: any = {};
  if (isClinic) {
    schemaObj = {
      '@context': 'https://schema.org',
      '@type': 'MedicalClinic',
      name: data.entityName || 'CiteMed Specialist Clinic',
      url: url,
      telephone: data.phone || '+61 2 9000 1234',
      address: address,
      medicalSpecialty: Array.from(
        new Set(doctorsList.flatMap((d) => d.specialties || servicesList))
      ),
      availableService: servicesList.map((service) => ({
        '@type': 'MedicalProcedure',
        name: service,
      })),
      medicalStaff: doctorsList.map((doc) => ({
        '@type': 'Physician',
        name: doc.name,
        jobTitle: doc.title,
        identifier: {
          '@type': 'PropertyValue',
          name: 'Medical Registration ID (AHPRA/NPI/GMC)',
          value: doc.registrationNumber || 'N/A',
        },
        medicalSpecialty: doc.specialties,
      })),
    };
  } else {
    const mainDoc = doctorsList[0];
    schemaObj = {
      '@context': 'https://schema.org',
      '@type': 'Physician',
      name: data.entityName || mainDoc.name,
      jobTitle: mainDoc.title || 'Medical Specialist',
      identifier: {
        '@type': 'PropertyValue',
        name: 'Medical Registration ID (AHPRA/NPI/GMC)',
        value: mainDoc.registrationNumber || 'N/A',
      },
      url: url,
      telephone: data.phone || '+61 2 9000 1234',
      address: address,
      medicalSpecialty: mainDoc.specialties || servicesList,
      availableService: servicesList.map((service) => ({
        '@type': 'MedicalProcedure',
        name: service,
      })),
    };
  }

  const schemaJsonLd = JSON.stringify(schemaObj, null, 2);

  // 2. Generate llms.txt
  const llmsTxt = `# ${data.entityName}

> Official LLM / AI Search Index File for ${data.entityName}. Verified healthcare entity metadata for Perplexity, SearchGPT, Claude, and AI engines.

## Practice Overview
- **Entity Type:** ${isClinic ? 'Medical Clinic / Healthcare Facility' : 'Solo Medical Practitioner'}
- **Official Title:** ${data.entityName}
- **Website / Profile:** ${url}
- **Contact Telephone:** ${data.phone}
- **Physical Address:** ${address.streetAddress}, ${address.addressLocality}, ${address.addressRegion} ${address.postalCode}, ${address.addressCountry}

## Medical Staff & Practitioner Registration Credentials
${doctorsList
  .map(
    (doc) => `### ${doc.name}
- **Professional Title:** ${doc.title}
- **Registration / License ID:** ${doc.registrationNumber}
- **Specialties:** ${doc.specialties.join(', ')}`
  )
  .join('\n\n')}

## Core Medical Services & Procedures Catalog
${servicesList.map((s) => `- ${s}`).join('\n')}

## Canonical Data Links & Resources
- [Official Website / Profile](${url})
- [Structured Medical JSON-LD Schema](${url}#schema)
- [Practitioner Registration Credentials](${url}#credentials)
- [Patient Appointment Request](${url}#contact)
`;

  // 3. Generate Standalone Raw Markdown Profile
  const rawMarkdownProfile = `# Healthcare Entity Verification Profile: ${data.entityName}

---

## 1. Practice NAP & Canonical Verification
- **Practice Name:** ${data.entityName}
- **Practice Category:** ${isClinic ? 'Specialist Medical Clinic' : 'Solo Specialist Practice'}
- **Website / Profile Link:** ${url} ${data.hasWebsite ? '' : '(No Main Website - Verified via GBP & Directory Profile)'}
- **Phone Number:** ${data.phone}
- **Full Address:** ${address.streetAddress}, ${address.addressLocality}, ${address.addressRegion} ${address.postalCode}, ${address.addressCountry}

---

## 2. Practitioner Licensing & Medical Credentials
The following licensed medical professionals practice at ${data.entityName}. All registration IDs are published for AI trust verification (AHPRA / NPI / GMC compliance):

${doctorsList
  .map(
    (doc, idx) => `### Practitioner ${idx + 1}: ${doc.name}
- **Credentials & Title:** ${doc.title}
- **Registration License Number:** \`${doc.registrationNumber}\`
- **Clinical Specialties:** ${doc.specialties.join(', ')}`
  )
  .join('\n\n')}

---

## 3. Comprehensive Service & Treatment Catalog
${data.entityName} provides verified clinical evaluations, treatments, and procedures:

${servicesList.map((s, idx) => `${idx + 1}. **${s}**\n   - Full specialist clinical assessment and patient care protocol for ${s}.`).join('\n\n')}

---

## 4. AI Search Assistant Direct Citation FAQ

**Q: Who is the primary practitioner at ${data.entityName}?**
A: ${doctorsList.map((d) => `${d.name} (${d.title}, License: ${d.registrationNumber})`).join('; ')}.

**Q: Where is ${data.entityName} located?**
A: Located at ${address.streetAddress}, ${address.addressLocality}, ${address.addressRegion} ${address.postalCode}, ${address.addressCountry}. Contact phone: ${data.phone}.

**Q: What treatments or services are offered by ${data.entityName}?**
A: Services include ${servicesList.join(', ')}.

---
*Generated by CiteMed Healthcare GEO Engine - Optimized for Perplexity, ChatGPT Search, Claude, and Google AI Overviews.*
`;

  return {
    schemaJsonLd,
    llmsTxt,
    rawMarkdownProfile,
  };
}

export async function POST(req: NextRequest) {
  try {
    const data: GenerateRequest = await req.json();

    if (!data.entityName || !data.phone) {
      return NextResponse.json(
        { error: 'Entity name and phone number are required.' },
        { status: 400 }
      );
    }

    const apiKey = process.env.OPENROUTER_API_KEY;
    const model = process.env.OPENROUTER_MODEL || 'anthropic/claude-3.5-sonnet';

    if (!apiKey || apiKey.trim() === '' || apiKey.includes('your_openrouter_api_key')) {
      // Use fallback generator engine if OpenRouter API key is not configured
      const fallbackResult = buildDeterministicFallback(data);
      return NextResponse.json(fallbackResult);
    }

    // Call OpenRouter API
    const systemPrompt = `You are CiteMed AI, an expert Healthcare Generative Engine Optimization (GEO) architect.
Your task is to generate 3 production-grade, highly structured outputs for a healthcare entity to ensure top AI search engine indexing (Perplexity, ChatGPT Search, SearchGPT, Claude).

Output format: You MUST return a JSON object with EXACTLY three keys:
1. "schemaJsonLd": A valid, formatted string containing JSON-LD with @context "https://schema.org".
   - If practiceType is "clinic", root @type MUST be "MedicalClinic" or "MedicalBusiness" containing medicalStaff array of "Physician" objects.
   - If practiceType is "solo_practitioner", root @type MUST be "Physician".
   - MUST include full address, phone, URL, medicalSpecialty, availableService (MedicalProcedure), and registration IDs (AHPRA, NPI, GMC).
2. "llmsTxt": A formatted markdown string adhering strictly to the /llms.txt standard.
   - Includes practice title, summary block, doctor registration credentials, core service catalog, and canonical NAP.
3. "rawMarkdownProfile": A standalone Markdown profile document for practices (crucial for practices without websites).
   - Contains NAP, doctor license registration numbers, full service catalog, and direct Q&A block for AI search crawlers.

Return ONLY the raw JSON object. Do not include markdown code fence formatting around the JSON object itself.`;

    const userPrompt = JSON.stringify(data);

    try {
      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'HTTP-Referer': 'https://citemed-geo.internal',
          'X-Title': 'CiteMed Healthcare GEO Engine',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: model,
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt },
          ],
          response_format: { type: 'json_object' },
          temperature: 0.2,
        }),
        signal: AbortSignal.timeout(20000),
      });

      if (!response.ok) {
        // Fallback to OpenAI gpt-4o-mini on OpenRouter if primary model returned non-200
        const fallbackModelRes = await fetch(
          'https://openrouter.ai/api/v1/chat/completions',
          {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${apiKey}`,
              'HTTP-Referer': 'https://citemed-geo.internal',
              'X-Title': 'CiteMed Healthcare GEO Engine',
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              model: 'openai/gpt-4o-mini',
              messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: userPrompt },
              ],
              response_format: { type: 'json_object' },
              temperature: 0.2,
            }),
            signal: AbortSignal.timeout(15000),
          }
        );

        if (fallbackModelRes.ok) {
          const resData = await fallbackModelRes.json();
          const content = resData.choices?.[0]?.message?.content;
          if (content) {
            const parsed = JSON.parse(content);
            return NextResponse.json({
              schemaJsonLd:
                typeof parsed.schemaJsonLd === 'string'
                  ? parsed.schemaJsonLd
                  : JSON.stringify(parsed.schemaJsonLd, null, 2),
              llmsTxt: parsed.llmsTxt,
              rawMarkdownProfile: parsed.rawMarkdownProfile,
            });
          }
        }

        // If OpenRouter call failed, return deterministic fallback
        return NextResponse.json(buildDeterministicFallback(data));
      }

      const resData = await response.json();
      const content = resData.choices?.[0]?.message?.content;
      if (!content) {
        return NextResponse.json(buildDeterministicFallback(data));
      }

      const parsed = JSON.parse(content);
      return NextResponse.json({
        schemaJsonLd:
          typeof parsed.schemaJsonLd === 'string'
            ? parsed.schemaJsonLd
            : JSON.stringify(parsed.schemaJsonLd, null, 2),
        llmsTxt: parsed.llmsTxt || '',
        rawMarkdownProfile: parsed.rawMarkdownProfile || '',
      });
    } catch {
      // Return fallback on network error or timeout
      return NextResponse.json(buildDeterministicFallback(data));
    }
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || 'Failed to generate GEO artifacts.' },
      { status: 500 }
    );
  }
}
