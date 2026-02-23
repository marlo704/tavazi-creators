const steps = [
  {
    number: 1,
    title: 'Apply',
    description: 'Submit your content for review. Authentic African storytelling.',
  },
  {
    number: 2,
    title: 'Upload',
    description: 'Films, docs, series, PPV events. Choose: subscriptions, pay-per-view, or ad-supported.',
  },
  {
    number: 3,
    title: 'Earn',
    description: 'Keep 60-70% of every sale. M-Pesa or local payment methods.',
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 px-6 bg-tavazi-dark">
      <div className="max-w-5xl mx-auto">
        <h2 className="font-display text-3xl md:text-4xl text-cream text-center mb-16">
          How It <span className="text-tavazi-navy">Works</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {steps.map((step) => (
            <div key={step.number} className="text-center">
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 font-display text-2xl text-tavazi-dark"
                style={{
                  background: 'linear-gradient(135deg, #D4A853, #C49B48)',
                  boxShadow: '0 4px 20px rgba(212,168,83,0.3)',
                }}
              >
                {step.number}
              </div>
              <h3 className="font-display text-2xl text-cream mb-3">{step.title}</h3>
              <p className="text-cream/60 text-sm leading-relaxed max-w-xs mx-auto">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
