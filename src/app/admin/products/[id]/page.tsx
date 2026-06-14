// FILE: src/app/admin/products/[id]/page.tsx
import { notFound } from 'next/navigation';
import { findById } from '@/repositories/product.repo';
import ProductForm from '@/components/admin/products/ProductForm';

export const metadata = { title: 'Edit Product' };

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = await findById(id);

  if (!product) notFound();

  // Serialize for client component
  const serialized = JSON.parse(JSON.stringify(product));

  const defaultValues = {
    _id: serialized._id,
    name: serialized.name,
    slug: serialized.slug,
    shortDescription: serialized.shortDescription,
    description: serialized.description,
    price: serialized.price,
    salePrice: serialized.salePrice,
    stock: serialized.stock,
    sku: serialized.sku,
    categoryId: typeof serialized.categoryId === 'object'
      ? serialized.categoryId._id
      : serialized.categoryId,
    tags: Array.isArray(serialized.tags) ? serialized.tags.join(', ') : '',
    isFeatured: serialized.isFeatured,
    isActive: serialized.isActive,
    images: serialized.images,
  };

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-admin-text">Edit Product</h1>
        <p className="text-sm text-admin-muted mt-0.5 truncate">
          {product.name} · <span className="font-mono">{product.sku}</span>
        </p>
      </div>
      <ProductForm mode="edit" defaultValues={defaultValues} />
    </div>
  );
}
