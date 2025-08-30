import type { Metadata } from "next"
import { Montserrat, Open_Sans } from "next/font/google"
import { SkipLink } from "@/components/ui/skip-link"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "sonner"
import "./globals.css"

const montserrat = Montserrat({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-montserrat",
  weight: ["400", "600", "700", "900"],
})

const openSans = Open_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-open-sans",
  weight: ["400", "500", "600", "700"],
})

export const metadata: Metadata = {
  title: "EboniDating - Connect & Find Love",
  description: "Premium dating platform for meaningful connections",
  generator: "v0.app",
  manifest: "/manifest.json",
  themeColor: "#8b5cf6",
  viewport: "width=device-width, initial-scale=1, maximum-scale=5",
  robots: "index, follow",
  keywords: "LGBTQ+, dating, community, relationships, love, inclusive",
  authors: [{ name: "EboniDating Team" }],
  openGraph: {
    title: "EboniDating - LGBTQ+ Dating Community",
    description: "Connect with your community. Find love, friendship, and meaningful connections.",
    type: "website",
    locale: "en_US",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${montserrat.variable} ${openSans.variable}`}>
      <body className="font-sans antialiased">
        <SkipLink />
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}