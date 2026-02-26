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

const heroPromises = ['Student-Focused System', 'Organized Academic Planning']

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

  const goToSlide = (index) => {
    setCurrentSlide(index)
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
          <div className="relative overflow-hidden rounded-[2rem] border border-cyan-100/25 bg-[#071429] p-6 sm:p-8 lg:p-10">
            <div className="pointer-events-none absolute inset-0 bg-grid-fade opacity-65"></div>
            <div className="pointer-events-none absolute -left-16 top-0 h-56 w-56 rounded-full bg-cyan-300/20 blur-3xl"></div>
            <div className="pointer-events-none absolute right-0 top-0 h-64 w-64 rounded-full bg-sky-400/12 blur-3xl"></div>
            <div className="pointer-events-none absolute bottom-[-140px] left-1/3 h-72 w-72 rounded-full bg-blue-500/18 blur-3xl"></div>

            <div className="ryme-grid items-center gap-8 lg:grid-cols-[1.03fr_0.97fr]">
              <div className="relative z-10">
                <span className="inline-flex items-center gap-2 rounded-full border border-cyan-100/35 bg-cyan-100/10 px-4 py-1.5 text-xs font-semibold text-cyan-100 shadow-lg shadow-black/15 backdrop-blur-sm">
                  <span className="material-symbols-outlined text-sm">auto_awesome</span>
                  {SCHOOL_NAME}
                </span>

                <h1 className="mt-5 text-4xl font-black leading-[1.05] tracking-[-0.03em] sm:text-5xl lg:text-6xl">
                  <span className="text-white">Learning </span>
                  <span className="text-gradient-brand">Amplified.</span>
                  <br />
                  <span className="text-white">Future </span>
                  <span className="text-gradient-brand">Ready.</span>
                </h1>

                <p className="mt-5 max-w-xl text-lg leading-relaxed text-white/92">
                  {SCHOOL_NAME} empowers students with disciplined academics, modern tools, transparent results and a
                  safe environment where every learner can grow with confidence.
                </p>

                <div className="mt-7 flex flex-wrap items-center gap-3">
                  <Link
                    to="/results-portal"
                    className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-[#5ce6ff] to-[#1abef8] px-7 py-3 text-base font-extrabold text-[#04182d] shadow-xl shadow-cyan-500/25"
                  >
                    Result
                  </Link>
                  <Link
                    to="/login"
                    className="inline-flex items-center justify-center rounded-full border border-cyan-100/35 bg-[#0a1d34]/85 px-7 py-3 text-base font-bold text-white shadow-xl shadow-black/30 hover:bg-[#0f2b4a]"
                  >
                    Admin
                  </Link>
                </div>

                <div className="mt-8 flex flex-wrap gap-x-5 gap-y-2 text-sm font-semibold text-cyan-100/95">
                  {heroPromises.map((promise) => (
                    <p key={promise} className="inline-flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-base text-cyan-200">check_box</span>
                      {promise}
                    </p>
                  ))}
                </div>
              </div>

              <div className="relative z-10">
                <div
                  className="relative mx-auto h-[380px] w-[265px] sm:h-[460px] sm:w-[330px] lg:h-[520px] lg:w-[390px]"
                  onMouseEnter={() => setIsAutoPlaying(false)}
                  onMouseLeave={() => setIsAutoPlaying(true)}
                >
                  <div className="absolute left-[-42px] top-7 hidden h-[78%] w-24 rotate-[-4deg] overflow-hidden rounded-3xl border border-white/20 bg-[#1f2546]/70 shadow-2xl md:block">
                    <img
                      src={homeHeroSlides[(currentSlide - 1 + homeHeroSlides.length) % homeHeroSlides.length]}
                      alt="Previous story"
                      className="h-full w-full object-cover opacity-70"
                    />
                  </div>
                  <div className="absolute right-[-42px] top-7 hidden h-[78%] w-24 rotate-[4deg] overflow-hidden rounded-3xl border border-white/20 bg-[#1f2546]/70 shadow-2xl md:block">
                    <img
                      src={homeHeroSlides[(currentSlide + 1) % homeHeroSlides.length]}
                      alt="Next story"
                      className="h-full w-full object-cover opacity-70"
                    />
                  </div>

                  <div className="relative h-full overflow-hidden rounded-[2rem] border border-cyan-100/25 bg-[#08182e] shadow-[0_20px_50px_rgba(5,8,24,0.45)]">
                    <div
                      className="flex h-full transition-transform duration-700 ease-out"
                      style={{ transform: `translateX(-${currentSlide * 100}%)` }}
                    >
                      {homeHeroSlides.map((slide, index) => (
                        <div key={index} className="min-w-full">
                          <div className="relative h-full">
                            <img
                              src={slide}
                              alt={`Campus visual ${index + 1}`}
                              className={`h-full w-full object-cover transition-transform duration-[1100ms] ${
                                currentSlide === index ? 'scale-105' : 'scale-100'
                              }`}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/72 via-black/28 to-transparent"></div>
                          </div>
                        </div>
                      ))}
                    </div>

                  </div>

                  <div className="mt-4 flex items-center justify-center gap-2">
                    {homeHeroSlides.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => goToSlide(index)}
                        className={`h-2.5 rounded-full transition-all ${
                          currentSlide === index ? 'w-6 bg-cyan-300' : 'w-2.5 bg-white/65'
                        }`}
                        aria-label={`Go to slide ${index + 1}`}
                      />
                    ))}
                  </div>

                  <div className="mt-3 hidden items-center justify-center gap-2 md:flex">
                    <button
                      onClick={prevSlide}
                      className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/35 bg-white/15 text-white"
                      aria-label="Previous slide"
                    >
                      <span className="material-symbols-outlined text-base">chevron_left</span>
                    </button>
                    <button
                      onClick={nextSlide}
                      className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/35 bg-white/15 text-white"
                      aria-label="Next slide"
                    >
                      <span className="material-symbols-outlined text-base">chevron_right</span>
                    </button>
                  </div>
                </div>
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
              <Link to="/results-portal" className="ryme-button">
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
