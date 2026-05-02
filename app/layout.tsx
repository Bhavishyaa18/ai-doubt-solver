import type { Metadata } from "next";
import "./globals.css";
import Script from "next/script";

export const metadata: Metadata = {
  title: "AI Doubt Solver — Get Answers to Any Subject",
  description:
    "Ask any question from Maths, Physics, Chemistry, Biology, History, English and more. Get clear step-by-step explanations instantly.",
  keywords: ["doubt solver", "AI tutor", "homework help", "student", "maths", "science", "history"],
  openGraph: {
    title: "AI Doubt Solver",
    description: "Ask any school or college question. Get instant step-by-step answers.",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {/* Google Analytics */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-17W6NP3SLS"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-17W6NP3SLS');
          `}
        </Script>
        {children}
      </body>
    </html>
  );
}
