import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { Bebas_Neue, DM_Sans } from "next/font/google";
import { headers } from "next/headers";
import { OrganizationJsonLd, WebSiteJsonLd } from "@/components/seo/JsonLd";
import { WebVitalsReporter } from "@/app/web-vitals-reporter";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import "./globals.css";
import "./type-scale.css";

const bebasNeue = Bebas_Neue({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-bebas",
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  display: "swap",
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  title: {
    default: "PhillySportsPack.com | Philadelphia High School Sports Database",
    template: "%s | PhillySportsPack.com"
  },
  description:
    "Complete Philadelphia high school sports database covering football, basketball, baseball, soccer, lacrosse, track & field, wrestling. Stats, records, championships, and player profiles across 400+ schools and 10,000+ athletes.",
  icons: {
    icon: "/favicon.svg",
    apple: "/apple-touch-icon.svg",
  },
  metadataBase: new URL("https://phillysportspack.com"),
  openGraph: {
    type: "website",
    siteName: "PhillySportsPack.com",
    title: "PhillySportsPack.com | Philadelphia High School Sports Database",
    description: "Complete Philadelphia high school sports database covering football, basketball, baseball, soccer, lacrosse, track & field, wrestling.",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "PhillySportsPack.com",
    description: "Complete Philadelphia high school sports database.",
  },
  alternates: {
    canonical: "https://phillysportspack.com",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const gaId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

  // Get CSP nonce from headers passed by middleware
  const headersList = await headers();
  const nonce = headersList.get("x-csp-nonce") || "";

  return (
    <html lang="en" className={`${bebasNeue.variable} ${dmSans.variable}`}>
      <head>
        {/* Preconnect to Google Fonts for faster font loading */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* DNS prefetch for Google Analytics and Google Tag Manager */}
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
        <link rel="dns-prefetch" href="https://www.google-analytics.com" />
        <Script
          nonce={nonce}
          dangerouslySetInnerHTML={{
            __html: `
              (function(){try{var t=localStorage.getItem('psp-theme');if(t){document.documentElement.setAttribute('data-theme',t)}else if(window.matchMedia('(prefers-color-scheme:dark)').matches){document.documentElement.setAttribute('data-theme','dark')}}catch(e){}})()
            `,
          }}
        />
        {/* Organization and Website JSON-LD */}
        <OrganizationJsonLd />
        <WebSiteJsonLd />
        {/* Google Analytics */}
        {gaId && (
          <>
            <Script
              nonce={nonce}
              strategy="afterInteractive"
              src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
            />
            <Script
              nonce={nonce}
              id="google-analytics"
              strategy="afterInteractive"
              dangerouslySetInnerHTML={{
                __html: `
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());
                  gtag('config', '${gaId}');
                `,
              }}
            />
          </>
        )}
      </head>
      <body className="antialiased">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:bg-[var(--psp-gold-text)] focus:text-[var(--psp-navy)] focus:p-4 focus:text-sm focus:font-bold focus:top-0 focus:left-0"
        >
          Skip to main content
        </a>
        <WebVitalsReporter />
        <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
          <Header />
          <main id="main-content" style={{ flex: 1 }}>
            {children}
          </main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
