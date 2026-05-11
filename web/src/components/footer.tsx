export default function Footer() {
  return (
    <footer className="border-t border-zinc-900 px-6 md:px-12 py-8">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-md bg-zinc-900 border border-zinc-800 flex items-center justify-center">
            <svg width="10" height="10" viewBox="0 0 14 14" fill="white">
              <polygon points="7,1 13,12 1,12" />
            </svg>
          </div>
          <span className="text-xs text-zinc-500">VercelLens</span>
        </div>
        <div className="flex items-center gap-6">
          <a
            href="/privacy-policy"
            className="text-xs text-zinc-600 hover:text-zinc-400 transition-colors"
          >
            Privacy Policy
          </a>
          <a
            href="/terms"
            className="text-xs text-zinc-600 hover:text-zinc-400 transition-colors"
          >
            Terms
          </a>
          <p className="text-xs text-zinc-600">Not affiliated with Vercel, Inc.</p>
        </div>
        <p className="text-xs text-zinc-600">built with ❤️ by Fari</p>
      </div>
    </footer>
  );
}
