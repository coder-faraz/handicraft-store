// FILE: src/app/(store)/wishlist/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { User, MapPin, Heart, Package, Loader2, Trash2, ShoppingCart } from 'lucide-react';
import { formatPrice } from '@/lib/utils';

export default function WishlistPage() {
  const { isLoggedIn, isLoading } = useAuth();
  const { addToCart } = useCart();
  const router = useRouter();

  const [wishlist, setWishlist] = useState<any[]>([]);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    if (!isLoading && !isLoggedIn) {
      router.push('/login?redirect=/wishlist');
    }
  }, [isLoading, isLoggedIn, router]);

  const fetchWishlist = () => {
    setFetching(true);
    fetch('/api/wishlist')
      .then(res => res.json())
      .then(data => {
        if (data.success) setWishlist(data.data);
      })
      .finally(() => setFetching(false));
  };

  useEffect(() => {
    if (isLoggedIn) fetchWishlist();
  }, [isLoggedIn]);

  const handleRemove = async (productId: string) => {
    try {
      const res = await fetch('/api/wishlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId }),
      });
      if (res.ok) fetchWishlist();
    } catch (e) {
      console.error(e);
    }
  };

  const handleMoveToCart = async (product: any) => {
    addToCart({
      productId: product._id,
      name: product.name,
      price: product.salePrice || product.price,
      image: product.images[0]?.url,
      quantity: 1,
      stock: product.stock
    });
    await handleRemove(product._id);
  };

  if (isLoading || fetching) {
    return (
      <div className="py-24 flex items-center justify-center bg-brand-light min-h-[60vh]">
        <Loader2 size={32} className="animate-spin text-brand-primary" />
      </div>
    );
  }

  if (!isLoggedIn) return null;

  return (
    <div className="bg-brand-light/50 min-h-screen py-12">
      <div className="container mx-auto px-4 max-w-6xl">
        <h1 className="font-display text-3xl font-bold text-brand-dark mb-8">My Wishlist</h1>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar */}
          <div className="w-full md:w-64 space-y-2 flex-shrink-0">
            <Link href="/account" className="flex items-center gap-3 px-4 py-3 text-brand-dark hover:bg-white hover:shadow-sm rounded-xl font-medium transition-all">
              <User size={18} className="text-brand-muted" /> Profile
            </Link>
            <Link href="/orders" className="flex items-center gap-3 px-4 py-3 text-brand-dark hover:bg-white hover:shadow-sm rounded-xl font-medium transition-all">
              <Package size={18} className="text-brand-muted" /> My Orders
            </Link>
            <Link href="/account/addresses" className="flex items-center gap-3 px-4 py-3 text-brand-dark hover:bg-white hover:shadow-sm rounded-xl font-medium transition-all">
              <MapPin size={18} className="text-brand-muted" /> Saved Addresses
            </Link>
            <Link href="/wishlist" className="flex items-center gap-3 px-4 py-3 bg-brand-primary text-white rounded-xl font-medium shadow-sm">
              <Heart size={18} /> Wishlist
            </Link>
          </div>

          {/* Main Content */}
          <div className="flex-1 space-y-6 w-full">
            
            {wishlist.length === 0 ? (
              <div className="bg-white rounded-2xl border border-brand-border p-12 text-center shadow-sm w-full">
                <Heart size={48} className="mx-auto mb-4 text-brand-muted" />
                <h2 className="text-xl font-bold text-brand-dark mb-2">Your wishlist is empty</h2>
                <p className="text-brand-muted mb-6">Save items you love here and buy them later.</p>
                <Link href="/products" className="btn-primary px-8 py-3 inline-flex">
                  Explore Products
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {wishlist.map((product) => (
                  <div key={product._id} className="bg-white rounded-2xl border border-brand-border overflow-hidden shadow-sm group flex flex-col hover:shadow-warm transition-all">
                    <div className="relative aspect-square w-full bg-brand-light">
                      {product.images?.[0]?.url ? (
                        <Image src={product.images[0].url} alt={product.name} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-brand-muted">No Image</div>
                      )}
                      
                      <button 
                        onClick={() => handleRemove(product._id)}
                        className="absolute top-3 right-3 w-8 h-8 bg-white/90 backdrop-blur rounded-full flex items-center justify-center text-red-500 hover:bg-red-500 hover:text-white shadow-sm transition-all z-10"
                        title="Remove from Wishlist"
                      >
                        <Trash2 size={16} />
                      </button>

                      {!product.isActive && (
                        <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] flex items-center justify-center z-10">
                          <span className="bg-white px-4 py-2 rounded-lg font-bold text-red-600 shadow-sm">Currently Unavailable</span>
                        </div>
                      )}
                      {product.isActive && product.stock <= 0 && (
                        <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] flex items-center justify-center z-10">
                          <span className="bg-white px-4 py-2 rounded-lg font-bold text-orange-600 shadow-sm">Out of Stock</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="p-4 flex flex-col flex-1">
                      <Link href={`/products/${product.slug}`} className="font-semibold text-brand-dark hover:text-brand-primary line-clamp-2 min-h-[48px] mb-2">
                        {product.name}
                      </Link>
                      
                      <div className="flex items-center gap-2 mb-4 mt-auto">
                        <span className="font-display font-bold text-lg text-brand-dark">
                          {formatPrice(product.salePrice || product.price)}
                        </span>
                        {product.salePrice && product.salePrice < product.price && (
                          <span className="text-sm text-brand-muted line-through">{formatPrice(product.price)}</span>
                        )}
                      </div>

                      <button
                        onClick={() => handleMoveToCart(product)}
                        disabled={!product.isActive || product.stock <= 0}
                        className="w-full btn-primary py-2.5 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                      >
                        <ShoppingCart size={16} /> Move to Cart
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
            
          </div>
        </div>
      </div>
    </div>
  );
}
