import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { Toaster } from "@/components/ui/toaster";
import NavbarWrapper from "@/components/home/navbar";
import Footer from "@/components/home/Footer";
import { ChatProvider } from "@/context/ChatContext";
import { CompanyProvider } from '@/context/CompanyContext';

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
    <html lang="en" className={inter.className}>
      <body className="bg-background-light text-foreground">
        <AuthProvider>
          <CompanyProvider>
            <ChatProvider>
              <NavbarWrapper />
              <main className="min-h-screen flex flex-col items-center">
                <div className="flex flex-col gap-20 w-full">
                  {children}
                </div>
                <Toaster />
              </main>
              <Footer />
            </ChatProvider>
          </CompanyProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
