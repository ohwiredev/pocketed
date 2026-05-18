import { motion } from "framer-motion";
import { CalendarCheck, Sparkles, Target } from "lucide-react";
import TaggingPreview from "@/assets/ai-that-gets-it.webp";
import FindIT from "@/assets/find-it.webp";
import { Card } from "@/components/ui/card";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
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

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="bg-background">
      <div className="pb-24 pt-10">
        <div className="mx-auto w-full max-w-7xl px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          ></motion.div>

          <motion.div
            className="mt-20 flex flex-col gap-24 md:gap-32 relative"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
          >
            {/* Elegant dashed timeline line in the center for desktop */}
            <div className="absolute left-1/2 top-10 bottom-10 w-px border-l border-dashed border-foreground/10 -translate-x-1/2 hidden md:block -z-10" />

            {/* Step 1: Text Left, Image Right */}
            <motion.div
              variants={itemVariants}
              className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 items-center"
            >
              {/* Text side */}
              <div className="order-2 md:order-1 flex flex-col justify-center">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-black/70 text-xs font-semibold tracking-wider uppercase mb-4 w-fit">
                  <Target className="size-3.5 animate-pulse" />
                  Step 01
                </div>
                <h3 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl font-serif mb-4">
                  See something that stops you
                </h3>
                <p className="text-muted-foreground text-lg leading-relaxed max-w-xl">
                  Scrolling and something stops you. A recipe, a place, a
                  workout. No need to screenshot or copy links anymore.
                </p>
              </div>

              {/* Image side */}
              <div className="order-1 md:order-2 relative group">
                {/* Glow backdrop effect */}
                <div className="absolute -inset-4 rounded-3xl bg-linear-to-tr from-indigo-500/10 to-purple-500/10 opacity-70 blur-xl group-hover:opacity-100 transition-opacity duration-500 -z-10" />

                <Card
                  className="aspect-video overflow-hidden p-0 border border-foreground/10 shadow-xl hover:shadow-2xl hover:border-indigo-500/20 transition-all duration-300 hover:scale-[1.02]"
                  variant="soft"
                >
                  <div className="relative size-full">
                    <img
                      src="https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?q=80&w=600&auto=format&fit=crop"
                      alt="See content"
                      className="size-full object-cover"
                    />
                  </div>
                </Card>
              </div>
            </motion.div>

            {/* Step 2: Image Left, Text Right */}
            <motion.div
              variants={itemVariants}
              className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 items-center"
            >
              {/* Image side */}
              <div className="order-1 md:order-1 relative group">
                {/* Glow backdrop effect */}
                <div className="absolute -inset-4 rounded-3xl bg-linear-to-tr from-emerald-500/10 to-teal-500/10 opacity-70 blur-xl group-hover:opacity-100 transition-opacity duration-500 -z-10" />

                <Card
                  className="aspect-video overflow-hidden p-0 border border-foreground/10 shadow-xl hover:shadow-2xl hover:border-emerald-500/20 transition-all duration-300 hover:scale-[1.02]"
                  variant="soft"
                >
                  <div className="relative size-full">
                    <img
                      src={TaggingPreview}
                      alt="Pocket content"
                      className="size-full object-cover"
                    />
                  </div>
                </Card>
              </div>

              {/* Text side */}
              <div className="order-2 md:order-2 flex flex-col justify-center">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-black/70 text-xs font-semibold tracking-wider uppercase mb-4 w-fit">
                  <CalendarCheck className="size-3.5 animate-pulse" />
                  Step 02
                </div>
                <h3 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl font-serif mb-4">
                  Pocket it instantly
                </h3>
                <p className="text-muted-foreground text-lg leading-relaxed max-w-xl">
                  Share sheet, tap Pocketed. Title, thumbnail, and tags are
                  handled instantly with intelligent categorization.
                </p>
              </div>
            </motion.div>

            {/* Step 3: Text Left, Image Right */}
            <motion.div
              variants={itemVariants}
              className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 items-center"
            >
              {/* Text side */}
              <div className="order-2 md:order-1 flex flex-col justify-center">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-black/70 text-xs font-semibold tracking-wider uppercase mb-4 w-fit">
                  <Sparkles className="size-3.5 animate-pulse" />
                  Step 03
                </div>
                <h3 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl font-serif mb-4">
                  Find it when you need it
                </h3>
                <p className="text-muted-foreground text-lg leading-relaxed max-w-xl">
                  Search by anything a topic, a vibe, or a half remembered
                  phrase. Pocketed retrieves it instantly.
                </p>
              </div>

              {/* Image side */}
              <div className="order-1 md:order-2 relative group">
                {/* Glow backdrop effect */}
                <div className="absolute -inset-4 rounded-3xl bg-gradient-to-tr from-sky-500/10 to-blue-500/10 opacity-70 blur-xl group-hover:opacity-100 transition-opacity duration-500 -z-10" />

                <Card
                  className="aspect-video overflow-hidden p-0 border border-foreground/10 shadow-xl hover:shadow-2xl hover:border-sky-500/20 transition-all duration-300 hover:scale-[1.02]"
                  variant="soft"
                >
                  <div className="relative size-full">
                    <img
                      src={FindIT}
                      alt="Find content"
                      className="size-full object-cover"
                    />
                  </div>
                </Card>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
