// FILE: src/repositories/user.repo.ts
import { connectDB } from '@/lib/db';
import User, { IUser } from '@/models/User';
import { FilterQuery } from 'mongoose';

export interface CreateUserData {
  name: string;
  email: string;
  password: string;
  phone?: string;
  role?: 'admin' | 'customer';
}

export interface UpdateUserData {
  name?: string;
  phone?: string;
  isActive?: boolean;
  role?: 'admin' | 'customer';
}

export async function findByEmail(email: string): Promise<IUser | null> {
  await connectDB();
  return User.findOne({ email: email.toLowerCase().trim() }).select('+password');
}

export async function findById(id: string): Promise<IUser | null> {
  await connectDB();
  return User.findById(id).select('-password');
}

export async function createUser(data: CreateUserData): Promise<IUser> {
  await connectDB();
  return User.create(data);
}

export async function updateUser(id: string, data: UpdateUserData): Promise<IUser | null> {
  await connectDB();
  return User.findByIdAndUpdate(id, { $set: data }, { new: true, select: '-password' });
}

export async function getAllUsers(
  page: number = 1,
  limit: number = 20,
  search?: string
): Promise<{ users: IUser[]; total: number }> {
  await connectDB();

  const query: FilterQuery<IUser> = { role: 'customer' };
  if (search) {
    query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
    ];
  }

  const [users, total] = await Promise.all([
    User.find(query)
      .select('-password')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean(),
    User.countDocuments(query),
  ]);

  return { users: users as IUser[], total };
}

export async function getUserStats(): Promise<{
  total: number;
  newThisMonth: number;
}> {
  await connectDB();
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const [total, newThisMonth] = await Promise.all([
    User.countDocuments({ role: 'customer' }),
    User.countDocuments({ role: 'customer', createdAt: { $gte: startOfMonth } }),
  ]);
  return { total, newThisMonth };
}
