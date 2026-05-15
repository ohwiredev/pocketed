import CallToAction from "@/components/landing/CTA";
import Features from "@/components/landing/Features";
import Footer from "@/components/landing/Footer";
import HeroSection from "@/components/landing/Hero";
import HowItWorks from "@/components/landing/HowItWorks";
import Testimonials from "@/components/landing/Testimonials";

import { useMeta } from "@/hooks/useMeta";
import { useTitle } from "@/hooks/useTitle";

export default function LandingPage() {
  useTitle("Your AI Powered Video Library");
  useMeta({
    description:
      "Save any video from TikTok, Instagram, or YouTube and find it again instantly using AI-powered search and tagging.",
    keywords:
      "video library, bookmark videos, AI search, TikTok saver, Instagram saver, YouTube library, video tagging",
    canonical: "https://pocketed.app/",
  });

  return (
    <main className="min-h-screen bg-linear-to-b from-muted to-background">
      <HeroSection />
      <HowItWorks />
      <Features />
      <Testimonials />
      <CallToAction />
      <Footer />
    </main>
  );
}
