import React, { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import WebsiteLayout from '../../Components/Website/WebsiteLayout'

function Home() {
  const SCHOOL_NAME = import.meta.env.VITE_SCHOOL_NAME || 'Gyanoday Public School'
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)
  const intervalRef = useRef(null)

  const heroSlides = [
    {
      image: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=1200&q=80',
    },
    {
      image: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=1200&q=80',
    },
    {
      image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=1200&q=80',
    },
    {
      image: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=1200&q=80',
    },
    {
      image: 'https://images.unsplash.com/photo-1529070538774-1843cb3265df?w=1200&q=80',
    },
  ]

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
      {/* Hero Carousel - Full Width Images Only */}
      <section
        className="relative overflow-hidden w-full"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div className="relative w-full">
          {/* School Name Overlay - Center (Top to Bottom) with Rainbow Gradient */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 text-center">
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black rainbow-text text-shadow-subtle leading-tight">
              {SCHOOL_NAME}
            </h1>
            <div className="mt-3 sm:mt-4 h-1 w-32 sm:w-40 md:w-48 mx-auto bg-linear-to-r from-[#ff6b6b] via-[#4ecdc4] to-[#45b7d1] rounded-full opacity-80"></div>
          </div>

          {/* Carousel Container */}
          <div className="relative overflow-hidden w-full">
            <div
              className="flex transition-transform duration-700 ease-in-out"
              style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            >
              {heroSlides.map((slide, index) => (
                <div
                  key={index}
                  className="min-w-full w-full relative"
                >
                  {/* Subtle overlay for better text readability */}
                  <div className="absolute inset-0 bg-black/5 z-10"></div>
                  <div
                    className="w-full h-[60vh] sm:h-[70vh] md:h-[80vh] lg:h-[90vh] bg-cover bg-center bg-no-repeat"
                    style={{ backgroundImage: `url('${slide.image}')` }}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Navigation Buttons */}
          <button
            onClick={prevSlide}
            className="absolute left-4 sm:left-6 top-1/2 -translate-y-1/2 z-10 h-12 w-12 sm:h-14 sm:w-14 rounded-full bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm border border-slate-200 dark:border-slate-700 shadow-lg hover:bg-white dark:hover:bg-slate-700 flex items-center justify-center text-slate-700 dark:text-slate-200 hover:text-[#137fec] transition-all duration-200 hover:scale-110"
            aria-label="Previous slide"
          >
            <span className="material-symbols-outlined text-2xl sm:text-3xl">chevron_left</span>
          </button>

          <button
            onClick={nextSlide}
            className="absolute right-4 sm:right-6 top-1/2 -translate-y-1/2 z-10 h-12 w-12 sm:h-14 sm:w-14 rounded-full bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm border border-slate-200 dark:border-slate-700 shadow-lg hover:bg-white dark:hover:bg-slate-700 flex items-center justify-center text-slate-700 dark:text-slate-200 hover:text-[#137fec] transition-all duration-200 hover:scale-110"
            aria-label="Next slide"
          >
            <span className="material-symbols-outlined text-2xl sm:text-3xl">chevron_right</span>
          </button>

          {/* Dots Indicator */}
          <div className="absolute bottom-6 sm:bottom-8 left-1/2 -translate-x-1/2 z-10 flex items-center gap-2">
            {heroSlides.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`h-2.5 sm:h-3 rounded-full transition-all duration-300 ${
                  currentSlide === index
                    ? 'w-8 sm:w-10 bg-[#137fec] shadow-md shadow-[#137fec]/50'
                    : 'w-2.5 sm:w-3 bg-white/60 dark:bg-slate-600/60 hover:bg-white/80 dark:hover:bg-slate-500/80'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
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
                  { icon: 'groups', value: '60+', label: 'Total Teachers' },
                  { icon: 'school', value: '1200+', label: 'Total Students' },
                  { icon: 'psychology', value: '1:20', label: 'Student-Teacher Ratio' },
                  { icon: 'workspace_premium', value: '10+', label: 'Top Mentors' },
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


