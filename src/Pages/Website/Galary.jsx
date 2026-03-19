import React from 'react'
import WebsiteLayout from '../../Components/Website/WebsiteLayout'
import { campusPhotos } from '../../assets/websiteImages'

const galleryHighlights = ['Academic Focus', 'Creative Activities', 'Sports Spirit', 'Community Events']

const galleryCaptions = [
  { title: 'Morning Rhythm', note: 'Assembly moments that set discipline and confidence for the day.' },
  { title: 'Curious Classroom', note: 'Focused teaching with active questions and student participation.' },
  { title: 'Culture in Motion', note: 'Festive performances that build expression and teamwork.' },
  { title: 'Campus Walkway', note: 'Safe and organized spaces that support daily movement.' },
  { title: 'Student Spotlight', note: 'Presentations that strengthen communication and leadership.' },
  { title: 'Reading Corner', note: 'Library hours that nurture habit, language and imagination.' },
  { title: 'Field Energy', note: 'Sports sessions that shape fitness and sportsmanship.' },
  { title: 'Lab Discovery', note: 'Practical exploration through science-based activities.' },
  { title: 'Team Learning', note: 'Peer collaboration where students solve and learn together.' },
  { title: 'Campus Event', note: 'Celebrations and gatherings that create lifelong memories.' },
  { title: 'Annual Stage', note: 'Cultural showcases that reflect student confidence and talent.' },
  { title: 'Proud Display', note: 'Moments that celebrate school values and student growth.' },
  { title: 'Engaged Minds', note: 'Hands-on participation across co-curricular experiences.' },
  { title: 'Beyond Books', note: 'Activities that blend creativity with real-world learning.' },
  { title: 'Creative Lab', note: 'Workshops designed to spark ideas and practical skills.' },
  { title: 'Value First', note: 'Discipline, respect and responsibility in daily practice.' },
  { title: 'Achievement Lens', note: 'Recognizing milestones and motivating every learner.' },
  { title: 'Campus Pride', note: 'A visual story of identity, effort and belonging.' },
]

function Galary() {
  const getCardSpan = (index, photo) => {
    if (index === 0) return 'sm:col-span-2 lg:col-span-2 lg:row-span-2'
    if (photo.orientation === 'portrait' && index % 4 !== 0) return 'sm:row-span-2'
    if (index % 6 === 4) return 'lg:col-span-2'
    return ''
  }

  const getCardTone = (index) => {
    const tones = [
      'from-[#031223]/88 via-[#031223]/34 to-transparent',
      'from-[#1f1408]/82 via-[#1f1408]/35 to-transparent',
      'from-[#0d1a30]/84 via-[#0d1a30]/36 to-transparent',
      'from-[#2a1708]/82 via-[#2a1708]/35 to-transparent',
    ]
    return tones[index % tones.length]
  }

  return (
    <WebsiteLayout>
      <section className="gps-section">
        <div className="gps-shell">
          <div className="relative overflow-hidden rounded-[2rem] border border-[#d3bd92]/65 bg-gradient-to-br from-[#fffaf1] via-[#f9f0de] to-[#f5e8d0] p-6 sm:p-8">
            <div className="pointer-events-none absolute -left-14 top-0 h-52 w-52 rounded-full bg-[#d5ab5a]/20 blur-3xl"></div>
            <div className="pointer-events-none absolute right-[-34px] top-10 h-56 w-56 rounded-full bg-[#3a63a8]/12 blur-3xl"></div>

            <div className="relative z-10">
              <span className="inline-flex items-center gap-2 rounded-full border border-[#c79843]/45 bg-[#f7ecd9] px-4 py-1.5 text-xs font-bold uppercase tracking-[0.15em] text-[#7d5620]">
                <span className="material-symbols-outlined text-sm">photo_library</span>
                Campus Gallery
              </span>

              <h1 className="mt-4 text-4xl font-black tracking-[-0.03em] text-[#1f2d45] sm:text-5xl">
                Stories From
                <span className="ml-2 text-[#b07f31]">Every School Day</span>
              </h1>

              <p className="mt-3 max-w-3xl text-sm leading-relaxed text-[#4d6486] sm:text-base">
                A refreshed visual wall of classrooms, sports, celebrations and student life that captures the spirit
                of learning at our campus.
              </p>

              <div className="mt-5 flex flex-wrap gap-2.5">
                {galleryHighlights.map((item) => (
                  <span
                    key={item}
                    className="inline-flex items-center rounded-full border border-[#d1b27d]/65 bg-white/70 px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-[0.1em] text-[#6c4b1d]"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="gps-section pt-0">
        <div className="gps-shell">
          <div className="rounded-[1.6rem] border border-[#d8c6a2]/60 bg-gradient-to-b from-[#fffdf7] to-[#f6eddb] p-3 sm:p-4">
            <div className="grid auto-rows-[210px] grid-cols-1 gap-4 sm:auto-rows-[220px] sm:grid-cols-2 lg:auto-rows-[210px] lg:grid-cols-4">
              {campusPhotos.map((photo, index) => (
                <article
                  key={photo.id}
                  className={`group relative overflow-hidden rounded-[1.35rem] border border-[#d8c6a2]/70 bg-white shadow-[0_14px_30px_rgba(118,94,56,0.16)] ${getCardSpan(index, photo)}`}
                >
                  <img
                    src={photo.src}
                    alt={photo.title}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.08]"
                  />

                  <div className="absolute left-3 top-3 rounded-full border border-[#f0cf92]/65 bg-[#141619]/58 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-[#f0cf92] backdrop-blur-sm">
                    Frame {String(index + 1).padStart(2, '0')}
                  </div>

                  <div className={`absolute inset-x-0 bottom-0 bg-gradient-to-t ${getCardTone(index)} p-3.5 sm:p-4`}>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#d9b87b]">
                      {index % 2 === 0 ? 'Campus Life' : 'Learning Zone'}
                    </p>
                    <p className="mt-1 text-base font-extrabold text-[#f3dcae] sm:text-lg">
                      {galleryCaptions[index]?.title || photo.title}
                    </p>
                    <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-[#f6ebd2]/90">
                      {galleryCaptions[index]?.note || 'Students learning, exploring and growing together on campus.'}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>
    </WebsiteLayout>
  )
}

export default Galary
