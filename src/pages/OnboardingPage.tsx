import { useMeta } from "@/hooks/useMeta";
import { useTitle } from "@/hooks/useTitle";

export default function OnboardingPage() {
  useTitle("Onboarding");
  useMeta({
    description: "Get started with Pocketed and set up your video library.",
  });

  return (
    <div className="onboarding-page">
      <h1>Onboarding</h1>
    </div>
  );
}
