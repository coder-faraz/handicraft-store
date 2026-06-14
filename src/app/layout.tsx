// FILE: src/app/layout.tsx
import type { Metadata, Viewport } from 'next';
import { Playfair_Display, Inter, Kalam } from 'next/font/google';
import './globals.css';
import { CartProvider } from '@/context/CartContext';
import { AuthProvider } from '@/context/AuthContext';

// ─── Font Configuration ───────────────────────────────────────────────────────

const playfairDisplay = Playfair_Display({
  subsets: ['latin'],
  weight: ['700', '900'],
  variable: '--font-display',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-body',
  display: 'swap',
});

const kalam = Kalam({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-accent',
  display: 'swap',
});

// ─── Metadata ─────────────────────────────────────────────────────────────────

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://limramanufacturing.com';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'Limra Manufacturing Company — Authentic Indian Handicrafts',
    template: '%s | Limra Manufacturing Company',
  },
  description:
    'Discover authentic handcrafted treasures from Indian artisans. Premium handicrafts, wooden art, brass decor, and traditional textiles — crafted with love, delivered to your door.',
  keywords: [
    'Indian handicrafts',
    'handmade gifts',
    'wooden handicrafts',
    'brass decor',
    'artisan crafts',
    'Limra Manufacturing',
    'traditional Indian art',
    'handcrafted home decor',
  ],
  authors: [{ name: 'Limra Manufacturing Company' }],
  creator: 'Limra Manufacturing Company',
  publisher: 'Limra Manufacturing Company',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: siteUrl,
    siteName: 'Limra Manufacturing Company',
    title: 'Limra Manufacturing Company — Authentic Indian Handicrafts',
    description:
      'Discover authentic handcrafted treasures from Indian artisans. Premium handicrafts delivered to your door.',
    images: [
      {
        url: `${siteUrl}/og-image.jpg`,
        width: 1200,
        height: 630,
        alt: 'Limra Manufacturing Company — Authentic Indian Handicrafts',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Limra Manufacturing Company — Authentic Indian Handicrafts',
    description:
      'Discover authentic handcrafted treasures from Indian artisans.',
    images: [`${siteUrl}/og-image.jpg`],
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/site.webmanifest',
};

export const viewport: Viewport = {
  themeColor: '#8B4513',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

// ─── Root Layout ──────────────────────────────────────────────────────────────

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${playfairDisplay.variable} ${inter.variable} ${kalam.variable}`}
      suppressHydrationWarning
    >
      <body className="font-body bg-brand-light text-brand-dark antialiased">
        <AuthProvider>
          <CartProvider>
            {children}
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
