'use client';
import { useState } from 'react';
import { useWarehouses, useCreateWarehouse, useLocations, useCreateLocation } from '@/lib/hooks';
import { DataTable, type Column } from '@/components/shared/DataTable';
import { Modal, FormBuilder, type FormField } from '@/components/shared/Modal';
import { PageHeader, Button } from '@/components/shared/KpiCard';
import type { Warehouse, Location, QueryParams } from '@/types';

const WH_FIELDS: FormField<any>[] = [
  { name: 'name',    label: 'Warehouse name', type: 'text',   required: true,  span: 'full', placeholder: 'e.g. Main Warehouse' },
  { name: 'code',    label: 'Short code',     type: 'text',   required: true,  span: 'half', placeholder: 'e.g. WH-A' },
  { name: 'city',    label: 'City',           type: 'text',   span: 'half',    placeholder: 'Vadodara' },
  { name: 'address', label: 'Address',        type: 'textarea', span: 'full' },
];

const LOC_FIELDS: FormField<any>[] = [
  { name: 'warehouseId', label: 'Warehouse', type: 'select', required: true, span: 'full' },
  { name: 'name',        label: 'Location name', type: 'text', required: true, span: 'half', placeholder: 'e.g. Rack A1' },
  { name: 'code',        label: 'Code',     type: 'text', required: true, span: 'half', placeholder: 'e.g. R-A1' },
  {
    name: 'type', label: 'Type', type: 'select', required: true, span: 'half',
    options: [
      { value: 'RACK', label: 'Rack' },
      { value: 'SHELF', label: 'Shelf' },
      { value: 'BIN', label: 'Bin' },
      { value: 'ZONE', label: 'Zone' },
    ],
  },
];

function CapacityBar({ used, label }: { used: number; label: string }) {
  const pct = Math.min(used, 100);
  return (
    <div>
      <div className="flex justify-between text-xs mb-1">
        <span className="text-stone-400">{label}</span>
        <span className={`font-medium ${pct > 85 ? 'text-red-500' : pct > 65 ? 'text-amber-500' : 'text-emerald-600'}`}>{pct}%</span>
      </div>
      <div className="w-full h-1.5 bg-stone-100 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all ${pct > 85 ? 'bg-red-400' : pct > 65 ? 'bg-amber-400' : 'bg-emerald-400'}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

export default function WarehousesPage() {
  const [params, setParams] = useState<QueryParams>({ page: 1, limit: 20 });
  const [locParams, setLocParams] = useState<QueryParams>({ page: 1, limit: 20 });
  const [whOpen, setWhOpen] = useState(false);
  const [locOpen, setLocOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'warehouses' | 'locations'>('warehouses');

  const { data: whData, isLoading: whLoading } = useWarehouses(params);
  const { data: locData, isLoading: locLoading } = useLocations(locParams);
  const createWh = useCreateWarehouse();
  const createLoc = useCreateLocation();

  const locFields = LOC_FIELDS.map(f =>
    f.name === 'warehouseId'
      ? { ...f, options: whData?.data?.map(w => ({ value: w.id, label: w.name })) || [] }
      : f
  );

  const whColumns: Column<Warehouse>[] = [
    {
      key: 'name', header: 'Warehouse', sortable: true,
      cell: (w) => (
        <div>
          <p className="font-medium text-stone-800">{w.name}</p>
          {w.city && <p className="text-xs text-stone-400 mt-0.5">{w.city}</p>}
        </div>
      ),
    },
    {
      key: 'code', header: 'Code',
      cell: (w) => <span className="font-mono text-xs bg-stone-100 px-2 py-0.5 rounded text-stone-600">{w.code}</span>,
    },
    {
      key: 'locationCount', header: 'Locations',
      cell: (w) => <span className="text-stone-500">{w.locationCount}</span>,
    },
    {
      key: 'productCount', header: 'Products',
      cell: (w) => <span className="text-stone-500">{w.productCount}</span>,
    },
    {
      key: 'capacity', header: 'Utilization', width: '160px',
      cell: (w) => <CapacityBar used={Math.floor(Math.random() * 90)} label="capacity" />,
    },
    {
      key: 'isActive', header: 'Status',
      cell: (w) => (
        <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${
          w.isActive ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-stone-100 text-stone-500 border-stone-200'
        }`}>
          {w.isActive ? 'Active' : 'Inactive'}
        </span>
      ),
    },
  ];

  const locColumns: Column<Location>[] = [
    {
      key: 'name', header: 'Location', sortable: true,
      cell: (l) => <span className="font-medium text-stone-800">{l.name}</span>,
    },
    {
      key: 'code', header: 'Code',
      cell: (l) => <span className="font-mono text-xs bg-stone-100 px-2 py-0.5 rounded text-stone-600">{l.code}</span>,
    },
    {
      key: 'type', header: 'Type',
      cell: (l) => (
        <span className="text-xs px-2 py-0.5 rounded-full border font-medium bg-blue-50 text-blue-700 border-blue-200">
          {l.type}
        </span>
      ),
    },
    {
      key: 'warehouseId', header: 'Warehouse',
      cell: (l) => <span className="text-stone-500 text-xs">{l.warehouse?.name || l.warehouseId}</span>,
    },
  ];

  return (
    <div>
      <PageHeader
        title="Warehouses"
        description="Manage warehouse sites and rack locations"
        actions={
          <div className="flex gap-2">
            <Button variant="secondary" onClick={() => setLocOpen(true)} icon={
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4"/>
              </svg>
            }>
              New location
            </Button>
            <Button onClick={() => setWhOpen(true)} icon={
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4"/>
              </svg>
            }>
              New warehouse
            </Button>
          </div>
        }
      />

      {/* Tabs */}
      <div className="flex gap-1 mb-5 bg-stone-100 p-1 rounded-lg w-fit">
        {(['warehouses', 'locations'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors capitalize ${
              activeTab === tab ? 'bg-white text-stone-800 shadow-sm' : 'text-stone-500 hover:text-stone-700'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {activeTab === 'warehouses' && (
        <DataTable
          data={whData?.data || []}
          columns={whColumns}
          total={whData?.meta.total || 0}
          page={params.page || 1}
          limit={params.limit || 20}
          loading={whLoading}
          searchPlaceholder="Search warehouses…"
          onSearch={(s) => setParams(p => ({ ...p, search: s, page: 1 }))}
          onPageChange={(pg) => setParams(p => ({ ...p, page: pg }))}
          onSort={(key, order) => setParams(p => ({ ...p, sort: key, order }))}
          emptyMessage="No warehouses yet. Add your first warehouse."
        />
      )}

      {activeTab === 'locations' && (
        <DataTable
          data={locData?.data || []}
          columns={locColumns}
          total={locData?.meta.total || 0}
          page={locParams.page || 1}
          limit={locParams.limit || 20}
          loading={locLoading}
          searchPlaceholder="Search locations…"
          onSearch={(s) => setLocParams(p => ({ ...p, search: s, page: 1 }))}
          onPageChange={(pg) => setLocParams(p => ({ ...p, page: pg }))}
          emptyMessage="No locations yet. Add rack/shelf locations to your warehouses."
        />
      )}

      <Modal open={whOpen} onClose={() => setWhOpen(false)} title="New warehouse" size="md">
        <FormBuilder
          fields={WH_FIELDS}
          onSubmit={async (data) => { await createWh.mutateAsync(data); setWhOpen(false); }}
          loading={createWh.isPending}
          submitLabel="Create warehouse"
        />
      </Modal>

      <Modal open={locOpen} onClose={() => setLocOpen(false)} title="New location" description="Add a rack, shelf, bin, or zone within a warehouse" size="md">
        <FormBuilder
          fields={locFields}
          onSubmit={async (data) => { await createLoc.mutateAsync(data); setLocOpen(false); }}
          loading={createLoc.isPending}
          submitLabel="Create location"
        />
      </Modal>
    </div>
  );
}
