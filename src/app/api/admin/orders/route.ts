// FILE: src/app/api/admin/orders/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/services/auth.service';
import { findAll } from '@/repositories/order.repo';
import { parseQueryInt } from '@/lib/utils';

export async function GET(request: NextRequest) {
  try {
    await requireAdmin();
    const { searchParams } = new URL(request.url);
    const page = parseQueryInt(searchParams.get('page'), 1);
    const limit = parseQueryInt(searchParams.get('limit'), 20);
    const orderStatus = searchParams.get('status') || undefined;
    const search = searchParams.get('search') || undefined;

    const { orders, total } = await findAll({ orderStatus, search }, page, limit);
    const totalPages = Math.ceil(total / limit);

    return NextResponse.json({
      success: true,
      data: orders,
      total,
      page,
      limit,
      totalPages,
    });
  } catch (err: any) {
    if (err.message === 'UNAUTHENTICATED') return NextResponse.json({ success: false, error: 'Not authenticated' }, { status: 401 });
    if (err.message === 'UNAUTHORIZED') return NextResponse.json({ success: false, error: 'Admin only' }, { status: 403 });
    console.error('[GET /api/admin/orders]', err);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
