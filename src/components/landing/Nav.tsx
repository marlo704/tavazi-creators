import { Link } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';

export default function Nav() {
  const { user } = useAuthStore();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-10"
      style={{
        overflow: 'visible',
        background: 'rgba(13,13,13,0.8)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(25,113,194,0.1)',
      }}
    >
      <a href="https://tavazi.tv" className="relative z-10">
        <img
          src="/assets/tavazi-logo.png"
          alt="Tavazi"
          style={{ height: '200px', width: 'auto', objectFit: 'contain', marginTop: '-70px', marginBottom: '-70px' }}
        />
      </a>

      <div className="flex items-center gap-3">
        <a
          href="https://tavazi.tv"
          className="hidden sm:inline-flex items-center px-6 py-3 text-sm font-semibold text-cream border border-tavazi-navy rounded transition-all duration-300 hover:bg-tavazi-navy hover:text-tavazi-dark"
        >
          Watch Films &rarr;
        </a>
        <Link
          to={user ? '/dashboard' : '/login'}
          className="inline-flex items-center px-4 sm:px-6 py-2 sm:py-3 text-[0.8125rem] sm:text-sm font-semibold text-gold-accent border border-gold-accent rounded transition-all duration-300 hover:bg-gold-accent hover:text-tavazi-dark"
        >
          {user ? 'Dashboard' : 'Creator Login'}
        </Link>
      </div>
    </nav>
  );
}
