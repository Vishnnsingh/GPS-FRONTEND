import React, { useState } from 'react'
import WebsiteLayout from '../../Components/Website/WebsiteLayout'

function Contact() {
  const SCHOOL_NAME = import.meta.env.VITE_SCHOOL_NAME || 'Gyanoday Public School'
  const [form, setForm] = useState({ name: '', phone: '', message: '' })
  const [sent, setSent] = useState(false)

  const onChange = (e) => {
    const { name, value } = e.target
    setForm((p) => ({ ...p, [name]: value }))
    setSent(false)
  }

  const onSubmit = (e) => {
    e.preventDefault()
    setSent(true)
    // No backend wired yet; keeping it as a UI-only form.
  }

  return (
    <WebsiteLayout>
      <section className="max-w-6xl mx-auto px-4 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <p className="text-xs font-black text-[#137fec]">Contact</p>
            <h1 className="mt-1 text-3xl font-black text-[#0d141b] dark:text-white">Get in touch</h1>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
              For admissions, fees, transport or general queries — contact {SCHOOL_NAME}.
            </p>

            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { icon: 'call', title: 'Phone', value: '+91 00000 00000' },
                { icon: 'mail', title: 'Email', value: 'info@school.edu' },
                { icon: 'location_on', title: 'Address', value: 'School Road, Your City' },
                { icon: 'schedule', title: 'Timing', value: 'Mon-Sat: 8:00 AM - 2:00 PM' },
              ].map((c) => (
                <div
                  key={c.title}
                  className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-5"
                >
                  <div className="h-10 w-10 rounded-xl bg-[#137fec]/10 text-[#137fec] flex items-center justify-center">
                    <span className="material-symbols-outlined">{c.icon}</span>
                  </div>
                  <p className="mt-3 text-sm font-black">{c.title}</p>
                  <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{c.value}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6">
            <p className="text-sm font-black">Send a message</p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Fill details, we will contact you.
            </p>

            {sent ? (
              <div className="mt-4 p-3 rounded-xl bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
                <p className="text-sm font-bold text-green-700 dark:text-green-300">
                  Message saved (UI only). Backend connect kar denge jab chaho.
                </p>
              </div>
            ) : null}

            <form className="mt-4 space-y-3" onSubmit={onSubmit}>
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Name
                </label>
                <input
                  name="name"
                  value={form.name}
                  onChange={onChange}
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#137fec]/40"
                  placeholder="Your name"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Phone
                </label>
                <input
                  name="phone"
                  value={form.phone}
                  onChange={onChange}
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#137fec]/40"
                  placeholder="Your mobile number"
                  inputMode="tel"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Message
                </label>
                <textarea
                  name="message"
                  value={form.message}
                  onChange={onChange}
                  className="w-full min-h-28 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#137fec]/40"
                  placeholder="Write your query..."
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full inline-flex items-center justify-center gap-2 font-black px-5 py-3 rounded-xl bg-[#137fec] text-white hover:bg-[#137fec]/90 shadow-lg shadow-[#137fec]/20"
              >
                <span className="material-symbols-outlined">send</span>
                Send
              </button>
            </form>
          </div>
        </div>
      </section>
    </WebsiteLayout>
  )
}

export default Contact


