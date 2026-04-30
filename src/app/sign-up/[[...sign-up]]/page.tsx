import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className="bg-transparent flex flex-col items-center justify-center min-h-screen p-2 sm:p-8 transition-colors duration-300 w-full overflow-x-hidden">

      {/* Newspaper Wrapper */}
      <article className="w-full max-w-5xl bg-paper shadow-md border-x-[1px] border-y-[4px] border-ink transition-colors duration-300 overflow-hidden box-border flex flex-col">

        {/* Apple UI Window Controls */}
        <div className="w-full bg-surface/50 border-b-[1px] border-ink py-2 px-4 flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-[#FF5F56] border-[1px] border-black/10 shadow-sm"></div>
          <div className="w-3 h-3 rounded-full bg-[#FFBD2E] border-[1px] border-black/10 shadow-sm"></div>
          <div className="w-3 h-3 rounded-full bg-[#27C93F] border-[1px] border-black/10 shadow-sm"></div>
        </div>

        {/* Top Dateline Bar (Full Width) */}
        <header className="py-2 px-3 sm:px-6 uppercase tracking-wider text-[9px] sm:text-xs font-sans font-bold border-b-4 border-double border-ink flex justify-between items-center transition-colors duration-300 text-ink">
          <span className="hidden sm:inline-block">{today}</span>
          <span className="tracking-[0.2em] opacity-80 text-center flex-1 sm:flex-none">EDITION: DIGITAL</span>
          <span className="hidden sm:inline-block">VOL. I</span>
        </header>

        {/* Main Content Area: Split on Desktop, Stacked on Mobile */}
        <div className="flex flex-col md:flex-row w-full box-border stretch">

          {/* Left Panel: Project Summary (Hidden on Mobile) */}
          <div className="hidden md:flex flex-col w-full md:w-1/2 p-8 lg:p-12 border-r-[2px] border-ink box-border bg-surface/30">
            <h1 className="font-chomsky text-5xl lg:text-7xl font-extralight tracking-tighter text-ink leading-[0.9] mb-4 text-center">
              The Raag Journal
            </h1>
            
            <img 
              src="/logo.png" 
              alt="Raag Journal Logo" 
              className="w-full max-w-[200px] mx-auto mb-6 object-contain mix-blend-multiply dark:mix-blend-screen opacity-80" 
            />

            <p className="font-serif italic text-base lg:text-lg text-ink/80 mb-6">
              &ldquo;Chronicles of the Everyday Mind&rdquo;
            </p>

            <div className="h-[2px] w-full bg-ink/20 mb-8"></div>

            <div className="font-serif text-ink leading-relaxed text-sm lg:text-base flex-1">
              <p className="mb-6">
                RaagJournal is a premium personal journaling application designed with a <strong>Vintage Newspaper and Modern Pop-Art</strong> aesthetic. It elegantly blends the nostalgia of classic broadsheets with high-contrast Neobrutalist design and AI-powered intelligence.
              </p>

              <p className="font-sans font-bold uppercase tracking-widest text-xs text-ink/70 mb-3">Key Features</p>
              <ul className="space-y-3 font-serif">
                <li className="flex gap-2 items-start"><span className="text-ink">•</span> <span><strong>Interactive Masthead:</strong> Classic header triggering the Chronos terminal.</span></li>
                <li className="flex gap-2 items-start"><span className="text-ink">•</span> <span><strong>Chronos Terminal:</strong> Functional timer, alarm, and world clock.</span></li>
                <li className="flex gap-2 items-start"><span className="text-ink">•</span> <span><strong>Spotify Music Sync:</strong> Journal entries with your favourite songs.</span></li>
                <li className="flex gap-2 items-start"><span className="text-ink">•</span> <span><strong>Global Broadside:</strong> Real-time AI-generated news feed powered by Google Gemini.</span></li>
              </ul>
            </div>

            <div className="mt-8 pt-6 border-t-[1px] border-ink/20">
              <p className="font-sans text-[10px] font-bold tracking-[0.2em] uppercase text-ink">
                Crafted by Raag
              </p>
            </div>
          </div>

          {/* Right Panel: Authentication */}
          <div className="w-full md:w-1/2 p-4 sm:p-6 md:p-8 lg:p-12 flex flex-col items-center justify-center box-border overflow-hidden">

            {/* Mobile-only Masthead (Since Left Panel is hidden) */}
            <div className="md:hidden mb-8 text-center w-full border-b-[2px] border-ink pb-8 transition-colors duration-300">
              <h1 className="font-chomsky text-5xl sm:text-6xl font-extralight tracking-tighter text-ink leading-[0.9] mb-4 break-words">
                The Raag Journal
              </h1>
              <img 
                src="/logo.png" 
                alt="Raag Journal Logo" 
                className="w-full max-w-[150px] mx-auto mb-4 object-contain mix-blend-multiply dark:mix-blend-screen opacity-80" 
              />
              <p className="font-serif italic text-sm text-ink/80 mt-2">
                &ldquo;Start Your Chronicle Today&rdquo;
              </p>
              <p className="font-sans text-[9px] font-bold tracking-[0.2em] uppercase text-ink mt-6">
                Crafted by Raag
              </p>
            </div>

            {/* Vintage Section Header */}
            <div className="flex items-center gap-2 sm:gap-4 mb-6 sm:mb-8 w-full justify-center">
              <div className="h-[1px] bg-ink/30 flex-1"></div>
              <h2 className="font-sans text-[9px] sm:text-[10px] font-black uppercase tracking-[0.3em] text-ink text-center whitespace-nowrap px-1">
                New Subscriber Registration
              </h2>
              <div className="h-[1px] bg-ink/30 flex-1"></div>
            </div>

            {/* Clerk Component */}
            <div className="w-full pb-2 pl-0.5 pr-1.5 sm:pr-2 box-border flex justify-center">
              <SignUp
                appearance={{
                  elements: {
                    rootBox: "mx-auto w-full max-w-full box-border",
                    card: "bg-surface border-[2px] border-ink shadow-[2px_2px_0px_0px_var(--ink)] sm:shadow-[4px_4px_0px_0px_var(--ink)] rounded-none p-4 sm:p-6 w-full max-w-full box-border overflow-hidden",
                    headerTitle: "font-serif text-xl sm:text-2xl font-black text-ink",
                    headerSubtitle: "font-sans text-[10px] sm:text-xs uppercase tracking-widest text-ink/70 mt-2",
                    socialButtonsBlockMain: "flex-wrap justify-center gap-2",
                    socialButtonsBlockButton: "border-ink border-[1px] hover:bg-ink/5 rounded-none transition-colors max-w-full flex-1",
                    socialButtonsBlockButtonText: "font-sans font-bold uppercase text-[9px] sm:text-[10px] tracking-wider text-ink",
                    dividerLine: "bg-ink/20",
                    dividerText: "font-mono text-[9px] sm:text-[10px] uppercase tracking-widest text-ink/50",
                    formFieldLabel: "font-sans font-black uppercase text-[9px] sm:text-[10px] tracking-widest text-ink mb-1.5 sm:mb-2",
                    formFieldInput: "border-ink border-[1px] rounded-none bg-paper focus:ring-0 focus:border-ink font-serif text-ink py-2 w-full box-border",
                    formButtonPrimary: "bg-ink text-paper rounded-none font-sans font-black uppercase tracking-[0.2em] text-[10px] sm:text-xs py-2.5 sm:py-3 hover:opacity-80 transition-opacity mt-2 w-full box-border",
                    footerActionText: "font-serif text-xs sm:text-sm text-ink/70",
                    footerActionLink: "font-sans text-[10px] sm:text-xs font-black uppercase tracking-widest text-ink hover:opacity-70 decoration-[1.5px] underline-offset-4 ml-1 sm:ml-2",
                    identityPreviewText: "font-serif text-ink text-sm",
                    identityPreviewEditButtonIcon: "text-ink hover:opacity-70"
                  }
                }}
              />
            </div>

          </div>
        </div>
      </article>

      {/* Decorative Bottom Rule */}
      <div className="w-full max-w-5xl mt-2 border-t-[1px] border-ink opacity-30"></div>
    </div>
  );
}