import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { LayoutContent } from "./layoutContent";
import Script from "next/script";
import { Toaster } from "react-hot-toast";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Aivana Commerce",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <LayoutContent>{children}</LayoutContent>
        <Script
          src="https://cdn.omise.co/omise.js"
          strategy="afterInteractive"
        />
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: "rgba(30, 27, 75, 0.95)",
              backdropFilter: "blur(12px)",
              color: "#ffffff",
              padding: "14px 18px",
              borderRadius: "12px",
              fontSize: "14px",
              fontWeight: "500",
              minWidth: "320px",
              border: "1px solid rgba(139, 92, 246, 0.3)",
              boxShadow: "0 8px 32px rgba(0, 0, 0, 0.4)",
            },
            success: {
              icon: "✓",
              iconTheme: {
                primary: "#22c55e",
                secondary: "#ffffff",
              },
              style: {
                background: "rgba(34, 197, 94, 0.15)",
                backdropFilter: "blur(12px)",
                color: "#ffffff",
                border: "1px solid rgba(34, 197, 94, 0.5)",
                boxShadow: "0 8px 32px rgba(34, 197, 94, 0.2)",
              },
            },
            error: {
              icon: "✕",
              iconTheme: {
                primary: "#ef4444",
                secondary: "#ffffff",
              },
              style: {
                background: "rgba(239, 68, 68, 0.15)",
                backdropFilter: "blur(12px)",
                color: "#ffffff",
                border: "1px solid rgba(239, 68, 68, 0.5)",
                boxShadow: "0 8px 32px rgba(239, 68, 68, 0.2)",
              },
            },
          }}
          containerStyle={{
            top: 24,
            right: 24,
          }}
        />
      </body>
    </html>
  );
}
