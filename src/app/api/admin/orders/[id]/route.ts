// FILE: src/app/api/admin/orders/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { requireAdmin } from '@/services/auth.service';
import { findById, updateTracking } from '@/repositories/order.repo';

const UpdateOrderSchema = z.object({
  orderStatus: z.enum(['placed', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled']).optional(),
  paymentStatus: z.enum(['pending', 'paid', 'failed']).optional(),
  courierName: z.string().optional(),
  trackingId: z.string().optional(),
  trackingUrl: z.string().url().optional().or(z.literal('')),
});

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin();
    const { id } = await params;
    const order = await findById(id);
    if (!order) return NextResponse.json({ success: false, error: 'Order not found' }, { status: 404 });
    return NextResponse.json({ success: true, data: order });
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

    const parsed = UpdateOrderSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: 'Validation failed', details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const order = await updateTracking(id, parsed.data as any);
    if (!order) return NextResponse.json({ success: false, error: 'Order not found' }, { status: 404 });
    return NextResponse.json({ success: true, data: order });
  } catch (err: any) {
    if (err.message === 'UNAUTHENTICATED') return NextResponse.json({ success: false, error: 'Not authenticated' }, { status: 401 });
    if (err.message === 'UNAUTHORIZED') return NextResponse.json({ success: false, error: 'Admin only' }, { status: 403 });
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
