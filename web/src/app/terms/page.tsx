import type { Metadata } from "next";
import Nav from "@/components/nav";
import Footer from "@/components/footer";

export const metadata: Metadata = {
  title: "Terms of Service — VercelLens",
  description: "Terms of service for the VercelLens app.",
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

export default function Terms() {
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
            Terms of Service
          </h1>
          <p className="text-zinc-500 text-sm">Effective date: May 10, 2026</p>
        </div>

        <div className="border-t border-zinc-900 pt-10">
          <Section title="Acceptance">
            <p>
              By downloading or using VercelLens, you agree to these terms. If
              you do not agree, please do not use the app.
            </p>
          </Section>

          <Section title="The Service">
            <p>
              VercelLens is a free Android app that displays your Vercel web
              analytics using your own Vercel personal access token. It connects
              directly to the Vercel API on your behalf and presents your data
              inside the app.
            </p>
          </Section>

          <Section title="Your Account">
            <p>
              You are responsible for the Vercel personal access token you
              provide and for all activity that occurs through it. We recommend
              creating a dedicated token for VercelLens and revoking it if you
              stop using the app.
            </p>
            <p>
              You can manage your tokens at any time at{" "}
              <a
                href="https://vercel.com/account/tokens"
                target="_blank"
                rel="noopener noreferrer"
                className="text-zinc-300 underline underline-offset-2 hover:text-white transition-colors"
              >
                vercel.com/account/tokens
              </a>
              .
            </p>
          </Section>

          <Section title="Free to Use">
            <p>
              VercelLens is free to download and use. There are no in-app
              purchases, subscriptions, or fees of any kind.
            </p>
          </Section>

          <Section title="Updates">
            <p>
              The app may check Google Play for available updates. Updates are
              optional, though older versions may not receive future bug fixes or
              improvements.
            </p>
          </Section>

          <Section title="Disclaimer">
            <p>
              VercelLens is provided &ldquo;as is&rdquo; without warranty of any
              kind. We are not responsible for the accuracy or availability of
              data returned by the Vercel API. VercelLens is not affiliated with,
              endorsed by, or officially connected to Vercel, Inc.
            </p>
          </Section>

          <Section title="Limitation of Liability">
            <p>
              To the fullest extent permitted by law, the developer of
              VercelLens shall not be liable for any indirect, incidental,
              special, or consequential damages arising from your use of, or
              inability to use, the app.
            </p>
          </Section>

          <Section title="Changes">
            <p>
              We may update these terms from time to time. When we do, we will
              update the effective date at the top of this page. Continued use
              of the app after changes are posted constitutes your acceptance of
              the updated terms.
            </p>
          </Section>

          <Section title="Contact">
            <p>
              If you have any questions about these terms, you can reach us at:
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
