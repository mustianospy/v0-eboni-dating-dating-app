import type React from "react"
export const dynamic = "force-dynamic"

import type { Metadata } from "next"
import { Montserrat, Open_Sans } from "next/font/google"
import { SkipLink } from "@/components/ui/skip-link"
import { Providers } from "@/components/providers"
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
  description: "Premium LGBTQ+ dating platform for meaningful connections and community building",
  generator: "v0.app",
  manifest: "/manifest.json",
  themeColor: "#8b5cf6",
  viewport: "width=device-width, initial-scale=1, maximum-scale=5",
  robots: "index, follow",
  keywords: "LGBTQ+, dating, community, relationships, love, inclusive, queer, pride, connection",
  authors: [{ name: "EboniDating Team" }],
  openGraph: {
    title: "EboniDating - LGBTQ+ Dating Community",
    description:
      "Connect with your community. Find love, friendship, and meaningful connections in a safe, inclusive space.",
    type: "website",
    locale: "en_US",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "EboniDating",
  },
  formatDetection: {
    telephone: false,
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${montserrat.variable} ${openSans.variable}`}>
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/icon-192x192.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="msapplication-config" content="/browserconfig.xml" />
        <meta name="msapplication-TileColor" content="#8b5cf6" />
        <meta name="msapplication-tap-highlight" content="no" />
      </head>
      <body className="font-sans antialiased">
        <SkipLink />
        <Providers>
          {children}
          <Toaster />
        </Providers>

        <script
          dangerouslySetInnerHTML={{
            __html: `
              if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js')
                    .then(function(registration) {
                      console.log('SW registered: ', registration);
                    })
                    .catch(function(registrationError) {
                      console.log('SW registration failed: ', registrationError);
                    });
                });
              }
            `,
          }}
        />
      </body>
    </html>
  )
}
