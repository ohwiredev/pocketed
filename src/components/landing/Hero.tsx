import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import logoSvg from "@/assets/brand/logo.svg";
import { Button } from "@/components/ui/button";
import ProductHome from "@/assets/product_home.webp"

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
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
      duration: 0.5,
      ease: [0.21, 0.47, 0.32, 0.98] as const,
    },
  },
};

export default function HeroSection() {
  return (
    <section className="py-20 lg:pt-32 overflow-hidden">
      <div className="relative z-10 mx-auto w-full max-w-7xl px-6">
        <motion.div
          className="relative max-w-3xl"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.img
            src={logoSvg}
            alt="Pocketed"
            className="size-15"
            variants={itemVariants}
          />
          <motion.h1
            className="mt-8 text-balance font-serif text-5xl lg:text-7xl"
            variants={itemVariants}
          >
            Save any video. Find it in seconds.
          </motion.h1>

          <motion.p
            className="text-muted-foreground mt-4 mb-6 text-base md:text-xl"
            variants={itemVariants}
          >
            You see it, you love it, and three weeks later it's gone forever.
            Pocketed saves any video from TikTok, Instagram, or YouTube and
            makes it actually findable when you need it.
          </motion.p>

          <motion.div
            className="flex flex-col items-center gap-2 *:w-full sm:flex-row sm:*:w-auto"
            variants={itemVariants}
          >
            <Button variant="neutral">
              <Link to="/login">
                <span className="text-nowrap">Start for free</span>
              </Link>
            </Button>
          </motion.div>

          <motion.div
            className="mt-8 flex flex-wrap items-center gap-4"
            variants={itemVariants}
          >
            <p className="text-muted-foreground text-center text-sm">
              No credit card. No install. Works on any device.
            </p>
          </motion.div>
        </motion.div>

        <motion.div
          className="relative mt-12 overflow-hidden rounded-3xl bg-black/10 md:mt-16"
          initial={{ opacity: 0, y: 40, scale: 0.95 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true }}
          transition={{
            duration: 0.8,
            delay: 0.4,
            ease: [0.21, 0.47, 0.32, 0.98] as const,
          }}
        >
          <img
            src="https://images.unsplash.com/photo-1547623641-d2c56c03e2a7?q=80&w=3087&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt=""
            className="absolute inset-0 size-full object-cover"
          />

          <div className="bg-background rounded-(--radius) relative m-4 overflow-hidden border border-transparent shadow-xl shadow-black/15 ring-1 ring-black/10 sm:m-8 md:m-12">
            <img
              src={ProductHome}
              alt="app screen"
              className="object-top-left size-full object-cover"
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
