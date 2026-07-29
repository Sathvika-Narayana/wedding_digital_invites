import type { Metadata } from "next";
import { Great_Vibes, Playfair_Display, EB_Garamond, Cormorant_Garamond, Lato } from "next/font/google";
import "./globals.css";

const greatVibes = Great_Vibes({ 
  weight: '400',
  subsets: ["latin"],
  variable: '--font-great-vibes'
});

const playfair = Playfair_Display({ 
  subsets: ["latin"],
  variable: '--font-playfair'
});

const ebGaramond = EB_Garamond({
  subsets: ["latin"],
  variable: '--font-eb-garamond'
});

const cormorant = Cormorant_Garamond({
  weight: ['300', '400', '700'],
  subsets: ["latin"],
  variable: '--font-cormorant'
});

const lato = Lato({ 
  weight: ['400', '700'],
  subsets: ["latin"],
  variable: '--font-lato'
});

export const metadata: Metadata = {
  title: "Sudeepthi & Nayanadeep | Wedding Invitation",
  description: "Join us in celebrating the wedding of Sudeepthi and Nayanadeep.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${greatVibes.variable} ${playfair.variable} ${ebGaramond.variable} ${cormorant.variable} ${lato.variable}`}>
      <body className="font-sans bg-ivory-bg text-deep-maroon">{children}</body>
    </html>
  );
}
