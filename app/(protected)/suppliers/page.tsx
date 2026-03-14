'use client';
import { useState } from 'react';
import { useSuppliers, useCreateSupplier, useUpdateSupplier } from '@/lib/hooks';
import { DataTable, type Column } from '@/components/shared/DataTable';
import { Modal, FormBuilder, type FormField } from '@/components/shared/Modal';
import { PageHeader, Button } from '@/components/shared/KpiCard';
import type { Supplier, QueryParams } from '@/types';

const SUPPLIER_FIELDS: FormField<any>[] = [
  { name: 'name',    label: 'Supplier name', type: 'text',    required: true, span: 'full', placeholder: 'e.g. Asha Traders' },
  { name: 'code',    label: 'Code',          type: 'text',    required: true, span: 'half', placeholder: 'e.g. SUP-001' },
  { name: 'email',   label: 'Email',         type: 'email',   span: 'half',   placeholder: 'contact@supplier.com' },
  { name: 'phone',   label: 'Phone',         type: 'text',    span: 'half',   placeholder: '+91 98765 43210' },
  { name: 'address', label: 'Address',       type: 'textarea', span: 'full' },
];

export default function SuppliersPage() {
  const [params, setParams] = useState<QueryParams>({ page: 1, limit: 20 });
  const [createOpen, setCreateOpen] = useState(false);
  const [editSupplier, setEditSupplier] = useState<Supplier | null>(null);

  const { data, isLoading } = useSuppliers(params);
  const createSupplier = useCreateSupplier();
  const updateSupplier = useUpdateSupplier();

  const columns: Column<Supplier>[] = [
    {
      key: 'name', header: 'Supplier', sortable: true,
      cell: (s) => (
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-full bg-[#E6F1FB] flex items-center justify-center shrink-0">
            <span className="text-xs font-bold text-[#185FA5]">{s.name.charAt(0)}</span>
          </div>
          <div>
            <p className="font-medium text-stone-800">{s.name}</p>
            <p className="text-xs text-stone-400 font-mono">{s.code}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'email', header: 'Email',
      cell: (s) => s.email
        ? <a href={`mailto:${s.email}`} className="text-[#185FA5] text-sm hover:underline">{s.email}</a>
        : <span className="text-stone-300">—</span>,
    },
    {
      key: 'phone', header: 'Phone',
      cell: (s) => <span className="text-stone-500 text-sm">{s.phone || '—'}</span>,
    },
    {
      key: 'isActive', header: 'Status',
      cell: (s) => (
        <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${
          s.isActive ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-stone-100 text-stone-500 border-stone-200'
        }`}>
          {s.isActive ? 'Active' : 'Inactive'}
        </span>
      ),
    },
    {
      key: 'createdAt', header: 'Added', sortable: true,
      cell: (s) => <span className="text-xs text-stone-400">{new Date(s.createdAt).toLocaleDateString('en-IN')}</span>,
    },
    {
      key: 'actions', header: '', width: '60px',
      cell: (s) => (
        <button
          onClick={() => setEditSupplier(s)}
          className="p-1.5 text-stone-400 hover:text-stone-600 hover:bg-stone-100 rounded-md transition-colors"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
          </svg>
        </button>
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        title="Suppliers"
        description="Manage your supplier directory"
        actions={
          <Button onClick={() => setCreateOpen(true)} icon={
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4"/>
            </svg>
          }>
            New supplier
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
        searchPlaceholder="Search by name or code…"
        filters={[
          {
            key: 'isActive', label: 'Status',
            options: [{ value: 'true', label: 'Active' }, { value: 'false', label: 'Inactive' }],
          },
        ]}
        onSearch={(s) => setParams(p => ({ ...p, search: s, page: 1 }))}
        onFilter={(k, v) => setParams(p => ({ ...p, filter: { ...p.filter, [k]: v }, page: 1 }))}
        onPageChange={(pg) => setParams(p => ({ ...p, page: pg }))}
        onSort={(key, order) => setParams(p => ({ ...p, sort: key, order }))}
        emptyMessage="No suppliers yet. Add your first supplier."
      />

      <Modal open={createOpen} onClose={() => setCreateOpen(false)} title="New supplier" size="md">
        <FormBuilder
          fields={SUPPLIER_FIELDS}
          onSubmit={async (data) => { await createSupplier.mutateAsync(data); setCreateOpen(false); }}
          loading={createSupplier.isPending}
          submitLabel="Create supplier"
        />
      </Modal>

      <Modal
        open={!!editSupplier}
        onClose={() => setEditSupplier(null)}
        title="Edit supplier"
        size="md"
      >
        {editSupplier && (
          <FormBuilder
            fields={SUPPLIER_FIELDS}
            defaultValues={editSupplier}
            onSubmit={async (data) => {
              await updateSupplier.mutateAsync({ id: editSupplier.id, data });
              setEditSupplier(null);
            }}
            loading={updateSupplier.isPending}
            submitLabel="Save changes"
          />
        )}
      </Modal>
    </div>
  );
}
