import logoSvg from "@/assets/logo.svg";
import { Button } from "@/components/ui/button";

export default function HeroSection() {
  return (
    <section className="py-20 lg:pt-32">
      <div className="relative z-10 mx-auto w-full max-w-7xl px-6">
        <div className="relative max-w-3xl">
          <img src={logoSvg} alt="Pocketed" className="size-15" />
          <h1 className="mt-8 text-balance font-serif text-5xl lg:text-7xl">
            Save any video. Find it in seconds.
          </h1>

          <p className="text-muted-foreground mt-4 mb-6 text-xl">
            You see it, you love it, and three weeks later it's gone forever.
            Pocketed saves any video from TikTok, Instagram, or YouTube and
            makes it actually findable when you need it.
          </p>

          <div className="flex flex-col items-center gap-2 *:w-full sm:flex-row sm:*:w-auto">
            <Button variant="neutral">
              <span className="text-nowrap">Start for free</span>
            </Button>
            <Button variant="ghost">
              <span className="text-nowrap">View Demo</span>
            </Button>
          </div>
        </div>

        <div className="relative mt-12 overflow-hidden rounded-3xl bg-black/10 md:mt-16">
          <img
            src="https://images.unsplash.com/photo-1547623641-d2c56c03e2a7?q=80&w=3087&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt=""
            className="absolute inset-0 size-full object-cover"
          />

          <div className="bg-background rounded-(--radius) relative m-4 overflow-hidden border border-transparent shadow-xl shadow-black/15 ring-1 ring-black/10 sm:m-8 md:m-12">
            <img
              src="https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?q=80&w=2874&auto=format&fit=crop"
              alt="app screen"
              className="object-top-left size-full object-cover"
            />
          </div>
        </div>

        <div className="mt-8 flex flex-wrap items-center gap-4">
          <p className="text-muted-foreground text-center">
            No credit card. No install. Works on any device.
          </p>
        </div>
      </div>
    </section>
  );
}
