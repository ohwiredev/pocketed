import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { Card } from "@/components/ui/card";

import WorksEverywhere from "@/assets/works-everywhere.webp"

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
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

export default function Features() {
  return (
    <section>
      <div className="bg-muted/50 py-24">
        <div className="mx-auto max-w-7xl px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-foreground font-serif text-5xl">
              Built for how you actually watch
            </h2>
          </motion.div>

          <motion.div
            className="mt-8 grid gap-4 sm:grid-cols-2 md:mt-16 md:grid-cols-3"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
          >
            <motion.div className="space-y-4" variants={itemVariants}>
              <Card
                className="aspect-video overflow-hidden p-0 border-none shadow-md group-hover:shadow-lg transition-shadow"
                variant="soft"
              >
                <div className="relative size-full">
                  <img
                    src={WorksEverywhere}
                    alt="Works Everywhere"
                    className="size-full object-cover"
                  />
                </div>
              </Card>
              
              <div className="sm:max-w-sm">
                <h3 className="text-foreground text-xl font-semibold">
                  Works everywhere
                </h3>
                <p className="text-muted-foreground my-4 text-sm md:text-base">
                  Saved on your phone, findable on your laptop, accessible
                  anywhere. One account, every device, no friction.
                </p>
              </div>
            </motion.div>

            <motion.div className="space-y-4" variants={itemVariants}>
              <Card
                className="aspect-video overflow-hidden p-0 border-none shadow-md group-hover:shadow-lg transition-shadow"
                variant="soft"
              >
                <div className="relative size-full bg-primary/5 p-4 flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <div className="size-4 rounded-full bg-primary/20"></div>
                    <div className="h-2 w-16 bg-primary/10 rounded-full"></div>
                  </div>
                  <div className="h-3 w-full bg-primary/10 rounded-full"></div>
                  <div className="h-3 w-5/6 bg-primary/10 rounded-full"></div>
                  <div className="mt-2 grid grid-cols-2 gap-2">
                    <div className="h-10 bg-primary/5 rounded-md border border-primary/10 border-dashed"></div>
                    <div className="h-10 bg-primary/5 rounded-md border border-primary/10 border-dashed"></div>
                  </div>
                </div>
              </Card>
              <div className="sm:max-w-sm">
                <h3 className="text-foreground text-xl font-semibold">
                  AI that gets it
                </h3>
                <p className="text-muted-foreground my-4 text-sm md:text-base">
                  Pocketed reads every video you save and tags it automatically.
                  Search "quick dinners" or "Tokyo travel" and the right videos
                  surface, no manual tagging needed.
                </p>
              </div>
            </motion.div>

            <motion.div className="space-y-4" variants={itemVariants}>
              <Card
                className="aspect-video overflow-hidden p-0 border-none shadow-md group-hover:shadow-lg transition-shadow"
                variant="soft"
              >
                <div className="relative size-full flex items-center justify-center bg-accent/5">
                  <div className="grid grid-cols-3 gap-1 rotate-12 scale-110 opacity-40">
                    {[...Array(6)].map((_, i) => (
                      <div
                        key={i}
                        className="size-12 bg-accent/20 rounded-lg"
                      ></div>
                    ))}
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="bg-white/90 p-3 rounded-2xl shadow-xl flex items-center gap-3">
                      <div className="size-8 rounded-lg bg-accent flex items-center justify-center">
                        <Sparkles className="size-4 text-white" />
                      </div>
                      <div className="h-3 w-20 bg-accent/20 rounded-full"></div>
                    </div>
                  </div>
                </div>
              </Card>
              <div className="sm:max-w-sm">
                <h3 className="text-foreground text-xl font-semibold">
                  Collections
                </h3>
                <p className="text-muted-foreground my-4 text-sm md:text-base">
                  Group videos however makes sense to you. Fitness routines,
                  dream travel spots, recipes to try. Your library, your way.
                </p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
