import React from 'react'
import WebsiteLayout from '../../Components/Website/WebsiteLayout'
import { campusPhotos } from '../../assets/websiteImages'

function Galary() {
  const getCardSpan = (photo, index) => {
    if (photo.orientation === 'portrait') return 'sm:row-span-2'
    if (index % 7 === 0) return 'lg:col-span-2'
    return ''
  }

  return (
    <WebsiteLayout>
      <section className="ryme-section">
        <div className="ryme-shell">
          <div className="ryme-card p-6 sm:p-8">
            <span className="ryme-tag">Campus gallery</span>
            <h1 className="mt-4 text-4xl font-extrabold text-white sm:text-5xl">School Moments</h1>
            <p className="mt-3 max-w-3xl text-sm leading-relaxed text-slate-200 sm:text-base">
              Real photos from classrooms, activities, events, sports and day-to-day student life on campus.
            </p>
          </div>
        </div>
      </section>

      <section className="ryme-section pt-0">
        <div className="ryme-shell">
          <div className="bg-grid-fade rounded-2xl p-3 sm:p-4">
            <div className="grid auto-rows-[220px] grid-cols-1 gap-4 sm:auto-rows-[200px] sm:grid-cols-2 lg:auto-rows-[210px] lg:grid-cols-4">
              {campusPhotos.map((photo, index) => (
                <article
                  key={photo.id}
                  className={`ryme-card group relative overflow-hidden ${getCardSpan(photo, index)}`}
                >
                  <img
                    src={photo.src}
                    alt={photo.title}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                  />
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#031323]/90 via-[#031323]/55 to-transparent p-3.5">
                    <p className="text-sm font-bold text-white">{photo.title}</p>
                    <p className="text-xs uppercase tracking-[0.13em] text-cyan-100/85">Campus & Activities</p>
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
