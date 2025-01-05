import { Geist, Geist_Mono } from "next/font/google";
import AnalyticsProvider from "./components/AnalyticsProvider"; // Import the client component
import "./globals.css";

// Load custom fonts
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "ChitChatWe",
  description: "Real-time chat application built with Next.js and Firebase.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AnalyticsProvider /> {/* Client-side component for analytics */}
        {children}
      </body>
    </html>
  );
}
