const testimonials = [
  {
    initials: 'AO',
    name: 'Amara Okonkwo',
    role: 'Documentary Filmmaker, Lagos',
    quote: 'Finally, a platform where I can operate like a professional -- not just another YouTube channel. My content lives in a real library with trailers and collections, and I keep 65% of every sale.',
  },
  {
    initials: 'KM',
    name: 'Kofi Mensah',
    role: 'Independent Director, Accra',
    quote: 'M-Pesa payments that actually work, HD streaming that looks professional, and an audience that is actually looking for African content. This is the infrastructure we have been waiting for.',
  },
];

export default function Testimonials() {
  return (
    <section className="py-24 px-6 bg-tavazi-charcoal">
      <div className="max-w-5xl mx-auto">
        <h2 className="font-display text-3xl md:text-4xl text-cream text-center mb-16">
          Creators Love <span className="text-tavazi-navy">Tavazi</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {testimonials.map((t) => (
            <div
              key={t.name}
              className="relative bg-tavazi-slate rounded-xl p-8 pt-12"
            >
              <span
                className="absolute top-4 left-6 font-display text-[5rem] leading-none text-tavazi-navy/20 select-none"
                aria-hidden="true"
              >
                &ldquo;
              </span>
              <p className="text-cream/80 text-sm leading-relaxed mb-8 relative z-10">
                {t.quote}
              </p>
              <div className="flex items-center gap-3 relative z-10">
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center font-display text-sm text-tavazi-dark shrink-0"
                  style={{ background: 'linear-gradient(135deg, #1971C2, #D4A853)' }}
                >
                  {t.initials}
                </div>
                <div>
                  <div className="font-semibold text-cream text-sm">{t.name}</div>
                  <div className="text-cream/50 text-xs">{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
