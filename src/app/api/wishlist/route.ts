// FILE: src/app/api/wishlist/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import User from '@/models/User';
import { cookies } from 'next/headers';
import mongoose from 'mongoose';

async function getUserFromSession() {
  const sessionCookie = (await cookies()).get('session')?.value;
  if (!sessionCookie) return null;
  const { userId } = JSON.parse(Buffer.from(sessionCookie, 'base64').toString('utf8'));
  return userId;
}

export async function GET() {
  try {
    const userId = await getUserFromSession();
    if (!userId) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

    await connectDB();
    const user = await User.findById(userId).populate({
      path: 'wishlist',
      select: 'name slug price salePrice images stock isFeatured isActive'
    }).lean();

    if (!user) return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });

    return NextResponse.json({ success: true, data: user.wishlist || [] });
  } catch (error) {
    console.error('Fetch Wishlist Error:', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const userId = await getUserFromSession();
    if (!userId) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

    const { productId } = await req.json();
    if (!productId || !mongoose.Types.ObjectId.isValid(productId)) {
      return NextResponse.json({ success: false, error: 'Invalid product ID' }, { status: 400 });
    }

    await connectDB();
    const user = await User.findById(userId);
    if (!user) return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });

    const productObjectId = new mongoose.Types.ObjectId(productId);
    const index = user.wishlist.indexOf(productObjectId);

    let isAdded = false;
    if (index === -1) {
      user.wishlist.push(productObjectId);
      isAdded = true;
    } else {
      user.wishlist.splice(index, 1);
      isAdded = false;
    }

    await user.save();

    return NextResponse.json({ success: true, isAdded, message: isAdded ? 'Added to wishlist' : 'Removed from wishlist' });
  } catch (error) {
    console.error('Toggle Wishlist Error:', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}
