import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function CallToAction() {
  return (
    <section>
      <div className="bg-muted py-12">
        <motion.div
          className="mx-auto max-w-7xl px-6"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <h2 className="text-foreground max-w-lg text-balance font-serif text-3xl lg:text-5xl">
            Stop losing the videos you love.
          </h2>
          <p className="mt-4 text-sm md:text-lg">
            Everything you save, finally organised and findable. Free to start,
            works in seconds.
          </p>
          <div className="mt-8 flex gap-3">
            <Link to="/signup">
              <Button className="pr-2 cursor-pointer">
                Get started free
                <ChevronRight
                  strokeWidth={2.5}
                  className="size-3.5! opacity-50"
                />
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
