import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'PotluckShare — 持ち寄りパーティー管理',
  description: '持ち寄りパーティーのアイテム管理をみんなでシェア',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className={inter.className} style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', margin: 0 }}>
        <Header />
        <main style={{ flex: 1, padding: '24px' }}>
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
