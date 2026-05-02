import type { Metadata } from "next";
import "./globals.css";

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
      <body>{children}</body>
    </html>
  );
}
