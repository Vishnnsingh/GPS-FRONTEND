import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import WebsiteLayout from "../../Components/Website/WebsiteLayout";

import { siteMedia } from "./siteContent";
import {
  homeCommunityNotes,
  homeHeroSections,
  homeHeroSlides,
  homeHeroStats,
  homeJourneySteps,
  homeProgramCards,
  homePromisePoints,
  schoolProfile,
} from "./siteContent";

function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % homeHeroSlides.length);
    }, 4200);

    return () => clearInterval(interval);
  }, []);

  const scrollingPoints = [...homePromisePoints, ...homePromisePoints];

  return (
    <WebsiteLayout>

      {/* HERO */}
      <section className="relative overflow-hidden bg-slate-950">
        <div className="absolute inset-0">
          {homeHeroSlides.map((slide, index) => (
            <img
              key={slide.src}
              src={slide.src}
              alt={slide.title}
              className={`absolute inset-0 h-full w-full object-cover transition-all duration-[1500ms] ${
                index === currentSlide ? "opacity-100 scale-100" : "opacity-0 scale-110"
              }`}
            />
          ))}
          <div className="absolute inset-0 bg-black/50"></div>
        </div>

        <div className="relative z-10 mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 text-white">
          <h1 className="text-3xl font-black leading-tight sm:text-5xl lg:text-6xl">
            Clarity for families.
            <br />
            Confidence for students.
          </h1>

          <p className="mt-5 max-w-xl text-sm text-slate-200 sm:text-base lg:text-lg">
            {schoolProfile.name} helps students grow through calm routines,
            clear communication and consistent learning.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link to="/admission" className="gps-site-button">
              Apply for admission
            </Link>

            <Link to="/results-portal" className="gps-site-button">
              Result portal
            </Link>
          </div>

          <div className="mt-8 flex gap-2">
            {homeHeroSlides.map((slide, index) => (
              <button
                key={slide.title}
                onClick={() => setCurrentSlide(index)}
                className={`h-2.5 rounded-full transition-all ${
                  index === currentSlide ? "w-8 bg-cyan-300" : "w-3 bg-white/40"
                }`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* CAMPUS FEEL */}
      <section className="py-16 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 grid grid-cols-1 gap-10 md:grid-cols-2 items-center">

          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-cyan-700">
              What this campus feels like
            </span>

            <h2 className="mt-3 text-3xl font-bold text-slate-900">
              A cleaner hero with supporting details below
            </h2>

            <p className="mt-4 text-slate-600 max-w-xl">
              {schoolProfile.motto} The image now carries the mood of the
              campus while the explanation stays readable and calm.
            </p>

            <div className="mt-6 overflow-hidden rounded-full border">
              <div className="flex min-w-max gap-3 px-4 py-3">
                {scrollingPoints.map((point, index) => (
                  <span
                    key={index}
                    className="flex items-center gap-2 rounded-full border px-4 py-2 text-sm"
                  >
                    ✓ {point}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="grid gap-4">
            {homeHeroSections.map((item) => (
              <div key={item.title} className="rounded-xl border p-6 bg-white shadow-sm">
                <p className="text-xs font-bold uppercase text-cyan-700">
                  {item.title}
                </p>

                <p className="mt-3 text-slate-600">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="py-14 bg-slate-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 text-center">

          {homeHeroStats.map((item) => (
            <div key={item.value}>
              <p className="text-3xl font-extrabold text-slate-900">
                {item.value}
              </p>

              <p className="mt-2 text-slate-600">{item.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* SCHOOL JOURNEY */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 grid gap-10 lg:grid-cols-2">

          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-cyan-700">
              Why families stay
            </span>

            <h2 className="mt-4 text-3xl font-bold text-slate-900">
              Strong school culture works best when it feels clear
            </h2>

            <p className="mt-4 text-slate-600">
              Families want routines, communication and visible growth.
              This website redesign helps make that easier to understand.
            </p>

            <div className="mt-8 space-y-4">
              {homeJourneySteps.slice(0, 2).map((step, index) => (
                <div key={step.title} className="flex gap-4 border rounded-xl p-4">
                  <div className="w-10 h-10 flex items-center justify-center bg-black text-white rounded-full">
                    {index + 1}
                  </div>

                  <div>
                    <p className="font-semibold">{step.title}</p>
                    <p className="text-sm text-slate-600">{step.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <img
              src={siteMedia.homeCulture}
              alt="School culture"
              className="rounded-xl w-full object-cover"
            />

            <div className="mt-6 space-y-4">
              {homeJourneySteps.slice(2).map((step, index) => (
                <div key={step.title} className="border rounded-xl p-4">
                  <p className="text-xs uppercase text-cyan-700 font-bold">
                    Stage {index + 3}
                  </p>

                  <p className="font-semibold">{step.title}</p>

                  <p className="text-sm text-slate-600">{step.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* PROGRAMS */}
      <section className="py-16 bg-slate-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

          <h2 className="text-3xl font-bold text-slate-900">
            Three things this school does well
          </h2>

          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {homeProgramCards.map((card, index) => (
              <div key={card.title} className="border rounded-xl p-6 bg-white">
                <div className="w-10 h-10 flex items-center justify-center bg-black text-white rounded-full">
                  {index + 1}
                </div>

                <h3 className="mt-4 text-xl font-bold">{card.title}</h3>

                <p className="mt-3 text-slate-600">{card.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* COMMUNITY */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

          <h2 className="text-3xl font-bold text-slate-900">
            What families care about most
          </h2>

          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {homeCommunityNotes.map((item) => (
              <div key={item.title} className="border rounded-xl p-6 bg-white">
                <p className="text-sm font-bold uppercase text-cyan-700">
                  {item.title}
                </p>

                <p className="mt-3 text-slate-600">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

    </WebsiteLayout>
  );
}

export default Home;