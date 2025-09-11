"use client";
import '@fontsource/righteous';
import '@fontsource/josefin-sans';
import "./globals.css";
import { CartProvider } from '../components/CartContext';
import { NotificationProvider } from '../components/NotificationSystem';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body style={{ fontFamily: 'Josefin Sans, Arial, sans-serif' }}>
        <CartProvider>
          <NotificationProvider>
            {children}
          </NotificationProvider>
        </CartProvider>
        {/* Footer remains as before, or you can import Footer from /components/Footer if desired */}
      </body>
    </html>
  );
}
