"use client";
import '@fontsource/righteous';
import '@fontsource/josefin-sans';
import "./globals.css";
import { CartProvider } from '../components/CartContext';
import { NotificationProvider } from '../components/NotificationSystem';
import { CurrencyProvider } from '../components/CurrencyContext';

import { ChatBot } from '../components/ChatBot';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body style={{ fontFamily: 'Josefin Sans, Arial, sans-serif' }}>
        <CurrencyProvider>
          <CartProvider>
            <NotificationProvider>
              {children}
              <ChatBot />
            </NotificationProvider>
          </CartProvider>
        </CurrencyProvider>
        {/* Footer remains as before, or you can import Footer from /components/Footer if desired */}
      </body>
    </html>
  );
}
