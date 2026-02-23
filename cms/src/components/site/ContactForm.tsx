'use client'

import { FormEvent, useState } from 'react'

type ContactPayload = {
  name: string
  email: string
  phone: string
  subject: string
  message: string
  website: string
}

const INITIAL_FORM: ContactPayload = {
  name: '',
  email: '',
  phone: '',
  subject: '',
  message: '',
  website: '',
}

export function ContactForm() {
  const [form, setForm] = useState<ContactPayload>(INITIAL_FORM)
  const [isSubmitting, setSubmitting] = useState(false)
  const [notice, setNotice] = useState<{ kind: 'error' | 'success'; text: string } | null>(null)

  const updateField = (field: keyof ContactPayload, value: string) => {
    setForm((current) => ({ ...current, [field]: value }))
  }

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setNotice(null)
    setSubmitting(true)

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })

      const payload = (await response.json()) as { message?: string; error?: string }

      if (!response.ok) {
        throw new Error(payload.error || 'Unable to send your message.')
      }

      setNotice({
        kind: 'success',
        text: payload.message || 'Thanks. We received your inquiry and will follow up soon.',
      })
      setForm(INITIAL_FORM)
    } catch (error) {
      setNotice({
        kind: 'error',
        text: error instanceof Error ? error.message : 'Unable to send your message.',
      })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form className="contactForm" onSubmit={onSubmit}>
      <div className="formRow twoUp">
        <label className="fieldLabel">
          Name
          <input
            className="inputField"
            type="text"
            value={form.name}
            onChange={(event) => updateField('name', event.target.value)}
            required
            autoComplete="name"
          />
        </label>
        <label className="fieldLabel">
          Email
          <input
            className="inputField"
            type="email"
            value={form.email}
            onChange={(event) => updateField('email', event.target.value)}
            required
            autoComplete="email"
          />
        </label>
      </div>

      <div className="formRow twoUp">
        <label className="fieldLabel">
          Phone
          <input
            className="inputField"
            type="tel"
            value={form.phone}
            onChange={(event) => updateField('phone', event.target.value)}
            autoComplete="tel"
          />
        </label>
        <label className="fieldLabel">
          Subject
          <input
            className="inputField"
            type="text"
            value={form.subject}
            onChange={(event) => updateField('subject', event.target.value)}
            placeholder="General inquiry"
          />
        </label>
      </div>

      <label className="fieldLabel">
        Message
        <textarea
          className="textareaField"
          value={form.message}
          onChange={(event) => updateField('message', event.target.value)}
          rows={6}
          required
        />
      </label>

      <label className="honeypotField" aria-hidden="true">
        Leave this field empty
        <input
          tabIndex={-1}
          autoComplete="off"
          value={form.website}
          onChange={(event) => updateField('website', event.target.value)}
        />
      </label>

      <button type="submit" className="submitButton" disabled={isSubmitting}>
        {isSubmitting ? 'Sending...' : 'Send Inquiry'}
      </button>

      {notice && <p className={`formNotice ${notice.kind}`}>{notice.text}</p>}
    </form>
  )
}
