import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Mueed City | Interactive Portfolio",
  description: "An explorable city portfolio for Mueed Ibne Sami — builder, operator, and systems thinker."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
