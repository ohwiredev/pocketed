import { motion } from "framer-motion";
import { Check, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.21, 0.47, 0.32, 0.98] as const,
    },
  },
};

const freeFeatures = [
  "Save up to 50 videos",
  "AI auto tagging",
  "Search and filtering",
  "Mobile PWA + bookmarklet",
  "3 collections",
];

const proFeatures = [
  "Unlimited saved videos",
  "AI auto tagging",
  "Search and filtering",
  "Mobile PWA + bookmarklet",
  "Unlimited collections",
  "Priority metadata fetching",
  "Early access to new features",
];

export default function Pricing() {
  return (
    <section id="pricing">
      <div className="py-24">
        <div className="mx-auto max-w-7xl px-6">
          <motion.div
            className="text-center max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-foreground font-serif text-4xl md:text-5xl">
              Simple pricing, no surprises
            </h2>
            <p className="mt-4 text-muted-foreground text-lg">
              Start free. Upgrade when you're ready. Cancel anytime.
            </p>
          </motion.div>

          <motion.div
            className="mt-12 grid gap-8 md:grid-cols-2 md:gap-12 md:mt-16 max-w-4xl mx-auto"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
          >
            <motion.div variants={itemVariants}>
              <div className="relative rounded-3xl border border-border bg-background p-8 h-full">
                <div className="space-y-4">
                  <h3 className="text-foreground font-serif text-2xl">Free</h3>
                  <div className="flex items-baseline gap-1">
                    <span className="text-foreground text-4xl font-semibold">
                      $0
                    </span>
                    <span className="text-muted-foreground">/month</span>
                  </div>
                  <p className="text-muted-foreground text-sm">
                    Get started and see what Pocketed can do.
                  </p>
                </div>

                <ul className="mt-8 space-y-4">
                  {freeFeatures.map((feature) => (
                    <li key={feature} className="flex items-center gap-3">
                      <div className="shrink-0 size-5 rounded-full bg-primary/10 flex items-center justify-center">
                        <Check
                          className="size-3 text-primary"
                          strokeWidth={3}
                        />
                      </div>
                      <span className="text-muted-foreground text-sm">
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>

                <div className="mt-8">
                  <Link to="/signup" className="block">
                    <Button variant="outline" className="w-full cursor-pointer">
                      Get started
                    </Button>
                  </Link>
                </div>
              </div>
            </motion.div>

            <motion.div variants={itemVariants}>
              <div className="relative rounded-3xl border-2 border-primary/30 bg-background p-8 h-full shadow-lg shadow-primary/5">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-primary px-4 py-1.5 text-sm font-medium text-white">
                    <Sparkles className="size-3.5" />
                    Most Popular
                  </span>
                </div>

                <div className="space-y-4 pt-2">
                  <h3 className="text-foreground font-serif text-2xl">Pro</h3>
                  <div className="flex items-baseline gap-1">
                    <span className="text-foreground text-4xl font-semibold">
                      $4.99
                    </span>
                    <span className="text-muted-foreground">/month</span>
                  </div>
                  <p className="text-muted-foreground text-sm">
                    Or save 35% with{" "}
                    <span className="bg-secondary/20 text-foreground px-2 py-0.5 rounded-md font-medium">
                      $39/year
                    </span>
                  </p>
                </div>

                <ul className="mt-8 space-y-4">
                  {proFeatures.map((feature) => (
                    <li key={feature} className="flex items-center gap-3">
                      <div className="shrink-0 size-5 rounded-full bg-primary/10 flex items-center justify-center">
                        <Check
                          className="size-3 text-primary"
                          strokeWidth={3}
                        />
                      </div>
                      <span className="text-foreground text-sm font-medium">
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>

                <div className="mt-8">
                  <Link to="/signup" className="block">
                    <Button className="w-full cursor-pointer">
                      Start 14-day free trial
                    </Button>
                  </Link>
                  <p className="text-center text-xs text-muted-foreground mt-3">
                    Or $39/year (save 35%). Cancel anytime.
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
