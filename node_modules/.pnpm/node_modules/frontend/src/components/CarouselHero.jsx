// src/components/CarouselHero.jsx
import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';

const SLIDES = [
  {
    img: 'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1600&auto=format&fit=crop',
    title: 'The Beginner',
    text: 'Tối giản, dễ mix-match, chất liệu bền bỉ.',
    cta: { to: '/collection?collection=the-beginner', label: 'Khám phá' },
  },
  {
    img: 'https://images.unsplash.com/photo-1602810318383-9e1d25b3b807?q=80&w=1600&auto=format&fit=crop',
    title: 'The Trainer',
    text: 'Thể thao năng động — thoáng nhẹ cả ngày.',
    cta: { to: '/collection?collection=the-trainer', label: 'Bắt đầu' },
  },
  {
    img: 'https://images.unsplash.com/photo-1503342394128-c104d54dba01?q=80&w=1600&auto=format&fit=crop',
    title: 'Basic Everyday',
    text: 'Những món cơ bản — giá mềm, mặc sướng.',
    cta: { to: '/collection', label: 'Mua ngay' },
  },
];

export default function CarouselHero() {
  const wrapRef = useRef(null);
  const [idx, setIdx] = useState(0);

  const go = (i) => {
    const el = wrapRef.current;
    if (!el) return;
    const next = (i + SLIDES.length) % SLIDES.length;
    el.scrollTo({ left: next * el.clientWidth, behavior: 'smooth' });
    setIdx(next);
  };

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const onScroll = () => {
      const i = Math.round(el.scrollLeft / el.clientWidth);
      setIdx(i);
    };
    el.addEventListener('scroll', onScroll, { passive: true });
    return () => el.removeEventListener('scroll', onScroll);
  }, []);

  // autoplay
  useEffect(() => {
    const t = setInterval(() => go(idx + 1), 4000);
    return () => clearInterval(t);
  }, [idx]);

  return (
    <section className="relative bg-black text-white">
      <div className="max-w-screen-2xl mx-auto px-4 py-6 md:py-8">
        <div
          ref={wrapRef}
          className="relative w-full overflow-x-auto flex snap-x snap-mandatory rounded-3xl ring-1 ring-white/10"
          style={{ scrollBehavior: 'smooth' }}
        >
          {SLIDES.map((s, i) => (
            <div key={i} className="min-w-full snap-start relative">
              <div className="aspect-[21/9] md:aspect-[16/6]">
                <img src={s.img} alt={s.title} className="w-full h-full object-cover opacity-90" />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent rounded-3xl" />
              <div className="absolute inset-0 p-6 md:p-10 flex items-end">
                <div>
                  <p className="uppercase text-xs tracking-widest text-neutral-300">new season</p>
                  <h1 className="text-3xl md:text-5xl font-extrabold leading-tight">{s.title}</h1>
                  <p className="text-neutral-200 max-w-xl mt-2">{s.text}</p>
                  <Link
                    to={s.cta.to}
                    className="inline-block mt-4 px-5 py-2.5 rounded-2xl bg-white text-black font-medium hover:opacity-90"
                  >
                    {s.cta.label}
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Dots */}
        <div className="flex items-center gap-2 mt-3 justify-center">
          {SLIDES.map((_, i) => (
            <button
              key={i}
              onClick={() => go(i)}
              className={`w-2.5 h-2.5 rounded-full ${i === idx ? 'bg-white' : 'bg-white/40'}`}
              aria-label={`slide ${i + 1}`}
            />
          ))}
        </div>

        {/* Prev/Next */}
        <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex justify-between pointer-events-none max-w-screen-2xl mx-auto">
          <button
            onClick={() => go(idx - 1)}
            className="pointer-events-auto ml-2 md:ml-4 w-10 h-10 grid place-items-center rounded-full bg-white/80 hover:bg-white"
            aria-label="prev"
          >
            ‹
          </button>
          <button
            onClick={() => go(idx + 1)}
            className="pointer-events-auto mr-2 md:mr-4 w-10 h-10 grid place-items-center rounded-full bg-white/80 hover:bg-white"
            aria-label="next"
          >
            ›
          </button>
        </div>
      </div>
    </section>
  );
}
