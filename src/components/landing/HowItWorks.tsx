import { motion } from "framer-motion";
import { CalendarCheck, Plus, Sparkles, Target } from "lucide-react";
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

export default function FeaturesSection() {
  return (
    <section>
      <div className="pb-24">
        <div className="mx-auto w-full max-w-7xl px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-foreground max-w-2xl text-balance font-serif text-5xl">
              Three taps. Done.
            </h2>
          </motion.div>
          <motion.div
            className="mt-16 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
          >
            <motion.div variants={itemVariants}>
              <Card variant="soft" className="overflow-hidden p-6 h-full gap-0">
                <Target className="text-primary size-5" />
                <h3 className="text-foreground mt-5 text-lg font-semibold">
                  Step 1 - See it
                </h3>
                <p className="text-muted-foreground mt-3 text-balance text-sm md:text-base">
                  Scrolling TikTok, Instagram, or YouTube and something catches
                  your eye. A recipe, a workout, a travel spot. Whatever it is.
                </p>

                <MeetingIllustration />
              </Card>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Card
                variant="soft"
                className="group overflow-hidden px-6 pt-6 h-full gap-0"
              >
                <CalendarCheck className="text-primary size-5" />
                <h3 className="text-foreground mt-5 text-lg font-semibold">
                  Step 2 - Pocket it
                </h3>
                <p className="text-muted-foreground mt-3 text-balance text-sm md:text-base">
                  Hit share and tap Pocketed. Or click the bookmarklet on
                  desktop. The video is saved instantly title, thumbnail, and
                  tags handled automatically.
                </p>

                <CodeReviewIllustration />
              </Card>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Card
                variant="soft"
                className="group overflow-hidden px-6 pt-6 h-full gap-0"
              >
                <Sparkles className="text-primary size-5" />
                <h3 className="text-foreground mt-5 text-lg font-semibold">
                  Step 3 - Find it
                </h3>
                <p className="text-muted-foreground mt-3 text-balance text-sm md:text-base">
                  Search by topic, filter by tag, or browse your collections.
                  That video you saved six months ago? Found in two seconds.
                </p>

                <div className="mask-b-from-50 -mx-2 -mt-2 px-2 pt-2">
                  <AIAssistantIllustration />
                </div>
              </Card>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

const MeetingIllustration = () => {
  return (
    <Card
      aria-hidden
      className="mt-9 aspect-video p-0 overflow-hidden relative border-none shadow-2xl"
    >
      <img
        src="https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?q=80&w=2874&auto=format&fit=crop"
        alt="Video content"
        className="size-full object-cover"
      />
    </Card>
  );
};

const CodeReviewIllustration = () => {
  return (
    <div aria-hidden className="relative mt-6">
      <Card className="aspect-video w-4/5 translate-y-4 p-0 overflow-hidden transition-transform duration-200 ease-in-out group-hover:-rotate-3 border-none shadow-xl">
        <img
          src="https://images.unsplash.com/photo-1622737133809-d95047b9e673?q=80&w=2832&auto=format&fit=crop"
          alt="Save video"
          className="size-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex flex-col justify-end p-3">
          <div className="h-2 w-3/4 bg-white/80 rounded-full mb-1"></div>
          <div className="h-2 w-1/2 bg-white/50 rounded-full"></div>
        </div>
      </Card>
      <Card className="absolute -top-4 right-0 flex w-2/5 aspect-square items-center justify-center translate-y-4 transition-transform duration-200 ease-in-out group-hover:rotate-12 bg-primary text-primary-foreground shadow-2xl rounded-2xl border-none">
        <div className="flex flex-col items-center gap-1">
          <Plus className="size-6" />
          <span className="text-[10px] font-bold uppercase tracking-wider">
            Save
          </span>
        </div>
      </Card>
    </div>
  );
};

const AIAssistantIllustration = () => {
  return (
    <Card
      aria-hidden
      className="mt-6 aspect-video translate-y-4 p-3 transition-transform duration-200 group-hover:translate-y-0 shadow-lg border-none bg-background/80 backdrop-blur-md"
    >
      <div className="flex items-center gap-2 mb-3">
        <div className="size-6 rounded-lg bg-primary/10 flex items-center justify-center">
          <Sparkles className="size-3.5 text-primary" />
        </div>
        <div className="h-2 w-20 bg-foreground/10 rounded-full"></div>
      </div>
      <div className="space-y-2 mb-4">
        <div className="h-2.5 w-full bg-foreground/5 rounded-full"></div>
        <div className="h-2.5 w-5/6 bg-foreground/5 rounded-full"></div>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <div className="aspect-video rounded-md bg-muted flex flex-col p-1.5 justify-end overflow-hidden relative">
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
          <div className="h-1 w-3/4 bg-white/80 rounded-full relative z-10"></div>
        </div>
        <div className="aspect-video rounded-md bg-muted flex flex-col p-1.5 justify-end overflow-hidden relative">
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
          <div className="h-1 w-3/4 bg-white/80 rounded-full relative z-10"></div>
        </div>
      </div>
    </Card>
  );
};
