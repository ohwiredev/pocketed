import { motion } from "framer-motion";
import { Star } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

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
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut",
    },
  },
};

export default function TestimonialSection() {
  const testimonials = [
    {
      name: "Priya",
      role: "Home cook",
      stars: 5,
      avatar:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=2787&auto=format&fit=crop",
      content:
        "I saved a pasta recipe on TikTok in January. Found it in Pocketed in about four seconds. That used to take me twenty minutes of scrolling.",
    },
    {
      name: "Marcus",
      role: "Personal trainer",
      stars: 5,
      avatar:
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=2787&auto=format&fit=crop",
      content:
        "I follow so many fitness creators. Pocketed is the only reason I can actually find the workouts I want when I want them.",
    },
    {
      name: "Leila",
      role: "Frequent traveller",
      stars: 5,
      avatar:
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=2787&auto=format&fit=crop",
      content:
        "I travel a lot and save every recommendation I come across. Pocketed turned a mess of saved posts into something I can actually use.",
    },
  ];

  return (
    <section>
      <div className="py-24">
        <div className="@container mx-auto w-full max-w-7xl px-6">
          <motion.h2
            className="text-foreground mb-12 font-serif text-5xl"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            You're not the only one losing good videos
          </motion.h2>
          <motion.div
            className="@lg:grid-cols-2 @3xl:grid-cols-3 @3xl:gap-12 grid gap-6"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
          >
            {testimonials.map((testimonial) => (
              <motion.div key={testimonial.name} variants={itemVariants}>
                <div className="flex gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={`star-${testimonial.name}-${i}`}
                      className={cn(
                        "size-4",
                        i < testimonial.stars
                          ? "fill-primary stroke-primary"
                          : "fill-foreground/15 stroke-transparent",
                      )}
                    />
                  ))}
                </div>
                <p className="text-foreground my-4">{testimonial.content}</p>
                <div className="flex items-center gap-2">
                  <Avatar className="ring-foreground/10 size-6 border border-transparent shadow ring-1">
                    <AvatarImage
                      src={testimonial.avatar}
                      alt={testimonial.name}
                    />
                    <AvatarFallback>
                      {testimonial.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="text-foreground text-sm font-medium">
                    {testimonial.name}
                  </div>
                  <span
                    aria-hidden
                    className="bg-foreground/25 size-1 rounded-full"
                  />
                  <span className="text-muted-foreground text-sm">
                    {testimonial.role}
                  </span>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
