import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { Toaster } from "@/components/ui/toaster";
import { ChatProvider } from "@/context/ChatContext";
import { CompanyProvider } from '@/context/CompanyContext';
import { ProductsProvider } from '@/context/ProductsContext';
import { SearchProvider } from '@/context/SearchContext';
import { CategoriesProvider } from '@/context/CategoriesContext';
import Footer from "@/components/shared/Footer";
import DynamicNavbar from "@/components/shared/dynamic-navbar";

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

const inter = Inter({subsets: ["latin"], weight: "variable"})

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: "Zymptek: Leading Platform for Manufacturers, Suppliers, Exporters & Importers",
  description: "Discover a world of opportunities with Zymptek, the premier online B2B marketplace. Connect with top manufacturers, suppliers, exporters, and importers globally. Whether you're sourcing products or seeking new markets, Zymptek offers a seamless platform to meet your business needs. Explore a vast range of industries and connect with trusted partners through our advanced network.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.className}>
      <body className="bg-background-light text-foreground">
        <AuthProvider>
          <CompanyProvider>
            <ProductsProvider>
              <SearchProvider>
                <ChatProvider>
                  <CategoriesProvider>
                    <DynamicNavbar />
                    {/* Navbar will be rendered inside each page where needed */}
                    {children}
                    <Footer />
                    <Toaster />
                  </CategoriesProvider>
                </ChatProvider>
              </SearchProvider>
            </ProductsProvider>
          </CompanyProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
