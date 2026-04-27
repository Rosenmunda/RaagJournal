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

        {/* Credit Text */}
        <p className="text-sm text-ink dark:text-zinc-400 font-bold flex items-center justify-center gap-1.5 font-mono-tag uppercase">
          Made with <Heart className="w-4 h-4 text-hot-pink fill-hot-pink" /> by Rosenmunda
        </p>

      </div>
    </footer>
  );
};
