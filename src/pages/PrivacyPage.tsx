import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useMeta } from "@/hooks/useMeta";
import { useTitle } from "@/hooks/useTitle";

export default function PrivacyPage() {
  useTitle("Privacy Policy");
  useMeta({
    description:
      "Pocketed privacy policy. Learn how we collect, use, and protect your personal data.",
    canonical: "https://pocketed.app/privacy",
  });

  return (
    <main className="min-h-screen bg-linear-to-b from-muted to-background">
      <div className="mx-auto max-w-3xl px-6 py-16 md:py-24">
        <Button
          asChild
          variant="ghost"
          className="mb-8 -ml-2 gap-2 text-muted-foreground hover:text-foreground"
        >
          <Link to="/">
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>
        </Button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="font-serif text-4xl font-bold tracking-tight md:text-5xl mb-2">
            Privacy Policy
          </h1>
          <p className="text-muted-foreground text-sm mb-12">
            Last updated: May 15, 2026
          </p>

          <div className="prose prose-gray max-w-none space-y-8 text-muted-foreground">
            <section>
              <h2 className="font-serif text-2xl font-semibold text-foreground mb-3">
                1. Information We Collect
              </h2>
              <p>
                When you create an account, we collect your email address and
                display name. When you use Pocketed, we store the video URLs you
                save along with any tags, notes, and collections you create. We
                also collect basic usage data such as page views and feature
                interactions to improve our service.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-2xl font-semibold text-foreground mb-3">
                2. How We Use Your Information
              </h2>
              <p>
                We use your information to provide, maintain, and improve
                Pocketed. This includes saving your videos, generating
                AI-powered tags, organizing your collections, and personalizing
                your experience. We do not sell your personal data to third
                parties.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-2xl font-semibold text-foreground mb-3">
                3. Data Storage and Security
              </h2>
              <p>
                Your data is stored securely using Supabase, a HIPAA-compliant
                cloud database provider. We use industry-standard encryption for
                data in transit (TLS) and at rest. You retain full ownership of
                your content and can delete your account and associated data at
                any time.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-2xl font-semibold text-foreground mb-3">
                4. Third-Party Services
              </h2>
              <p>
                Pocketed integrates with third-party platforms (TikTok,
                Instagram, YouTube) solely for the purpose of fetching video
                metadata. We do not store your login credentials for these
                platforms. Our AI tagging features use Supabase Edge Functions
                running on Deno; no video content is shared with external AI
                providers.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-2xl font-semibold text-foreground mb-3">
                5. Cookies
              </h2>
              <p>
                We use essential cookies for authentication and session
                management. We do not use tracking cookies or third-party
                advertising cookies. You can control cookie settings through
                your browser preferences.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-2xl font-semibold text-foreground mb-3">
                6. Your Rights
              </h2>
              <p>
                You have the right to access, correct, or delete your personal
                data at any time. You can export your data through your profile
                settings. To request complete data deletion, contact us at
                support@pocketed.app.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-2xl font-semibold text-foreground mb-3">
                7. Contact
              </h2>
              <p>
                For questions about this privacy policy, please reach out to
                support@pocketed.app.
              </p>
            </section>
          </div>
        </motion.div>
      </div>
    </main>
  );
}
