import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI Doubt Solver — Step-by-Step Math Help",
  description:
    "Get clear, step-by-step solutions to your math problems instantly. Powered by AI, built for students.",
  keywords: ["math solver", "AI tutor", "doubt solver", "step by step math"],
  openGraph: {
    title: "AI Doubt Solver",
    description: "Get clear, step-by-step solutions to your math problems instantly.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
