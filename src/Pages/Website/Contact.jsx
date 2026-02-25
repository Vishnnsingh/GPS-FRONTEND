import React, { useState } from 'react'
import WebsiteLayout from '../../Components/Website/WebsiteLayout'
import { contactPhotos } from '../../assets/websiteImages'

const contactItems = [
  { icon: 'call', title: 'Phone', value: '+91 7870225302', link: 'tel:+917870225302' },
  { icon: 'mail', title: 'Email', value: 'gpschool2025@gmail.com', link: 'mailto:gpschool2025@gmail.com' },
  { icon: 'location_on', title: 'Address', value: 'Belaspur Dainmanwa Road, Harinagar, Bihar 845103', link: 'https://maps.google.com' },
  { icon: 'schedule', title: 'Office Hours', value: 'Mon - Sat, 8:00 AM to 2:00 PM', link: '#' },
]

function Contact() {
  const SCHOOL_NAME = import.meta.env.VITE_SCHOOL_NAME || 'Gyanoday Public School'
  const [form, setForm] = useState({ name: '', phone: '', email: '', message: '' })
  const [sent, setSent] = useState(false)

  const onChange = (event) => {
    const { name, value } = event.target
    setForm((prev) => ({ ...prev, [name]: value }))
    setSent(false)
  }

  const onSubmit = (event) => {
    event.preventDefault()
    setSent(true)
  }

  return (
    <WebsiteLayout>
      <section className="ryme-section">
        <div className="ryme-shell">
          <div className="ryme-card p-6 sm:p-8">
            <span className="ryme-tag">Contact desk</span>
            <h1 className="mt-4 text-4xl font-extrabold text-white sm:text-5xl">Talk to {SCHOOL_NAME}</h1>
            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-slate-200 sm:text-base">
              For admissions, fees, transport, results or general school support, connect with us and the team will
              respond quickly.
            </p>
          </div>
        </div>
      </section>

      <section className="ryme-section pt-0">
        <div className="ryme-shell">
          <div className="ryme-grid lg:grid-cols-[0.9fr_1.1fr]">
            <article className="ryme-card p-5 sm:p-6">
              <h2 className="text-2xl font-extrabold text-white">Reach out directly</h2>
              <p className="mt-2 text-sm text-slate-200">Use any preferred channel and we will assist you.</p>

              <img src={contactPhotos.hero} alt="Campus support" className="mt-5 h-52 w-full rounded-xl object-cover" />

              <div className="mt-5 space-y-3">
                {contactItems.map((item) => (
                  <a
                    key={item.title}
                    href={item.link}
                    target={item.link.startsWith('http') ? '_blank' : undefined}
                    rel={item.link.startsWith('http') ? 'noopener noreferrer' : undefined}
                    className="ryme-card-soft flex items-start gap-3 p-3"
                  >
                    <span className="material-symbols-outlined text-cyan-300">{item.icon}</span>
                    <span>
                      <p className="text-xs uppercase tracking-[0.14em] text-cyan-100/80">{item.title}</p>
                      <p className="text-sm text-slate-100/95">{item.value}</p>
                    </span>
                  </a>
                ))}
              </div>
            </article>

            <article className="ryme-card p-5 sm:p-6">
              <h2 className="text-2xl font-extrabold text-white">Send a message</h2>
              <p className="mt-2 text-sm text-slate-200">Share your query and we will get back within one business day.</p>

              {sent ? (
                <div className="mt-4 rounded-xl border border-emerald-300/30 bg-emerald-400/10 p-3 text-sm text-emerald-100">
                  Message received. Thank you, we will contact you soon.
                </div>
              ) : null}

              <form className="mt-5 space-y-3" onSubmit={onSubmit}>
                <div>
                  <label className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.12em] text-slate-200">
                    Full Name
                  </label>
                  <input
                    name="name"
                    value={form.name}
                    onChange={onChange}
                    className="ryme-input"
                    placeholder="Enter full name"
                    required
                  />
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <label className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.12em] text-slate-200">
                      Phone
                    </label>
                    <input
                      name="phone"
                      value={form.phone}
                      onChange={onChange}
                      className="ryme-input"
                      placeholder="9876543210"
                      required
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.12em] text-slate-200">
                      Email
                    </label>
                    <input
                      name="email"
                      type="email"
                      value={form.email}
                      onChange={onChange}
                      className="ryme-input"
                      placeholder="name@email.com"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.12em] text-slate-200">
                    Message
                  </label>
                  <textarea
                    name="message"
                    value={form.message}
                    onChange={onChange}
                    className="ryme-input min-h-36 resize-none"
                    placeholder="Write your question..."
                    required
                  />
                </div>

                <button type="submit" className="ryme-button w-full">
                  <span className="material-symbols-outlined text-base">send</span>
                  Submit Message
                </button>
              </form>
            </article>
          </div>
        </div>
      </section>

      <section className="ryme-section pt-0">
        <div className="ryme-shell">
          <div className="ryme-card overflow-hidden">
            <div className="relative h-72 sm:h-96">
              <img src={contactPhotos.location} alt="School campus location" className="h-full w-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#031223] via-[#031223]/58 to-[#031223]/15"></div>
              <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-7">
                <p className="text-xs uppercase tracking-[0.14em] text-cyan-100/90">Visit us</p>
                <p className="mt-1 text-2xl font-bold text-white sm:text-4xl">School Campus Location</p>
                <p className="mt-1 max-w-3xl text-sm text-slate-100/95 sm:text-lg">
                  Belaspur Dainmanwa Road, Harinagar, West Champaran, Bihar
                </p>
                <a
                  href="https://maps.google.com/?q=Belaspur+Dainmanwa+Road+Harinagar+West+Champaran+Bihar"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-flex items-center gap-2 rounded-full border border-cyan-200/35 bg-cyan-400/15 px-4 py-2 text-sm font-semibold text-cyan-50 backdrop-blur-sm hover:bg-cyan-300/20"
                >
                  <span className="material-symbols-outlined text-base">near_me</span>
                  Open Directions
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </WebsiteLayout>
  )
}

export default Contact
