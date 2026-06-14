// FILE: src/components/store/product/ProductDetails.tsx
'use client';

import { useState } from 'react';
import { Star, Heart, Minus, Plus, Truck, ShieldCheck, RefreshCw } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { formatPrice } from '@/lib/utils';
import type { IProduct } from '@/models/Product';
import { cn } from '@/lib/utils';

interface ProductDetailsProps {
  product: IProduct;
}

export default function ProductDetails({ product }: ProductDetailsProps) {
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'description' | 'shipping' | 'reviews'>('description');
  const { addItem } = useCart();

  const price = product.price;
  const salePrice = product.salePrice;
  const discount = salePrice ? Math.round(((price - salePrice) / price) * 100) : 0;
  const isOutOfStock = product.stock <= 0;

  const handleAddToCart = () => {
    if (isOutOfStock) return;
    addItem({
      productId: product._id as string,
      name: product.name,
      price: salePrice || price,
      quantity,
      image: product.images?.[0]?.url || '',
      stock: product.stock,
      sku: product.sku,
    });
  };

  return (
    <div className="flex flex-col h-full">
      {/* Category & Title */}
      <div className="mb-6">
        <p className="text-sm font-semibold text-brand-primary uppercase tracking-wider mb-2">
          {(product.category as any)?.name || 'Handicraft'}
        </p>
        <h1 className="font-display text-3xl md:text-4xl font-bold text-brand-dark mb-4 leading-tight">
          {product.name}
        </h1>

        {/* Rating & SKU */}
        <div className="flex flex-wrap items-center gap-4 text-sm text-brand-muted border-b border-brand-border pb-6">
          <div className="flex items-center gap-1.5">
            <div className="flex text-brand-accent">
              <Star size={16} className="fill-current" />
              <Star size={16} className="fill-current" />
              <Star size={16} className="fill-current" />
              <Star size={16} className="fill-current" />
              <Star size={16} className="fill-current opacity-40" />
            </div>
            <span className="font-medium text-brand-dark">4.2</span>
            <span>(24 reviews)</span>
          </div>
          <span className="w-1 h-1 rounded-full bg-brand-border" />
          <span className="font-mono">SKU: {product.sku}</span>
        </div>
      </div>

      {/* Price Block */}
      <div className="mb-6">
        <div className="flex items-end gap-3 mb-2">
          {salePrice ? (
            <>
              <span className="font-display text-4xl font-bold text-brand-dark">
                {formatPrice(salePrice)}
              </span>
              <span className="text-lg text-brand-muted line-through mb-1">
                {formatPrice(price)}
              </span>
              <span className="px-2 py-1 mb-1.5 bg-red-100 text-red-700 text-xs font-bold rounded-full">
                Save {discount}%
              </span>
            </>
          ) : (
            <span className="font-display text-4xl font-bold text-brand-dark">
              {formatPrice(price)}
            </span>
          )}
        </div>
        <p className="text-xs text-brand-muted">Inclusive of all taxes.</p>
      </div>

      {/* Short Description */}
      <div className="mb-8 text-brand-muted leading-relaxed">
        <p className="line-clamp-4">{product.description}</p>
      </div>

      {/* Stock Status */}
      <div className="mb-6">
        {isOutOfStock ? (
          <p className="text-red-600 font-medium flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-pulse" /> Out of Stock
          </p>
        ) : product.stock < 10 ? (
          <p className="text-amber-600 font-medium flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse" /> Only {product.stock} left in stock - order soon
          </p>
        ) : (
          <p className="text-emerald-600 font-medium flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> In Stock
          </p>
        )}
      </div>

      {/* Add to Cart Actions */}
      <div className="flex flex-col sm:flex-row gap-4 mb-10 border-b border-brand-border pb-10">
        <div className="flex items-center border border-brand-border rounded-xl bg-white h-14 w-full sm:w-32">
          <button
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            className="flex-1 h-full flex items-center justify-center text-brand-dark hover:bg-brand-light transition-colors rounded-l-xl"
            disabled={isOutOfStock}
          >
            <Minus size={18} />
          </button>
          <div className="flex-1 h-full flex items-center justify-center font-bold text-brand-dark border-x border-brand-border">
            {quantity}
          </div>
          <button
            onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
            className="flex-1 h-full flex items-center justify-center text-brand-dark hover:bg-brand-light transition-colors rounded-r-xl"
            disabled={isOutOfStock || quantity >= product.stock}
          >
            <Plus size={18} />
          </button>
        </div>

        <button
          onClick={handleAddToCart}
          disabled={isOutOfStock}
          className="flex-1 btn-primary h-14 text-lg font-semibold shadow-warm-md hover:shadow-warm-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
        </button>

        <button className="h-14 w-14 rounded-xl border border-brand-border bg-white flex items-center justify-center text-brand-muted hover:text-brand-primary hover:border-brand-primary hover:bg-brand-light transition-all flex-shrink-0">
          <Heart size={24} />
        </button>
      </div>

      {/* Trust Badges */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
        <div className="flex items-center gap-3 p-3 rounded-lg bg-brand-light">
          <Truck size={24} className="text-brand-primary flex-shrink-0" />
          <div>
            <p className="font-semibold text-sm text-brand-dark">Free Shipping</p>
            <p className="text-xs text-brand-muted">Orders over ₹999</p>
          </div>
        </div>
        <div className="flex items-center gap-3 p-3 rounded-lg bg-brand-light">
          <ShieldCheck size={24} className="text-brand-primary flex-shrink-0" />
          <div>
            <p className="font-semibold text-sm text-brand-dark">Secure Payment</p>
            <p className="text-xs text-brand-muted">100% secure checkout</p>
          </div>
        </div>
        <div className="flex items-center gap-3 p-3 rounded-lg bg-brand-light">
          <RefreshCw size={24} className="text-brand-primary flex-shrink-0" />
          <div>
            <p className="font-semibold text-sm text-brand-dark">Easy Returns</p>
            <p className="text-xs text-brand-muted">7 days return policy</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="mt-auto">
        <div className="flex gap-8 border-b border-brand-border mb-6">
          {(['description', 'shipping', 'reviews'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                'pb-3 font-semibold text-sm capitalize transition-colors relative',
                activeTab === tab ? 'text-brand-primary' : 'text-brand-muted hover:text-brand-dark'
              )}
            >
              {tab}
              {activeTab === tab && (
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-brand-primary rounded-t-full" />
              )}
            </button>
          ))}
        </div>

        <div className="text-sm text-brand-muted leading-relaxed prose prose-sm max-w-none prose-p:text-brand-muted prose-headings:text-brand-dark">
          {activeTab === 'description' && (
            <div>
              <p>{product.description}</p>
              {/* Could render more rich text if available */}
            </div>
          )}
          {activeTab === 'shipping' && (
            <ul className="space-y-2">
              <li>• Dispatches within 24-48 hours.</li>
              <li>• Standard delivery takes 5-7 business days across India.</li>
              <li>• Express delivery available at checkout.</li>
              <li>• Secure packaging to prevent transit damage.</li>
            </ul>
          )}
          {activeTab === 'reviews' && (
            <div>
              <p>Reviews coming soon. Be the first to review this product!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
