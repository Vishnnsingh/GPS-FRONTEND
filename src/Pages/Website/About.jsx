import React from 'react'
import { Link } from 'react-router-dom'
import WebsiteLayout from '../../Components/Website/WebsiteLayout'

function About() {
  const SCHOOL_NAME = import.meta.env.VITE_SCHOOL_NAME || 'Gyanoday Public School'

  return (
    <WebsiteLayout>
      <section className="max-w-6xl mx-auto px-4 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          <div>
            <p className="text-xs font-black text-[#137fec]">About</p>
            <h1 className="mt-1 text-3xl font-black text-[#0d141b] dark:text-white">{SCHOOL_NAME}</h1>
            <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">
              We are committed to quality education with discipline, character building and
              holistic development. Our teachers and staff create a supportive and modern learning
              environment for every child.
            </p>

            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                {
                  title: 'Mission',
                  desc: 'To provide a strong foundation in academics with values and confidence.',
                  icon: 'target',
                },
                {
                  title: 'Vision',
                  desc: 'To develop responsible citizens with curiosity, creativity and skills.',
                  icon: 'visibility',
                },
              ].map((c) => (
                <div
                  key={c.title}
                  className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-5"
                >
                  <div className="h-10 w-10 rounded-xl bg-[#137fec]/10 text-[#137fec] flex items-center justify-center">
                    <span className="material-symbols-outlined">{c.icon}</span>
                  </div>
                  <p className="mt-3 text-base font-black">{c.title}</p>
                  <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{c.desc}</p>
                </div>
              ))}
            </div>

            <div className="mt-6 flex flex-col sm:flex-row gap-3">
              <Link
                to="/contact"
                className="inline-flex items-center justify-center gap-2 font-black px-5 py-3 rounded-xl bg-[#137fec] text-white hover:bg-[#137fec]/90 shadow-lg shadow-[#137fec]/20"
              >
                <span className="material-symbols-outlined">call</span>
                Contact Us
              </Link>
              <Link
                to="/gallery"
                className="inline-flex items-center justify-center gap-2 font-black px-5 py-3 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-white dark:hover:bg-slate-900"
              >
                <span className="material-symbols-outlined">photo_library</span>
                View Gallery
              </Link>
            </div>
          </div>

          <div className="relative">
            <div className="rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 shadow-xl">
              <div
                className="w-full aspect-4/3 bg-cover bg-center"
                style={{
                  backgroundImage:
                    "url('https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=1200&q=80')",
                }}
              />
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3">
              {[
                { label: 'Smart Classes', value: 'Yes' },
                { label: 'Computer Lab', value: 'Yes' },
                { label: 'Library', value: 'Yes' },
                { label: 'Transport', value: 'Available' },
              ].map((i) => (
                <div
                  key={i.label}
                  className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4"
                >
                  <p className="text-sm font-black">{i.value}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{i.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 pb-12">
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 md:p-8">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#137fec]">format_quote</span>
            <p className="text-sm font-black">Principal's Message</p>
          </div>
          <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">
            “Education is not just about marks, it is about building character, confidence and skills.
            We encourage every student to learn with curiosity and grow with discipline.”
          </p>
          <p className="mt-4 text-xs font-bold text-slate-500 dark:text-slate-400">— Principal</p>
        </div>
      </section>
    </WebsiteLayout>
  )
}

export default About


