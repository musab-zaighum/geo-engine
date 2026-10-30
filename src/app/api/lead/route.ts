import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    let body: any = {};
    try {
      body = await req.json();
    } catch {
      body = {};
    }

    const { domain, name, email, phone, notes, webhookUrl } = body;

    if (!domain || !email) {
      return NextResponse.json(
        { error: 'Practice domain and contact email are required.' },
        { status: 400 }
      );
    }

    const leadPayload = {
      event: 'lead_captured',
      timestamp: new Date().toISOString(),
      domain: domain.replace(/^https?:\/\//, '').replace(/\/$/, ''),
      contactName: name || 'Practice Director',
      email,
      phone: phone || '',
      notes: notes || 'Interested in 0-Error Schema & /llms.txt AI Fix Deployment',
      source: 'NexusRank1 Clinical Intelligence Audit Portal',
    };

    // If agency configured a custom Webhook URL (Zapier, GoHighLevel, Slack, Make)
    if (webhookUrl && typeof webhookUrl === 'string' && webhookUrl.startsWith('http')) {
      try {
        await fetch(webhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(leadPayload),
          signal: AbortSignal.timeout(6000),
        });
      } catch (err: any) {
        console.warn('Agency webhook delivery note:', err?.message || err);
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Practice consultation request registered successfully.',
      lead: leadPayload,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || 'Failed to capture lead.' },
      { status: 500 }
    );
  }
}
