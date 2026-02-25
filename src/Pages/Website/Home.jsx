import React, { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import WebsiteLayout from '../../Components/Website/WebsiteLayout'
import { homeFeaturePhotos, homeHeroSlides } from '../../assets/websiteImages'

const featureCards = [
  {
    icon: 'menu_book',
    title: 'Academic Excellence',
    description: 'Structured curriculum, regular mentoring and smart classroom delivery.',
  },
  {
    icon: 'science',
    title: 'Hands-on Labs',
    description: 'Science and computer labs designed for practical understanding.',
  },
  {
    icon: 'sports_soccer',
    title: 'Balanced Growth',
    description: 'Sports, activities and life skills integrated with academics.',
  },
]

const highlights = [
  { label: 'Students', value: '400+' },
  { label: 'Faculty', value: '15+' },
  { label: 'Labs & Clubs', value: '20+' },
]

const testimonials = [
  {
    name: 'Principal',
    text: 'Our focus is simple: disciplined learning, confident communication and responsible citizenship.',
  },
  {
    name: 'Parent',
    text: 'Transparent results and caring teachers made a visible difference in my child within one year.',
  },
  {
    name: 'Student',
    text: 'Classes are engaging, teachers are supportive and activities help us learn beyond books.',
  },
]

function Home() {
  const SCHOOL_NAME = import.meta.env.VITE_SCHOOL_NAME || 'Gyanoday Public School'
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)
  const intervalRef = useRef(null)

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % homeHeroSlides.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + homeHeroSlides.length) % homeHeroSlides.length)
  }

  useEffect(() => {
    if (!isAutoPlaying) return undefined

    intervalRef.current = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % homeHeroSlides.length)
    }, 4500)

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [isAutoPlaying])

  return (
    <WebsiteLayout>
      <section className="ryme-section">
        <div className="ryme-shell">
          <div className="ryme-grid items-stretch lg:grid-cols-[1.08fr_0.92fr]">
            <div className="ryme-card p-6 sm:p-8">
              <span className="ryme-tag reveal-up">Future-ready school experience</span>
              <h1 className="ryme-section-title mt-4 reveal-up">
                Build brighter journeys at <span className="text-gradient-brand">{SCHOOL_NAME}</span>
              </h1>
              <p className="mt-4 max-w-xl text-sm leading-relaxed text-slate-200 sm:text-base">
                A modern learning ecosystem where academics, discipline, technology and student wellbeing move together.
                Explore admissions, result portal and school updates from one unified platform.
              </p>

              <div className="mt-6 flex flex-wrap items-center gap-3">
                <Link to="/about" className="ryme-button">
                  Explore School
                  <span className="material-symbols-outlined text-base">arrow_forward</span>
                </Link>
                <Link to="/contact" className="ryme-button-ghost">
                  Contact Campus
                </Link>
              </div>

              <div className="mt-7 grid grid-cols-1 gap-2 sm:grid-cols-3">
                {highlights.map((item) => (
                  <div key={item.label} className="ryme-card-soft p-3">
                    <p className="text-2xl font-extrabold text-cyan-200">{item.value}</p>
                    <p className="text-xs uppercase tracking-[0.16em] text-slate-200/90">{item.label}</p>
                  </div>
                ))}
              </div>
            </div>

            <div
              className="ryme-card relative overflow-hidden p-2"
              onMouseEnter={() => setIsAutoPlaying(false)}
              onMouseLeave={() => setIsAutoPlaying(true)}
            >
              <div className="relative h-[340px] overflow-hidden rounded-2xl sm:h-[420px]">
                <div
                  className="flex h-full transition-transform duration-700 ease-out"
                  style={{ transform: `translateX(-${currentSlide * 100}%)` }}
                >
                  {homeHeroSlides.map((slide, index) => (
                    <div key={index} className="min-w-full">
                      <div className="relative h-full">
                        <img src={slide} alt={`Campus visual ${index + 1}`} className="h-full w-full object-cover" />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#031323]/85 via-[#031323]/35 to-transparent"></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="absolute inset-x-0 bottom-6 z-10 flex items-center justify-between px-5">
                <div className="rounded-lg border border-cyan-100/25 bg-[#04192e]/65 px-3 py-1.5 text-xs font-semibold text-cyan-50">
                  Campus Story #{String(currentSlide + 1).padStart(2, '0')}
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={prevSlide}
                    className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-cyan-100/30 bg-[#03182d]/70 text-cyan-50"
                    aria-label="Previous slide"
                  >
                    <span className="material-symbols-outlined text-base">chevron_left</span>
                  </button>
                  <button
                    onClick={nextSlide}
                    className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-cyan-100/30 bg-[#03182d]/70 text-cyan-50"
                    aria-label="Next slide"
                  >
                    <span className="material-symbols-outlined text-base">chevron_right</span>
                  </button>
                </div>
              </div>

              <div className="absolute left-1/2 top-5 z-10 flex -translate-x-1/2 gap-2">
                {homeHeroSlides.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentSlide(index)}
                    className={`h-2 rounded-full transition-all ${
                      currentSlide === index ? 'w-7 bg-cyan-200' : 'w-2 bg-cyan-50/50'
                    }`}
                    aria-label={`Go to slide ${index + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="ryme-section pt-0">
        <div className="ryme-shell">
          <div className="mb-6 flex items-end justify-between gap-3">
            <div>
              <span className="ryme-tag">Campus energy</span>
              <h2 className="ryme-section-title mt-3">Everyday Moments</h2>
            </div>
            <Link to="/gallery" className="ryme-button-ghost !px-4 !py-2 text-sm">
              View Full Gallery
            </Link>
          </div>

          <div className="ryme-grid md:grid-cols-3">
            {homeFeaturePhotos.map((photo, index) => (
              <article key={index} className="ryme-card group overflow-hidden">
                <img
                  src={photo}
                  alt={`Campus moment ${index + 1}`}
                  className="h-64 w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="p-4">
                  <p className="text-sm font-bold text-white">
                    {index === 0 ? 'Learning Zones' : index === 1 ? 'Sports & Focus' : 'Student Engagement'}
                  </p>
                  <p className="mt-1 text-xs text-slate-200/90">Captured from real school activities and campus life.</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="ryme-section pt-0">
        <div className="ryme-shell">
          <div className="ryme-grid lg:grid-cols-[1fr_1.2fr]">
            <div className="ryme-card p-6 sm:p-7">
              <span className="ryme-tag">Why families choose us</span>
              <h2 className="mt-4 text-3xl font-extrabold text-white sm:text-4xl">Strong foundation with modern systems</h2>
              <p className="mt-4 text-sm leading-relaxed text-slate-200 sm:text-base">
                The platform combines admissions support, student lifecycle, fees, marks upload and results under one
                clear workflow so parents and school teams stay aligned.
              </p>
              <div className="mt-5 space-y-2 text-sm text-slate-200">
                <p className="inline-flex items-center gap-2">
                  <span className="material-symbols-outlined text-cyan-300">check_circle</span>
                  Transparent result and records access
                </p>
                <p className="inline-flex items-center gap-2">
                  <span className="material-symbols-outlined text-cyan-300">check_circle</span>
                  Admin, teacher and student specific workflows
                </p>
                <p className="inline-flex items-center gap-2">
                  <span className="material-symbols-outlined text-cyan-300">check_circle</span>
                  Faster communication between school and families
                </p>
              </div>
            </div>

            <div className="ryme-grid sm:grid-cols-2 lg:grid-cols-3">
              {featureCards.map((card) => (
                <article key={card.title} className="ryme-kpi-card p-5">
                  <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-cyan-300/15 text-cyan-200">
                    <span className="material-symbols-outlined">{card.icon}</span>
                  </div>
                  <h3 className="mt-4 text-lg font-bold text-white">{card.title}</h3>
                  <p className="mt-2 text-sm text-slate-200/95">{card.description}</p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="ryme-section pt-0">
        <div className="ryme-shell">
          <div className="ryme-card p-6 sm:p-8">
            <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <span className="ryme-tag">Parent & student voice</span>
                <h2 className="mt-3 text-3xl font-extrabold text-white sm:text-4xl">Trusted by our community</h2>
              </div>
              <Link to="/result-login" className="ryme-button">
                Open Result Portal
              </Link>
            </div>

            <div className="ryme-grid md:grid-cols-3">
              {testimonials.map((item) => (
                <article key={item.name} className="ryme-card-soft p-4">
                  <div className="mb-2 inline-flex items-center gap-0.5 text-cyan-300">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <span key={i} className="material-symbols-outlined text-base">
                        star
                      </span>
                    ))}
                  </div>
                  <p className="text-sm leading-relaxed text-slate-200">"{item.text}"</p>
                  <p className="mt-4 text-xs font-bold uppercase tracking-[0.15em] text-cyan-100/90">{item.name}</p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>
    </WebsiteLayout>
  )
}

export default Home
