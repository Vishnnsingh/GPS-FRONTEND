import React from 'react'
import WebsiteLayout from '../../Components/Website/WebsiteLayout'

function Galary() {
  const images = [
    "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=1200&q=80",
    "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=1200&q=80",
    "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=1200&q=80",
    "https://images.unsplash.com/photo-1529070538774-1843cb3265df?w=1200&q=80",
    "https://images.unsplash.com/photo-1588072432836-7a1a7f3f2b7e?w=1200&q=80",
    "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=1200&q=80",
    "https://images.unsplash.com/photo-1562774053-701939374585?w=1200&q=80",
    "https://images.unsplash.com/photo-1529390079861-591de354faf5?w=1200&q=80",
    "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=1200&q=80",
  ]

  return (
    <WebsiteLayout>
      <section className="max-w-6xl mx-auto px-4 py-10">
        <p className="text-xs font-black text-[#137fec]">Gallery</p>
        <h1 className="mt-1 text-3xl font-black text-[#0d141b] dark:text-white">Campus Moments</h1>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300 max-w-2xl">
          A glimpse of classrooms, activities, celebrations and student life.
        </p>

        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {images.map((src, idx) => (
            <div
              key={`${src}-${idx}`}
              className="group rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-sm hover:shadow-lg transition-shadow"
            >
              <div
                className="w-full aspect-4/3 bg-cover bg-center group-hover:scale-[1.02] transition-transform"
                style={{ backgroundImage: `url('${src}')` }}
              />
              <div className="p-3">
                <p className="text-sm font-black text-slate-900 dark:text-white">Photo {idx + 1}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">School activities & campus</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </WebsiteLayout>
  )
}

export default Galary


