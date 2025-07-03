"use client";
import '@fontsource/righteous';
import '@fontsource/josefin-sans';
import "./globals.css";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body style={{ fontFamily: 'Josefin Sans, Arial, sans-serif' }}>
        {children}
        {/* Footer remains as before, or you can import Footer from /components/Footer if desired */}
      </body>
    </html>
  );
}
