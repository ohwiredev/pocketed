import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import trademarkSvg from "@/assets/brand/trademark.svg";

const footerLinks = [
  { name: "Features", href: "#features" },
  { name: "How it works", href: "#how-it-works" },
  { name: "Pricing", href: "#pricing" },
  { name: "Privacy", href: "/privacy" },
];

export default function FooterSection() {
  return (
    <footer className="bg-background border-t pt-16 pb-10">
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex flex-col items-center gap-12 md:flex-row md:items-start md:justify-between">
          <motion.div
            className="flex flex-col items-center md:items-start gap-4 max-w-sm"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <img
              src={trademarkSvg}
              alt="Pocketed"
              className="h-12 md:h-14 w-auto"
            />
            <p className="text-muted-foreground text-center md:text-left text-base leading-relaxed">
              Save any video. Find it in seconds. The ultimate curation tool for
              video collectors.
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-2 gap-x-12 gap-y-10 sm:gap-x-20 md:flex md:gap-24"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <div className="flex flex-col gap-5">
              <h4 className="font-serif text-lg text-foreground">Product</h4>
              <ul className="flex flex-col gap-3">
                {footerLinks.slice(0, 3).map((link) => (
                  <li key={link.name}>
                    <a
                      href={link.href}
                      className="text-muted-foreground hover:text-foreground text-sm transition-colors"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex flex-col gap-5">
              <h4 className="font-serif text-lg text-foreground">Legal</h4>
              <ul className="flex flex-col gap-3">
                <li>
                  <Link
                    to="/privacy"
                    className="text-muted-foreground hover:text-foreground text-sm transition-colors"
                  >
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link
                    to="/terms"
                    className="text-muted-foreground hover:text-foreground text-sm transition-colors"
                  >
                    Terms of Service
                  </Link>
                </li>
              </ul>
            </div>
          </motion.div>
        </div>

        <motion.div
          className="mt-16 border-t border-border/50 pt-8 flex flex-col md:flex-row justify-between items-center gap-6"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <p className="text-muted-foreground text-sm text-center md:text-left">
            © {new Date().getFullYear()} Pocketed. Built with ❤️ for the video
            collectors.
          </p>
        </motion.div>
      </div>
    </footer>
  );
}
