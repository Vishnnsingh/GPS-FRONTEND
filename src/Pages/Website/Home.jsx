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
      <section className="gps-section">
        <div className="gps-shell">
          <div className="relative overflow-hidden rounded-[2rem] border border-[#c79843]/30 bg-[#fff9ef] p-6 sm:p-8 lg:p-10">
            <div className="pointer-events-none absolute inset-0 bg-grid-fade opacity-65"></div>
            <div className="pointer-events-none absolute -left-16 top-0 h-56 w-56 rounded-full bg-[#d4ab5b]/22 blur-3xl"></div>
            <div className="pointer-events-none absolute right-0 top-0 h-64 w-64 rounded-full bg-[#3562aa]/16 blur-3xl"></div>
            <div className="pointer-events-none absolute bottom-[-140px] left-1/3 h-72 w-72 rounded-full bg-[#2a4c88]/20 blur-3xl"></div>

            <div className="gps-grid items-center gap-8 lg:grid-cols-[1.03fr_0.97fr]">
              <div className="relative z-10">
                <span className="inline-flex items-center gap-2 rounded-full border border-[#c79843]/45 bg-[#f6ebd7] px-4 py-1.5 text-xs font-semibold text-[#805921] shadow-lg shadow-[#a07431]/10 backdrop-blur-sm">
                  <span className="material-symbols-outlined text-sm">auto_awesome</span>
                  {SCHOOL_NAME}
                </span>

                <h1 className="mt-5 text-4xl font-black leading-[1.05] tracking-[-0.03em] sm:text-5xl lg:text-6xl">
                  <span className="text-[#1f2d45]">Learning </span>
                  <span className="text-gradient-brand">Amplified.</span>
                  <br />
                  <span className="text-[#1f2d45]">Future </span>
                  <span className="text-gradient-brand">Ready.</span>
                </h1>

                <p className="mt-5 max-w-xl text-lg leading-relaxed text-[#425775]">
                  {SCHOOL_NAME} empowers students with disciplined academics, modern tools, transparent results and a
                  safe environment where every learner can grow with confidence.
                </p>

                <div className="mt-7 flex flex-wrap items-center gap-3">
                  <Link
                    to="/results-portal"
                    className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-[#f0d4a0] via-[#d9ad63] to-[#bd8933] px-7 py-3 text-base font-extrabold text-[#1f2335] shadow-xl shadow-[#8d6326]/35"
                  >
                    Result
                  </Link>
                  <Link
                    to="/login"
                    className="inline-flex items-center justify-center rounded-full border border-[#c79843]/38 bg-[#102850]/90 px-7 py-3 text-base font-bold text-white shadow-xl shadow-black/30 hover:bg-[#163566]"
                  >
                    Admin
                  </Link>
                </div>

                <div className="mt-8 flex flex-wrap gap-x-5 gap-y-2 text-sm font-semibold text-[#334766]">
                  {heroPromises.map((promise) => (
                    <p key={promise} className="inline-flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-base text-[#dfbf78]">check_box</span>
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
                  <div className="absolute left-[-42px] top-7 hidden h-[78%] w-24 rotate-[-4deg] overflow-hidden rounded-3xl border border-[#d8c7a6]/65 bg-white/85 shadow-[0_16px_30px_rgba(120,94,53,0.2)] md:block">
                    <img
                      src={homeHeroSlides[(currentSlide - 1 + homeHeroSlides.length) % homeHeroSlides.length]}
                      alt="Previous story"
                      className="h-full w-full object-cover opacity-75"
                    />
                  </div>
                  <div className="absolute right-[-42px] top-7 hidden h-[78%] w-24 rotate-[4deg] overflow-hidden rounded-3xl border border-[#d8c7a6]/65 bg-white/85 shadow-[0_16px_30px_rgba(120,94,53,0.2)] md:block">
                    <img
                      src={homeHeroSlides[(currentSlide + 1) % homeHeroSlides.length]}
                      alt="Next story"
                      className="h-full w-full object-cover opacity-75"
                    />
                  </div>

                  <div className="relative h-full overflow-hidden rounded-[2rem] border border-[#d8c7a6]/70 bg-white shadow-[0_20px_50px_rgba(120,94,53,0.18)]">
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
                          currentSlide === index ? 'w-6 bg-[#c79843]' : 'w-2.5 bg-[#c8d3e4]'
                        }`}
                        aria-label={`Go to slide ${index + 1}`}
                      />
                    ))}
                  </div>

                  <div className="mt-3 hidden items-center justify-center gap-2 md:flex">
                    <button
                      onClick={prevSlide}
                      className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[#c79843]/38 bg-[#fff6e8] text-[#1f3f7a]"
                      aria-label="Previous slide"
                    >
                      <span className="material-symbols-outlined text-base">chevron_left</span>
                    </button>
                    <button
                      onClick={nextSlide}
                      className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[#c79843]/38 bg-[#fff6e8] text-[#1f3f7a]"
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

      <section className="gps-section pt-0">
        <div className="gps-shell">
          <div className="mb-6 flex items-end justify-between gap-3">
            <div>
              <span className="gps-tag">Campus energy</span>
              <h2 className="gps-section-title mt-3">Everyday Moments</h2>
            </div>
            <Link to="/gallery" className="gps-button-ghost !px-4 !py-2 text-sm">
              View Full Gallery
            </Link>
          </div>

          <div className="gps-grid md:grid-cols-3">
            {homeFeaturePhotos.map((photo, index) => (
              <article key={index} className="gps-card group overflow-hidden">
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

      <section className="gps-section pt-0">
        <div className="gps-shell">
          <div className="gps-grid lg:grid-cols-[1fr_1.2fr]">
            <div className="gps-card p-6 sm:p-7">
              <span className="gps-tag">Why families choose us</span>
              <h2 className="mt-4 text-3xl font-extrabold text-white sm:text-4xl">Strong foundation with modern systems</h2>
              <p className="mt-4 text-sm leading-relaxed text-slate-200 sm:text-base">
                The platform combines admissions support, student lifecycle, fees, marks upload and results under one
                clear workflow so parents and school teams stay aligned.
              </p>
              <div className="mt-5 space-y-2 text-sm text-slate-200">
                <p className="inline-flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#d8b060]">check_circle</span>
                  Transparent result and records access
                </p>
                <p className="inline-flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#d8b060]">check_circle</span>
                  Admin, teacher and student specific workflows
                </p>
                <p className="inline-flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#d8b060]">check_circle</span>
                  Faster communication between school and families
                </p>
              </div>
            </div>

            <div className="gps-grid sm:grid-cols-2 lg:grid-cols-3">
              {featureCards.map((card) => (
                <article key={card.title} className="gps-kpi-card p-5">
                  <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-[#d8b060]/16 text-[#e8ca8f]">
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

      <section className="gps-section pt-0">
        <div className="gps-shell">
          <div className="gps-card p-6 sm:p-8">
            <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <span className="gps-tag">Parent & student voice</span>
                <h2 className="mt-3 text-3xl font-extrabold text-white sm:text-4xl">Trusted by our community</h2>
              </div>
              <Link to="/results-portal" className="gps-button">
                Open Result Portal
              </Link>
            </div>

            <div className="gps-grid md:grid-cols-3">
              {testimonials.map((item) => (
                <article key={item.name} className="gps-card-soft p-4">
                  <div className="mb-2 inline-flex items-center gap-0.5 text-[#d8b060]">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <span key={i} className="material-symbols-outlined text-base">
                        star
                      </span>
                    ))}
                  </div>
                  <p className="text-sm leading-relaxed text-slate-200">"{item.text}"</p>
                  <p className="mt-4 text-xs font-bold uppercase tracking-[0.15em] text-[#f0ddaf]/95">{item.name}</p>
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
