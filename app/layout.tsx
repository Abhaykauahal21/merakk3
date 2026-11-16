import type { Metadata } from "next";
import { Montserrat, Nunito } from "next/font/google";
import "./globals.css";
import { ReadyProvider } from "@/components/ReadyProvider";
import SmoothScroll from "@/components/SmoothScroll";
import Cursor from "@/components/Cursor";

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600"],
  variable: "--font-montserrat",
  display: "swap",
});

const nunito = Nunito({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-nunito",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Merakk Studios — Architecture & Interiors",
  description:
    "Merakk Studios is an architecture and interior design practice crafting calm, enduring spaces — from open ground to a home.",
  icons: { icon: "/assets/mark-dark.png" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${montserrat.variable} ${nunito.variable}`}>
      <body>
        <ReadyProvider>
          <SmoothScroll />
          <Cursor />
          {children}
        </ReadyProvider>
      </body>
    </html>
  );
}
