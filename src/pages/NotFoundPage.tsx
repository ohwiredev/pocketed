import { motion } from "framer-motion";
import { ArrowLeft, Home } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useTitle } from "@/hooks/useTitle";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.21, 0.47, 0.32, 0.98] as const,
    },
  },
};

export default function NotFoundPage() {
  useTitle("Page Not Found");
  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-linear-to-b from-muted to-background px-6">
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 z-0">
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="bg-primary/5 absolute top-1/4 -left-1/4 size-[500px] rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
          className="bg-secondary/5 absolute -right-1/4 bottom-1/4 size-[400px] rounded-full blur-3xl"
        />
      </div>

      <motion.div
        className="relative z-10 flex flex-col items-center text-center"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.h1
          variants={itemVariants}
          className="font-serif text-8xl font-bold tracking-tighter text-primary lg:text-[12rem]"
        >
          404
        </motion.h1>

        <motion.div variants={itemVariants} className="max-w-md">
          <h2 className="mb-4 font-serif text-3xl font-medium tracking-tight text-foreground lg:text-4xl">
            Lost in your pocket?
          </h2>
          <p className="text-muted-foreground mb-8 text-lg leading-relaxed">
            Oops! It seems this page has been tucked away where we can't find
            it. Let's get you back to your videos.
          </p>
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="flex flex-col gap-3 sm:flex-row"
        >
          <Button asChild variant="neutral" size="lg" className="px-8">
            <Link to="/">
              <Home className="mr-2 size-4" />
              Back to Home
            </Link>
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="px-8"
            onClick={() => window.history.back()}
          >
            <ArrowLeft className="mr-2 size-4" />
            Go Back
          </Button>
        </motion.div>
      </motion.div>

      {/* Subtle Footer-like attribution or help */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="text-muted-foreground absolute bottom-8 text-sm"
      >
        Need help?{" "}
        <a
          href="mailto:support@pocketed.com"
          className="hover:text-primary underline"
        >
          Contact Support
        </a>
      </motion.div>
    </main>
  );
}
