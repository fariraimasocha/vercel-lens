export default function Nav() {
  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-5 md:px-12"
      style={{
        background:
          "linear-gradient(to bottom, rgba(0,0,0,0.9) 0%, transparent 100%)",
        backdropFilter: "blur(12px)",
      }}
    >
      <a href="/" className="flex items-center gap-2.5">
        <div className="w-7 h-7 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="white">
            <polygon points="7,1 13,12 1,12" />
          </svg>
        </div>
        <span className="text-sm font-semibold tracking-tight">VercelLens</span>
      </a>
      <a
        href="https://play.google.com/store/apps/details?id=com.verceltics.android"
        target="_blank"
        rel="noopener noreferrer"
        className="text-xs font-medium px-4 py-2 rounded-full border border-zinc-800 text-zinc-300 hover:text-white hover:border-zinc-600 transition-all duration-200"
      >
        Get the App
      </a>
    </nav>
  );
}
