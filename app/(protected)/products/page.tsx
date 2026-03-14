'use client';
import { useState } from 'react';
import { useProducts, useCategories, useCreateProduct, useDeleteProduct } from '@/lib/hooks';
import { DataTable, type Column } from '@/components/shared/DataTable';
import { Modal, FormBuilder, ConfirmDialog, type FormField } from '@/components/shared/Modal';
import { PageHeader, Button } from '@/components/shared/KpiCard';
import { StatusBadge } from '@/components/shared/StatusBadge';
import type { Product, QueryParams } from '@/types';

const PRODUCT_FIELDS: FormField<any>[] = [
  { name: 'name',         label: 'Product name', type: 'text',   required: true,  placeholder: 'e.g. Bolt M8×20', span: 'full' },
  { name: 'sku',          label: 'SKU',           type: 'text',   required: true,  placeholder: 'e.g. SKU-00212', span: 'half' },
  { name: 'unit',         label: 'Unit',          type: 'text',   required: true,  placeholder: 'e.g. pcs, kg, box', span: 'half' },
  { name: 'categoryId',   label: 'Category',      type: 'select', span: 'half' },
  { name: 'reorderLevel', label: 'Reorder level', type: 'number', span: 'half',   placeholder: '10' },
  { name: 'description',  label: 'Description',   type: 'textarea', span: 'full' },
];

export default function ProductsPage() {
  const [params, setParams] = useState<QueryParams>({ page: 1, limit: 20, filter: {} });
  const [createOpen, setCreateOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const { data, isLoading } = useProducts(params);
  const { data: categories } = useCategories();
  const createProduct = useCreateProduct();
  const deleteProduct = useDeleteProduct();

  const fields = PRODUCT_FIELDS.map(f =>
    f.name === 'categoryId'
      ? { ...f, options: categories?.map(c => ({ value: c.id, label: c.name })) || [] }
      : f
  );

  const columns: Column<Product>[] = [
    {
      key: 'sku', header: 'SKU', sortable: true, width: '140px',
      cell: (p) => <span className="font-mono text-xs text-stone-500">{p.sku}</span>,
    },
    {
      key: 'name', header: 'Product', sortable: true,
      cell: (p) => (
        <div>
          <p className="font-medium text-stone-800">{p.name}</p>
          {p.category && <p className="text-xs text-stone-400 mt-0.5">{p.category.name}</p>}
        </div>
      ),
    },
    { key: 'unit', header: 'Unit', cell: (p) => <span className="text-stone-500">{p.unit}</span> },
    {
      key: 'totalStock', header: 'On hand', sortable: true,
      cell: (p) => (
        <span className={`font-semibold ${p.totalStock <= p.reorderLevel ? 'text-red-600' : 'text-stone-800'}`}>
          {p.totalStock.toLocaleString()}
        </span>
      ),
    },
    { key: 'reorderLevel', header: 'Reorder pt.', cell: (p) => <span className="text-stone-500">{p.reorderLevel}</span> },
    {
      key: 'status', header: 'Status',
      cell: (p) => <StatusBadge status={p.totalStock <= p.reorderLevel ? 'LOW' : 'OK'} />,
    },
    {
      key: 'actions', header: '', width: '80px',
      cell: (p) => (
        <div className="flex items-center gap-1">
          <button className="p-1.5 text-stone-400 hover:text-stone-600 hover:bg-stone-100 rounded-md transition-colors">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
            </svg>
          </button>
          <button
            onClick={() => setDeleteId(p.id)}
            className="p-1.5 text-stone-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-colors"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
            </svg>
          </button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        title="Products"
        description="Manage your product catalogue"
        actions={
          <Button onClick={() => setCreateOpen(true)} icon={
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4"/>
            </svg>
          }>
            New product
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
        searchPlaceholder="Search by name or SKU…"
        filters={[
          {
            key: 'status', label: 'Stock status',
            options: [{ value: 'low', label: 'Low stock' }, { value: 'ok', label: 'OK' }],
          },
          {
            key: 'categoryId', label: 'Category',
            options: categories?.map(c => ({ value: c.id, label: c.name })) || [],
          },
        ]}
        onSearch={(s) => setParams(p => ({ ...p, search: s, page: 1 }))}
        onFilter={(k, v) => setParams(p => ({ ...p, filter: { ...p.filter, [k]: v }, page: 1 }))}
        onPageChange={(pg) => setParams(p => ({ ...p, page: pg }))}
        onSort={(key, order) => setParams(p => ({ ...p, sort: key, order }))}
        emptyMessage="No products found. Add your first product to get started."
      />

      {/* Create Modal */}
      <Modal open={createOpen} onClose={() => setCreateOpen(false)} title="New product" description="Add a new product to the catalogue" size="lg">
        <FormBuilder
          fields={fields}
          onSubmit={async (data) => {
            await createProduct.mutateAsync(data);
            setCreateOpen(false);
          }}
          loading={createProduct.isPending}
          submitLabel="Create product"
        />
      </Modal>

      {/* Delete Confirm */}
      <ConfirmDialog
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={async () => {
          if (deleteId) {
            await deleteProduct.mutateAsync(deleteId);
            setDeleteId(null);
          }
        }}
        title="Delete product"
        message="This will soft-delete the product. It can be restored from the database. Continue?"
        confirmLabel="Delete"
        danger
        loading={deleteProduct.isPending}
      />
    </div>
  );
}
