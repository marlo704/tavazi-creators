import { TrendingDown, DollarSign, Globe } from 'lucide-react';

const problems = [
  {
    icon: TrendingDown,
    title: 'Buried Under Algorithms',
    description: 'Global platforms treat African content as an afterthought.',
    stat: 'Afterthought',
  },
  {
    icon: DollarSign,
    title: 'Paid Pennies Per View',
    description: 'YouTube pays African creators $1.50 CPM vs $7+ globally.',
    stat: '$1.50 CPM',
  },
  {
    icon: Globe,
    title: 'No Dedicated Home',
    description: 'Audiences hungry for African stories have no dedicated platform.',
    stat: 'Nowhere to Go',
  },
];

export default function ProblemSection() {
  return (
    <section className="py-24 px-6 bg-tavazi-charcoal">
      <div className="max-w-6xl mx-auto">
        <h2 className="font-display text-3xl md:text-4xl text-cream text-center mb-4">
          The Infrastructure <span className="text-tavazi-navy">Gap</span>
        </h2>
        <p className="text-cream/60 text-center mb-16 max-w-2xl mx-auto">
          African creators face systemic barriers that limit their reach and earnings.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {problems.map((problem) => (
            <div
              key={problem.title}
              className="relative bg-tavazi-slate rounded-lg p-8 transition-all duration-300 hover:-translate-y-1 group overflow-hidden"
            >
              <div className="absolute top-0 left-0 right-0 h-[3px]"
                style={{ background: 'linear-gradient(90deg, #dc2626, #f87171)' }}
              />
              <div className="w-12 h-12 rounded-lg flex items-center justify-center mb-5" style={{ background: 'rgba(220,38,38,0.1)' }}>
                <problem.icon className="w-6 h-6 text-red-400" />
              </div>
              <h3 className="font-display text-xl text-cream mb-3">{problem.title}</h3>
              <p className="text-cream/60 text-sm mb-6 leading-relaxed">{problem.description}</p>
              <div className="font-display text-2xl text-red-400">{problem.stat}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
