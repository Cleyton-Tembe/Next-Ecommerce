import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import NavBar from "@/components/Global/NavBar";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import UserProvider from "@/Context/UserContext";
import ProductProvider from "@/Context/ProductContext";
import { CartProvider } from "@/Context/CartContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "E-Commerce",
  description: "Loja online feita com Next.js",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="relative min-h-screen overflow-x-hidden bg-gray-900 font-sans text-white">
        <div
          aria-hidden="true"
          className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,rgba(16,185,129,0.3)_0%,rgba(10,80,60,0.2)_45%,rgba(0,0,0,0.1)_100%)]"
        />

        <div className="relative pt-16">
          <Toaster />

          <UserProvider>
            <ProductProvider>
              <CartProvider>
                <NavBar />
                {children}
              </CartProvider>
            </ProductProvider>
          </UserProvider>
        </div>
      </body>
    </html>
  );
}
