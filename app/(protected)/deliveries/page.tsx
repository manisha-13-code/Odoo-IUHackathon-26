'use client';
import { useState } from 'react';
import { useDeliveries, useCreateDelivery, useDeliveryAction, useWarehouses } from '@/lib/hooks';
import { DataTable, type Column } from '@/components/shared/DataTable';
import { Modal, FormBuilder, type FormField } from '@/components/shared/Modal';
import { PageHeader, Button } from '@/components/shared/KpiCard';
import { StatusBadge } from '@/components/shared/StatusBadge';
import type { Operation, QueryParams } from '@/types';

const DELIVERY_FIELDS: FormField<any>[] = [
  { name: 'warehouseId',   label: 'From warehouse', type: 'select', required: true, span: 'half' },
  { name: 'scheduledDate', label: 'Scheduled date', type: 'date',   span: 'half' },
  { name: 'notes',         label: 'Notes / customer', type: 'textarea', span: 'full' },
];

function DeliveryActionBtn({ op, onAction }: { op: Operation; onAction: (id: string, a: 'pick'|'pack'|'ship') => void }) {
  const map: Record<string, { label: string; action: 'pick'|'pack'|'ship'; cls: string }> = {
    CONFIRMED: { label: 'Start Pick', action: 'pick', cls: 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100' },
    PICKING:   { label: 'Pack',       action: 'pack', cls: 'bg-violet-50 text-violet-700 border-violet-200 hover:bg-violet-100' },
    PACKED:    { label: 'Ship',       action: 'ship', cls: 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100' },
  };
  const btn = map[op.status];
  if (!btn) return null;
  return (
    <button
      onClick={() => onAction(op.id, btn.action)}
      className={`text-xs px-2 py-1 rounded-md border transition-colors ${btn.cls}`}
    >
      {btn.label}
    </button>
  );
}

export default function DeliveriesPage() {
  const [params, setParams] = useState<QueryParams>({ page: 1, limit: 20, filter: {} });
  const [createOpen, setCreateOpen] = useState(false);

  const { data, isLoading } = useDeliveries(params);
  const { data: warehouses } = useWarehouses();
  const createDelivery = useCreateDelivery();
  const deliveryAction = useDeliveryAction();

  const fields = DELIVERY_FIELDS.map(f =>
    f.name === 'warehouseId'
      ? { ...f, options: warehouses?.data?.map(w => ({ value: w.id, label: w.name })) || [] }
      : f
  );

  const columns: Column<Operation>[] = [
    {
      key: 'reference', header: 'Reference', width: '140px',
      cell: (op) => <span className="font-mono text-xs font-medium text-stone-700">{op.reference}</span>,
    },
    {
      key: 'warehouse', header: 'From',
      cell: (op) => <span className="text-stone-500 text-xs">{op.warehouse?.name}</span>,
    },
    {
      key: 'scheduledDate', header: 'Scheduled',
      cell: (op) => op.scheduledDate
        ? <span className="text-xs text-stone-500">{new Date(op.scheduledDate).toLocaleDateString('en-IN')}</span>
        : <span className="text-stone-300">—</span>,
    },
    { key: 'lines', header: 'Lines', cell: (op) => <span className="text-stone-500">{op.lines?.length ?? 0}</span> },
    { key: 'status', header: 'Status', cell: (op) => <StatusBadge status={op.status} /> },
    {
      key: 'actions', header: '', width: '120px',
      cell: (op) => (
        <DeliveryActionBtn op={op} onAction={(id, a) => deliveryAction.mutate({ id, action: a })} />
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        title="Deliveries"
        description="Manage outgoing shipments"
        actions={
          <Button onClick={() => setCreateOpen(true)} icon={<svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4"/></svg>}>
            New delivery
          </Button>
        }
      />

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
              { value: 'CONFIRMED', label: 'Confirmed' },
              { value: 'PICKING', label: 'Picking' },
              { value: 'PACKED', label: 'Packed' },
              { value: 'SHIPPED', label: 'Shipped' },
            ],
          },
        ]}
        onSearch={(s) => setParams(p => ({ ...p, search: s, page: 1 }))}
        onFilter={(k, v) => setParams(p => ({ ...p, filter: { ...p.filter, [k]: v }, page: 1 }))}
        onPageChange={(pg) => setParams(p => ({ ...p, page: pg }))}
        onSort={(key, order) => setParams(p => ({ ...p, sort: key, order }))}
        emptyMessage="No deliveries yet."
      />

      <Modal open={createOpen} onClose={() => setCreateOpen(false)} title="New delivery" size="md">
        <FormBuilder
          fields={fields}
          onSubmit={async (data) => { await createDelivery.mutateAsync(data); setCreateOpen(false); }}
          loading={createDelivery.isPending}
          submitLabel="Create delivery"
        />
      </Modal>
    </div>
  );
}
