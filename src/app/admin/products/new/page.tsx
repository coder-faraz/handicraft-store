// FILE: src/app/admin/products/new/page.tsx
import ProductForm from '@/components/admin/products/ProductForm';

export const metadata = { title: 'Add New Product' };

export default function NewProductPage() {
  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-admin-text">Add New Product</h1>
        <p className="text-sm text-admin-muted mt-0.5">
          Fill in the details below to add a new product to your catalog.
        </p>
      </div>
      <ProductForm mode="create" />
    </div>
  );
}
