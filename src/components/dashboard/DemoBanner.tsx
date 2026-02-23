import { forwardRef } from 'react';

const DemoBanner = forwardRef<HTMLDivElement>(function DemoBanner(_props, ref) {
  return (
    <div
      ref={ref}
      className="fixed top-0 left-0 right-0 z-[60] flex flex-col items-center gap-2 py-[10px] px-4 md:flex-row md:gap-0 md:items-center md:justify-between md:py-0 md:px-6 md:h-[44px]"
      style={{
        background: 'rgba(212,168,83,0.15)',
        borderBottom: '1px solid rgba(212,168,83,0.3)',
        backdropFilter: 'blur(12px)',
      }}
    >
      <span
        className="w-full whitespace-normal text-center md:w-auto md:whitespace-nowrap md:text-left"
        style={{ fontSize: '13px', color: 'rgba(245,240,230,0.85)' }}
      >
        Demo view &mdash; sample data only. Sign in to see your real earnings.
      </span>
      <a
        href="https://tavazi.tv/creators"
        target="_blank"
        rel="noopener noreferrer"
        className="w-full text-center md:w-auto md:mt-0 shrink-0 hover:opacity-90 transition-opacity"
        style={{
          background: '#D4A853',
          color: '#0B1929',
          fontWeight: 700,
          fontSize: '12px',
          padding: '6px 16px',
          borderRadius: '4px',
          border: 'none',
          textDecoration: 'none',
          display: 'block',
        }}
      >
        Apply to Join &rarr;
      </a>
    </div>
  );
});

export default DemoBanner;
