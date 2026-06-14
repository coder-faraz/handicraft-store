// FILE: src/app/api/admin/products/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { requireAdmin } from '@/services/auth.service';
import * as productService from '@/services/product.service';
import { parseQueryInt } from '@/lib/utils';

const ProductCreateSchema = z.object({
  name: z.string().min(2).max(200),
  description: z.string().min(10),
  shortDescription: z.string().min(10).max(300),
  price: z.number().positive(),
  salePrice: z.number().positive().optional(),
  categoryId: z.string().min(1),
  stock: z.number().int().min(0),
  sku: z.string().min(2).max(50),
  tags: z.array(z.string()).optional(),
  isFeatured: z.boolean().optional(),
  isActive: z.boolean().optional(),
  images: z.array(z.object({ url: z.string(), publicId: z.string() })).optional(),
});

export async function GET(request: NextRequest) {
  try {
    await requireAdmin();
    const { searchParams } = new URL(request.url);
    const page = parseQueryInt(searchParams.get('page'), 1);
    const limit = parseQueryInt(searchParams.get('limit'), 20);
    const search = searchParams.get('search') || undefined;
    const categoryId = searchParams.get('categoryId') || undefined;

    const result = await productService.listProductsAdmin(page, limit, search, categoryId);
    return NextResponse.json({ success: true, ...result });
  } catch (err: any) {
    if (err.message === 'UNAUTHENTICATED') return NextResponse.json({ success: false, error: 'Not authenticated' }, { status: 401 });
    if (err.message === 'UNAUTHORIZED') return NextResponse.json({ success: false, error: 'Admin only' }, { status: 403 });
    console.error('[GET /api/admin/products]', err);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await requireAdmin();
    const body = await request.json();
    const parsed = ProductCreateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: 'Validation failed', details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const product = await productService.createProduct(parsed.data);
    return NextResponse.json({ success: true, data: product }, { status: 201 });
  } catch (err: any) {
    if (err.message === 'UNAUTHENTICATED') return NextResponse.json({ success: false, error: 'Not authenticated' }, { status: 401 });
    if (err.message === 'UNAUTHORIZED') return NextResponse.json({ success: false, error: 'Admin only' }, { status: 403 });
    if (err.code === 11000) return NextResponse.json({ success: false, error: 'SKU already exists' }, { status: 409 });
    console.error('[POST /api/admin/products]', err);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
