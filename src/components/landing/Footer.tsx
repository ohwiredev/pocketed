import trademarkSvg from "@/assets/trademark.svg";

export default function FooterSection() {
  return (
    <footer className="bg-background border-t pt-6 pb-6">
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
          <img src={trademarkSvg} alt="Pocketed" className="h-16 w-auto" />
          <p className="text-muted-foreground text-base">
            Save any video. Find it in seconds.
          </p>
        </div>

        <div className="mt-5 border-t border-border/50 pt-6">
          <p className="text-muted-foreground text-sm">
            Built with ❤️ for the video collectors.
          </p>
        </div>
      </div>
    </footer>
  );
}
