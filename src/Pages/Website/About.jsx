import React from 'react'
import { Link } from 'react-router-dom'
import WebsiteLayout from '../../Components/Website/WebsiteLayout'

function About() {
  const SCHOOL_NAME = import.meta.env.VITE_SCHOOL_NAME || 'Gyanoday Public School'

  return (
    <WebsiteLayout>
      {/* Hero Section */}
      <section className="w-full bg-slate-50 dark:bg-slate-900 py-12 sm:py-16">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-10 sm:mb-12">
              <p className="text-xs sm:text-sm font-semibold text-[#137fec] mb-2">About Us</p>
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-[#0d141b] dark:text-white">
                {SCHOOL_NAME}
              </h1>
              <p className="mt-4 text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-3xl mx-auto leading-relaxed">
                We are committed to quality education with discipline, character building and holistic development.
                Our teachers and staff create a supportive and modern learning environment for every child.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
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
              </div>

              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: 'Smart Classes', value: '40+', icon: 'menu_book' },
                  { label: 'Computer Lab', value: '8+', icon: 'computer' },
                  { label: 'Library', value: '5000+', icon: 'library_books' },
                  { label: 'Transport', value: 'Available', icon: 'directions_bus' },
                ].map((i) => (
                  <div
                    key={i.label}
                    className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5 hover:shadow-lg transition-shadow"
                  >
                    <div className="h-10 w-10 rounded-xl bg-[#137fec] flex items-center justify-center mb-3">
                      <span className="material-symbols-outlined text-white">{i.icon}</span>
                    </div>
                    <p className="text-xl font-black text-[#137fec]">{i.value}</p>
                    <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">{i.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Vision & Mission */}
      <section className="w-full bg-white dark:bg-slate-800 py-12 sm:py-16">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-10 sm:mb-12">
              <p className="text-xs sm:text-sm font-semibold text-[#137fec] mb-2">Our Foundation</p>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#0d141b] dark:text-white">
                Vision & Mission
              </h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
              {[
                {
                  title: 'Vision',
                  desc: 'To develop responsible citizens with curiosity, creativity and modern skills. We aim to nurture confident individuals with strong values who can contribute meaningfully to society.',
                  icon: 'visibility',
                },
                {
                  title: 'Mission',
                  desc: 'To provide a strong foundation in academics with values and confidence. We create a supportive learning environment where every student can achieve their full potential through quality education and holistic development.',
                  icon: 'target',
                },
              ].map((c) => (
                <div
                  key={c.title}
                  className="bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 p-6 sm:p-8 hover:shadow-lg transition-all duration-300"
                >
                  <div className="h-16 w-16 rounded-xl bg-[#137fec] flex items-center justify-center mb-6 shadow-sm">
                    <span className="material-symbols-outlined text-white text-3xl">{c.icon}</span>
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-black text-[#0d141b] dark:text-white mb-4">{c.title}</h3>
                  <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">{c.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="w-full bg-slate-50 dark:bg-slate-900 py-12 sm:py-16">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-10 sm:mb-12">
              <p className="text-xs sm:text-sm font-semibold text-[#137fec] mb-2">What We Stand For</p>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#0d141b] dark:text-white">
                Our Core Values
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { title: 'Excellence', desc: 'Striving for the highest standards in academics and character.', icon: 'workspace_premium' },
                { title: 'Discipline', desc: 'Building strong character through structured learning and values.', icon: 'security' },
                { title: 'Innovation', desc: 'Embracing modern teaching methods and technology for better learning.', icon: 'lightbulb' },
                { title: 'Integrity', desc: 'Upholding honesty, ethics and moral values in all our actions.', icon: 'verified' },
              ].map((v) => (
                <div
                  key={v.title}
                  className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6 hover:shadow-lg hover:border-[#137fec]/30 transition-all duration-300"
                >
                  <div className="h-12 w-12 rounded-xl bg-[#137fec] flex items-center justify-center mb-4 shadow-sm">
                    <span className="material-symbols-outlined text-white text-xl">{v.icon}</span>
                  </div>
                  <h3 className="text-lg font-black text-[#0d141b] dark:text-white mb-2">{v.title}</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-300">{v.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* History & Achievements */}
      <section className="w-full bg-white dark:bg-slate-800 py-12 sm:py-16">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12">
              <div>
                <p className="text-xs sm:text-sm font-semibold text-[#137fec] mb-2">Our Journey</p>
                <h2 className="text-3xl sm:text-4xl font-black text-[#0d141b] dark:text-white mb-6">
                  School History
                </h2>
                <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
                  Established with a vision to provide quality education, {SCHOOL_NAME} has been serving the community
                  for over 15 years. We have grown from a small institution to a recognized educational establishment
                  known for academic excellence and holistic development.
                </p>
                <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
                  Our journey has been marked by continuous improvement, modern infrastructure development, and a
                  commitment to nurturing young minds. We take pride in our alumni who have excelled in various fields
                  and continue to make us proud.
                </p>
              </div>

              <div>
                <p className="text-xs sm:text-sm font-semibold text-[#137fec] mb-2">Recognition</p>
                <h2 className="text-3xl sm:text-4xl font-black text-[#0d141b] dark:text-white mb-6">
                  Key Achievements
                </h2>
                <div className="space-y-4">
                  {[
                    { title: 'CBSE Affiliation', desc: 'Recognized by Central Board of Secondary Education' },
                    { title: 'Academic Excellence', desc: 'Consistent high performance in board examinations' },
                    { title: 'Sports Champions', desc: 'Multiple inter-school competition victories' },
                    { title: 'Innovation Award', desc: 'Recognition for modern teaching methodologies' },
                  ].map((a) => (
                    <div
                      key={a.title}
                      className="flex items-start gap-4 p-4 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700"
                    >
                      <div className="h-10 w-10 rounded-lg bg-[#137fec] flex items-center justify-center shrink-0">
                        <span className="material-symbols-outlined text-white text-lg">check</span>
                      </div>
                      <div>
                        <h3 className="text-base font-black text-[#0d141b] dark:text-white">{a.title}</h3>
                        <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">{a.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Principal's Message */}
      <section className="w-full bg-slate-50 dark:bg-slate-900 py-12 sm:py-16">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6 sm:p-8 md:p-10">
              <div className="flex items-center gap-3 mb-6">
                <div className="h-12 w-12 rounded-xl bg-[#137fec] flex items-center justify-center">
                  <span className="material-symbols-outlined text-white text-2xl">format_quote</span>
                </div>
                <p className="text-lg sm:text-xl font-black text-[#0d141b] dark:text-white">Principal's Message</p>
              </div>
              <p className="text-base sm:text-lg text-slate-700 dark:text-slate-200 leading-relaxed italic mb-6">
                "Education is not just about marks, it is about building character, confidence and skills.
                We encourage every student to learn with curiosity and grow with discipline. At {SCHOOL_NAME},
                we believe in nurturing each child's unique potential while instilling strong values and
                preparing them for the challenges of tomorrow."
              </p>
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-full bg-[#137fec] flex items-center justify-center">
                  <span className="material-symbols-outlined text-white">person</span>
                </div>
                <div>
                  <p className="text-base font-black text-[#0d141b] dark:text-white">Principal</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">{SCHOOL_NAME}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="w-full bg-white dark:bg-slate-800 py-12 sm:py-16">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto text-center">
            <h2 className="text-3xl sm:text-4xl font-black text-[#0d141b] dark:text-white mb-4">
              Join Our Community
            </h2>
            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 mb-8 max-w-2xl mx-auto">
              Experience quality education with modern facilities and dedicated teachers. Get in touch to learn more
              about admissions and our programs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/contact"
                className="inline-flex items-center justify-center gap-2 font-semibold px-6 py-3 rounded-xl bg-[#137fec] text-white hover:bg-[#0f6dd4] shadow-lg shadow-[#137fec]/30 transition-colors"
              >
                <span className="material-symbols-outlined">call</span>
                Contact Us
              </Link>
              <Link
                to="/gallery"
                className="inline-flex items-center justify-center gap-2 font-semibold px-6 py-3 rounded-xl border-2 border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
              >
                <span className="material-symbols-outlined">photo_library</span>
                View Gallery
              </Link>
            </div>
          </div>
        </div>
      </section>
    </WebsiteLayout>
  )
}

export default About


