import type { Metadata } from "next";
import Nav from "@/components/nav";
import Footer from "@/components/footer";

export const metadata: Metadata = {
  title: "Privacy Policy — VercelLens",
  description: "How VercelLens handles your data.",
};

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mb-10">
      <h2 className="text-lg font-semibold text-white mb-3">{title}</h2>
      <div className="space-y-3 text-zinc-400 text-sm leading-relaxed">
        {children}
      </div>
    </section>
  );
}

export default function PrivacyPolicy() {
  return (
    <div className="bg-black text-white min-h-screen">
      <Nav />

      <main className="max-w-2xl mx-auto px-6 pt-36 pb-24">
        {/* Header */}
        <div className="mb-12">
          <p className="text-xs font-semibold tracking-widest text-zinc-500 uppercase mb-4">
            Legal
          </p>
          <h1 className="text-4xl font-bold tracking-tight gradient-text mb-4">
            Privacy Policy
          </h1>
          <p className="text-zinc-500 text-sm">
            Effective date: May 10, 2026
          </p>
        </div>

        <div className="border-t border-zinc-900 pt-10">
          <Section title="Overview">
            <p>
              VercelLens is a mobile app that lets you view website analytics
              for sites you host on Vercel. This policy explains what
              information the app accesses, how it is used, and what it does
              not do.
            </p>
            <p>
              We take your privacy seriously. VercelLens does not collect,
              store, or sell your personal data.
            </p>
          </Section>

          <Section title="Information we access">
            <p>
              To show you analytics, VercelLens connects to the Vercel API
              using a personal access token that you provide. Through that
              token, the app reads:
            </p>
            <ul className="list-none space-y-2 pl-0">
              {[
                "The list of projects (websites) on your Vercel account",
                "Analytics data for those projects: visitor counts, page views, bounce rate, and per-page traffic",
                "Basic project metadata: project name, live URL, and framework",
              ].map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span className="mt-1 w-1 h-1 rounded-full bg-zinc-600 flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
            <p>
              This data comes directly from the Vercel API and is displayed
              inside the app. It is never sent to any server we operate.
            </p>
          </Section>

          <Section title="Your Vercel API token">
            <p>
              When you sign in, you paste a Vercel personal access token into
              the app. That token is stored only on your device using secure
              local storage. It is never transmitted to us or any third party
              other than the Vercel API itself.
            </p>
            <p>
              You can revoke the token at any time from your Vercel account
              settings at{" "}
              <a
                href="https://vercel.com/account/tokens"
                target="_blank"
                rel="noopener noreferrer"
                className="text-zinc-300 underline underline-offset-2 hover:text-white transition-colors"
              >
                vercel.com/account/tokens
              </a>
              . Removing or revoking the token immediately stops the app from
              accessing any data.
            </p>
          </Section>

          <Section title="Data we do not collect">
            <p>VercelLens does not collect, store, or transmit:</p>
            <ul className="list-none space-y-2 pl-0">
              {[
                "Your name, email address, or any account credentials",
                "Device identifiers or advertising IDs",
                "Location data",
                "Crash reports or analytics about your usage of the app",
                "Any data to our own servers",
              ].map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span className="mt-1 w-1 h-1 rounded-full bg-zinc-600 flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </Section>

          <Section title="Third-party services">
            <p>
              The only third-party service VercelLens communicates with is the
              Vercel API (
              <a
                href="https://vercel.com/docs/rest-api"
                target="_blank"
                rel="noopener noreferrer"
                className="text-zinc-300 underline underline-offset-2 hover:text-white transition-colors"
              >
                vercel.com/docs/rest-api
              </a>
              ). Requests are made directly from your device to Vercel's
              servers. Vercel's own privacy policy governs how they handle
              those requests.
            </p>
            <p>
              VercelLens is not affiliated with, endorsed by, or officially
              connected to Vercel, Inc.
            </p>
          </Section>

          <Section title="Children's privacy">
            <p>
              VercelLens is intended for developers and is not directed at
              children under the age of 13. We do not knowingly collect any
              information from children.
            </p>
          </Section>

          <Section title="Changes to this policy">
            <p>
              We may update this privacy policy from time to time. When we do,
              we will update the effective date at the top of this page. We
              encourage you to review this page periodically.
            </p>
          </Section>

          <Section title="Contact">
            <p>
              If you have any questions about this privacy policy or how
              VercelLens handles data, you can reach us at:
            </p>
            <p>
              <a
                href="mailto:fariraimasocha@gmail.com"
                className="text-zinc-300 underline underline-offset-2 hover:text-white transition-colors"
              >
                fariraimasocha@gmail.com
              </a>
            </p>
          </Section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
