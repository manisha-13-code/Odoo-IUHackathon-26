'use client';
import { useState } from 'react';
import { useAuthStore } from '@/stores/auth';
import { PageHeader } from '@/components/shared/KpiCard';
import { useRouter } from 'next/navigation';
import { authApi } from '@/lib/api/client';

const TABS = ['Profile', 'Security', 'Team', 'Notifications'] as const;
type Tab = typeof TABS[number];

function Section({ title, description, children }: { title: string; description?: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-xl border border-stone-200 overflow-hidden mb-5">
      <div className="px-6 py-4 border-b border-stone-100">
        <h3 className="text-sm font-semibold text-stone-700">{title}</h3>
        {description && <p className="text-xs text-stone-400 mt-0.5">{description}</p>}
      </div>
      <div className="p-6">{children}</div>
    </div>
  );
}

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-8 py-4 border-b border-stone-100 last:border-0">
      <div className="min-w-[180px]">
        <p className="text-sm font-medium text-stone-700">{label}</p>
        {hint && <p className="text-xs text-stone-400 mt-0.5">{hint}</p>}
      </div>
      <div className="flex-1 max-w-sm">{children}</div>
    </div>
  );
}

const INPUT_CLS = 'w-full px-3 py-2 text-sm border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1B3A5C]/20 focus:border-[#1B3A5C]/40 text-stone-700';

export default function SettingsPage() {
  const { user, clearAuth } = useAuthStore();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<Tab>('Profile');
  const [saved, setSaved] = useState(false);

  const handleLogout = async () => {
    const rt = typeof window !== 'undefined' ? localStorage.getItem('refreshToken') : null;
    if (rt) await authApi.logout(rt).catch(() => {});
    clearAuth();
    router.push('/auth/login');
  };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div>
      <PageHeader title="Settings" description="Manage your account and system preferences" />

      {/* Tabs */}
      <div className="flex gap-1 mb-6 border-b border-stone-200">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2.5 text-sm font-medium transition-colors border-b-2 -mb-px ${
              activeTab === tab
                ? 'border-[#1B3A5C] text-[#1B3A5C]'
                : 'border-transparent text-stone-500 hover:text-stone-700'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {activeTab === 'Profile' && (
        <>
          <Section title="Personal information" description="Update your name and contact details">
            <Field label="Full name">
              <div className="grid grid-cols-2 gap-2">
                <input className={INPUT_CLS} defaultValue={user?.firstName} placeholder="First name" />
                <input className={INPUT_CLS} defaultValue={user?.lastName} placeholder="Last name" />
              </div>
            </Field>
            <Field label="Email address" hint="Used for login and notifications">
              <input className={INPUT_CLS} type="email" defaultValue={user?.email} />
            </Field>
            <Field label="Role" hint="Assigned by your administrator">
              <div className="px-3 py-2 text-sm bg-stone-50 border border-stone-200 rounded-lg text-stone-500">
                {user?.role?.replace('_', ' ')}
              </div>
            </Field>
          </Section>
          <div className="flex justify-end gap-2">
            <button onClick={handleSave} className="px-4 py-2 bg-[#1B3A5C] text-white text-sm font-medium rounded-lg hover:bg-[#1B3A5C]/90 transition-colors">
              {saved ? '✓ Saved' : 'Save changes'}
            </button>
          </div>
        </>
      )}

      {activeTab === 'Security' && (
        <>
          <Section title="Change password" description="Use a strong password with at least 8 characters">
            <Field label="Current password">
              <input className={INPUT_CLS} type="password" placeholder="••••••••" />
            </Field>
            <Field label="New password">
              <input className={INPUT_CLS} type="password" placeholder="Min. 8 characters" />
            </Field>
            <Field label="Confirm new password">
              <input className={INPUT_CLS} type="password" placeholder="••••••••" />
            </Field>
          </Section>
          <Section title="Sessions" description="Active login sessions for your account">
            <div className="flex items-center justify-between py-2">
              <div>
                <p className="text-sm text-stone-700">Current session</p>
                <p className="text-xs text-stone-400 mt-0.5">Chrome · Vadodara, India · Active now</p>
              </div>
              <span className="text-xs bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full border border-emerald-200">Current</span>
            </div>
          </Section>
          <div className="flex justify-between items-center">
            <button onClick={handleLogout} className="px-4 py-2 text-sm font-medium text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition-colors">
              Sign out of all sessions
            </button>
            <button onClick={handleSave} className="px-4 py-2 bg-[#1B3A5C] text-white text-sm font-medium rounded-lg hover:bg-[#1B3A5C]/90 transition-colors">
              Update password
            </button>
          </div>
        </>
      )}

      {activeTab === 'Team' && (
        <Section title="Team members" description="View and manage users with access to CoreInventory">
          <div className="space-y-3">
            {[
              { name: 'Rahul Sharma', email: 'rahul@company.com', role: 'ADMIN', active: true },
              { name: 'Priya Patel', email: 'priya@company.com', role: 'INVENTORY_MANAGER', active: true },
              { name: 'Vikram Singh', email: 'vikram@company.com', role: 'WAREHOUSE_STAFF', active: true },
            ].map((u) => (
              <div key={u.email} className="flex items-center justify-between py-3 border-b border-stone-100 last:border-0">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#E6F1FB] flex items-center justify-center">
                    <span className="text-xs font-bold text-[#185FA5]">{u.name[0]}</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-stone-700">{u.name}</p>
                    <p className="text-xs text-stone-400">{u.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-stone-500">{u.role.replace('_', ' ')}</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                </div>
              </div>
            ))}
          </div>
        </Section>
      )}

      {activeTab === 'Notifications' && (
        <Section title="Alert preferences" description="Choose which events trigger notifications">
          {[
            { label: 'Low stock alerts', hint: 'When a product falls below its reorder level', defaultChecked: true },
            { label: 'Receipt validated', hint: 'When a receipt is confirmed and stock is updated', defaultChecked: true },
            { label: 'Delivery shipped', hint: 'When a delivery order is marked as shipped', defaultChecked: false },
            { label: 'Transfer completed', hint: 'When an internal transfer finishes', defaultChecked: false },
            { label: 'Stock adjustment', hint: 'When an inventory adjustment is submitted', defaultChecked: true },
          ].map((n) => (
            <Field key={n.label} label={n.label} hint={n.hint}>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" defaultChecked={n.defaultChecked} className="w-4 h-4 rounded accent-[#1B3A5C]" />
                <span className="text-sm text-stone-600">Enabled</span>
              </label>
            </Field>
          ))}
        </Section>
      )}
    </div>
  );
}
