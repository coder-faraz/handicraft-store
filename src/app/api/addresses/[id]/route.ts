// FILE: src/app/api/addresses/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import User from '@/models/User';
import { AddressSchema } from '@/validators/order.schema';
import { cookies } from 'next/headers';

async function getUserFromSession() {
  const sessionCookie = (await cookies()).get('session')?.value;
  if (!sessionCookie) return null;
  const { userId } = JSON.parse(Buffer.from(sessionCookie, 'base64').toString('utf8'));
  return userId;
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const userId = await getUserFromSession();
    if (!userId) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

    const { id } = await params;
    const body = await req.json();
    const parsed = AddressSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ success: false, error: 'Invalid address data', details: parsed.error.flatten() }, { status: 400 });
    }

    await connectDB();
    const user = await User.findById(userId);
    if (!user) return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });

    const address = user.addresses.id(id);
    if (!address) return NextResponse.json({ success: false, error: 'Address not found' }, { status: 404 });

    Object.assign(address, parsed.data);
    await user.save();

    return NextResponse.json({ success: true, data: address });
  } catch (error) {
    console.error('Update Address Error:', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const userId = await getUserFromSession();
    if (!userId) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

    const { id } = await params;

    await connectDB();
    const user = await User.findById(userId);
    if (!user) return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });

    user.addresses.pull({ _id: id });
    
    // If the deleted address was default, make the first one default if exists
    if (user.addresses.length > 0 && !user.addresses.some(a => a.isDefault)) {
      user.addresses[0].isDefault = true;
    }

    await user.save();

    return NextResponse.json({ success: true, message: 'Address deleted' });
  } catch (error) {
    console.error('Delete Address Error:', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const userId = await getUserFromSession();
    if (!userId) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

    const { id } = await params;
    const { isDefault } = await req.json();

    if (isDefault !== true) {
      return NextResponse.json({ success: false, error: 'Invalid action' }, { status: 400 });
    }

    await connectDB();
    const user = await User.findById(userId);
    if (!user) return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });

    const address = user.addresses.id(id);
    if (!address) return NextResponse.json({ success: false, error: 'Address not found' }, { status: 404 });

    // Set all to false, then target to true
    user.addresses.forEach(a => a.isDefault = false);
    address.isDefault = true;

    await user.save();

    return NextResponse.json({ success: true, data: address });
  } catch (error) {
    console.error('Set Default Address Error:', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}
