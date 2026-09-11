import type { Metadata } from "next";

export async function generateMetadata({ 
  params 
}: { 
  params: Promise<{ clinic: string; doctor: string }> | { clinic: string; doctor: string } 
}): Promise<Metadata> {
  const resolved = await params;
  const clinicSlug = resolved?.clinic || "clinic";
  const doctorSlug = resolved?.doctor || "doctor";
  
  const clinicName = decodeURIComponent(clinicSlug)
    .split("-")
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");

  const doctorName = decodeURIComponent(doctorSlug)
    .split("-")
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");

  return {
    title: `${doctorName} at ${clinicName} | Verified AI Search Passport`,
    description: `Official machine-readable AI Passport for ${doctorName} practicing at ${clinicName}. Validated for ChatGPT, Perplexity, and Apple Intelligence.`,
    alternates: {
      canonical: `https://aethergeo.ai/p/${clinicSlug}/${doctorSlug}`,
    },
    openGraph: {
      title: `${doctorName} - ${clinicName} AI Passport`,
      description: `Generative Engine Optimization profile for ${doctorName} at ${clinicName}. Doctor credentials, clinic services, and bot crawler permissibility.`,
      url: `https://aethergeo.ai/p/${clinicSlug}/${doctorSlug}`,
      siteName: "AetherGEO",
      type: "profile",
    },
  };
}

export default function MultiClinicDoctorLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}