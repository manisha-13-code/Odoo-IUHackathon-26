'use client';
import { useState } from 'react';
import { useTransfers, useCreateTransfer, useTransferAction, useWarehouses, useLocations } from '@/lib/hooks';
import { DataTable, type Column } from '@/components/shared/DataTable';
import { Modal, FormBuilder, type FormField } from '@/components/shared/Modal';
import { PageHeader, Button } from '@/components/shared/KpiCard';
import { StatusBadge } from '@/components/shared/StatusBadge';
import type { Operation, QueryParams } from '@/types';

const TRANSFER_FIELDS: FormField<any>[] = [
  { name: 'fromWarehouseId', label: 'From warehouse', type: 'select', required: true, span: 'half' },
  { name: 'toWarehouseId',   label: 'To warehouse',   type: 'select', required: true, span: 'half' },
  { name: 'fromLocationId',  label: 'From location',  type: 'select', span: 'half' },
  { name: 'toLocationId',    label: 'To location',    type: 'select', span: 'half' },
  { name: 'scheduledDate',   label: 'Scheduled date', type: 'date',   span: 'half' },
  { name: 'notes',           label: 'Notes',          type: 'textarea', span: 'full' },
];

export default function TransfersPage() {
  const [params, setParams] = useState<QueryParams>({ page: 1, limit: 20, filter: {} });
  const [createOpen, setCreateOpen] = useState(false);

  const { data, isLoading } = useTransfers(params);
  const { data: warehouses } = useWarehouses();
  const { data: locations } = useLocations();
  const createTransfer = useCreateTransfer();
  const transferAction = useTransferAction();

  const warehouseOptions = warehouses?.data?.map(w => ({ value: w.id, label: w.name })) || [];
  const locationOptions = locations?.data?.map(l => ({ value: l.id, label: `${l.name} (${l.code})` })) || [];

  const fields = TRANSFER_FIELDS.map(f => {
    if (f.name === 'fromWarehouseId' || f.name === 'toWarehouseId') return { ...f, options: warehouseOptions };
    if (f.name === 'fromLocationId' || f.name === 'toLocationId') return { ...f, options: locationOptions };
    return f;
  });

  const columns: Column<Operation>[] = [
    {
      key: 'reference', header: 'Reference', width: '140px',
      cell: (op) => <span className="font-mono text-xs font-medium text-stone-700">{op.reference}</span>,
    },
    {
      key: 'from', header: 'From',
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
      cell: (op) => {
        if (op.status === 'DRAFT') return (
          <button onClick={() => transferAction.mutate({ id: op.id, action: 'start' })}
            className="text-xs px-2 py-1 bg-amber-50 text-amber-700 border border-amber-200 rounded-md hover:bg-amber-100">
            Start
          </button>
        );
        if (op.status === 'IN_PROGRESS') return (
          <button onClick={() => transferAction.mutate({ id: op.id, action: 'complete' })}
            className="text-xs px-2 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-md hover:bg-emerald-100">
            Complete
          </button>
        );
        return null;
      },
    },
  ];

  return (
    <div>
      <PageHeader
        title="Internal Transfers"
        description="Move stock between warehouses and locations"
        actions={
          <Button onClick={() => setCreateOpen(true)} icon={<svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4"/></svg>}>
            New transfer
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
          { key: 'status', label: 'Status', options: [
            { value: 'DRAFT', label: 'Draft' },
            { value: 'IN_PROGRESS', label: 'In Progress' },
            { value: 'COMPLETED', label: 'Completed' },
          ]},
        ]}
        onSearch={(s) => setParams(p => ({ ...p, search: s, page: 1 }))}
        onFilter={(k, v) => setParams(p => ({ ...p, filter: { ...p.filter, [k]: v }, page: 1 }))}
        onPageChange={(pg) => setParams(p => ({ ...p, page: pg }))}
        onSort={(key, order) => setParams(p => ({ ...p, sort: key, order }))}
        emptyMessage="No transfers yet."
      />
      <Modal open={createOpen} onClose={() => setCreateOpen(false)} title="New transfer" size="lg">
        <FormBuilder
          fields={fields}
          onSubmit={async (data) => { await createTransfer.mutateAsync(data); setCreateOpen(false); }}
          loading={createTransfer.isPending}
          submitLabel="Create transfer"
        />
      </Modal>
    </div>
  );
}
