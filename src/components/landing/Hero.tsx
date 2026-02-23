export default function Hero() {
  return (
    <section className="relative min-h-screen overflow-hidden flex items-center justify-center">
      <div
        className="absolute inset-0 z-[1]"
        style={{
          background: `
            linear-gradient(135deg, rgba(13,13,13,0.95) 0%, rgba(26,26,26,0.85) 50%, rgba(25,113,194,0.15) 100%),
            repeating-linear-gradient(45deg, transparent 0px, transparent 30px, rgba(25,113,194,0.03) 30px, rgba(25,113,194,0.03) 60px),
            repeating-linear-gradient(-45deg, transparent 0px, transparent 30px, rgba(212,168,83,0.05) 30px, rgba(212,168,83,0.05) 60px)
          `,
        }}
      />

      <div
        className="absolute z-0 w-[600px] h-[600px] rounded-full animate-pulse-glow"
        style={{
          top: '-200px',
          right: '-200px',
          background: 'radial-gradient(circle, rgba(25,113,194,0.4), transparent 70%)',
          filter: 'blur(80px)',
        }}
      />

      <div className="relative z-10 max-w-[900px] mx-auto text-center px-6" style={{ paddingTop: 'calc(8rem + 12rem)' }}>
        <div className="inline-flex items-center gap-2 px-5 py-2 mb-8 rounded-full border border-tavazi-navy/30 bg-tavazi-navy/10">
          <span className="w-2 h-2 rounded-full bg-tavazi-navy animate-blink" />
          <span className="text-sm font-semibold uppercase tracking-[0.15em] text-tavazi-navy font-body">
            For African Creators
          </span>
        </div>

        <h1 className="font-display leading-[1.05] tracking-[-0.03em] text-cream mb-8" style={{ fontSize: 'clamp(2.5rem, 8vw, 5rem)' }}>
          Upload Once.{' '}
          <span className="relative text-gold-accent">
            Get Paid Fairly.
            <span className="absolute left-0 right-0 bottom-[0.1em] h-[0.15em] bg-gold-accent/40" />
          </span>{' '}
          Keep Creative Control.
        </h1>

        <p className="max-w-[600px] mx-auto text-cream/80 mb-10 font-body leading-relaxed" style={{ fontSize: 'clamp(1.125rem, 2.5vw, 1.375rem)' }}>
          Tavazi provides the streaming backbone that lets you operate like a professional
          platform &mdash; not a YouTube channel. Your content, your audience, your earnings.
        </p>

        <div className="flex flex-wrap gap-4 justify-center mb-32">
          <a
            href="#apply"
            className="inline-flex items-center gap-2 px-8 py-4 bg-tavazi-navy text-tavazi-dark font-semibold rounded transition-all duration-300 hover:bg-[#339AF0] hover:-translate-y-0.5 hover:shadow-[0_8px_30px_rgba(25,113,194,0.3)]"
          >
            Apply to Join
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </a>
          <a
            href="#how-it-works"
            className="inline-flex items-center px-8 py-4 border border-cream/30 text-cream font-semibold rounded transition-all duration-300 hover:border-cream/60 hover:-translate-y-0.5"
          >
            See How It Works
          </a>
        </div>

        <div className="flex flex-col md:flex-row gap-8 md:gap-16 pt-8 border-t border-cream/10 justify-center">
          <div className="text-center">
            <div className="font-display text-[2.5rem] text-gold-accent">60-70%</div>
            <div className="text-sm text-cream/60">You Keep the Majority</div>
          </div>
          <div className="text-center">
            <div className="font-display text-[2.5rem] text-gold-accent">100%</div>
            <div className="text-sm text-cream/60">Creative Control</div>
          </div>
          <div className="text-center">
            <div className="font-display text-[2.5rem] text-gold-accent">HD</div>
            <div className="text-sm text-cream/60">Adaptive Streaming</div>
          </div>
        </div>
      </div>
    </section>
  );
}
