// FILE: src/types/index.ts

// ─── Base model interfaces ────────────────────────────────────────────────────

export interface IUserType {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  role: 'admin' | 'customer';
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ICategoryType {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  image: {
    url: string;
    publicId: string;
  };
  parentId?: string | null;
  isActive: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface IProductImageType {
  url: string;
  publicId: string;
}

export interface IProductType {
  _id: string;
  name: string;
  slug: string;
  description: string;
  shortDescription: string;
  price: number;
  salePrice?: number;
  images: IProductImageType[];
  categoryId: string | ICategoryType;
  stock: number;
  sku: string;
  tags: string[];
  isFeatured: boolean;
  isActive: boolean;
  ratings: {
    average: number;
    count: number;
  };
  createdAt: string;
  updatedAt: string;
  // virtuals (optional)
  effectivePrice?: number;
  discountPercent?: number;
}

export interface IShippingAddressType {
  name: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  pincode: string;
}

export interface IOrderItemType {
  _id: string;
  orderId: string;
  productId: string | IProductType;
  productName: string;
  productImage: string;
  quantity: number;
  price: number;
  total: number;
}

export interface IOrderType {
  _id: string;
  userId: string | IUserType;
  orderNumber: string;
  items: IOrderItemType[];
  shippingAddress: IShippingAddressType;
  subtotal: number;
  shippingCharge: number;
  discount: number;
  total: number;
  paymentStatus: 'pending' | 'paid' | 'failed';
  paymentId?: string;
  razorpayOrderId?: string;
  orderStatus:
    | 'placed'
    | 'confirmed'
    | 'processing'
    | 'shipped'
    | 'delivered'
    | 'cancelled';
  trackingId?: string;
  courierName?: string;
  trackingUrl?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface IAddressType {
  _id: string;
  userId: string;
  name: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  pincode: string;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface IReviewType {
  _id: string;
  productId: string | IProductType;
  userId: string | IUserType;
  rating: number;
  title: string;
  comment: string;
  isApproved: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface IBannerType {
  _id: string;
  title: string;
  subtitle?: string;
  image: {
    url: string;
    publicId: string;
  };
  link?: string;
  position: 'hero' | 'mid' | 'footer';
  isActive: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface IWishlistType {
  _id: string;
  userId: string;
  products: IProductType[];
  createdAt: string;
  updatedAt: string;
}

// ─── Cart ─────────────────────────────────────────────────────────────────────

export interface CartItem {
  productId: string;
  name: string;
  slug: string;
  price: number;
  salePrice?: number;
  image: string;
  quantity: number;
  stock: number;
}

// ─── Pagination ───────────────────────────────────────────────────────────────

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// ─── API Response wrappers ────────────────────────────────────────────────────

export interface ApiSuccessResponse<T = any> {
  success: true;
  data: T;
  message?: string;
}

export interface ApiErrorResponse {
  success: false;
  error: string;
  details?: any;
}

export type ApiResponse<T = any> = ApiSuccessResponse<T> | ApiErrorResponse;

// ─── Auth / Session ───────────────────────────────────────────────────────────

export interface SessionUser {
  userId: string;
  role: 'admin' | 'customer';
  name: string;
  email: string;
  isLoggedIn: boolean;
}

// ─── Filter / Sort Options ────────────────────────────────────────────────────

export interface ProductFilters {
  categoryId?: string;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
  isFeatured?: boolean;
  tags?: string[];
  search?: string;
  sortBy?: 'price_asc' | 'price_desc' | 'newest' | 'rating' | 'popularity';
  page?: number;
  limit?: number;
}

// ─── Form types ───────────────────────────────────────────────────────────────

export interface LoginFormData {
  email: string;
  password: string;
}

export interface RegisterFormData {
  name: string;
  email: string;
  password: string;
  phone?: string;
}

export interface CheckoutFormData {
  name: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  pincode: string;
  notes?: string;
}

// ─── Admin Dashboard ──────────────────────────────────────────────────────────

export interface DashboardStats {
  totalOrders: number;
  totalRevenue: number;
  totalProducts: number;
  totalCustomers: number;
  recentOrders: IOrderType[];
  lowStockProducts: IProductType[];
}
