import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { name, email, message } = (await req.json()) as {
      name?: string;
      email?: string;
      message?: string;
    };

    if (!name || !email || !message) {
      return NextResponse.json({ error: "missing_fields" }, { status: 400 });
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "invalid_email" }, { status: 400 });
    }

    const key = process.env.RESEND_API_KEY;
    if (!key) {
      // Backend not configured yet — the form surfaces a "email me directly" fallback.
      return NextResponse.json({ error: "not_configured" }, { status: 503 });
    }

    const { Resend } = await import("resend");
    const resend = new Resend(key);
    await resend.emails.send({
      from: process.env.CONTACT_FROM ?? "adelinewen.com <onboarding@resend.dev>",
      to: process.env.CONTACT_TO ?? "ywen8@uw.edu",
      replyTo: email,
      subject: `Portfolio contact — ${name}`,
      text: `From: ${name} <${email}>\n\n${message}`,
    });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "send_failed" }, { status: 500 });
  }
}
