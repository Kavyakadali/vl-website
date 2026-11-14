import type { Metadata } from "next";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";

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
      <body className="min-h-full flex flex-col bg-[#FAF8F5] text-[#1C201D] font-sans antialiased selection:bg-[#C29B38] selection:text-white">
        <CartProvider>
          <Header />
          <CartDrawer />
          <main className="flex-1">{children}</main>
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}

