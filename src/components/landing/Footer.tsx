export default function Footer() {
  return (
    <footer className="py-16 px-6 bg-tavazi-dark border-t border-cream/5">
      <div className="max-w-5xl mx-auto text-center">
        <img
          src="/assets/tavazi-logo.png"
          alt="Tavazi"
          className="h-[40px] mx-auto mb-4"
        />
        <p className="text-cream/50 text-sm mb-8 font-display italic">
          From Africa. By Africans. For the World.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-6 mb-8 text-sm">
          <a href="https://tavazi.tv" className="text-cream/50 hover:text-cream transition-colors">Home</a>
          <a href="https://tavazi.tv/about" className="text-cream/50 hover:text-cream transition-colors">About</a>
          <a href="https://tavazi.tv/terms" className="text-cream/50 hover:text-cream transition-colors">Terms</a>
          <a href="https://tavazi.tv/privacy" className="text-cream/50 hover:text-cream transition-colors">Privacy</a>
          <a href="mailto:hello@tavazi.tv" className="text-cream/50 hover:text-cream transition-colors">Contact</a>
        </div>

        <p className="text-cream/30 text-xs">
          &copy; 2025 Thulani Studios Ltd. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
