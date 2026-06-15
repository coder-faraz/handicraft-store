// FILE: src/components/store/product/ProductCard.tsx
'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Heart, Star, ShoppingCart } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { formatPrice } from '@/lib/utils';
import type { IProduct } from '@/models/Product';
import { cn } from '@/lib/utils';

interface ProductCardProps {
  product: IProduct;
  priority?: boolean;
}

export default function ProductCard({ product, priority = false }: ProductCardProps) {
  const { addItem } = useCart();
  const imageUrl = product.images?.[0]?.url || '';
  const price = product.price;
  const salePrice = product.salePrice;
  const discount = salePrice ? Math.round(((price - salePrice) / price) * 100) : 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigating to the product page
    addItem({
      productId: product._id as string,
      name: product.name,
      price: salePrice || price,
      quantity: 1,
      image: imageUrl,
      stock: product.stock,
      sku: product.sku,
    });
  };

  return (
    <Link href={`/products/${product.slug}`} className="group block bg-brand-surface rounded-xl border border-brand-border overflow-hidden hover:shadow-warm-md transition-shadow relative">
      {/* Badges */}
      <div className="absolute top-3 left-3 z-10 flex flex-col gap-2">
        {discount > 0 && (
          <span className="px-2 py-1 bg-red-600 text-white text-xs font-bold rounded-full">
            {discount}% OFF
          </span>
        )}
        {(product.category as any)?.name && (
          <span className="px-2 py-1 bg-white/90 backdrop-blur-sm text-brand-dark text-xs font-medium rounded-full shadow-sm">
            {(product.category as any).name}
          </span>
        )}
      </div>

      {/* Wishlist Button */}
      <button 
        className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm shadow-sm flex items-center justify-center text-brand-muted hover:text-brand-primary transition-colors"
        onClick={(e) => { e.preventDefault(); /* Wishlist logic later */ }}
      >
        <Heart size={16} />
      </button>

      {/* Image container */}
      <div className="relative aspect-square w-full bg-brand-light overflow-hidden">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={product.name}
            fill
            priority={priority}
            placeholder="blur"
            blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mO88+hZPQAIxwMu7+e+zQAAAABJRU5ErkJggg=="
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-brand-muted/30">
            No Image
          </div>
        )}
        
        {/* Quick Add overlay button (Desktop) */}
        <div className="absolute bottom-0 left-0 w-full p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300 hidden md:block">
          <button
            onClick={handleAddToCart}
            disabled={product.stock <= 0}
            className="w-full btn-primary py-2.5 flex items-center justify-center gap-2 shadow-lg disabled:opacity-70 disabled:cursor-not-allowed"
          >
            <ShoppingCart size={16} />
            {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
          </button>
        </div>
      </div>

      {/* Product Info */}
      <div className="p-4">
        {/* Rating */}
        <div className="flex items-center gap-1 mb-2">
          <div className="flex text-brand-accent">
            <Star size={12} className="fill-current" />
            <Star size={12} className="fill-current" />
            <Star size={12} className="fill-current" />
            <Star size={12} className="fill-current" />
            <Star size={12} className="text-brand-border" />
          </div>
          <span className="text-[10px] text-brand-muted">(12)</span>
        </div>

        <h3 className="font-body font-semibold text-brand-dark line-clamp-2 text-sm md:text-base min-h-[40px] md:min-h-[48px] mb-2">
          {product.name}
        </h3>

        <div className="flex items-center gap-2">
          {salePrice ? (
            <>
              <span className="font-bold text-brand-primary text-base md:text-lg">
                {formatPrice(salePrice)}
              </span>
              <span className="text-xs md:text-sm text-brand-muted line-through">
                {formatPrice(price)}
              </span>
            </>
          ) : (
            <span className="font-bold text-brand-primary text-base md:text-lg">
              {formatPrice(price)}
            </span>
          )}
        </div>
      </div>
      
      {/* Mobile Add to Cart (Visible only on small screens) */}
      <div className="md:hidden p-4 pt-0">
        <button
          onClick={handleAddToCart}
          disabled={product.stock <= 0}
          className="w-full py-2 rounded-lg bg-brand-primary/10 text-brand-primary font-medium text-sm flex items-center justify-center gap-2 disabled:opacity-50"
        >
          <ShoppingCart size={14} />
          {product.stock > 0 ? 'Add' : 'Out'}
        </button>
      </div>
    </Link>
  );
}
