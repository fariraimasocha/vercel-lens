import Image from "next/image";
import Nav from "@/components/nav";
import Footer from "@/components/footer";

function GooglePlayIcon({ size = 18 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 512 512"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Google Play"
    >
      {/* Google Play icon by Pixel perfect — Flaticon */}
      <path
        d="M48.062 0C33.302 8.578 24 24.47 24 42.667v426.666C24 487.53 33.302 503.422 48.062 512L280 280 48.062 0z"
        fill="#32BBFF"
      />
      <path
        d="M392 216l-56-32.356L280 280l56 96.356L392 344c22.978-13.267 22.978-114.733 0-128z"
        fill="#FFD000"
      />
      <path
        d="M48.062 512C52.714 514.667 57.89 516 63.374 516c9.844 0 19.953-3.467 29.688-10.4L336 376.356 280 280 48.062 512z"
        fill="#00EE76"
      />
      <path
        d="M93.062 5.733C83.327-1.2 73.218-3.6 63.374 0 57.89 0 52.714 1.333 48.062 4L280 280l56-96.356L93.062 5.733z"
        fill="#F43249"
      />
    </svg>
  );
}

export default function Home() {
  return (
    <div className="bg-black text-white min-h-screen overflow-x-hidden">
      <Nav />

      {/* Hero */}
      <section className="relative min-h-screen flex flex-col items-center justify-center text-center px-6 pt-24 pb-20 hero-glow">
        {/* Background grid */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />

        {/* Badge */}
        <div className="mb-8 inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-zinc-800 bg-zinc-950 text-zinc-400 text-xs font-medium">
          <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
          Available on Android
        </div>

        {/* Headline */}
        <h1 className="max-w-3xl text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight leading-[0.95] mb-6">
          <span className="accent-gradient-text">Who&apos;s visiting</span>
          <br />
          <span className="gradient-text">your sites?</span>
        </h1>

        <p className="max-w-md text-base md:text-lg text-zinc-400 leading-relaxed mb-10">
          Real visitor counts, page views, and bounce rates for every website
          you host on Vercel. Always with you, right from your phone.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-3 items-center mb-20">
          <a
            href="https://play.google.com/store/apps/details?id=com.verceltics.android"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2.5 px-6 py-3 rounded-full text-sm font-semibold text-white transition-all duration-200 hover:opacity-90 active:scale-95"
            style={{
              background: "linear-gradient(135deg, #4f6ef7 0%, #3b55d4 100%)",
            }}
          >
            <GooglePlayIcon size={18} />
            Google Play
          </a>
          <a
            href="#features"
            className="flex items-center gap-2 px-6 py-3 rounded-full text-sm font-medium text-zinc-400 hover:text-white transition-colors"
          >
            See features
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M12 5v14M5 12l7 7 7-7" />
            </svg>
          </a>
        </div>

        {/* Phone mockups */}
        <div className="relative flex items-end justify-center gap-4 md:gap-6">
          {/* Left phone */}
          <div
            className="hidden md:block animate-float-delay opacity-70"
            style={{
              transform:
                "perspective(1000px) rotateY(12deg) rotateX(2deg)",
            }}
          >
            <div
              className="relative w-[200px] h-[410px] rounded-[36px] border border-zinc-800 overflow-hidden glow-blue"
              style={{ background: "#0a0a0a" }}
            >
              <Image
                src="/apppictures/projects-portrait.png"
                alt="VercelLens projects screen"
                fill
                loading="lazy"
                className="object-cover object-top rounded-[36px]"
              />
            </div>
          </div>

          {/* Center phone */}
          <div className="animate-float z-10">
            <div
              className="relative w-[260px] h-[530px] md:w-[280px] md:h-[570px] rounded-[44px] border border-zinc-700 overflow-hidden glow-blue"
              style={{
                background: "#000",
                boxShadow:
                  "0 0 80px rgba(79,110,247,0.2), 0 40px 80px rgba(0,0,0,0.8)",
              }}
            >
              <Image
                src="/apppictures/landing-portrait.png"
                alt="VercelLens home screen"
                fill
                loading="lazy"
                className="object-cover object-top rounded-[44px]"
              />
            </div>
          </div>

          {/* Right phone */}
          <div
            className="hidden md:block animate-float-delay opacity-70"
            style={{
              transform:
                "perspective(1000px) rotateY(-12deg) rotateX(2deg)",
            }}
          >
            <div
              className="relative w-[200px] h-[410px] rounded-[36px] border border-zinc-800 overflow-hidden glow-blue"
              style={{ background: "#0a0a0a" }}
            >
              <Image
                src="/apppictures/analytics-portrait.png"
                alt="VercelLens analytics screen"
                fill
                loading="lazy"
                className="object-cover object-top rounded-[36px]"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section
        id="features"
        className="px-6 md:px-12 py-32 max-w-6xl mx-auto"
      >
        <div className="mb-16 text-center">
          <p className="text-xs font-semibold tracking-widest text-zinc-500 uppercase mb-4">
            Features
          </p>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight gradient-text">
            Your site traffic.
            <br />
            Always in your pocket.
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-zinc-900 rounded-2xl overflow-hidden border border-zinc-900">
          {[
            {
              icon: (
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                >
                  <path
                    d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              ),
              title: "All your websites, one list",
              desc: "Every site you host on Vercel, in one place. Tap any of them to see its traffic data straight away.",
            },
            {
              icon: (
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                >
                  <path
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              ),
              title: "Live traffic numbers",
              desc: "Visitors, page views, and bounce rate for your sites, updated in real time. Know exactly what your audience is doing.",
            },
            {
              icon: (
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                >
                  <path
                    d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              ),
              title: "Charts that make sense",
              desc: "Visitor trends shown as clean line charts. Spot traffic spikes, quiet days, and growth patterns without opening a laptop.",
            },
          ].map((f, i) => (
            <div
              key={i}
              className="bg-black p-8 card-glow transition-all duration-300"
            >
              <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400 mb-5">
                {f.icon}
              </div>
              <h3 className="text-base font-semibold text-white mb-2">
                {f.title}
              </h3>
              <p className="text-sm text-zinc-500 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Analytics showcase */}
      <section className="px-6 md:px-12 py-24 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <p className="text-xs font-semibold tracking-widest text-zinc-500 uppercase mb-4">
              Analytics
            </p>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight leading-tight mb-5 gradient-text">
              Know who&apos;s reading
              <br />
              your content.
            </h2>
            <p className="text-zinc-400 text-base leading-relaxed mb-8">
              See visitor counts, page views, and bounce rates for any of your
              Vercel-hosted sites across any time window: 24h, 7d, or 30d.
              Drill down to individual pages to see what actually gets traffic.
            </p>
            <ul className="space-y-3">
              {[
                "Total visitors and page views",
                "Bounce rate with change indicators",
                "Per-page traffic breakdown",
                "Time range switching: 24h, 7d, 30d",
              ].map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-3 text-sm text-zinc-400"
                >
                  <span className="mt-0.5 w-4 h-4 rounded-full border border-zinc-700 flex-shrink-0 flex items-center justify-center">
                    <svg
                      width="8"
                      height="8"
                      viewBox="0 0 8 8"
                      fill="none"
                      stroke="#4f6ef7"
                      strokeWidth="1.5"
                    >
                      <path
                        d="M1 4l2 2 4-4"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="flex justify-center">
            <div
              className="relative w-[260px] h-[530px] rounded-[44px] border border-zinc-800 overflow-hidden"
              style={{
                boxShadow:
                  "0 0 60px rgba(79,110,247,0.12), 0 30px 60px rgba(0,0,0,0.6)",
              }}
            >
              <Image
                src="/apppictures/analytics-portrait.png"
                alt="Analytics screen"
                fill
                loading="lazy"
                className="object-cover object-top rounded-[44px]"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Projects showcase */}
      <section className="px-6 md:px-12 py-24 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="flex justify-center order-2 lg:order-1">
            <div
              className="relative w-[260px] h-[530px] rounded-[44px] border border-zinc-800 overflow-hidden"
              style={{
                boxShadow:
                  "0 0 60px rgba(79,110,247,0.12), 0 30px 60px rgba(0,0,0,0.6)",
              }}
            >
              <Image
                src="/apppictures/projects-portrait.png"
                alt="Projects screen"
                fill
                loading="lazy"
                className="object-cover object-top rounded-[44px]"
              />
            </div>
          </div>
          <div className="order-1 lg:order-2">
            <p className="text-xs font-semibold tracking-widest text-zinc-500 uppercase mb-4">
              Projects
            </p>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight leading-tight mb-5 gradient-text">
              Pick a site,
              <br />
              see its traffic.
            </h2>
            <p className="text-zinc-400 text-base leading-relaxed mb-8">
              All your Vercel websites in a clean list. Tap one and you get its
              visitor numbers straight away. No login, no browser, no waiting.
            </p>
            <ul className="space-y-3">
              {[
                "All your Vercel sites in one list",
                "Tap any site to view its analytics",
                "Live URLs shown for each site",
                "Search to find a site fast",
              ].map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-3 text-sm text-zinc-400"
                >
                  <span className="mt-0.5 w-4 h-4 rounded-full border border-zinc-700 flex-shrink-0 flex items-center justify-center">
                    <svg
                      width="8"
                      height="8"
                      viewBox="0 0 8 8"
                      fill="none"
                      stroke="#4f6ef7"
                      strokeWidth="1.5"
                    >
                      <path
                        d="M1 4l2 2 4-4"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* CTA section */}
      <section className="px-6 md:px-12 py-32 text-center relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none hero-glow" />
        <div className="relative max-w-2xl mx-auto">
          <p className="text-xs font-semibold tracking-widest text-zinc-500 uppercase mb-6">
            Get started
          </p>
          <h2 className="text-4xl md:text-6xl font-bold tracking-tight leading-tight mb-6 accent-gradient-text">
            See who&apos;s visiting
            <br />
            your sites today.
          </h2>
          <p className="text-zinc-400 text-base mb-10 leading-relaxed">
            Connect your Vercel account and get visitor analytics for every
            site you run on Vercel. Free to download.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href="https://play.google.com/store/apps/details?id=com.verceltics.android"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-full text-sm font-semibold text-white transition-all duration-200 hover:opacity-90 active:scale-95"
              style={{
                background:
                  "linear-gradient(135deg, #4f6ef7 0%, #3b55d4 100%)",
              }}
            >
              <GooglePlayIcon size={18} />
              Download on Google Play
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
