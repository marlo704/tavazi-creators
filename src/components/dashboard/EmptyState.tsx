import { Film } from 'lucide-react';

interface EmptyStateProps {
  heading?: string;
  body?: string;
}

export default function EmptyState({
  heading = 'No content yet',
  body = 'Your titles will appear here once your content manager uploads them to Muvi CMS and imports analytics.',
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="w-16 h-16 rounded-full bg-tavazi-slate/50 flex items-center justify-center mb-6">
        <Film className="w-8 h-8 text-cream/30" />
      </div>
      <h3 className="font-display text-lg text-cream/60 mb-2">{heading}</h3>
      <p className="text-sm text-cream/40 max-w-md leading-relaxed">{body}</p>
    </div>
  );
}
