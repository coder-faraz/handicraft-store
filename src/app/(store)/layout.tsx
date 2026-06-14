// FILE: src/app/(store)/layout.tsx
import { findAll } from '@/repositories/category.repo';
import AnnouncementBar from '@/components/store/layout/AnnouncementBar';
import Header from '@/components/store/layout/Header';
import Footer from '@/components/store/layout/Footer';
import CartDrawer from '@/components/store/cart/CartDrawer';

export const metadata = {
  title: {
    default: 'Limra Manufacturing Company | Premium Indian Handicrafts',
    template: '%s | Limra Manufacturing Co.',
  },
  description: 'Discover authentic, handcrafted home decor and gifts by skilled Indian artisans.',
};

export default async function StoreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const categories = await findAll();
  // Serialize for client components
  const serializedCategories = JSON.parse(JSON.stringify(categories));

  return (
    <div className="min-h-screen bg-brand-light font-body text-brand-dark flex flex-col">
      <AnnouncementBar />
      <Header categories={serializedCategories} />
      
      <main className="flex-1 flex flex-col">
        {children}
      </main>

      <Footer />
      
      {/* Cart Drawer is global and controlled by CartContext state */}
      <CartDrawer />
    </div>
  );
}
