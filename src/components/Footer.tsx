import { Heart } from "lucide-react";

const socials = [
  { label: "LinkedIn", href: "https://linkedin.com" },
  { label: "GitHub", href: "https://github.com" },
  { label: "Medium", href: "https://medium.com" },
  { label: "Dribbble", href: "https://dribbble.com" },
  { label: "Figma", href: "https://figma.com" },
  { label: "Buy Me a Coffee", href: "https://buymeacoffee.com" },
];

export const Footer = () => {
  return (
    <footer className="w-full bg-[#f4e8ff] dark:bg-zinc-900 pt-12 pb-24 px-4 border-t-[1.5px] border-ink mt-20">
      <div className="max-w-4xl mx-auto flex flex-col items-center gap-10">

        {/* Social Links Row */}
        <div className="flex flex-wrap items-center justify-center gap-3">
          {socials.map((s) => (
            <a
              key={s.label}
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-2 rounded-full border-[1.5px] border-ink bg-white dark:bg-zinc-800 text-ink dark:text-zinc-100 text-sm font-bold shadow-[3px_3px_0px_rgba(0,0,0,0.3)] hover:brightness-95 hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
            >
              {s.label}
            </a>
          ))}
        </div>

        {/* Shiny Image Button Above Credits */}
        <div className="flex flex-col items-center gap-4 -mb-4">
          <style dangerouslySetInnerHTML={{
            __html: `
            @keyframes shine {
              0% { left: -100%; }
              20% { left: 100%; }
              100% { left: 100%; }
            }
            @keyframes float {
              0%, 100% { transform: translateY(0px); }
              50% { transform: translateY(-5px); }
            }
            .shiny-button::after {
              content: "";
              position: absolute;
              top: 0;
              left: -100%;
              width: 50%;
              height: 100%;
              background: linear-gradient(
                to right,
                transparent,
                rgba(255, 255, 255, 0.6),
                transparent
              );
              transform: skewX(-25deg);
              animation: shine 4s infinite;
            }
          ` }} />
          <a
            href="https://linkedin.com"
            target="_blank"
            rel="noopener noreferrer"
            className="w-16 h-16 rounded-full border-2 border-ink bg-white dark:bg-zinc-800 shadow-[4px_4px_0px_rgba(0,0,0,0.4)] hover:brightness-95 hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all overflow-hidden flex items-center justify-center relative shiny-button"
            style={{ animation: 'float 3s ease-in-out infinite' }}
          >
            <img
              src="/image2.png"
              alt="LinkedIn"
              className="w-full h-full object-cover"
            />
          </a>
        </div>

        {/* Credit Text */}
        <p className="text-sm text-ink dark:text-zinc-400 font-bold flex items-center justify-center gap-1.5 font-mono-tag uppercase">
          Made with <Heart className="w-4 h-4 text-hot-pink fill-hot-pink" /> by Anurag Sen
        </p>

      </div>
    </footer>
  );
};
