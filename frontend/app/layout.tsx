import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "HeartFlow — Your AI Wingman",
  description: "Agentic AI that reads conversations, scores intent, and curates personalized dates for you.",
  icons: { icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>💜</text></svg>" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div className="orb orb-1" />
        <div className="orb orb-2" />
        <div className="relative z-10">{children}</div>
      </body>
    </html>
  );
}
