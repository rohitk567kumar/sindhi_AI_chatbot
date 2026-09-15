import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "سنڌي AI چيٽ بوٽ",
  description: "سنڌي ٻولي ۾ ذهين گفتگو",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="sd" dir="rtl">
      <body>{children}</body>
    </html>
  );
}

