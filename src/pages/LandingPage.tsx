import CallToAction from "@/components/landing/CTA";
import Features from "@/components/landing/Features";
import Footer from "@/components/landing/Footer";
import HeroSection from "@/components/landing/Hero";
import HowItWorks from "@/components/landing/HowItWorks";
import Testimonials from "@/components/landing/Testimonials";

import { useTitle } from "@/hooks/useTitle";

export default function LandingPage() {
  useTitle("Your AI Powered Video Library");

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
