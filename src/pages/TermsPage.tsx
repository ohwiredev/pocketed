import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useMeta } from "@/hooks/useMeta";
import { useTitle } from "@/hooks/useTitle";

export default function TermsPage() {
  useTitle("Terms of Service");
  useMeta({
    description:
      "Pocketed terms of service. Understand the rules and guidelines for using our video library platform.",
    canonical: "https://pocketed.app/terms",
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
            Terms of Service
          </h1>
          <p className="text-muted-foreground text-sm mb-12">
            Last updated: May 15, 2026
          </p>

          <div className="prose prose-gray max-w-none space-y-8 text-muted-foreground">
            <section>
              <h2 className="font-serif text-2xl font-semibold text-foreground mb-3">
                1. Acceptance of Terms
              </h2>
              <p>
                By creating an account and using Pocketed, you agree to these
                Terms of Service. If you do not agree, please do not use the
                service.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-2xl font-semibold text-foreground mb-3">
                2. Description of Service
              </h2>
              <p>
                Pocketed is a personal video library that allows users to save,
                organize, and search videos from platforms like TikTok,
                Instagram, and YouTube. You must provide your own video URLs; we
                do not host or store video files, only metadata and links.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-2xl font-semibold text-foreground mb-3">
                3. User Responsibilities
              </h2>
              <p>
                You are responsible for the content you save and share through
                Pocketed. You agree not to use the service to store infringing,
                abusive, or illegal content. You must comply with the terms of
                service of any third-party platform from which you save videos.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-2xl font-semibold text-foreground mb-3">
                4. Account Security
              </h2>
              <p>
                You are responsible for maintaining the confidentiality of your
                account credentials. Please notify us immediately at
                support@pocketed.app if you suspect unauthorized access to your
                account.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-2xl font-semibold text-foreground mb-3">
                5. Limitation of Liability
              </h2>
              <p>
                Pocketed is provided "as is" without warranties of any kind. We
                are not liable for any damages arising from your use of the
                service, including but not limited to data loss or service
                interruption.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-2xl font-semibold text-foreground mb-3">
                6. Termination
              </h2>
              <p>
                You may delete your account and data at any time through your
                profile settings. We reserve the right to suspend or terminate
                accounts that violate these terms.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-2xl font-semibold text-foreground mb-3">
                7. Changes to Terms
              </h2>
              <p>
                We may update these terms from time to time. Continued use of
                Pocketed after changes constitutes acceptance of the new terms.
                We will notify users of material changes via email or in-app
                notification.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-2xl font-semibold text-foreground mb-3">
                8. Contact
              </h2>
              <p>
                For questions about these terms, please contact us at
                support@pocketed.app.
              </p>
            </section>
          </div>
        </motion.div>
      </div>
    </main>
  );
}
