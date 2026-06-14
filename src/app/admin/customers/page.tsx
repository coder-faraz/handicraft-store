// FILE: src/app/admin/customers/page.tsx
import { getAllUsers } from '@/repositories/user.repo';
import { formatDate } from '@/lib/utils';
import { Users, Search } from 'lucide-react';
import { cn } from '@/lib/utils';

export const metadata = { title: 'Customers' };

interface SearchParams { page?: string; search?: string; }

export default async function AdminCustomersPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const sp = await searchParams;
  const page = parseInt(sp.page ?? '1');
  const search = sp.search;

  const { users, total } = await getAllUsers(page, 20, search);
  const totalPages = Math.ceil(total / 20);

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-admin-text">Customers</h1>
        <p className="text-sm text-admin-muted mt-0.5">{total} registered customers</p>
      </div>

      {/* Search bar */}
      <form method="GET" className="flex gap-2">
        <div className="relative flex-1 max-w-sm">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-admin-muted" />
          <input
            name="search"
            defaultValue={search}
            placeholder="Search by name or email…"
            className="w-full pl-9 pr-4 py-2.5 text-sm border border-admin-border rounded-lg focus:outline-none focus:border-brand-primary bg-white"
          />
        </div>
        <button type="submit" className="px-4 py-2.5 text-sm bg-brand-primary text-white rounded-lg hover:bg-[#7a3c10] transition-colors">
          Search
        </button>
      </form>

      {/* Table */}
      <div className="bg-white rounded-xl border border-admin-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 text-left border-b border-admin-border">
                <th className="px-5 py-3 font-medium text-admin-muted">Customer</th>
                <th className="px-5 py-3 font-medium text-admin-muted">Email</th>
                <th className="px-5 py-3 font-medium text-admin-muted">Phone</th>
                <th className="px-5 py-3 font-medium text-admin-muted">Status</th>
                <th className="px-5 py-3 font-medium text-admin-muted">Joined</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-admin-border">
              {users.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-16 text-center">
                    <Users size={36} className="mx-auto text-admin-border mb-3" />
                    <p className="text-admin-muted text-sm">No customers found.</p>
                  </td>
                </tr>
              ) : (
                users.map((user) => {
                  const initials = user.name.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase();
                  return (
                    <tr key={(user._id as any).toString()} className="hover:bg-gray-50 transition-colors">
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-brand-primary/10 flex items-center justify-center flex-shrink-0">
                            <span className="text-xs font-semibold text-brand-primary">{initials}</span>
                          </div>
                          <span className="font-medium text-admin-text">{user.name}</span>
                        </div>
                      </td>
                      <td className="px-5 py-3 text-admin-muted">{user.email}</td>
                      <td className="px-5 py-3 text-admin-muted">{user.phone ?? '—'}</td>
                      <td className="px-5 py-3">
                        <span className={cn('px-2.5 py-1 rounded-full text-xs font-medium',
                          user.isActive ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
                        )}>
                          {user.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-admin-muted">{formatDate(user.createdAt as any)}</td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-5 py-3 border-t border-admin-border bg-gray-50">
            <p className="text-xs text-admin-muted">Showing {(page - 1) * 20 + 1}–{Math.min(page * 20, total)} of {total}</p>
            <div className="flex items-center gap-2">
              {page > 1 && (
                <a href={`?page=${page - 1}${search ? `&search=${search}` : ''}`} className="px-3 py-1.5 text-xs border border-admin-border rounded-lg hover:bg-gray-50">
                  Previous
                </a>
              )}
              {page < totalPages && (
                <a href={`?page=${page + 1}${search ? `&search=${search}` : ''}`} className="px-3 py-1.5 text-xs border border-admin-border rounded-lg hover:bg-gray-50">
                  Next
                </a>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
