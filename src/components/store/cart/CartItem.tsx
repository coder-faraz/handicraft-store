// FILE: src/components/store/cart/CartItem.tsx
'use client';

import Image from 'next/image';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import type { ICartItem } from '@/context/CartContext';

interface CartItemProps {
  item: ICartItem;
  onUpdateQuantity: (id: string, qty: number) => void;
  onRemove: (id: string) => void;
}

export default function CartItem({ item, onUpdateQuantity, onRemove }: CartItemProps) {
  return (
    <div className="flex gap-4 py-4 border-b border-brand-border">
      {/* Image */}
      <div className="w-20 h-20 bg-white rounded-lg border border-brand-border overflow-hidden flex-shrink-0">
        {item.image ? (
          <Image src={item.image} alt={item.name} width={80} height={80} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-gray-100" />
        )}
      </div>

      {/* Details */}
      <div className="flex flex-1 flex-col justify-between min-w-0">
        <div>
          <div className="flex justify-between items-start gap-2">
            <h4 className="text-sm font-semibold text-brand-dark line-clamp-2">{item.name}</h4>
            <button onClick={() => onRemove(item.productId)} className="text-brand-muted hover:text-red-500 transition-colors p-1 flex-shrink-0">
              <Trash2 size={16} />
            </button>
          </div>
          <p className="text-xs text-brand-muted mt-1 font-mono">SKU: {item.sku}</p>
        </div>

        <div className="flex items-end justify-between mt-2">
          {/* Quantity Controls */}
          <div className="flex items-center border border-brand-border rounded-lg bg-white overflow-hidden">
            <button
              onClick={() => onUpdateQuantity(item.productId, item.quantity - 1)}
              className="w-8 h-8 flex items-center justify-center text-brand-dark hover:bg-brand-light transition-colors"
            >
              <Minus size={14} />
            </button>
            <div className="w-8 h-8 flex items-center justify-center text-sm font-medium border-x border-brand-border">
              {item.quantity}
            </div>
            <button
              onClick={() => onUpdateQuantity(item.productId, item.quantity + 1)}
              className="w-8 h-8 flex items-center justify-center text-brand-dark hover:bg-brand-light transition-colors"
              disabled={item.quantity >= item.stock}
            >
              <Plus size={14} />
            </button>
          </div>

          {/* Price */}
          <div className="text-right">
            <p className="font-semibold text-brand-dark">{formatPrice(item.price * item.quantity)}</p>
            {item.quantity > 1 && (
              <p className="text-[10px] text-brand-muted">{formatPrice(item.price)} each</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
