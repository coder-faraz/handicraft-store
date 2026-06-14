// FILE: src/repositories/product.repo.ts
import { connectDB } from '@/lib/db';
import Product, { IProduct } from '@/models/Product';
import { FilterQuery } from 'mongoose';
import type { ProductFilters } from '@/types';

export interface CreateProductData {
  name: string;
  slug: string;
  description: string;
  shortDescription: string;
  price: number;
  salePrice?: number;
  images?: { url: string; publicId: string }[];
  categoryId: string;
  stock: number;
  sku: string;
  tags?: string[];
  isFeatured?: boolean;
  isActive?: boolean;
}

export async function findAll(
  filters: ProductFilters = {},
  page: number = 1,
  limit: number = 20
): Promise<{ products: IProduct[]; total: number }> {
  await connectDB();

  const query: FilterQuery<IProduct> = { isActive: true };

  if (filters.categoryId) query.categoryId = filters.categoryId;
  if (filters.isFeatured !== undefined) query.isFeatured = filters.isFeatured;
  if (filters.inStock) query.stock = { $gt: 0 };
  if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
    query.price = {};
    if (filters.minPrice !== undefined) query.price.$gte = filters.minPrice;
    if (filters.maxPrice !== undefined) query.price.$lte = filters.maxPrice;
  }
  if (filters.tags?.length) query.tags = { $in: filters.tags };
  if (filters.search) {
    query.$text = { $search: filters.search };
  }

  let sortQuery: Record<string, any> = { createdAt: -1 };
  switch (filters.sortBy) {
    case 'price_asc':    sortQuery = { price: 1 }; break;
    case 'price_desc':   sortQuery = { price: -1 }; break;
    case 'newest':       sortQuery = { createdAt: -1 }; break;
    case 'rating':       sortQuery = { 'ratings.average': -1 }; break;
    case 'popularity':   sortQuery = { 'ratings.count': -1 }; break;
  }

  const [products, total] = await Promise.all([
    Product.find(query)
      .populate('categoryId', 'name slug')
      .sort(sortQuery)
      .skip((page - 1) * limit)
      .limit(limit)
      .lean(),
    Product.countDocuments(query),
  ]);

  return { products: products as IProduct[], total };
}

export async function findAllAdmin(
  page: number = 1,
  limit: number = 20,
  search?: string,
  categoryId?: string
): Promise<{ products: IProduct[]; total: number }> {
  await connectDB();

  const query: FilterQuery<IProduct> = {};
  if (search) {
    query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { sku: { $regex: search, $options: 'i' } },
    ];
  }
  if (categoryId) query.categoryId = categoryId;

  const [products, total] = await Promise.all([
    Product.find(query)
      .populate('categoryId', 'name slug')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean(),
    Product.countDocuments(query),
  ]);

  return { products: products as IProduct[], total };
}

export async function findBySlug(slug: string): Promise<IProduct | null> {
  await connectDB();
  return Product.findOne({ slug, isActive: true }).populate('categoryId', 'name slug');
}

export async function findById(id: string): Promise<IProduct | null> {
  await connectDB();
  return Product.findById(id).populate('categoryId', 'name slug');
}

export async function create(data: CreateProductData): Promise<IProduct> {
  await connectDB();
  return Product.create(data);
}

export async function update(id: string, data: Partial<CreateProductData>): Promise<IProduct | null> {
  await connectDB();
  return Product.findByIdAndUpdate(id, { $set: data }, { new: true });
}

export async function deleteById(id: string): Promise<IProduct | null> {
  await connectDB();
  // Soft delete
  return Product.findByIdAndUpdate(id, { $set: { isActive: false } }, { new: true });
}

export async function findFeatured(limit: number = 8): Promise<IProduct[]> {
  await connectDB();
  return Product.find({ isFeatured: true, isActive: true, stock: { $gt: 0 } })
    .populate('categoryId', 'name slug')
    .sort({ 'ratings.average': -1 })
    .limit(limit)
    .lean() as Promise<IProduct[]>;
}

export async function findByCategory(categoryId: string, limit: number = 12): Promise<IProduct[]> {
  await connectDB();
  return Product.find({ categoryId, isActive: true })
    .sort({ createdAt: -1 })
    .limit(limit)
    .lean() as Promise<IProduct[]>;
}

export async function getProductStats(): Promise<{
  total: number;
  lowStock: number;
  outOfStock: number;
}> {
  await connectDB();
  const [total, lowStock, outOfStock] = await Promise.all([
    Product.countDocuments({ isActive: true }),
    Product.countDocuments({ isActive: true, stock: { $gt: 0, $lte: 5 } }),
    Product.countDocuments({ isActive: true, stock: 0 }),
  ]);
  return { total, lowStock, outOfStock };
}
