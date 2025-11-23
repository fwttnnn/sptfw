import "./globals.css";

import type { Metadata } from "next";
import { ReactLenis as Lenis } from "lenis/react";

import Header from "@/components/Header";
import Tooltip from "@/components/Tooltip";

import { Viaoda_Libre, Plus_Jakarta_Sans } from "next/font/google";

const _01 = Viaoda_Libre({
  weight: "400",
  variable: "--font-vl",
  subsets: ["latin"],
})

const _02 = Plus_Jakarta_Sans({
  weight: "400",
  variable: "--font-pjs",
  subsets: ["latin"],
})

const fonts = [_01, _02]

export const metadata: Metadata = {
  title: "sptfw - spotify wrapped",
  description: "spotify wrapped (data viz challenge '2025)",
}

export default ({ children }: Readonly<{ children: React.ReactNode }>) => {
  return (
    <html lang="en">
      <Lenis root>
        <body
          className={`${fonts.map((f) => f.variable).join(" ")} max-w-[570px] mx-auto my-15 py-5 px-7.5 antialiased`}
        >
          <Tooltip />
          <Header />
          {children}
        </body>
      </Lenis>
    </html>
  )
}
