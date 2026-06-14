// FILE: src/app/api/addresses/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import User from '@/models/User';
import { AddressSchema } from '@/validators/order.schema';
import { cookies } from 'next/headers';
import mongoose from 'mongoose';

export async function GET() {
  try {
    const sessionCookie = (await cookies()).get('session')?.value;
    if (!sessionCookie) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { userId } = JSON.parse(Buffer.from(sessionCookie, 'base64').toString('utf8'));
    if (!userId) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const user = await User.findById(userId).lean();
    if (!user) {
      return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: user.addresses || [] });
  } catch (error) {
    console.error('Fetch Addresses Error:', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const sessionCookie = (await cookies()).get('session')?.value;
    if (!sessionCookie) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { userId } = JSON.parse(Buffer.from(sessionCookie, 'base64').toString('utf8'));
    if (!userId) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const parsed = AddressSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ success: false, error: 'Invalid address data', details: parsed.error.flatten() }, { status: 400 });
    }

    await connectDB();
    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });
    }

    const newAddress = {
      ...parsed.data,
      _id: new mongoose.Types.ObjectId(),
      isDefault: user.addresses.length === 0, // make default if first
    };

    user.addresses.push(newAddress as any);
    await user.save();

    return NextResponse.json({ success: true, data: newAddress }, { status: 201 });
  } catch (error) {
    console.error('Add Address Error:', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}
