// FILE: src/repositories/category.repo.ts
import { connectDB } from '@/lib/db';
import Category, { ICategory } from '@/models/Category';

export interface CreateCategoryData {
  name: string;
  slug: string;
  description?: string;
  image?: { url: string; publicId: string };
  parentId?: string | null;
  isActive?: boolean;
  sortOrder?: number;
}

export async function findAll(): Promise<ICategory[]> {
  await connectDB();
  return Category.find({ isActive: true })
    .sort({ sortOrder: 1, name: 1 })
    .lean() as Promise<ICategory[]>;
}

export async function findAllAdmin(): Promise<ICategory[]> {
  await connectDB();
  return Category.find({})
    .sort({ sortOrder: 1, name: 1 })
    .lean() as Promise<ICategory[]>;
}

export async function findBySlug(slug: string): Promise<ICategory | null> {
  await connectDB();
  return Category.findOne({ slug, isActive: true });
}

export async function findById(id: string): Promise<ICategory | null> {
  await connectDB();
  return Category.findById(id);
}

export async function create(data: CreateCategoryData): Promise<ICategory> {
  await connectDB();
  return Category.create(data);
}

export async function update(id: string, data: Partial<CreateCategoryData>): Promise<ICategory | null> {
  await connectDB();
  return Category.findByIdAndUpdate(id, { $set: data }, { new: true });
}

export async function deleteById(id: string): Promise<ICategory | null> {
  await connectDB();
  return Category.findByIdAndDelete(id);
}
