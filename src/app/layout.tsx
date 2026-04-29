import type { Metadata } from "next";
import { Bodoni_Moda, Space_Mono, News_Cycle } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import { Ticker } from "@/components/Ticker";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Footer } from "@/components/Footer";
import { ClerkProvider } from "@clerk/nextjs";

const bodoni = Bodoni_Moda({
  subsets: ["latin"],
  variable: "--font-bodoni",
});

const newsCycle = News_Cycle({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-news-cycle",
});

const sillage = localFont({
  src: "../../public/Dx-Sillage-Free-Personal-Use/Dx Sillage regular.otf",
  variable: "--font-sillage",
});

const chomsky = localFont({
  src: "../../public/chomsky/Chomsky.otf",
  variable: "--font-chomsky",
});

const spaceMono = Space_Mono({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-space-mono",
});

import { GlobalClickSound } from "@/components/GlobalClickSound";
import { SplashLoader } from "@/components/SplashLoader";

export const metadata: Metadata = {
  title: "Daily Journal | Chronicles of the Everyday Mind",
  description: "A neobrutalist personal journaling space",
  icons: {
    icon: "/logo.png",
    apple: "/logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${bodoni.variable} ${sillage.variable} ${chomsky.variable} ${spaceMono.variable} ${newsCycle.variable} min-h-screen flex flex-col`}
      >
        <ClerkProvider>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <SplashLoader>
            <GlobalClickSound />
            <Ticker />

            {/* Vintage newspaper page border — wraps everything below ticker */}
            <div className="newspaper-page-border">
              <div className="newspaper-inner-decor" />
              <main className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-10 pb-12">
                {children}
              </main>
              <div className="newspaper-bottom-decor" />
            </div>
            <Footer />
          </SplashLoader>
          </ThemeProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}
