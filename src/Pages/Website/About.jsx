import React from 'react'
import { Link } from 'react-router-dom'
import WebsiteLayout from '../../Components/Website/WebsiteLayout'
import { aboutPhotos } from '../../assets/websiteImages'

const values = [
  { icon: 'workspace_premium', title: 'Excellence', text: 'High academic standards with accountable progress tracking.' },
  { icon: 'security', title: 'Discipline', text: 'Respectful campus culture with clear systems and routines.' },
  { icon: 'lightbulb', title: 'Innovation', text: 'Modern teaching tools and practical problem-solving exposure.' },
  { icon: 'groups', title: 'Inclusion', text: 'Supportive classrooms where every child is guided and heard.' },
]

const achievements = [
  'Consistent board performance with strong subject outcomes.',
  'Growing digital adoption for exams, marks and reporting.',
  'Balanced focus on sports, events and co-curricular activities.',
  'Parent trust built through transparency and communication.',
]

function About() {
  const SCHOOL_NAME = import.meta.env.VITE_SCHOOL_NAME || 'Gyanoday Public School'

  return (
    <WebsiteLayout>
      <section className="ryme-section">
        <div className="ryme-shell">
          <div className="ryme-grid lg:grid-cols-[1fr_1.04fr]">
            <div className="ryme-card p-6 sm:p-8">
              <span className="ryme-tag">About school</span>
              <h1 className="mt-4 text-4xl font-extrabold text-white sm:text-5xl">{SCHOOL_NAME}</h1>
              <p className="mt-4 text-sm leading-relaxed text-slate-200 sm:text-base">
                We nurture confident learners through academics, values and practical skill-building. Our teachers and
                systems work together to ensure that every student gets structure, support and consistent growth.
              </p>

              <div className="mt-6 grid grid-cols-2 gap-3">
                <div className="ryme-card-soft p-3">
                  <p className="text-2xl font-extrabold text-cyan-200">15+</p>
                  <p className="text-xs uppercase tracking-[0.15em] text-slate-200/90">Years Journey</p>
                </div>
                <div className="ryme-card-soft p-3">
                  <p className="text-2xl font-extrabold text-cyan-200">95%</p>
                  <p className="text-xs uppercase tracking-[0.15em] text-slate-200/90">Academic Success</p>
                </div>
              </div>
            </div>

            <div className="ryme-grid grid-cols-2">
              <div className="ryme-card col-span-2 overflow-hidden">
                <img src={aboutPhotos.hero} alt="School campus" className="h-72 w-full object-cover sm:h-80" />
              </div>
              <div className="ryme-card overflow-hidden">
                <img src={aboutPhotos.secondary} alt="Classroom learning" className="h-52 w-full object-cover" />
              </div>
              <div className="ryme-card p-5">
                <p className="text-xs uppercase tracking-[0.16em] text-cyan-100">Mission</p>
                <p className="mt-2 text-sm leading-relaxed text-slate-100/95">
                  Deliver quality education with discipline, compassion and future-ready skills.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="ryme-section pt-0">
        <div className="ryme-shell">
          <div className="mb-6">
            <span className="ryme-tag">Core values</span>
            <h2 className="ryme-section-title mt-3">What drives our culture</h2>
          </div>
          <div className="ryme-grid sm:grid-cols-2 lg:grid-cols-4">
            {values.map((value) => (
              <article key={value.title} className="ryme-kpi-card p-5">
                <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-cyan-300/15 text-cyan-200">
                  <span className="material-symbols-outlined">{value.icon}</span>
                </div>
                <h3 className="mt-4 text-lg font-bold text-white">{value.title}</h3>
                <p className="mt-2 text-sm text-slate-200/95">{value.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="ryme-section pt-0">
        <div className="ryme-shell">
          <div className="ryme-grid lg:grid-cols-[1.12fr_0.88fr]">
            <article className="ryme-card p-6 sm:p-8">
              <span className="ryme-tag">Our journey</span>
              <h2 className="mt-3 text-3xl font-extrabold text-white sm:text-4xl">Built with consistency and trust</h2>
              <p className="mt-4 text-sm leading-relaxed text-slate-200 sm:text-base">
                From a focused local institution to a structured school ecosystem, we have continuously improved
                infrastructure, faculty practices and digital processes to support students and families.
              </p>

              <div className="mt-5 space-y-3">
                {achievements.map((item) => (
                  <p key={item} className="inline-flex items-start gap-2 text-sm text-slate-200">
                    <span className="material-symbols-outlined mt-0.5 text-base text-cyan-300">check_circle</span>
                    {item}
                  </p>
                ))}
              </div>

              <img src={aboutPhotos.journey} alt="School journey" className="mt-5 h-56 w-full rounded-xl object-cover" />
            </article>

            <article className="ryme-card p-6 sm:p-8">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-300/15 text-cyan-200">
                <span className="material-symbols-outlined">format_quote</span>
              </div>
              <h3 className="mt-4 text-2xl font-extrabold text-white">Principal&apos;s message</h3>
              <p className="mt-4 text-sm leading-relaxed text-slate-100/95 sm:text-base">
                Education is not only about marks. It is about confidence, values and readiness for life. We guide each
                student with personal attention so they grow with skill, discipline and purpose.
              </p>

              <div className="mt-6 flex items-center gap-3 rounded-xl border border-cyan-200/20 bg-cyan-300/5 p-3">
                <img src={aboutPhotos.principal} alt="Principal portrait" className="h-14 w-14 rounded-full object-cover" />
                <div>
                  <p className="text-sm font-bold text-white">Principal</p>
                  <p className="text-xs text-slate-200/90">{SCHOOL_NAME}</p>
                </div>
              </div>

              <img
                src={aboutPhotos.achievements}
                alt="School achievement moments"
                className="mt-6 h-52 w-full rounded-xl object-cover"
              />
            </article>
          </div>
        </div>
      </section>

      <section className="ryme-section pt-0">
        <div className="ryme-shell">
          <div className="ryme-card p-7 text-center sm:p-9">
            <span className="ryme-tag">Admissions open</span>
            <h2 className="mt-4 text-3xl font-extrabold text-white sm:text-4xl">Be part of our learning community</h2>
            <p className="mx-auto mt-4 max-w-2xl text-sm text-slate-200 sm:text-base">
              Visit campus, meet our faculty and explore programs crafted for all-round student development.
            </p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <Link to="/contact" className="ryme-button">
                Contact School
              </Link>
              <Link to="/gallery" className="ryme-button-ghost">
                Explore Gallery
              </Link>
            </div>
          </div>
        </div>
      </section>
    </WebsiteLayout>
  )
}

export default About
