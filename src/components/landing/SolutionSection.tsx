import { Wallet, Library, CreditCard } from 'lucide-react';

const solutions = [
  {
    icon: Wallet,
    highlight: '60-70%',
    title: 'You Keep the Majority',
    description: 'Your stories, your audience, your earnings.',
  },
  {
    icon: Library,
    highlight: 'Professional',
    title: 'Library You Control',
    description: 'Professional library with trailers, categories, collections.',
  },
  {
    icon: CreditCard,
    highlight: 'Local',
    title: 'Payments That Work',
    description: 'M-Pesa, local currencies KES/NGN/GHS/ZAR/USD.',
  },
];

export default function SolutionSection() {
  return (
    <section className="py-24 px-6 bg-tavazi-dark">
      <div className="max-w-6xl mx-auto">
        <h2 className="font-display text-3xl md:text-4xl text-cream text-center mb-4">
          Your Professional <span className="text-tavazi-navy">Streaming Infrastructure</span>
        </h2>
        <p className="text-cream/60 text-center mb-16 max-w-3xl mx-auto leading-relaxed">
          We are not trying to be Netflix. We are building the infrastructure so African creators do not need Netflix.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {solutions.map((solution) => (
            <div
              key={solution.title}
              className="relative rounded-lg p-8 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_12px_40px_rgba(25,113,194,0.15)] overflow-hidden border border-tavazi-navy/20"
              style={{ background: 'linear-gradient(135deg, #1A3555, rgba(25,113,194,0.05))' }}
            >
              <div className="absolute top-0 left-0 right-0 h-[3px]"
                style={{ background: 'linear-gradient(90deg, #1971C2, #D4A853)' }}
              />
              <div className="w-20 h-20 rounded-full flex items-center justify-center mb-6" style={{ background: 'rgba(25,113,194,0.15)' }}>
                <solution.icon className="w-9 h-9 text-tavazi-navy" />
              </div>
              <div className="font-display text-5xl text-gold-accent mb-3">{solution.highlight}</div>
              <h3 className="font-display text-xl text-cream mb-3">{solution.title}</h3>
              <p className="text-cream/60 text-sm leading-relaxed">{solution.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
