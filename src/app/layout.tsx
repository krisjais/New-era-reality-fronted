import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import ChatBot from "@/components/shared/ChatBot";
import { SITE, buildOrganizationJsonLd } from "@/lib/seo";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0f" },
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
  ],
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: "New Era Reality | Premium Real Estate in Mumbai | Buy, Sell & Invest",
    template: "%s | New Era Reality",
  },
  description:
    "Discover premium apartments, villas, plots and commercial properties in Mumbai, Navi Mumbai and Thane with New Era Reality. Trusted RERA-registered property consultants with verified listings.",
  keywords: [
    "real estate Mumbai",
    "property in Mumbai",
    "luxury apartments Mumbai",
    "commercial property Mumbai",
    "plots in Navi Mumbai",
    "flats for sale Mumbai",
    "New Era Reality",
    "RERA registered consultant",
    "property consultant Thane",
    "buy flat Mumbai",
  ],
  authors: [{ name: "New Era Reality", url: SITE.url }],
  creator: "New Era Reality",
  publisher: "New Era Reality",
  icons: {
    icon: "/logo.jpg",
    shortcut: "/logo.jpg",
    apple: "/logo.jpg",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
  openGraph: {
    title: "New Era Reality | Premium Real Estate in Mumbai",
    description:
      "Discover premium apartments, villas, plots and commercial properties in Mumbai, Navi Mumbai and Thane with New Era Reality.",
    url: SITE.url,
    siteName: "New Era Reality",
    type: "website",
    locale: "en_IN",
    images: [
      {
        url: "/logo.jpg",
        width: 1200,
        height: 630,
        alt: "New Era Reality — Premium Real Estate in Mumbai",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "New Era Reality | Premium Real Estate in Mumbai",
    description:
      "Discover premium apartments, villas, plots and commercial properties in Mumbai, Navi Mumbai and Thane.",
    images: ["/logo.jpg"],
  },
  verification: {
    google: "z3rORXxN7BQCXYYGEgbDOKIQjuGX5VccMHL8lMUlCpY",
  },
};

const orgJsonLd = buildOrganizationJsonLd();

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" data-scroll-behavior="smooth" suppressHydrationWarning>
      <head>
        {/* Preconnect for performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
        {/* Global Organization + WebSite JSON-LD */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
        />
      </head>
      <body className={`font-sans antialiased bg-background text-foreground`}>
        {children}
        <Toaster richColors position="top-right" />
        <ChatBot />
      </body>
    </html>
  );
}
