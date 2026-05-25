import type { Metadata } from "next"
import { Playfair_Display, Source_Serif_4, PT_Mono } from "next/font/google"
import "./globals.css"
import Navbar from "@/components/Navbar"

const display = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["400", "500", "600", "700", "800"],
})

const primary = Source_Serif_4({
  subsets: ["latin"],
  variable: "--font-primary",
  weight: ["300", "400", "600", "700"],
})

const mono = PT_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: ["400"],
})

export const metadata: Metadata = {
  title: "Tinta — Encuestas en Vivo",
  description: "Creá, votá y seguí resultados en tiempo real",
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es" className={`${display.variable} ${primary.variable} ${mono.variable}`}>
      <body className="antialiased min-h-screen">
        <Navbar />
        <main>{children}</main>
      </body>
    </html>
  )
}
