import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import WebsiteLayout from '../../Components/Website/WebsiteLayout'
import SEO from '../../Components/SEO/SEO'
import { buildSchoolJsonLd, SCHOOL_KEYWORDS } from '../../seo/siteSeo'
import { siteMedia } from './siteContent'
import {
  homeCommunityNotes,
  homeHeroSections,
  homeHeroSlides,
  homeHeroStats,
  homeJourneySteps,
  homeProgramCards,
  homePromisePoints,
  schoolProfile,
} from './siteContent'

function Home() {
  const [currentSlide, setCurrentSlide] = useState(0)

  useEffect(() => {
    const interval = window.setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % homeHeroSlides.length)
    }, 4200)

    return () => window.clearInterval(interval)
  }, [])

  const scrollingPoints = [...homePromisePoints, ...homePromisePoints]

  return (
    <WebsiteLayout>
      <SEO
        title="Best School in Harinagar Ramnagar West Champaran"
        description="Gyanoday Public School is a trusted school in Harinagar, Ramnagar (Bettiah), West Champaran, Bihar focused on disciplined learning, parent communication, admissions and secure result access."
        keywords={SCHOOL_KEYWORDS}
        canonicalPath="/"
        jsonLd={buildSchoolJsonLd({ path: '/' })}
      />

      <section className="relative overflow-hidden bg-slate-950">
        <div className="absolute inset-0">
          {homeHeroSlides.map((slide, index) => (
            <img
              key={slide.src}
              src={slide.src}
              alt={slide.title}
              loading={index === 0 ? 'eager' : 'lazy'}
              decoding="async"
              fetchPriority={index === 0 ? 'high' : 'auto'}
              className={`absolute inset-0 h-full w-full object-cover transition-all duration-[1500ms] ${
                index === currentSlide ? 'opacity-100 scale-100' : 'opacity-0 scale-110'
              }`}
            />
          ))}
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(2,6,23,0.46),rgba(2,6,23,0.74))]"></div>
        </div>

        <div className="relative z-10 mx-auto max-w-7xl px-4 py-20 text-white sm:px-6 lg:px-8 lg:py-28">
          <div className="max-w-4xl">
            <span className="inline-flex rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-cyan-100 backdrop-blur-sm">
              Harinagar | Ramnagar (Bettiah) | West Champaran
            </span>

            <h1 className="mt-5 text-4xl font-black leading-[1.05] sm:text-5xl lg:text-7xl">
              Best School in Harinagar Ramnagar West Champaran for disciplined learning and confident growth
            </h1>

            <p className="mt-5 max-w-2xl text-base leading-7 text-slate-100 sm:text-lg">
              {schoolProfile.name} helps families looking for a Harinagar school, a Ramnagar Bettiah school, or a
              West Champaran school with clear admissions guidance, strong classroom routines, attentive teaching and
              a student journey built around trust.
            </p>

            <p className="mt-4 max-w-2xl text-sm leading-6 text-cyan-100/90 sm:text-base">
              If you want a school in Harinagar, Bihar that balances academics, discipline, communication and
              co-curricular confidence, this campus is designed to make that choice easier for parents.
            </p>

            <div className="mt-7 flex flex-wrap gap-3">
              <Link to="/admission" className="gps-site-button">
                Apply for admission
              </Link>
              <Link to="/results-portal" className="gps-site-button-secondary">
                Result portal
              </Link>
            </div>

            <div className="mt-8 flex flex-wrap gap-2.5">
              {scrollingPoints.slice(0, 4).map((point) => (
                <span key={point} className="rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm text-slate-100 backdrop-blur-sm">
                  {point}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-4 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:px-8">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-cyan-700">Why families choose us</span>
            <h2 className="mt-3 text-3xl font-black text-slate-900 sm:text-4xl">
              A dependable school choice for Harinagar, Ramnagar and nearby West Champaran families
            </h2>
            <p className="mt-4 max-w-2xl text-slate-600">
              Families searching for the best school in Harinagar Ramnagar West Champaran usually want more than just
              a classroom. They want a place where children are guided, routines are visible, communication stays
              clear and parents feel supported through the session.
            </p>

            <div className="mt-6 overflow-hidden rounded-full border border-slate-200 bg-slate-50">
              <div className="flex min-w-max gap-3 px-4 py-3">
                {scrollingPoints.map((point, index) => (
                  <span key={`${point}-${index}`} className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm text-slate-700 shadow-sm">
                    <span className="text-cyan-700">✓</span>
                    {point}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="grid gap-4">
            {homeHeroSections.map((item) => (
              <div key={item.title} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-cyan-700">{item.title}</p>
                <p className="mt-3 text-slate-600">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-slate-50 py-14">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 px-4 text-center sm:grid-cols-2 md:grid-cols-3 sm:px-6 lg:px-8">
          {homeHeroStats.map((item) => (
            <div key={item.label} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <p className="text-lg font-extrabold uppercase tracking-[0.12em] text-cyan-700">{item.value}</p>
              <p className="mt-3 text-sm leading-6 text-slate-600">{item.label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-cyan-700">School journey</span>
            <h2 className="mt-4 text-3xl font-black text-slate-900 sm:text-4xl">
              A steady learning environment that supports results, discipline and confidence
            </h2>
            <p className="mt-4 text-slate-600">
              Our school website, result flow and admissions content are built to make information easy to find for
              Harinagar, Ramnagar (Bettiah) and West Champaran families.
            </p>

            <div className="mt-8 space-y-4">
              {homeJourneySteps.slice(0, 2).map((step, index) => (
                <div key={step.title} className="flex gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-900 text-white">
                    {index + 1}
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900">{step.title}</p>
                    <p className="text-sm text-slate-600">{step.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <div className="aspect-[4/3] overflow-hidden rounded-3xl bg-slate-100">
              <img
                src={siteMedia.homeCulture}
                alt="School culture and classroom discipline"
                loading="lazy"
                decoding="async"
                className="h-full w-full object-cover"
              />
            </div>

            <div className="mt-6 space-y-4">
              {homeJourneySteps.slice(2).map((step, index) => (
                <div key={step.title} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-cyan-700">Stage {index + 3}</p>
                  <p className="mt-1 font-semibold text-slate-900">{step.title}</p>
                  <p className="mt-2 text-sm text-slate-600">{step.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-slate-50 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <span className="text-xs font-bold uppercase tracking-widest text-cyan-700">Local SEO focus</span>
            <h2 className="mt-4 text-3xl font-black text-slate-900 sm:text-4xl">
              Harinagar school, Ramnagar Bettiah school and West Champaran school searches should lead here
            </h2>
            <p className="mt-4 text-slate-600">
              We intentionally speak to families in and around Harinagar, Ramnagar (Bettiah) and West Champaran so the
              site matches the way parents actually search. That includes admissions, campus visits, result access and
              everyday school contact.
            </p>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-3">
            {homeProgramCards.map((card, index) => (
              <article key={card.title} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-900 text-sm font-bold text-white">
                  {index + 1}
                </div>
                <h3 className="mt-4 text-xl font-bold text-slate-900">{card.title}</h3>
                <p className="mt-3 text-slate-600">{card.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-black text-slate-900 sm:text-4xl">What families care about most</h2>
          <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3">
            {homeCommunityNotes.map((item) => (
              <article key={item.title} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <p className="text-sm font-bold uppercase tracking-[0.16em] text-cyan-700">{item.title}</p>
                <p className="mt-3 text-slate-600">{item.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </WebsiteLayout>
  )
}

export default Home
