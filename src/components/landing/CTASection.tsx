export default function CTASection() {
  const mailtoLink = `mailto:creators@tavazi.tv?subject=${encodeURIComponent('Creator Application - Tavazi')}&body=${encodeURIComponent('Hi Tavazi Team,\n\nI am interested in joining Tavazi as a creator.\n\nName:\nLocation:\nContent Type:\nPortfolio/Links:')}`;

  return (
    <section
      id="apply"
      className="relative py-24 px-6 overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #112640, #0B1929)' }}
    >
      <div
        className="absolute top-0 right-0 w-[800px] h-[800px] rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(25,113,194,0.3), transparent 70%)',
          filter: 'blur(100px)',
          opacity: 0.3,
          transform: 'translate(30%, -30%)',
        }}
      />

      <div className="relative z-10 max-w-3xl mx-auto text-center">
        <h2 className="font-display text-3xl md:text-5xl text-cream mb-6 leading-tight">
          Your Stories, Your Audience, Your Earnings
        </h2>
        <p className="text-cream/70 mb-10 text-lg">
          Join Tavazi and get the streaming infrastructure your content deserves.
        </p>
        <a
          href={mailtoLink}
          className="inline-flex items-center gap-2 px-10 py-4 bg-tavazi-navy text-tavazi-dark font-semibold rounded text-lg transition-all duration-300 hover:bg-[#339AF0] hover:-translate-y-0.5 hover:shadow-[0_8px_30px_rgba(25,113,194,0.3)]"
        >
          Apply Now
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </a>
      </div>
    </section>
  );
}
