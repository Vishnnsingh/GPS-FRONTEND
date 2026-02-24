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
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
        <p className="text-xs font-black text-[#137fec]">Gallery</p>
        <h1 className="mt-1 text-3xl sm:text-4xl font-black text-[#0d141b] dark:text-white">Campus Moments</h1>
        <p className="mt-2 text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-3xl">
          Real school photos from classes, events, labs, sports and daily student activities.
        </p>

        <div className="mt-7 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 auto-rows-[220px] sm:auto-rows-[200px] lg:auto-rows-[210px] gap-4">
          {campusPhotos.map((photo, idx) => (
            <div
              key={photo.id}
              className={`group relative rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-sm hover:shadow-lg transition-all ${getCardSpan(photo, idx)}`}
            >
              <img
                src={photo.src}
                alt={photo.title}
                className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-300"
              />
              <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/70 to-transparent">
                <p className="text-sm font-bold text-white">{photo.title}</p>
                <p className="text-xs text-white/80">Campus & Activities</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </WebsiteLayout>
  )
}

export default Galary


