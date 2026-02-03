import React from 'react'
import { Link } from 'react-router-dom'
import WebsiteLayout from '../../Components/Website/WebsiteLayout'

function Home() {
  const SCHOOL_NAME = import.meta.env.VITE_SCHOOL_NAME || 'Gyanoday Public School'

  return (
    <WebsiteLayout>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-br from-[#137fec]/15 via-transparent to-transparent pointer-events-none"></div>
        <div className="max-w-6xl mx-auto px-4 py-12 md:py-16 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div>
            <p className="inline-flex items-center gap-2 text-xs font-black px-3 py-1 rounded-full bg-[#137fec]/10 text-[#137fec]">
              <span className="material-symbols-outlined text-sm">workspace_premium</span>
              Admissions Open
            </p>
            <h1 className="mt-4 text-3xl md:text-4xl font-black leading-tight text-[#0d141b] dark:text-white">
              Welcome to <span className="text-[#137fec]">{SCHOOL_NAME}</span>
            </h1>
            <p className="mt-3 text-sm md:text-base text-slate-600 dark:text-slate-300 max-w-xl">
              A modern learning environment focused on academics, discipline and holistic development.
              Explore our campus, facilities and student achievements.
            </p>

            <div className="mt-6 flex flex-col sm:flex-row gap-3">
              <Link
                to="/about"
                className="inline-flex items-center justify-center gap-2 font-black px-5 py-3 rounded-xl bg-[#137fec] text-white hover:bg-[#137fec]/90 shadow-lg shadow-[#137fec]/20"
              >
                <span className="material-symbols-outlined">info</span>
                Learn More
              </Link>
              <Link
                to="/contact"
                className="inline-flex items-center justify-center gap-2 font-black px-5 py-3 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-white dark:hover:bg-slate-900"
              >
                <span className="material-symbols-outlined">call</span>
                Contact Us
              </Link>
            </div>

            <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { label: 'Students', value: '1200+' },
                { label: 'Teachers', value: '60+' },
                { label: 'Years', value: '15+' },
                { label: 'Activities', value: '30+' },
              ].map((s) => (
                <div
                  key={s.label}
                  className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-3"
                >
                  <p className="text-lg font-black">{s.value}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{s.label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="absolute -inset-6 bg-linear-to-r from-[#137fec]/20 to-transparent blur-3xl rounded-full"></div>
            <div className="relative rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 shadow-xl">
              <div
                className="w-full aspect-4/3 bg-cover bg-center"
                style={{
                  backgroundImage:
                    "url('https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=1200&q=80')",
                }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Facilities */}
      <section className="max-w-6xl mx-auto px-4 pb-10">
        <div className="flex items-end justify-between gap-3">
          <div>
            <p className="text-xs font-black text-[#137fec]">Why Choose Us</p>
            <h2 className="text-2xl font-black text-[#0d141b] dark:text-white mt-1">
              Facilities & Strengths
            </h2>
          </div>
          <Link to="/gallery" className="text-xs font-black text-[#137fec] hover:underline">
            View Gallery
          </Link>
        </div>

        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { icon: 'menu_book', title: 'Strong Academics', desc: 'Smart classrooms and structured curriculum.' },
            { icon: 'science', title: 'Labs & Practical', desc: 'Science & computer labs for hands-on learning.' },
            { icon: 'sports_soccer', title: 'Sports', desc: 'Sports activities for fitness and teamwork.' },
            { icon: 'security', title: 'Safe Campus', desc: 'Discipline, safety and student wellbeing focus.' },
            { icon: 'groups', title: 'Co-curricular', desc: 'Clubs, events, competitions and creativity.' },
            { icon: 'verified', title: 'Result Focus', desc: 'Transparent result portal and performance tracking.' },
          ].map((f) => (
            <div
              key={f.title}
              className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-5 hover:shadow-lg transition-shadow"
            >
              <div className="h-10 w-10 rounded-xl bg-[#137fec]/10 text-[#137fec] flex items-center justify-center">
                <span className="material-symbols-outlined">{f.icon}</span>
              </div>
              <p className="mt-3 text-base font-black">{f.title}</p>
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Vision & Mission */}
      <section className="max-w-6xl mx-auto px-4 pb-10">
        <div className="flex items-end justify-between gap-3">
          <div>
            <p className="text-xs font-black text-[#137fec]">Our Foundation</p>
            <h2 className="text-2xl font-black text-[#0d141b] dark:text-white mt-1">Vision & Mission</h2>
          </div>
          <Link to="/about" className="text-xs font-black text-[#137fec] hover:underline">
            Read More
          </Link>
        </div>

        <div className="mt-4 grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6">
            <div className="h-10 w-10 rounded-xl bg-[#137fec]/10 text-[#137fec] flex items-center justify-center">
              <span className="material-symbols-outlined">visibility</span>
            </div>
            <p className="mt-3 text-base font-black">Vision</p>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
              To nurture responsible citizens with strong values, confidence, creativity and modern skills.
            </p>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6">
            <div className="h-10 w-10 rounded-xl bg-[#137fec]/10 text-[#137fec] flex items-center justify-center">
              <span className="material-symbols-outlined">target</span>
            </div>
            <p className="mt-3 text-base font-black">Mission</p>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
              To provide quality education with discipline, strong academics, and holistic development through
              supportive teachers and student-friendly learning.
            </p>
          </div>
        </div>
      </section>

      {/* Our Team / Total Teachers */}
      <section className="max-w-6xl mx-auto px-4 pb-10">
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 md:p-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <p className="text-xs font-black text-[#137fec]">Our Team</p>
              <h2 className="text-2xl font-black text-[#0d141b] dark:text-white mt-1">Dedicated Teachers</h2>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-300 max-w-2xl">
                Experienced and supportive faculty to guide every student with personal attention and discipline.
              </p>
            </div>
            <Link
              to="/contact"
              className="inline-flex items-center justify-center gap-2 font-black px-5 py-3 rounded-xl bg-[#137fec] text-white hover:bg-[#137fec]/90 shadow-lg shadow-[#137fec]/20"
            >
              <span className="material-symbols-outlined">call</span>
              Contact School
            </Link>
          </div>

          <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { icon: 'groups', value: '60+', label: 'Total Teachers' },
              { icon: 'school', value: '1200+', label: 'Total Students' },
              { icon: 'psychology', value: '1:20', label: 'Student-Teacher Ratio' },
              { icon: 'workspace_premium', value: '10+', label: 'Top Mentors' },
            ].map((c) => (
              <div
                key={c.label}
                className="rounded-2xl border border-slate-200 dark:border-slate-700 p-4 bg-slate-50 dark:bg-slate-900/40"
              >
                <div className="flex items-center justify-between">
                  <div className="h-10 w-10 rounded-xl bg-[#137fec]/10 text-[#137fec] flex items-center justify-center">
                    <span className="material-symbols-outlined">{c.icon}</span>
                  </div>
                  <p className="text-xl font-black text-slate-900 dark:text-white">{c.value}</p>
                </div>
                <p className="mt-2 text-xs font-bold text-slate-500 dark:text-slate-400">{c.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Notices / Announcements */}
      <section className="max-w-6xl mx-auto px-4 pb-10">
        <div className="flex items-end justify-between gap-3">
          <div>
            <p className="text-xs font-black text-[#137fec]">Updates</p>
            <h2 className="text-2xl font-black text-[#0d141b] dark:text-white mt-1">Notices & Announcements</h2>
          </div>
          <Link to="/contact" className="text-xs font-black text-[#137fec] hover:underline">
            Ask a Query
          </Link>
        </div>

        <div className="mt-4 grid grid-cols-1 lg:grid-cols-3 gap-4">
          {[
            {
              tag: 'Admissions',
              title: 'New Admission Enquiry Window',
              desc: 'Submit your details on contact page for admission counselling and required documents list.',
              icon: 'how_to_reg',
            },
            {
              tag: 'Exams',
              title: 'Terminal Exam Schedule',
              desc: 'Please confirm class/terminal details before checking results. Published results are available on Result Portal.',
              icon: 'event_note',
            },
            {
              tag: 'Activities',
              title: 'Sports & Co-curricular Week',
              desc: 'Inter-house competitions, art & craft, and stage performances. Participation encouraged.',
              icon: 'sports',
            },
          ].map((n) => (
            <div
              key={n.title}
              className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-5 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-start justify-between gap-3">
                <span className="inline-flex items-center gap-1 text-xs font-black px-2.5 py-1 rounded-full bg-[#137fec]/10 text-[#137fec]">
                  <span className="material-symbols-outlined text-sm">{n.icon}</span>
                  {n.tag}
                </span>
                <span className="material-symbols-outlined text-slate-400">chevron_right</span>
              </div>
              <p className="mt-3 text-base font-black">{n.title}</p>
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{n.desc}</p>
              <div className="mt-4 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                <span className="inline-flex items-center gap-1">
                  <span className="material-symbols-outlined text-sm">schedule</span>
                  Updated recently
                </span>
                <Link to="/contact" className="font-black text-[#137fec] hover:underline">
                  Contact
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials + Achievements */}
      <section className="max-w-6xl mx-auto px-4 pb-10">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
          <div className="lg:col-span-3 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-black text-[#137fec]">Parents & Students</p>
                <h2 className="text-2xl font-black text-[#0d141b] dark:text-white mt-1">Testimonials</h2>
              </div>
              <Link to="/about" className="text-xs font-black text-[#137fec] hover:underline">
                Know More
              </Link>
            </div>

            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                {
                  name: 'Parent',
                  text: 'Teachers are supportive and the school focuses on discipline along with studies.',
                },
                {
                  name: 'Student',
                  text: 'Classes are interactive and activities help us build confidence and teamwork.',
                },
              ].map((t, idx) => (
                <div
                  key={`${t.name}-${idx}`}
                  className="rounded-2xl border border-slate-200 dark:border-slate-700 p-5 bg-slate-50 dark:bg-slate-900/40"
                >
                  <span className="material-symbols-outlined text-[#137fec]">format_quote</span>
                  <p className="mt-2 text-sm text-slate-700 dark:text-slate-200">{t.text}</p>
                  <p className="mt-4 text-xs font-black text-slate-500 dark:text-slate-400">— {t.name}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-2 rounded-2xl bg-linear-to-br from-[#137fec] to-[#0d5bb8] text-white p-6 shadow-lg">
            <p className="text-xs opacity-90">Achievements</p>
            <p className="text-2xl font-black mt-1">Performance Highlights</p>
            <p className="text-sm opacity-90 mt-1">Academic results, competitions and awards.</p>

            <div className="mt-5 space-y-3">
              {[
                { icon: 'emoji_events', title: 'Board / Terminal Results', desc: 'Consistent performance & improvement.' },
                { icon: 'military_tech', title: 'Competitions', desc: 'Inter-school quiz, sports and arts.' },
                { icon: 'workspace_premium', title: 'Discipline & Attendance', desc: 'Regularity and school values.' },
              ].map((a) => (
                <div key={a.title} className="flex items-start gap-3 rounded-2xl bg-white/10 p-4">
                  <span className="material-symbols-outlined">{a.icon}</span>
                  <div>
                    <p className="text-sm font-black">{a.title}</p>
                    <p className="text-xs opacity-90">{a.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6">
              <Link
                to="/gallery"
                className="inline-flex items-center justify-center gap-2 font-black px-5 py-3 rounded-xl bg-white text-[#0d141b] hover:bg-white/90 w-full"
              >
                <span className="material-symbols-outlined">photo_library</span>
                View Gallery
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Results Portal CTA */}
      <section className="max-w-6xl mx-auto px-4 pb-12">
        <div className="rounded-2xl bg-linear-to-r from-green-500 to-emerald-600 text-white p-6 md:p-8 shadow-lg">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <p className="text-xs opacity-90 flex items-center gap-2">
                <span className="material-symbols-outlined text-sm">verified_user</span>
                For Students & Parents
              </p>
              <p className="text-2xl font-black mt-1">Check Your Results Instantly</p>
              <p className="text-sm opacity-90 mt-1">Access your academic performance, marks, and division anytime.</p>
            </div>
            <Link
              to="/results-portal"
              className="inline-flex items-center justify-center gap-2 font-black px-5 py-3 rounded-xl bg-white text-green-600 hover:bg-white/90 whitespace-nowrap"
            >
              <span className="material-symbols-outlined">trending_up</span>
              View Results
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-6xl mx-auto px-4 pb-12">
        <div className="rounded-2xl bg-linear-to-r from-[#137fec] to-[#0d5bb8] text-white p-6 md:p-8 shadow-lg">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <p className="text-xs opacity-90">For Admin/Teacher</p>
              <p className="text-2xl font-black mt-1">Manage school data on Dashboard</p>
              <p className="text-sm opacity-90 mt-1">Use Admin Login to access dashboard modules.</p>
            </div>
            <Link
              to="/login"
              className="inline-flex items-center justify-center gap-2 font-black px-5 py-3 rounded-xl bg-white text-[#0d141b] hover:bg-white/90"
            >
              <span className="material-symbols-outlined">admin_panel_settings</span>
              Admin Login
            </Link>
          </div>
        </div>
      </section>
    </WebsiteLayout>
  )
}

export default Home


