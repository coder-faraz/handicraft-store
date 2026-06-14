// FILE: src/context/CartContext.tsx
'use client';

import React, {
  createContext,
  useContext,
  useReducer,
  useEffect,
  useCallback,
} from 'react';
import type { CartItem } from '@/types';

// ─── State ────────────────────────────────────────────────────────────────────

interface CartState {
  items: CartItem[];
  isHydrated: boolean;
}

// ─── Actions ──────────────────────────────────────────────────────────────────

type CartAction =
  | { type: 'HYDRATE'; payload: CartItem[] }
  | { type: 'ADD_ITEM'; payload: CartItem }
  | { type: 'REMOVE_ITEM'; payload: { productId: string } }
  | { type: 'UPDATE_QUANTITY'; payload: { productId: string; quantity: number } }
  | { type: 'CLEAR_CART' };

// ─── Reducer ─────────────────────────────────────────────────────────────────

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'HYDRATE': {
      return { ...state, items: action.payload, isHydrated: true };
    }

    case 'ADD_ITEM': {
      const existing = state.items.find(
        (item) => item.productId === action.payload.productId
      );
      if (existing) {
        // Increment quantity, capped at stock
        const newQty = Math.min(
          existing.quantity + action.payload.quantity,
          action.payload.stock
        );
        return {
          ...state,
          items: state.items.map((item) =>
            item.productId === action.payload.productId
              ? { ...item, quantity: newQty }
              : item
          ),
        };
      }
      return {
        ...state,
        items: [...state.items, action.payload],
      };
    }

    case 'REMOVE_ITEM': {
      return {
        ...state,
        items: state.items.filter(
          (item) => item.productId !== action.payload.productId
        ),
      };
    }

    case 'UPDATE_QUANTITY': {
      if (action.payload.quantity <= 0) {
        return {
          ...state,
          items: state.items.filter(
            (item) => item.productId !== action.payload.productId
          ),
        };
      }
      return {
        ...state,
        items: state.items.map((item) =>
          item.productId === action.payload.productId
            ? {
                ...item,
                quantity: Math.min(action.payload.quantity, item.stock),
              }
            : item
        ),
      };
    }

    case 'CLEAR_CART': {
      return { ...state, items: [] };
    }

    default:
      return state;
  }
}

// ─── Context ─────────────────────────────────────────────────────────────────

interface CartContextValue {
  items: CartItem[];
  isHydrated: boolean;
  addItem: (item: CartItem) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
}

const CartContext = createContext<CartContextValue | undefined>(undefined);

const CART_STORAGE_KEY = 'limra_cart';

// ─── Provider ────────────────────────────────────────────────────────────────

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, {
    items: [],
    isHydrated: false,
  });

  // Hydrate from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(CART_STORAGE_KEY);
      if (stored) {
        const parsed: CartItem[] = JSON.parse(stored);
        dispatch({ type: 'HYDRATE', payload: parsed });
      } else {
        dispatch({ type: 'HYDRATE', payload: [] });
      }
    } catch {
      dispatch({ type: 'HYDRATE', payload: [] });
    }
  }, []);

  // Persist to localStorage on change (after hydration)
  useEffect(() => {
    if (state.isHydrated) {
      try {
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(state.items));
      } catch {
        // Silently fail if storage is full
      }
    }
  }, [state.items, state.isHydrated]);

  const addItem = useCallback((item: CartItem) => {
    dispatch({ type: 'ADD_ITEM', payload: item });
  }, []);

  const removeItem = useCallback((productId: string) => {
    dispatch({ type: 'REMOVE_ITEM', payload: { productId } });
  }, []);

  const updateQuantity = useCallback((productId: string, quantity: number) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { productId, quantity } });
  }, []);

  const clearCart = useCallback(() => {
    dispatch({ type: 'CLEAR_CART' });
  }, []);

  const totalItems = state.items.reduce((sum, item) => sum + item.quantity, 0);

  const totalPrice = state.items.reduce((sum, item) => {
    const price = item.salePrice ?? item.price;
    return sum + price * item.quantity;
  }, 0);

  return (
    <CartContext.Provider
      value={{
        items: state.items,
        isHydrated: state.isHydrated,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        totalItems,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useCart(): CartContextValue {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
