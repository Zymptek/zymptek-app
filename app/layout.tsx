import { Inter } from "next/font/google";
import { ThemeProvider } from "next-themes";
import "./globals.css";
import Navbar from "@/components/navbar";
import { AuthProvider } from "@/context/AuthContext";
import { Toaster } from "@/components/ui/toaster";
import { cookies } from 'next/headers';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { MessageProvider } from "@/context/MessageContext";
import { usePathname } from "next/navigation";
import NavbarWrapper from "@/components/navbar";
import Footer from "@/components/home/Footer";

export const dynamic = 'force-dynamic';

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

const inter = Inter({subsets: ["latin"], weight: "variable"})

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: "Zymptek: Leading Platform for Manufacturers, Suppliers, Exporters & Importers",
  description: "Discover a world of opportunities with Zymptek, the premier online B2B marketplace. Connect with top manufacturers, suppliers, exporters, and importers globally. Whether you're sourcing products or seeking new markets, Zymptek offers a seamless platform to meet your business needs. Explore a vast range of industries and connect with trusted partners through our advanced network.",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  
  return (
    <html lang="en" className={inter.className} suppressHydrationWarning>
      <body className="bg-background-light text-foreground">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            <MessageProvider>
              <NavbarWrapper />
              <main className="min-h-screen flex flex-col items-center">
                <div className="flex flex-col gap-20 w-full">
                  {children}
                </div>
                <Toaster />
              </main>
              <Footer />
            </MessageProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
