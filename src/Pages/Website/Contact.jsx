import React, { useState } from 'react'
import WebsiteLayout from '../../Components/Website/WebsiteLayout'

function Contact() {
  const SCHOOL_NAME = import.meta.env.VITE_SCHOOL_NAME || 'Gyanoday Public School'
  const [form, setForm] = useState({ name: '', phone: '', email: '', message: '' })
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
      {/* Hero Section */}
      <section className="w-full bg-slate-50 dark:bg-slate-900 py-12 sm:py-16">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-10 sm:mb-12">
              <p className="text-xs sm:text-sm font-semibold text-[#137fec] mb-2">Get in Touch</p>
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-[#0d141b] dark:text-white">
                Contact Us
              </h1>
              <p className="mt-4 text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-3xl mx-auto leading-relaxed">
                For admissions, fees, transport or general queries — we're here to help. Reach out to {SCHOOL_NAME}
                and our team will get back to you promptly.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Information & Form */}
      <section className="w-full bg-white dark:bg-slate-800 py-12 sm:py-16">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12">
              {/* Contact Information */}
              <div>
                <p className="text-xs sm:text-sm font-semibold text-[#137fec] mb-2">Contact Information</p>
                <h2 className="text-2xl sm:text-3xl font-black text-[#0d141b] dark:text-white mb-6">
                  Reach Out to Us
                </h2>
                <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 mb-8 leading-relaxed">
                  We're available during school hours and always happy to assist with any questions about admissions,
                  academics, facilities, or general inquiries.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  {[
                    { icon: 'call', title: 'Phone', value: '+91 00000 00000', link: 'tel:+910000000000' },
                    { icon: 'mail', title: 'Email', value: 'info@school.edu', link: 'mailto:info@school.edu' },
                    { icon: 'location_on', title: 'Address', value: 'School Road, Your City, State - 000000', link: '#' },
                    { icon: 'schedule', title: 'Timing', value: 'Mon-Sat: 8:00 AM - 2:00 PM', link: '#' },
                  ].map((c) => (
                    <a
                      key={c.title}
                      href={c.link}
                      className="bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 p-5 sm:p-6 hover:shadow-lg hover:border-[#137fec]/30 transition-all duration-300"
                    >
                      <div className="h-12 w-12 rounded-xl bg-[#137fec] flex items-center justify-center mb-4 shadow-sm">
                        <span className="material-symbols-outlined text-white text-xl">{c.icon}</span>
                      </div>
                      <p className="text-sm font-black text-[#0d141b] dark:text-white mb-2">{c.title}</p>
                      <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">{c.value}</p>
                    </a>
                  ))}
                </div>

                {/* Additional Info */}
                <div className="mt-8 p-6 bg-[#137fec]/10 rounded-xl border border-[#137fec]/20">
                  <div className="flex items-start gap-4">
                    <div className="h-10 w-10 rounded-lg bg-[#137fec] flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined text-white">info</span>
                    </div>
                    <div>
                      <p className="text-sm font-black text-[#0d141b] dark:text-white mb-2">Quick Response</p>
                      <p className="text-sm text-slate-600 dark:text-slate-300">
                        We typically respond within 24 hours. For urgent matters, please call us directly.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact Form */}
              <div className="bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 p-6 sm:p-8">
                <div className="mb-6">
                  <p className="text-lg sm:text-xl font-black text-[#0d141b] dark:text-white">Send a Message</p>
                  <p className="text-sm text-slate-600 dark:text-slate-300 mt-2">
                    Fill in your details and we'll get back to you as soon as possible.
                  </p>
                </div>

                {sent ? (
                  <div className="mb-6 p-4 rounded-xl bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
                    <div className="flex items-center gap-3">
                      <span className="material-symbols-outlined text-green-600 dark:text-green-400">check_circle</span>
                      <p className="text-sm font-semibold text-green-700 dark:text-green-300">
                        Thank you! Your message has been sent. We'll contact you soon.
                      </p>
                    </div>
                  </div>
                ) : null}

                <form className="space-y-4" onSubmit={onSubmit}>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                      Full Name <span className="text-[#137fec]">*</span>
                    </label>
                    <input
                      name="name"
                      value={form.name}
                      onChange={onChange}
                      className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#137fec] focus:border-[#137fec] transition-colors"
                      placeholder="Enter your full name"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                      Phone Number <span className="text-[#137fec]">*</span>
                    </label>
                    <input
                      name="phone"
                      value={form.phone}
                      onChange={onChange}
                      className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#137fec] focus:border-[#137fec] transition-colors"
                      placeholder="Enter your mobile number"
                      inputMode="tel"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                      Email Address <span className="text-[#137fec]">*</span>
                    </label>
                    <input
                      name="email"
                      type="email"
                      value={form.email}
                      onChange={onChange}
                      className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#137fec] focus:border-[#137fec] transition-colors"
                      placeholder="Enter your email address"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                      Message <span className="text-[#137fec]">*</span>
                    </label>
                    <textarea
                      name="message"
                      value={form.message}
                      onChange={onChange}
                      className="w-full min-h-32 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#137fec] focus:border-[#137fec] transition-colors resize-none"
                      placeholder="Write your message or query here..."
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full inline-flex items-center justify-center gap-2 font-semibold px-6 py-3 rounded-xl bg-[#137fec] text-white hover:bg-[#0f6dd4] shadow-lg shadow-[#137fec]/30 transition-all duration-200"
                  >
                    <span className="material-symbols-outlined">send</span>
                    Send Message
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="w-full bg-slate-50 dark:bg-slate-900 py-12 sm:py-16">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-8">
              <p className="text-xs sm:text-sm font-semibold text-[#137fec] mb-2">Find Us</p>
              <h2 className="text-2xl sm:text-3xl font-black text-[#0d141b] dark:text-white">School Location</h2>
            </div>
            <div className="rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 shadow-lg">
              <div className="w-full h-64 sm:h-80 md:h-96 bg-slate-200 dark:bg-slate-700 flex items-center justify-center">
                <div className="text-center">
                  <span className="material-symbols-outlined text-6xl text-slate-400 dark:text-slate-500 mb-4">
                    map
                  </span>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Map integration can be added here</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </WebsiteLayout>
  )
}

export default Contact


