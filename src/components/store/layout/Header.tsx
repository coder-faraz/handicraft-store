// FILE: src/components/store/layout/Header.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Search, Heart, User, ShoppingCart, Menu, Store, ChevronDown } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import MobileNav from './MobileNav';
import { cn } from '@/lib/utils';
import type { ICategory } from '@/models/Category';
import { getOrganizationSchema } from '@/lib/structured-data';

interface HeaderProps {
  categories: any[];
}

export default function Header({ categories }: HeaderProps) {
  const router = useRouter();
  const { totalItems: cartItemCount, setCartOpen } = useCart();
  const { user, isLoggedIn } = useAuth();
  
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [megaMenuOpen, setMegaMenuOpen] = useState(false);

  // Handle scroll for sticky header styling
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(getOrganizationSchema()) }}
      />
      <header
        className={cn(
          'sticky top-0 z-40 w-full transition-all duration-300',
          isScrolled
            ? 'bg-white/90 backdrop-blur-md shadow-warm-md'
            : 'bg-white shadow-sm'
        )}
      >
        {/* Row 1: Logo, Search, Icons */}
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-20 gap-4 md:gap-8">
            
            {/* Mobile Hamburger */}
            <button
              className="lg:hidden p-2 -ml-2 text-brand-dark"
              onClick={() => setMobileMenuOpen(true)}
            >
              <Menu size={24} />
            </button>

            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 lg:min-w-[200px] flex-shrink-0">
              <div className="hidden sm:flex w-10 h-10 rounded-lg bg-brand-primary items-center justify-center">
                <Store size={22} className="text-white" />
              </div>
              <div>
                <p className="font-display text-2xl font-bold text-brand-dark leading-none tracking-tight">Limra</p>
                <p className="hidden sm:block text-[10px] uppercase tracking-widest text-brand-muted mt-0.5">Manufacturing Co.</p>
              </div>
            </Link>

            {/* Search Bar (Desktop) */}
            <div className="hidden md:block flex-1 max-w-2xl">
              <form onSubmit={handleSearch} className="relative">
                <input
                  type="text"
                  placeholder="Search for handicrafts, decor, gifts..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-5 pr-12 py-3 rounded-full border border-brand-border bg-brand-light focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary transition-all text-sm text-brand-dark placeholder:text-brand-muted"
                />
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 flex items-center justify-center rounded-full bg-brand-primary text-white hover:bg-[#7a3c10] transition-colors"
                >
                  <Search size={16} />
                </button>
              </form>
            </div>

            {/* Icons */}
            <div className="flex items-center gap-2 sm:gap-4 lg:min-w-[200px] justify-end">
              <Link href="/wishlist" className="p-2 text-brand-dark hover:text-brand-primary transition-colors hidden sm:block">
                <Heart size={24} strokeWidth={1.5} />
              </Link>
              
              <Link href={isLoggedIn ? "/account" : "/login"} className="p-2 text-brand-dark hover:text-brand-primary transition-colors flex items-center gap-2">
                <User size={24} strokeWidth={1.5} />
                <span className="hidden xl:block text-sm font-medium">{user?.name?.split(' ')[0] || 'Sign In'}</span>
              </Link>
              
              <button onClick={() => setCartOpen(true)} className="p-2 text-brand-dark hover:text-brand-primary transition-colors relative">
                <ShoppingCart size={24} strokeWidth={1.5} />
                {cartItemCount > 0 && (
                  <span className="absolute top-0.5 right-0 w-5 h-5 rounded-full bg-brand-accent text-white text-[10px] font-bold flex items-center justify-center border-2 border-white">
                    {cartItemCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Row 2: Navigation (Desktop only) */}
        <nav className="hidden lg:block border-t border-brand-border bg-white">
          <div className="container mx-auto px-4">
            <ul className="flex items-center justify-center gap-8 h-12">
              <li>
                <Link href="/" className="text-sm font-medium text-brand-dark hover:text-brand-primary transition-colors">
                  Home
                </Link>
              </li>
              
              {/* Mega Menu Trigger */}
              <li 
                className="h-full flex items-center"
                onMouseEnter={() => setMegaMenuOpen(true)}
                onMouseLeave={() => setMegaMenuOpen(false)}
              >
                <Link href="/products" className="text-sm font-medium text-brand-dark hover:text-brand-primary transition-colors flex items-center gap-1 h-full">
                  Categories <ChevronDown size={14} className={cn('transition-transform', megaMenuOpen && 'rotate-180')} />
                </Link>
                
                {/* Mega Menu Dropdown */}
                {megaMenuOpen && (
                  <div className="absolute top-full left-0 w-full bg-white shadow-warm-lg border-t border-brand-border py-8 px-4 animate-fade-in z-50">
                    <div className="container mx-auto grid grid-cols-4 gap-8">
                      {/* Featured Categories list */}
                      <div className="col-span-3 grid grid-cols-3 gap-6">
                        {categories.slice(0, 6).map(cat => (
                          <div key={cat._id} className="group">
                            <Link href={`/categories/${cat.slug}`} className="flex items-center gap-3">
                              {cat.image?.url ? (
                                <div className="w-12 h-12 rounded-full overflow-hidden bg-brand-light flex-shrink-0">
                                  <img src={cat.image.url} alt={cat.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
                                </div>
                              ) : (
                                <div className="w-12 h-12 rounded-full bg-brand-light flex items-center justify-center flex-shrink-0">
                                  <Store size={18} className="text-brand-muted" />
                                </div>
                              )}
                              <div>
                                <p className="font-semibold text-brand-dark group-hover:text-brand-primary transition-colors">{cat.name}</p>
                                <p className="text-xs text-brand-muted line-clamp-1">{cat.description || 'Explore collection'}</p>
                              </div>
                            </Link>
                          </div>
                        ))}
                      </div>
                      
                      {/* Promotional side panel */}
                      <div className="col-span-1 bg-brand-light rounded-xl p-6 text-center border border-brand-border flex flex-col justify-center items-center">
                        <p className="font-accent text-xl text-brand-primary mb-2">New Arrivals</p>
                        <p className="text-sm text-brand-dark font-medium mb-4">Discover the latest authentic crafts.</p>
                        <Link href="/products" className="btn-primary py-2 px-6 text-sm">
                          Shop Now
                        </Link>
                      </div>
                    </div>
                  </div>
                )}
              </li>
              
              <li>
                <Link href="/products" className="text-sm font-medium text-brand-dark hover:text-brand-primary transition-colors">
                  All Products
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-sm font-medium text-brand-dark hover:text-brand-primary transition-colors">
                  Our Story
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-sm font-medium text-brand-dark hover:text-brand-primary transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>
        </nav>
      </header>

      {/* Mobile Nav Drawer */}
      <MobileNav 
        isOpen={mobileMenuOpen} 
        onClose={() => setMobileMenuOpen(false)} 
        categories={categories}
      />
    </>
  );
}
