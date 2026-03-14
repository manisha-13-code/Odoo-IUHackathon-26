'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { ReactNode } from 'react';

interface NavItem {
  label: string;
  href: string;
  icon: ReactNode;
  badge?: number;
}

interface NavGroup {
  label?: string;
  items: NavItem[];
}

const Cube = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 10V11"/>
  </svg>
);

const NAV_GROUPS: NavGroup[] = [
  {
    items: [
      { label: 'Dashboard', href: '/dashboard', icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg> },
    ],
  },
  {
    label: 'Catalogue',
    items: [
      { label: 'Products', href: '/products', icon: <Cube /> },
      { label: 'Suppliers', href: '/suppliers', icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0H5m14 0h2m-2 0h-2M5 21H3m2 0h2m0-10h6m-6 4h6"/></svg> },
      { label: 'Warehouses', href: '/warehouses', icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 21V9l9-6 9 6v12H3zm6 0v-5h6v5"/></svg> },
    ],
  },
  {
    label: 'Operations',
    items: [
      { label: 'Receipts', href: '/receipts', icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 12l2 2 4-4M7.835 4.697a3 3 0 01-3.138-.003m15.466 0a3 3 0 01-3.138.003M12 3v1m0 16v1m-8-9H3m18 0h-1M5.636 5.636l-.707.707m13.435 13.435l-.707-.707M5.636 18.364l-.707-.707m13.435-13.435l-.707.707"/></svg> },
      { label: 'Deliveries', href: '/deliveries', icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M1 3h15v13H1zM16 8h4l3 3v5h-7V8z"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg> },
      { label: 'Transfers', href: '/transfers', icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"/></svg> },
      { label: 'Adjustments', href: '/adjustments', icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"/></svg> },
    ],
  },
  {
    label: 'System',
    items: [
      { label: 'Settings', href: '/settings', icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/><circle cx="12" cy="12" r="3"/></svg> },
    ],
  },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-56 shrink-0 bg-[#0F1F33] flex flex-col h-screen sticky top-0">
      {/* Logo */}
      <div className="px-4 py-5 border-b border-white/5">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 bg-[#185FA5] rounded-lg flex items-center justify-center shrink-0">
            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 16 16">
              <path d="M2 2h5v5H2V2zm7 0h5v5H9V2zM2 9h5v5H2V9zm7 0h5v5H9V9z"/>
            </svg>
          </div>
          <div>
            <p className="text-sm font-semibold text-white tracking-tight">CoreInventory</p>
            <p className="text-[10px] text-white/30">v1.0 · Production</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 overflow-y-auto space-y-4">
        {NAV_GROUPS.map((group, gi) => (
          <div key={gi}>
            {group.label && (
              <p className="text-[10px] font-semibold text-white/25 uppercase tracking-widest px-2 mb-1">
                {group.label}
              </p>
            )}
            <div className="space-y-0.5">
              {group.items.map((item) => {
                const active = pathname === item.href || pathname.startsWith(item.href + '/');
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-sm transition-colors ${
                      active
                        ? 'bg-[#185FA5] text-white'
                        : 'text-white/50 hover:text-white/80 hover:bg-white/5'
                    }`}
                  >
                    <span className={active ? 'opacity-100' : 'opacity-60'}>{item.icon}</span>
                    {item.label}
                    {item.badge != null && item.badge > 0 && (
                      <span className="ml-auto bg-[#185FA5]/80 text-white text-[10px] px-1.5 py-0.5 rounded-full font-medium">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* User */}
      <div className="px-3 pb-4">
        <Link href="/settings" className="flex items-center gap-2.5 p-2.5 rounded-lg hover:bg-white/5 transition-colors">
          <div className="w-7 h-7 rounded-full bg-[#185FA5] flex items-center justify-center text-white text-xs font-bold shrink-0">
            RS
          </div>
          <div className="min-w-0">
            <p className="text-xs font-medium text-white/80 truncate">Rahul Sharma</p>
            <p className="text-[10px] text-white/30 truncate">Admin</p>
          </div>
        </Link>
      </div>
    </aside>
  );
}
