import { NextResponse } from 'next/server'
import { getPayload } from 'payload'

import config from '@/payload.config'

type ContactPayload = {
  name?: string
  email?: string
  phone?: string
  subject?: string
  message?: string
  website?: string
}

function normalizeText(value: string | undefined, maxLength: number): string {
  if (!value) return ''
  return value.trim().replace(/\s+/g, ' ').slice(0, maxLength)
}

export async function POST(request: Request) {
  let payload: ContactPayload

  try {
    payload = (await request.json()) as ContactPayload
  } catch {
    return NextResponse.json({ error: 'Invalid request payload.' }, { status: 400 })
  }

  // Honeypot trap.
  if (payload.website && payload.website.trim().length > 0) {
    return NextResponse.json({ message: 'Thanks. Your request has been received.' })
  }

  const name = normalizeText(payload.name, 120)
  const email = normalizeText(payload.email, 120)
  const phone = normalizeText(payload.phone, 60)
  const subject = normalizeText(payload.subject, 120) || 'General inquiry'
  const message = normalizeText(payload.message, 3000)

  if (!name || !email || !message) {
    return NextResponse.json(
      { error: 'Name, email, and message are required fields.' },
      { status: 400 },
    )
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: 'Please enter a valid email address.' }, { status: 400 })
  }

  try {
    const payloadClient = await getPayload({ config: await config })
    const siteSettings = await payloadClient.findGlobal({
      slug: 'site-settings',
    })

    await payloadClient.sendEmail({
      to: siteSettings.supportEmail,
      subject: `[Website Inquiry] ${subject}`,
      replyTo: email,
      text: `Name: ${name}
Email: ${email}
Phone: ${phone || 'Not provided'}

Message:
${message}`,
    })

    return NextResponse.json({
      message: 'Thanks. We received your inquiry and will get back to you shortly.',
    })
  } catch {
    return NextResponse.json(
      { error: 'The inquiry service is temporarily unavailable. Please try again shortly.' },
      { status: 503 },
    )
  }
}
