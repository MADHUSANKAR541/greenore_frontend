import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { AuthProvider } from "@/components/providers/auth-provider";
import { LayoutSelector } from "@/components/layout/layout-selector";
import "./globals.scss";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "GreenOre — AI-powered Circularity & LCA Platform",
  description: "Advanced LCA and circularity analysis platform for metals with AI-powered optimization and reporting",
  keywords: ["LCA", "circularity", "metals", "sustainability", "AI", "optimization"],
  authors: [{ name: "GreenOre Team" }],
  openGraph: {
    title: "GreenOre — AI-powered Circularity & LCA Platform",
    description: "Advanced LCA and circularity analysis platform for metals with AI-powered optimization and reporting",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <ThemeProvider>
          <AuthProvider>
            <LayoutSelector>
              {children}
            </LayoutSelector>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
