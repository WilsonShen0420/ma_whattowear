import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "天氣穿搭建議 — What to Wear",
  description: "根據今日天氣，提供視覺化穿搭建議",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-Hant">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Sans+TC:wght@400;500;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased min-h-screen bg-gradient-to-br from-sky-50 via-blue-50 to-indigo-50">
        {children}
      </body>
    </html>
  );
}
