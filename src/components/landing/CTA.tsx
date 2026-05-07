import { ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function CallToAction() {
  return (
    <section>
      <div className="bg-muted py-12">
        <div className="mx-auto max-w-7xl px-6">
          <h2 className="text-foreground max-w-lg text-balance font-serif text-3xl lg:text-5xl">
            Stop losing the videos you love.
          </h2>
          <p className="mt-4 text-lg">
            Everything you save, finally organised and findable. Free to start,
            works in seconds.
          </p>
          <div className="mt-8 flex gap-3">
            <Button className="pr-2">
              Get started free
              <ChevronRight
                strokeWidth={2.5}
                className="size-3.5! opacity-50"
              />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
