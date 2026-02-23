import { Check, X } from 'lucide-react';

const rows = [
  {
    feature: 'Revenue Share',
    youtube: '~$1.50 CPM',
    youtubeCheck: false,
    netflix: 'One-time buyout',
    netflixCheck: false,
    tavazi: '60-70% per sale',
    tavaziCheck: true,
  },
  {
    feature: 'African Payment Methods',
    youtube: 'Limited',
    youtubeCheck: false,
    netflix: 'No',
    netflixCheck: false,
    tavazi: 'M-Pesa, Paystack',
    tavaziCheck: true,
  },
  {
    feature: 'Real-Time Analytics',
    youtube: 'Yes',
    youtubeCheck: true,
    netflix: 'No',
    netflixCheck: false,
    tavazi: 'Yes',
    tavaziCheck: true,
  },
  {
    feature: 'Content Ownership',
    youtube: 'You keep rights',
    youtubeCheck: true,
    netflix: 'Often exclusive',
    netflixCheck: false,
    tavazi: 'Non-exclusive, you keep rights',
    tavaziCheck: true,
  },
  {
    feature: 'Community Features',
    youtube: 'Comments only',
    youtubeCheck: false,
    netflix: 'None',
    netflixCheck: false,
    tavazi: 'Action links, impact tracking',
    tavaziCheck: true,
  },
];

function StatusIcon({ isCheck }: { isCheck: boolean }) {
  return isCheck ? (
    <Check className="w-4 h-4 text-success inline mr-1.5" />
  ) : (
    <X className="w-4 h-4 text-danger inline mr-1.5" />
  );
}

export default function ComparisonSection() {
  return (
    <section className="py-24 px-6 bg-tavazi-charcoal">
      <div className="max-w-5xl mx-auto">
        <h2 className="font-display text-3xl md:text-4xl text-cream text-center mb-16">
          See The <span className="text-tavazi-navy">Difference</span>
        </h2>

        <div className="overflow-x-auto -mx-6 px-6">
          <table className="w-full min-w-[600px] border-collapse">
            <thead>
              <tr>
                <th className="text-left py-4 px-4 text-sm font-semibold text-cream/60 uppercase tracking-wider font-body">Feature</th>
                <th className="text-left py-4 px-4 text-sm font-semibold text-cream/60 uppercase tracking-wider font-body">YouTube</th>
                <th className="text-left py-4 px-4 text-sm font-semibold text-cream/60 uppercase tracking-wider font-body">Netflix</th>
                <th className="text-left py-4 px-4 text-sm font-semibold text-cream/60 uppercase tracking-wider font-body bg-tavazi-navy/10 rounded-t-lg">
                  <span className="text-tavazi-navy font-bold">Tavazi</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => (
                <tr key={row.feature} className={i % 2 === 0 ? 'bg-tavazi-slate/30' : ''}>
                  <td className="py-4 px-4 text-sm font-semibold text-cream">{row.feature}</td>
                  <td className="py-4 px-4 text-sm text-cream/70">
                    <StatusIcon isCheck={row.youtubeCheck} />
                    {row.youtube}
                  </td>
                  <td className="py-4 px-4 text-sm text-cream/70">
                    <StatusIcon isCheck={row.netflixCheck} />
                    {row.netflix}
                  </td>
                  <td className="py-4 px-4 text-sm text-cream bg-tavazi-navy/10">
                    <StatusIcon isCheck={row.tavaziCheck} />
                    <strong className="text-tavazi-navy">{row.tavazi}</strong>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
