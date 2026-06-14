// FILE: src/app/admin/settings/page.tsx
export const metadata = { title: 'Settings' };

export default function AdminSettingsPage() {
  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-admin-text">Settings</h1>
        <p className="text-sm text-admin-muted mt-0.5">Store configuration and preferences.</p>
      </div>
      <div className="bg-white rounded-xl border border-admin-border p-8 text-center">
        <p className="text-admin-muted text-sm">Settings panel coming in a future phase.</p>
      </div>
    </div>
  );
}
