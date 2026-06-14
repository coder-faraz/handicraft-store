// FILE: src/app/api/admin/reviews/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Review from '@/models/Review';
import { parseQueryInt } from '@/lib/utils';

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const approved = searchParams.get('approved') === 'true';
    const page = parseQueryInt(searchParams.get('page'), 1);
    const limit = 20;

    const [reviews, total] = await Promise.all([
      Review.find({ isApproved: approved })
        .populate('productId', 'name slug')
        .populate('userId', 'name email')
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),
      Review.countDocuments({ isApproved: approved }),
    ]);

    return NextResponse.json({ success: true, data: reviews, total, page, totalPages: Math.ceil(total / limit) });
  } catch (err) {
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
