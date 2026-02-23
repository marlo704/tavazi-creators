import { Link } from 'react-router-dom';

export default function DemoBanner() {
  return (
    <div
      className="fixed top-[60px] left-0 right-0 z-30 flex items-center justify-between gap-4 px-4 md:px-6 py-2.5"
      style={{
        background: 'rgba(212,168,83,0.15)',
        borderBottom: '1px solid rgba(212,168,83,0.3)',
      }}
    >
      <p className="text-sm text-gold-accent/90 font-body leading-snug">
        This is a demo view with sample data. Apply to join Tavazi to see your real earnings.
      </p>
      <Link
        to="/"
        className="shrink-0 px-4 py-1.5 bg-gold-accent text-tavazi-dark text-sm font-bold rounded-lg hover:bg-[#C49B48] transition-colors"
      >
        Apply to Join
      </Link>
    </div>
  );
}
