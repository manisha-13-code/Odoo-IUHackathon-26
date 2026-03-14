'use client';
import { useDashboard, useLowStock } from '@/lib/hooks';
import { KpiCard, InventoryCard, PageHeader } from '@/components/shared/KpiCard';
import { StatusBadge } from '@/components/shared/StatusBadge';
import Link from 'next/link';

const Icons = {
  box:      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 10V11"/></svg>,
  stack:    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/></svg>,
  alert:    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>,
  receipt:  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/></svg>,
  truck:    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M1 3h15v13H1zM16 8h4l3 3v5h-7V8z"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>,
  transfer: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"/></svg>,
};

export default function DashboardPage() {
  const { data: kpis, isLoading } = useDashboard();
  const { data: lowStockProducts } = useLowStock();

  return (
    <div>
      <PageHeader
        title="Dashboard"
        description="Real-time overview of your inventory operations"
      />

      {/* KPI Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">
        <KpiCard label="Total Products" value={kpis?.totalProducts ?? '—'} icon={Icons.box} color="blue" loading={isLoading} sub="in catalogue" />
        <KpiCard label="Total Stock" value={kpis?.totalStock?.toLocaleString() ?? '—'} icon={Icons.stack} color="green" loading={isLoading} sub="units on hand" />
        <KpiCard label="Low Stock" value={kpis?.lowStockCount ?? '—'} icon={Icons.alert} color={kpis?.lowStockCount ? 'red' : 'green'} loading={isLoading} sub="below reorder pt." />
        <KpiCard label="Pending Receipts" value={kpis?.pendingReceipts ?? '—'} icon={Icons.receipt} color="amber" loading={isLoading} sub="awaiting validation" />
        <KpiCard label="Pending Deliveries" value={kpis?.pendingDeliveries ?? '—'} icon={Icons.truck} color="amber" loading={isLoading} sub="to be shipped" />
        <KpiCard label="Transfers" value={kpis?.transfersInProgress ?? '—'} icon={Icons.transfer} color="violet" loading={isLoading} sub="in progress" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Movements */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-stone-200 overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-stone-100">
            <h2 className="text-sm font-semibold text-stone-700">Recent movements</h2>
            <Link href="/adjustments" className="text-xs text-[#185FA5] hover:underline">View ledger →</Link>
          </div>
          <div className="divide-y divide-stone-100">
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-center gap-3 px-5 py-3 animate-pulse">
                  <div className="w-8 h-8 bg-stone-100 rounded-lg shrink-0" />
                  <div className="flex-1 space-y-1.5">
                    <div className="h-3 bg-stone-100 rounded w-48" />
                    <div className="h-2.5 bg-stone-100 rounded w-32" />
                  </div>
                  <div className="h-3 bg-stone-100 rounded w-16" />
                </div>
              ))
            ) : kpis?.recentMovements?.length ? (
              kpis.recentMovements.map((m) => (
                <div key={m.id} className="flex items-center gap-3 px-5 py-3 hover:bg-stone-50/50">
                  <div className="w-8 h-8 bg-stone-100 rounded-lg flex items-center justify-center shrink-0">
                    {Icons.box}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-stone-700 truncate">{m.product?.name}</p>
                    <p className="text-xs text-stone-400 font-mono">{m.product?.sku}</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <StatusBadge status={m.type} />
                    <span className={`text-sm font-semibold ${m.quantity >= 0 ? 'text-emerald-600' : 'text-red-500'}`}>
                      {m.quantity >= 0 ? '+' : ''}{m.quantity}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="px-5 py-12 text-center text-sm text-stone-400">No recent movements</div>
            )}
          </div>
        </div>

        {/* Low Stock Panel */}
        <div className="bg-white rounded-xl border border-stone-200 overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-stone-100">
            <h2 className="text-sm font-semibold text-stone-700">Low stock alerts</h2>
            <Link href="/products" className="text-xs text-[#185FA5] hover:underline">View all →</Link>
          </div>
          <div className="p-4 space-y-3 overflow-y-auto max-h-96">
            {isLoading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-20 bg-stone-100 rounded-lg animate-pulse" />
              ))
            ) : lowStockProducts?.length ? (
              lowStockProducts.map((p) => (
                <InventoryCard
                  key={p.id}
                  productName={p.name}
                  sku={p.sku}
                  stock={p.totalStock}
                  reorderLevel={p.reorderLevel}
                  unit={p.unit}
                />
              ))
            ) : (
              <div className="py-10 text-center text-sm text-stone-400">
                <svg className="w-8 h-8 text-emerald-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
                All stock levels OK
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
