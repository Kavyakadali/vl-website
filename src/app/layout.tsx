import type { Metadata } from "next";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import { AuthProvider } from "@/context/AuthContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";
import FloatingWhatsApp from "@/components/FloatingWhatsApp";
import AuthModal from "@/components/AuthModal";

export const metadata: Metadata = {
  title: "VL Designs for you | Pure Kalyani Cottons & Handcrafted Ethnic Wear",
  description: "Direct from loom to wardrobe. Pure Kalyani cotton unstitched suit materials, breathable sarees, and artisan-crafted dresses tailored for you across India.",
  keywords: "VL Designs, cotton suits, Kalyani cotton, unstitched suit materials, cotton sarees, Cham Cham cotton, Reenatex style, pure cotton, Indian ethnic wear",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,500;0,600;0,700;0,800;1,400;1,600&family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-full flex flex-col bg-[#FAF8F5] text-[#1C201D] font-sans antialiased selection:bg-[#C29B38] selection:text-white">
        <AuthProvider>
          <CartProvider>
            <Header />
            <CartDrawer />
            <AuthModal />
            <main className="flex-1">{children}</main>
            <Footer />
            <FloatingWhatsApp />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}


