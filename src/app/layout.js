import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import PrelineScript from "@/components/PrelineScript";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Techs & The City",
  description: "The marketplace for software solutions — All in one place",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-white dark:bg-[#0a0a0a]`}
      >
        {children}
      <PrelineScript />
      </body>
    </html>
  );
}
