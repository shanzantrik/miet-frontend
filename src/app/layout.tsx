"use client";
import '@fontsource/righteous';
import '@fontsource/josefin-sans';
import "./globals.css";
import { CartProvider } from '../components/CartContext';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body style={{ fontFamily: 'Josefin Sans, Arial, sans-serif' }}>
        <CartProvider>
          {children}
        </CartProvider>
        {/* Footer remains as before, or you can import Footer from /components/Footer if desired */}
      </body>
    </html>
  );
}
