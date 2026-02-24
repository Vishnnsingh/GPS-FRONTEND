import React, { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import WebsiteLayout from '../../Components/Website/WebsiteLayout'
import { homeFeaturePhotos, homeHeroSlides } from '../../assets/websiteImages'

function Home() {
  const SCHOOL_NAME = import.meta.env.VITE_SCHOOL_NAME || 'Gyanoday Public School'
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)
  const intervalRef = useRef(null)

  const heroSlides = homeHeroSlides.map((image) => ({ image }))

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length)
  }

  const goToSlide = (index) => {
    setCurrentSlide(index)
  }

  useEffect(() => {
    if (isAutoPlaying) {
      intervalRef.current = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % heroSlides.length)
      }, 5000) // Auto-scroll every 5 seconds
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [isAutoPlaying, heroSlides.length])

  const handleMouseEnter = () => {
    setIsAutoPlaying(false)
  }

  const handleMouseLeave = () => {
    setIsAutoPlaying(true)
  }

  return (
    <WebsiteLayout>
      {/* Hero Header */}
      <section className="w-full bg-slate-50 dark:bg-slate-900 py-8 sm:py-10 lg:py-12">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-10 items-stretch">
            <div className="order-2 lg:order-1 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-6 sm:p-8 lg:p-10 flex flex-col justify-center">
              <p className="text-xs sm:text-sm font-semibold text-[#137fec] uppercase tracking-wider mb-3">
                Welcome to
              </p>
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black leading-tight text-[#0d141b] dark:text-white">
                {SCHOOL_NAME}
              </h1>
              <div className="mt-4 h-1 w-28 sm:w-32 bg-linear-to-r from-[#137fec] via-[#4ecdc4] to-[#45b7d1] rounded-full"></div>
              <p className="mt-5 text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed max-w-xl">
                Inspiring students with quality education, discipline, and all-round development in a safe and modern learning environment.
              </p>
              <div className="mt-7 flex flex-wrap items-center gap-3">
                <Link
                  to="/about"
                  className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-[#137fec] hover:bg-[#0f6dd4] text-white text-sm font-semibold transition-colors"
                >
                  <span>Know More</span>
                  <span className="material-symbols-outlined text-base">arrow_forward</span>
                </Link>
                <Link
                  to="/contact"
                  className="inline-flex items-center justify-center px-5 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 text-sm font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700/40 transition-colors"
                >
                  Contact School
                </Link>
              </div>
            </div>

            <div
              className="order-1 lg:order-2 relative rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 shadow-xl shadow-slate-300/20 dark:shadow-black/20"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <div className="relative overflow-hidden h-[260px] sm:h-[320px] md:h-[380px] lg:h-full min-h-[320px]">
                <div
                  className="flex h-full transition-transform duration-700 ease-in-out"
                  style={{ transform: `translateX(-${currentSlide * 100}%)` }}
                >
                  {heroSlides.map((slide, index) => (
                    <div key={index} className="min-w-full w-full h-full relative">
                      <div className="absolute inset-0 bg-black/10 z-10"></div>
                      <div
                        className="w-full h-full bg-cover bg-center bg-no-repeat"
                        style={{ backgroundImage: `url('${slide.image}')` }}
                      />
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={prevSlide}
                className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 z-20 h-10 w-10 rounded-full bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm border border-slate-200 dark:border-slate-700 shadow-md hover:bg-white dark:hover:bg-slate-700 flex items-center justify-center text-slate-700 dark:text-slate-200 hover:text-[#137fec] transition-all duration-200"
                aria-label="Previous slide"
              >
                <span className="material-symbols-outlined text-2xl">chevron_left</span>
              </button>

              <button
                onClick={nextSlide}
                className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 z-20 h-10 w-10 rounded-full bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm border border-slate-200 dark:border-slate-700 shadow-md hover:bg-white dark:hover:bg-slate-700 flex items-center justify-center text-slate-700 dark:text-slate-200 hover:text-[#137fec] transition-all duration-200"
                aria-label="Next slide"
              >
                <span className="material-symbols-outlined text-2xl">chevron_right</span>
              </button>

              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
                {heroSlides.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => goToSlide(index)}
                    className={`h-2.5 rounded-full transition-all duration-300 ${
                      currentSlide === index
                        ? 'w-8 bg-[#137fec] shadow-md shadow-[#137fec]/50'
                        : 'w-2.5 bg-white/70 dark:bg-slate-500/70 hover:bg-white'
                    }`}
                    aria-label={`Go to slide ${index + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Campus Highlights */}
      <section className="w-full bg-white dark:bg-slate-800 py-12 sm:py-16">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-8 sm:mb-10">
              <p className="text-xs sm:text-sm font-semibold text-[#137fec] mb-2">Campus Life</p>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#0d141b] dark:text-white">Daily School Moments</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
              {homeFeaturePhotos.map((photo, index) => (
                <div
                  key={`feature-photo-${index}`}
                  className="group rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-lg transition-all"
                >
                  <img
                    src={photo}
                    alt={`Campus highlight ${index + 1}`}
                    className="w-full h-64 sm:h-72 object-cover group-hover:scale-[1.03] transition-transform duration-300"
                  />
                  <div className="px-4 py-3 bg-white dark:bg-slate-800">
                    <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">
                      {index === 0 ? 'Office view' : index === 1 ? 'Principal Office' : 'Student Participation'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Facilities */}
      <section className="w-full bg-slate-50 dark:bg-slate-900 py-12 sm:py-16">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10 sm:mb-12">
            <p className="text-xs sm:text-sm font-semibold text-[#137fec] mb-2">Why Choose Us</p>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#0d141b] dark:text-white">
              Facilities & Strengths
            </h2>
            <p className="mt-3 text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
              From smart classrooms to comprehensive programs, we provide everything for holistic student development.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 max-w-7xl mx-auto">
            {[
              { icon: 'menu_book', title: 'Strong Academics', desc: 'Smart classrooms and structured curriculum.', stat: '40+', label: 'Smart Classes' },
              { icon: 'science', title: 'Labs & Practical', desc: 'Science & computer labs for hands-on learning.', stat: '8+', label: 'Modern Labs' },
              { icon: 'sports_soccer', title: 'Sports', desc: 'Sports activities for fitness and teamwork.', stat: '15+', label: 'Sports' },
              { icon: 'security', title: 'Safe Campus', desc: 'Discipline, safety and student wellbeing focus.', stat: '100%', label: 'Safety' },
              { icon: 'groups', title: 'Co-curricular', desc: 'Clubs, events, competitions and creativity.', stat: '12+', label: 'Clubs' },
              { icon: 'verified', title: 'Result Focus', desc: 'Transparent result portal and performance tracking.', stat: '95%', label: 'Success' },
            ].map((f) => (
              <div
                key={f.title}
                className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6 sm:p-8 hover:shadow-lg hover:border-[#137fec]/30 dark:hover:border-[#137fec]/30 transition-all duration-300"
              >
                <div className="h-14 w-14 rounded-xl bg-[#137fec] flex items-center justify-center mb-5 shadow-sm">
                  <span className="material-symbols-outlined text-white text-2xl">{f.icon}</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-[#0d141b] dark:text-white mb-3">{f.title}</h3>
                <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 mb-6 leading-relaxed">{f.desc}</p>
                <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
                  <p className="text-2xl sm:text-3xl font-black text-[#137fec]">{f.stat}</p>
                  <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 uppercase tracking-wider mt-1">{f.label}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-10 sm:mt-12">
            <Link
              to="/gallery"
              className="inline-flex items-center gap-2 text-sm sm:text-base font-semibold text-[#137fec] hover:text-[#0f6dd4] transition-colors"
            >
              <span>View Gallery</span>
              <span className="material-symbols-outlined text-lg">arrow_forward</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Vision & Mission */}
      <section className="w-full bg-slate-50 dark:bg-slate-900 py-12 sm:py-16">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between gap-3 mb-8 sm:mb-10 max-w-7xl mx-auto">
            <div>
              <p className="text-xs sm:text-sm font-semibold text-[#137fec] mb-2">Our Foundation</p>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#0d141b] dark:text-white">Vision & Mission</h2>
            </div>
            <Link to="/about" className="text-xs sm:text-sm font-semibold text-[#137fec] hover:text-[#0f6dd4] transition-colors">
              Read More
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 max-w-7xl mx-auto">
            <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6 sm:p-8 hover:shadow-lg hover:border-[#137fec]/30 transition-all duration-300">
              <div className="h-16 w-16 rounded-xl bg-[#137fec] flex items-center justify-center mb-6 shadow-sm">
                <span className="material-symbols-outlined text-white text-3xl">visibility</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-black text-[#0d141b] dark:text-white mb-4">Vision</h3>
              <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
                To nurture responsible citizens with strong values, confidence, creativity and modern skills.
              </p>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6 sm:p-8 hover:shadow-lg hover:border-[#137fec]/30 transition-all duration-300">
              <div className="h-16 w-16 rounded-xl bg-[#137fec] flex items-center justify-center mb-6 shadow-sm">
                <span className="material-symbols-outlined text-white text-3xl">target</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-black text-[#0d141b] dark:text-white mb-4">Mission</h3>
              <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
                To provide quality education with discipline, strong academics, and holistic development through
                supportive teachers and student-friendly learning.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Team / Total Teachers */}
      <section className="w-full bg-slate-50 dark:bg-slate-900 py-12 sm:py-16">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="mb-10 sm:mb-12">
              <p className="text-xs sm:text-sm font-semibold text-[#137fec] mb-2">Our Team</p>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#0d141b] dark:text-white mb-4">Dedicated Teachers</h2>
              <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-3xl">
                Experienced and supportive faculty to guide every student with personal attention and discipline.
              </p>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6 sm:p-8 md:p-10">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-8">
                <div className="flex-1">
                  <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
                    Our experienced faculty members are committed to providing quality education and personal attention to every student.
                  </p>
                </div>
                <Link
                  to="/contact"
                  className="inline-flex items-center justify-center gap-2 font-semibold px-6 py-3 rounded-xl bg-[#137fec] hover:bg-[#0f6dd4] text-white transition-colors shadow-lg shadow-[#137fec]/30"
                >
                  <span className="material-symbols-outlined">call</span>
                  Contact School
                </Link>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
                {[
                  { icon: 'groups', value: '15+', label: 'Total Teachers' },
                  { icon: 'school', value: '400+', label: 'Total Students' },
                  { icon: 'psychology', value: '1:20', label: 'Student-Teacher Ratio' },
                  { icon: 'workspace_premium', value: '15+', label: 'Top Mentors' },
                ].map((c) => (
                  <div
                    key={c.label}
                    className="bg-slate-50 dark:bg-slate-900 rounded-xl p-5 sm:p-6 border border-slate-200 dark:border-slate-700 hover:border-[#137fec]/30 hover:shadow-md transition-all duration-300"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="h-12 w-12 rounded-xl bg-[#137fec] flex items-center justify-center shadow-sm">
                        <span className="material-symbols-outlined text-white text-xl">{c.icon}</span>
                      </div>
                      <p className="text-2xl sm:text-3xl font-black text-[#137fec]">{c.value}</p>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 uppercase tracking-wider">{c.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="w-full bg-slate-50 dark:bg-slate-900 py-12 sm:py-16">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10 sm:mb-12 max-w-7xl mx-auto">
            <p className="text-xs sm:text-sm font-semibold text-[#137fec] mb-2">Parents & Students</p>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#0d141b] dark:text-white">Testimonials</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 max-w-7xl mx-auto">
            {[
              {
                name: 'Dr. Rajesh Kumar',
                title: 'Principal',
                organization: 'Gyanoday Public School, New Delhi',
                text: 'Teachers are supportive and the school focuses on discipline along with studies. The strategic planning and staff training have made a remarkable difference in student engagement.',
                metric: '85% student satisfaction increase',
              },
              {
                name: 'Prof. Anjali Mehta',
                title: 'Parent',
                organization: 'Gyanoday Public School',
                text: 'The school provides excellent education with modern facilities. We have seen significant improvement in our child\'s academic performance and overall development.',
                metric: '40% academic improvement',
              },
              {
                name: 'Dr. Priya Sharma',
                title: 'Student',
                organization: 'Gyanoday Public School',
                text: 'Classes are interactive and activities help us build confidence and teamwork. The teachers are dedicated and provide personal attention to every student.',
                metric: '100% student engagement',
              },
            ].map((t, idx) => (
              <div
                key={idx}
                className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6 sm:p-8 hover:shadow-lg transition-all duration-300"
              >
                {/* Star Rating */}
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="material-symbols-outlined text-[#137fec] text-xl">
                      star
                    </span>
                  ))}
                </div>

                {/* Testimonial Text */}
                <p className="text-sm sm:text-base text-slate-700 dark:text-slate-200 italic leading-relaxed mb-6">
                  "{t.text}"
                </p>

                {/* Reviewer Info */}
                <div className="mb-4">
                  <p className="text-base sm:text-lg font-black text-[#0d141b] dark:text-white">{t.name}</p>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">{t.title}</p>
                  <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-500 mt-1">{t.organization}</p>
                </div>

                {/* Metric Tag */}
                <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#137fec]/10 border border-[#137fec]/20">
                    <span className="material-symbols-outlined text-[#137fec] text-sm">trending_up</span>
                    <span className="text-xs sm:text-sm font-semibold text-[#137fec]">{t.metric}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

    </WebsiteLayout>
  )
}

export default Home


