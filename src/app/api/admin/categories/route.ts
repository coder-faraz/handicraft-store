// FILE: src/app/api/admin/categories/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { requireAdmin } from '@/services/auth.service';
import * as categoryRepo from '@/repositories/category.repo';
import { slugify } from '@/lib/utils';

const CategorySchema = z.object({
  name: z.string().min(2).max(100),
  description: z.string().max(500).optional(),
  image: z.object({ url: z.string(), publicId: z.string() }).optional(),
  parentId: z.string().nullable().optional(),
  isActive: z.boolean().optional(),
  sortOrder: z.number().optional(),
});

export async function GET(_request: NextRequest) {
  try {
    const categories = await categoryRepo.findAllAdmin();
    return NextResponse.json({ success: true, data: categories });
  } catch (err) {
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await requireAdmin();
    const body = await request.json();
    const parsed = CategorySchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: 'Validation failed', details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { name, ...rest } = parsed.data;
    const slug = slugify(name);

    const existing = await categoryRepo.findBySlug(slug);
    if (existing) {
      return NextResponse.json({ success: false, error: 'A category with this name already exists.' }, { status: 409 });
    }

    const category = await categoryRepo.create({ name, slug, ...rest });
    return NextResponse.json({ success: true, data: category }, { status: 201 });
  } catch (err: any) {
    if (err.message === 'UNAUTHENTICATED') return NextResponse.json({ success: false, error: 'Not authenticated' }, { status: 401 });
    if (err.message === 'UNAUTHORIZED') return NextResponse.json({ success: false, error: 'Admin only' }, { status: 403 });
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
