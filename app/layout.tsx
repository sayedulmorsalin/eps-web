import type { Metadata, Viewport } from 'next';
import './globals.css';
import { LanguageProvider } from '../context/LanguageContext';
import { AuthProvider } from '../context/AuthContext';
import { CartProvider } from '../context/CartContext';
import { Navbar } from '../components/Navbar';
import { CartDrawer } from '../components/CartDrawer';
import { Footer } from '../components/Footer';
import { MobileBottomNav } from '../components/MobileBottomNav';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: '#221E1F',
};

export const metadata: Metadata = {
  title: 'EPSR — Easy Product Service Rajshahi | রাজশাহীর অনলাইন গ্রোসারি ও সুপারশপ',
  description:
    'EPSR (Easy Product Service Rajshahi) — রাজশাহীর সেরা অনলাইন গ্রোসারি শপ। তাজা শাকসবজি, চাল-ডাল, সয়াবিন ও সরিষার তেল, ডিম, খাঁটি দুধ, মাছ-মাংস ও নিত্যপ্রয়োজনীয় মুদি পণ্য সরাসরি আপনার বাসায় ৬০ মিনিটে হোম ডেলিভারি। ক্যাশ অন ডেলিভারি সুবিধা।',
  icons: {
    icon: '/favicon.svg',
    shortcut: '/favicon.svg',
    apple: '/epsr-icon.svg',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let supabaseOrigin: string | null = null;
  try {
    if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
      supabaseOrigin = new URL(process.env.NEXT_PUBLIC_SUPABASE_URL).origin;
    }
  } catch {
    supabaseOrigin = null;
  }

  return (
    <html lang="bn" className="h-full antialiased">
      <head>
        {supabaseOrigin && (
          <>
            <link rel="preconnect" href={supabaseOrigin} crossOrigin="anonymous" />
            <link rel="dns-prefetch" href={supabaseOrigin} />
          </>
        )}
      </head>
      <body className="min-h-full flex flex-col bg-[#F9FAFB] text-[#221E1F] overflow-x-hidden">
        <LanguageProvider>
          <AuthProvider>
            <CartProvider>
              <Navbar />
              <CartDrawer />
              <main className="flex-1">{children}</main>
              <Footer />
              <MobileBottomNav />
            </CartProvider>
          </AuthProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
