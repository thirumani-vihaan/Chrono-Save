import type { Metadata, Viewport } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import Footer from "@/components/layout/Footer";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  style: ["normal", "italic"],
  display: "swap",
});

export const metadata = {
  title: "Horizon — Decision-Theory Explorer",
  description: "An interactive dashboard for exploring how projected outcomes influence directional decisions. A design fiction.",
  openGraph: {
    title: "Horizon — Decision-Theory Explorer",
    description: "An interactive dashboard for exploring how projected outcomes influence directional decisions. A design fiction.",
  }
};

export const viewport: Viewport = {
  themeColor: "#000000",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${playfair.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-black font-sans text-zinc-100">
        {children}
        <Footer />
      </body>
    </html>
  );
}
