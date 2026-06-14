// FILE: src/services/product.service.ts
import { slugify } from '@/lib/utils';
import * as productRepo from '@/repositories/product.repo';
import type { CreateProductData } from '@/repositories/product.repo';
import type { IProduct } from '@/models/Product';
import type { ProductFilters } from '@/types';

export interface ProductInput {
  name: string;
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

/**
 * Create a product. Auto-generates slug from name.
 * Ensures SKU is uppercased.
 */
export async function createProduct(input: ProductInput): Promise<IProduct> {
  const baseSlug = slugify(input.name);
  let slug = baseSlug;
  let attempt = 0;

  // Ensure slug uniqueness
  while (true) {
    const existing = await productRepo.findBySlug(slug);
    if (!existing) break;
    attempt++;
    slug = `${baseSlug}-${attempt}`;
  }

  const data: CreateProductData = {
    ...input,
    slug,
    sku: input.sku.toUpperCase(),
    tags: input.tags ?? [],
    images: input.images ?? [],
  };

  return productRepo.create(data);
}

/**
 * Update a product by ID. If name changes, regenerate slug.
 */
export async function updateProduct(
  id: string,
  input: Partial<ProductInput>
): Promise<IProduct | null> {
  const updateData: Partial<CreateProductData> = { ...input };

  if (input.name) {
    const newSlug = slugify(input.name);
    updateData.slug = newSlug;
  }

  if (input.sku) {
    updateData.sku = input.sku.toUpperCase();
  }

  return productRepo.update(id, updateData);
}

/**
 * Paginated product listing for storefront.
 */
export async function listProducts(
  filters: ProductFilters,
  page: number,
  limit: number
) {
  const { products, total } = await productRepo.findAll(filters, page, limit);
  const totalPages = Math.ceil(total / limit);
  return { data: products, total, page, limit, totalPages };
}

/**
 * Paginated product listing for admin.
 */
export async function listProductsAdmin(
  page: number,
  limit: number,
  search?: string,
  categoryId?: string
) {
  const { products, total } = await productRepo.findAllAdmin(page, limit, search, categoryId);
  const totalPages = Math.ceil(total / limit);
  return { data: products, total, page, limit, totalPages };
}

export const getFeaturedProducts = productRepo.findFeatured;
export const getProductBySlug = productRepo.findBySlug;
export const getProductById = productRepo.findById;
export const deleteProduct = productRepo.deleteById;
export const getProductStats = productRepo.getProductStats;
