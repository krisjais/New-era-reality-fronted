import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import ChatBot from "@/components/shared/ChatBot";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export const metadata: Metadata = {
  title: "New Era Reality | Premium Real Estate Consultant in Mumbai",
  description:
    "Leading Real Estate Consultant in Mumbai, Navi Mumbai & Thane. Discover luxury properties, premium apartments, villas, and plots with New Era Reality - your trusted partner in finding the perfect home.",
  keywords: [
    "real estate Mumbai",
    "luxury apartments Mumbai",
    "property consultant",
    "Chembur flats",
    "Kurla apartments",
    "Ghatkopar properties",
    "New Era Reality",
    "RERA registered",
  ],
  authors: [{ name: "New Era Reality" }],
  icons: { icon: "/logo.jpg" },
  openGraph: {
    title: "New Era Reality | Premium Real Estate Consultant",
    description: "Discover luxury properties in Mumbai, Navi Mumbai & Thane",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" data-scroll-behavior="smooth" suppressHydrationWarning>
      <body
        className={`font-sans antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster richColors position="top-right" />
        <ChatBot />
      </body>
    </html>
  );
}
