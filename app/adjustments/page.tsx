'use client';
import { useState } from 'react';
import { useAdjustments, useCreateAdjustment, useWarehouses, useLocations, useProducts } from '@/lib/hooks';
import { DataTable, type Column } from '@/components/shared/DataTable';
import { Modal, FormBuilder, type FormField } from '@/components/shared/Modal';
import { PageHeader, Button } from '@/components/shared/KpiCard';
import { StatusBadge } from '@/components/shared/StatusBadge';
import type { Operation, QueryParams } from '@/types';

const ADJUSTMENT_FIELDS: FormField<any>[] = [
  { name: 'warehouseId', label: 'Warehouse',        type: 'select', required: true, span: 'half' },
  { name: 'locationId',  label: 'Location',         type: 'select', required: true, span: 'half' },
  { name: 'productId',   label: 'Product',          type: 'select', required: true, span: 'full' },
  { name: 'systemQty',   label: 'System quantity',  type: 'number', required: true, span: 'half', hint: 'Current recorded stock' },
  { name: 'physicalQty', label: 'Physical quantity', type: 'number', required: true, span: 'half', hint: 'Actual counted stock' },
  { name: 'notes',       label: 'Reason',           type: 'textarea', span: 'full', required: true, placeholder: 'Explain why the adjustment is needed…' },
];

export default function AdjustmentsPage() {
  const [params, setParams] = useState<QueryParams>({ page: 1, limit: 20, filter: {} });
  const [createOpen, setCreateOpen] = useState(false);

  const { data, isLoading } = useAdjustments(params);
  const { data: warehouses } = useWarehouses();
  const { data: locations } = useLocations();
  const { data: products } = useProducts({ limit: 200 });
  const createAdjustment = useCreateAdjustment();

  const fields = ADJUSTMENT_FIELDS.map(f => {
    if (f.name === 'warehouseId') return { ...f, options: warehouses?.data?.map(w => ({ value: w.id, label: w.name })) || [] };
    if (f.name === 'locationId') return { ...f, options: locations?.data?.map(l => ({ value: l.id, label: `${l.name} (${l.code})` })) || [] };
    if (f.name === 'productId') return { ...f, options: products?.data?.map(p => ({ value: p.id, label: `${p.name} — ${p.sku}` })) || [] };
    return f;
  });

  const columns: Column<Operation>[] = [
    {
      key: 'reference', header: 'Reference', width: '140px',
      cell: (op) => <span className="font-mono text-xs font-medium text-stone-700">{op.reference}</span>,
    },
    {
      key: 'warehouse', header: 'Warehouse',
      cell: (op) => <span className="text-stone-500 text-xs">{op.warehouse?.name}</span>,
    },
    {
      key: 'lines', header: 'Product',
      cell: (op) => {
        const line = op.lines?.[0];
        if (!line) return <span className="text-stone-300">—</span>;
        return (
          <div>
            <p className="text-sm text-stone-700">{line.product?.name}</p>
            <p className="text-xs text-stone-400 font-mono">{line.product?.sku}</p>
          </div>
        );
      },
    },
    {
      key: 'delta', header: 'Delta',
      cell: (op) => {
        const line = op.lines?.[0];
        if (!line) return null;
        const delta = line.quantityDone - line.quantityDemand;
        return (
          <span className={`font-semibold text-sm ${delta > 0 ? 'text-emerald-600' : delta < 0 ? 'text-red-500' : 'text-stone-400'}`}>
            {delta > 0 ? '+' : ''}{delta}
          </span>
        );
      },
    },
    {
      key: 'createdAt', header: 'Date', sortable: true,
      cell: (op) => <span className="text-xs text-stone-500">{new Date(op.createdAt).toLocaleDateString('en-IN')}</span>,
    },
    { key: 'status', header: 'Status', cell: (op) => <StatusBadge status={op.status} /> },
  ];

  return (
    <div>
      <PageHeader
        title="Stock Adjustments"
        description="Correct inventory mismatches between system and physical counts"
        actions={
          <Button onClick={() => setCreateOpen(true)} icon={
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4"/>
            </svg>
          }>
            New adjustment
          </Button>
        }
      />

      {/* Info banner */}
      <div className="mb-4 flex items-start gap-3 p-4 bg-amber-50 border border-amber-200 rounded-xl text-sm text-amber-800">
        <svg className="w-4 h-4 mt-0.5 shrink-0 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
        </svg>
        <p>Stock adjustments create immutable ledger records. All adjustments are logged to the audit trail. Only Inventory Managers and Admins may create adjustments.</p>
      </div>

      <DataTable
        data={data?.data || []}
        columns={columns}
        total={data?.meta.total || 0}
        page={params.page || 1}
        limit={params.limit || 20}
        loading={isLoading}
        searchPlaceholder="Search by reference…"
        filters={[
          {
            key: 'status', label: 'Status',
            options: [
              { value: 'DRAFT', label: 'Draft' },
              { value: 'COMPLETED', label: 'Completed' },
            ],
          },
        ]}
        onSearch={(s) => setParams(p => ({ ...p, search: s, page: 1 }))}
        onFilter={(k, v) => setParams(p => ({ ...p, filter: { ...p.filter, [k]: v }, page: 1 }))}
        onPageChange={(pg) => setParams(p => ({ ...p, page: pg }))}
        onSort={(key, order) => setParams(p => ({ ...p, sort: key, order }))}
        emptyMessage="No adjustments recorded yet."
      />

      <Modal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        title="New stock adjustment"
        description="Record a mismatch between physical and system stock"
        size="lg"
      >
        <FormBuilder
          fields={fields}
          onSubmit={async (data) => {
            const delta = Number(data.physicalQty) - Number(data.systemQty);
            await createAdjustment.mutateAsync({ ...data, delta });
            setCreateOpen(false);
          }}
          loading={createAdjustment.isPending}
          submitLabel="Submit adjustment"
        />
      </Modal>
    </div>
  );
}
