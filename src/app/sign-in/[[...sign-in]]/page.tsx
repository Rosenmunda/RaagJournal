import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    // Outer wrapper uses transparent so it blends with your global background
    <div className="min-h-screen bg-transparent flex flex-col items-center justify-center p-4 sm:p-8 transition-colors duration-300">

      {/* Newspaper Wrapper (Matches WorldNews layout) */}
      <article className="w-full max-w-4xl bg-paper shadow-md border-x-[1px] border-y-[4px] border-ink transition-colors duration-300">

        {/* Top Dateline Bar */}
        <header className="py-2 px-6 uppercase tracking-wider text-[10px] sm:text-xs font-sans font-bold border-b-4 border-double border-ink flex justify-between items-center transition-colors duration-300 text-ink">
          <span className="hidden sm:inline-block">{today}</span>
          <span className="tracking-[0.2em] opacity-80">EDITION: DIGITAL</span>
          <span className="hidden sm:inline-block">VOL. I</span>
        </header>

        <div className="p-6 md:p-12 flex flex-col items-center">

          {/* Masthead */}
          <div className="mb-12 text-center w-full border-b-[2px] border-ink pb-10 transition-colors duration-300">
            <h1 className="font-chomsky text-5xl sm:text-7xl md:text-[5.5rem] font-extralight tracking-tighter text-ink leading-[0.9] mb-4">
              The Raag&apos;s Daily Journal
            </h1>
            <p className="font-serif italic text-sm sm:text-base text-ink/80 mt-4">
              &ldquo;Chronicles of the Everyday Mind&rdquo;
            </p>
          </div>

          {/* Authentication Section */}
          <div className="w-full max-w-md flex flex-col items-center">

            {/* Vintage Section Header */}
            <div className="flex items-center gap-4 mb-8 w-full justify-center">
              <div className="h-[1px] bg-ink/30 flex-1"></div>
              <h2 className="font-sans text-[10px] font-black uppercase tracking-[0.3em] text-ink text-center">
                Subscriber Authorization
              </h2>
              <div className="h-[1px] bg-ink/30 flex-1"></div>
            </div>

            {/* Clerk Component with Custom Neobrutalist / Vintage Theme */}
            <SignIn
              appearance={{
                elements: {
                  rootBox: "mx-auto w-full",
                  card: "bg-surface border-[2px] border-ink shadow-[4px_4px_0px_0px_var(--ink)] rounded-none p-6 sm:p-8",
                  headerTitle: "font-serif text-2xl font-black text-ink",
                  headerSubtitle: "font-sans text-xs uppercase tracking-widest text-ink/70 mt-2",
                  socialButtonsBlockButton: "border-ink border-[1px] hover:bg-ink/5 rounded-none transition-colors",
                  socialButtonsBlockButtonText: "font-sans font-bold uppercase text-[10px] tracking-wider text-ink",
                  dividerLine: "bg-ink/20",
                  dividerText: "font-mono text-[10px] uppercase tracking-widest text-ink/50",
                  formFieldLabel: "font-sans font-black uppercase text-[10px] tracking-widest text-ink mb-2",
                  formFieldInput: "border-ink border-[1px] rounded-none bg-paper focus:ring-0 focus:border-ink font-serif text-ink py-2",
                  formButtonPrimary: "bg-ink text-paper rounded-none font-sans font-black uppercase tracking-[0.2em] text-xs py-3 hover:opacity-80 transition-opacity mt-2",
                  footerActionText: "font-serif text-sm text-ink/70",
                  footerActionLink: "font-sans text-xs font-black uppercase tracking-widest text-ink hover:opacity-70 decoration-[1.5px] underline-offset-4 ml-2",
                  identityPreviewText: "font-serif text-ink",
                  identityPreviewEditButtonIcon: "text-ink hover:opacity-70"
                }
              }}
            />

          </div>
        </div>
      </article>

      {/* Decorative Bottom Rule */}
      <div className="w-full max-w-4xl mt-2 border-t-[1px] border-ink opacity-30"></div>
    </div>
  );
}