'use client';
import { useState } from 'react';
import { useReceipts, useCreateReceipt, useReceiptAction, useSuppliers, useWarehouses } from '@/lib/hooks';
import { DataTable, type Column } from '@/components/shared/DataTable';
import { Modal, FormBuilder, type FormField } from '@/components/shared/Modal';
import { PageHeader, Button } from '@/components/shared/KpiCard';
import { StatusBadge } from '@/components/shared/StatusBadge';
import type { Operation, QueryParams } from '@/types';

const RECEIPT_FIELDS: FormField<any>[] = [
  { name: 'supplierId',    label: 'Supplier',    type: 'select',   required: true, span: 'full' },
  { name: 'warehouseId',   label: 'Warehouse',   type: 'select',   required: true, span: 'half' },
  { name: 'scheduledDate', label: 'Scheduled date', type: 'date',  span: 'half' },
  { name: 'notes',         label: 'Notes',       type: 'textarea', span: 'full' },
];

function ActionButton({ op, onAction }: { op: Operation; onAction: (id: string, action: string) => void }) {
  if (op.status === 'DRAFT') {
    return (
      <button
        onClick={() => onAction(op.id, 'confirm')}
        className="text-xs px-2 py-1 bg-blue-50 text-blue-700 rounded-md border border-blue-200 hover:bg-blue-100 transition-colors"
      >
        Confirm
      </button>
    );
  }
  if (op.status === 'CONFIRMED') {
    return (
      <button
        onClick={() => onAction(op.id, 'validate')}
        className="text-xs px-2 py-1 bg-emerald-50 text-emerald-700 rounded-md border border-emerald-200 hover:bg-emerald-100 transition-colors"
      >
        Validate
      </button>
    );
  }
  return null;
}

export default function ReceiptsPage() {
  const [params, setParams] = useState<QueryParams>({ page: 1, limit: 20, filter: {} });
  const [createOpen, setCreateOpen] = useState(false);

  const { data, isLoading } = useReceipts(params);
  const { data: suppliers } = useSuppliers();
  const { data: warehouses } = useWarehouses();
  const createReceipt = useCreateReceipt();
  const receiptAction = useReceiptAction();

  const fields = RECEIPT_FIELDS.map(f => {
    if (f.name === 'supplierId') return { ...f, options: suppliers?.data?.map(s => ({ value: s.id, label: s.name })) || [] };
    if (f.name === 'warehouseId') return { ...f, options: warehouses?.data?.map(w => ({ value: w.id, label: w.name })) || [] };
    return f;
  });

  const columns: Column<Operation>[] = [
    {
      key: 'reference', header: 'Reference', sortable: true, width: '140px',
      cell: (op) => <span className="font-mono text-xs font-medium text-stone-700">{op.reference}</span>,
    },
    {
      key: 'supplier', header: 'Supplier',
      cell: (op) => <span className="text-stone-700">{op.supplier?.name || '—'}</span>,
    },
    {
      key: 'warehouse', header: 'Destination',
      cell: (op) => <span className="text-stone-500 text-xs">{op.warehouse?.name}</span>,
    },
    {
      key: 'scheduledDate', header: 'Scheduled', sortable: true,
      cell: (op) => op.scheduledDate
        ? <span className="text-stone-500 text-xs">{new Date(op.scheduledDate).toLocaleDateString('en-IN')}</span>
        : <span className="text-stone-300">—</span>,
    },
    {
      key: 'lines', header: 'Lines',
      cell: (op) => <span className="text-stone-500">{op.lines?.length ?? 0}</span>,
    },
    { key: 'status', header: 'Status', cell: (op) => <StatusBadge status={op.status} /> },
    {
      key: 'actions', header: '', width: '100px',
      cell: (op) => (
        <ActionButton
          op={op}
          onAction={(id, action) => receiptAction.mutate({ id, action: action as any })}
        />
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        title="Receipts"
        description="Manage incoming goods from suppliers"
        actions={
          <Button onClick={() => setCreateOpen(true)} icon={
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4"/>
            </svg>
          }>
            New receipt
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
              { value: 'RECEIVED', label: 'Received' },
            ],
          },
        ]}
        onSearch={(s) => setParams(p => ({ ...p, search: s, page: 1 }))}
        onFilter={(k, v) => setParams(p => ({ ...p, filter: { ...p.filter, [k]: v }, page: 1 }))}
        onPageChange={(pg) => setParams(p => ({ ...p, page: pg }))}
        onSort={(key, order) => setParams(p => ({ ...p, sort: key, order }))}
        emptyMessage="No receipts yet. Create your first receipt to start receiving goods."
      />

      <Modal open={createOpen} onClose={() => setCreateOpen(false)} title="New receipt" description="Create an incoming receipt from a supplier" size="md">
        <FormBuilder
          fields={fields}
          onSubmit={async (data) => {
            await createReceipt.mutateAsync(data);
            setCreateOpen(false);
          }}
          loading={createReceipt.isPending}
          submitLabel="Create receipt"
        />
      </Modal>
    </div>
  );
}
