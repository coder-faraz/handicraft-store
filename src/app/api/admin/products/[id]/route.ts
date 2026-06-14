// FILE: src/app/api/admin/products/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { requireAdmin } from '@/services/auth.service';
import * as productRepo from '@/repositories/product.repo';
import * as productService from '@/services/product.service';

const ProductUpdateSchema = z.object({
  name: z.string().min(2).max(200).optional(),
  description: z.string().min(10).optional(),
  shortDescription: z.string().min(10).max(300).optional(),
  price: z.number().positive().optional(),
  salePrice: z.number().positive().nullable().optional(),
  categoryId: z.string().optional(),
  stock: z.number().int().min(0).optional(),
  sku: z.string().min(2).max(50).optional(),
  tags: z.array(z.string()).optional(),
  isFeatured: z.boolean().optional(),
  isActive: z.boolean().optional(),
  images: z.array(z.object({ url: z.string(), publicId: z.string() })).optional(),
});

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin();
    const { id } = await params;
    const product = await productRepo.findById(id);
    if (!product) return NextResponse.json({ success: false, error: 'Product not found' }, { status: 404 });
    return NextResponse.json({ success: true, data: product });
  } catch (err: any) {
    if (err.message === 'UNAUTHENTICATED') return NextResponse.json({ success: false, error: 'Not authenticated' }, { status: 401 });
    if (err.message === 'UNAUTHORIZED') return NextResponse.json({ success: false, error: 'Admin only' }, { status: 403 });
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin();
    const { id } = await params;
    const body = await request.json();
    const parsed = ProductUpdateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: 'Validation failed', details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const product = await productService.updateProduct(id, parsed.data as any);
    if (!product) return NextResponse.json({ success: false, error: 'Product not found' }, { status: 404 });
    return NextResponse.json({ success: true, data: product });
  } catch (err: any) {
    if (err.message === 'UNAUTHENTICATED') return NextResponse.json({ success: false, error: 'Not authenticated' }, { status: 401 });
    if (err.message === 'UNAUTHORIZED') return NextResponse.json({ success: false, error: 'Admin only' }, { status: 403 });
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin();
    const { id } = await params;
    const product = await productRepo.deleteById(id);
    if (!product) return NextResponse.json({ success: false, error: 'Product not found' }, { status: 404 });
    return NextResponse.json({ success: true, message: 'Product deactivated successfully' });
  } catch (err: any) {
    if (err.message === 'UNAUTHENTICATED') return NextResponse.json({ success: false, error: 'Not authenticated' }, { status: 401 });
    if (err.message === 'UNAUTHORIZED') return NextResponse.json({ success: false, error: 'Admin only' }, { status: 403 });
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
