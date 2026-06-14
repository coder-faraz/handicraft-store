// FILE: src/app/api/admin/categories/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { requireAdmin } from '@/services/auth.service';
import * as categoryRepo from '@/repositories/category.repo';

const UpdateCategorySchema = z.object({
  name: z.string().min(2).max(100).optional(),
  description: z.string().max(500).optional(),
  image: z.object({ url: z.string(), publicId: z.string() }).optional(),
  isActive: z.boolean().optional(),
  sortOrder: z.number().optional(),
});

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin();
    const { id } = await params;
    const body = await request.json();
    const parsed = UpdateCategorySchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ success: false, error: 'Validation failed', details: parsed.error.flatten().fieldErrors }, { status: 400 });
    }
    const category = await categoryRepo.update(id, parsed.data);
    if (!category) return NextResponse.json({ success: false, error: 'Category not found' }, { status: 404 });
    return NextResponse.json({ success: true, data: category });
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
    await categoryRepo.deleteById(id);
    return NextResponse.json({ success: true, message: 'Category deleted' });
  } catch (err: any) {
    if (err.message === 'UNAUTHENTICATED') return NextResponse.json({ success: false, error: 'Not authenticated' }, { status: 401 });
    if (err.message === 'UNAUTHORIZED') return NextResponse.json({ success: false, error: 'Admin only' }, { status: 403 });
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
