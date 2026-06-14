// FILE: src/app/api/admin/banners/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { requireAdmin } from '@/services/auth.service';
import { connectDB } from '@/lib/db';
import Banner from '@/models/Banner';

const BannerSchema = z.object({
  title: z.string().min(1).max(150),
  subtitle: z.string().max(300).optional(),
  image: z.object({ url: z.string(), publicId: z.string() }),
  link: z.string().optional(),
  position: z.enum(['hero', 'mid', 'footer']),
  isActive: z.boolean().optional(),
  sortOrder: z.number().optional(),
});

export async function GET(_request: NextRequest) {
  try {
    await connectDB();
    const banners = await Banner.find({}).sort({ position: 1, sortOrder: 1 }).lean();
    return NextResponse.json({ success: true, data: banners });
  } catch (err) {
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await requireAdmin();
    await connectDB();
    const body = await request.json();
    const parsed = BannerSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ success: false, error: 'Validation failed', details: parsed.error.flatten().fieldErrors }, { status: 400 });
    }
    const banner = await Banner.create(parsed.data);
    return NextResponse.json({ success: true, data: banner }, { status: 201 });
  } catch (err: any) {
    if (err.message === 'UNAUTHENTICATED') return NextResponse.json({ success: false, error: 'Not authenticated' }, { status: 401 });
    if (err.message === 'UNAUTHORIZED') return NextResponse.json({ success: false, error: 'Admin only' }, { status: 403 });
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
