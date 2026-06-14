// FILE: src/app/admin/orders/page.tsx
import { findAll } from '@/repositories/order.repo';
import OrderTable from '@/components/admin/orders/OrderTable';
import type { IOrderType } from '@/types';

export const metadata = { title: 'Orders' };

interface SearchParams { page?: string; status?: string; }

export default async function AdminOrdersPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const sp = await searchParams;
  const page = parseInt(sp.page ?? '1');
  const status = sp.status ?? '';

  const { orders, total } = await findAll(
    { orderStatus: status || undefined },
    page,
    20
  );
  const totalPages = Math.ceil(total / 20);

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-admin-text">Orders</h1>
        <p className="text-sm text-admin-muted mt-0.5">{total} total orders</p>
      </div>
      <OrderTable
        orders={JSON.parse(JSON.stringify(orders)) as IOrderType[]}
        total={total}
        totalPages={totalPages}
        currentPage={page}
        currentStatus={status}
      />
    </div>
  );
}
