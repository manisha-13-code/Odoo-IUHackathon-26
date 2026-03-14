import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { QueryParams } from '@/types';
import {
  dashboardApi, productsApi, categoriesApi, warehousesApi,
  locationsApi, suppliersApi, receiptsApi, deliveriesApi,
  transfersApi, adjustmentsApi, inventoryApi,
} from '@/lib/api/client';

// ─── Keys ─────────────────────────────────────────────────────
export const QK = {
  dashboard: ['dashboard'] as const,
  products: (p?: QueryParams) => ['products', p] as const,
  product: (id: string) => ['products', id] as const,
  categories: ['categories'] as const,
  warehouses: (p?: QueryParams) => ['warehouses', p] as const,
  warehouse: (id: string) => ['warehouses', id] as const,
  locations: (p?: QueryParams) => ['locations', p] as const,
  suppliers: (p?: QueryParams) => ['suppliers', p] as const,
  receipts: (p?: QueryParams) => ['receipts', p] as const,
  deliveries: (p?: QueryParams) => ['deliveries', p] as const,
  transfers: (p?: QueryParams) => ['transfers', p] as const,
  adjustments: (p?: QueryParams) => ['adjustments', p] as const,
  stock: (p?: QueryParams) => ['inventory', 'stock', p] as const,
  ledger: (p?: QueryParams) => ['inventory', 'ledger', p] as const,
  lowStock: ['inventory', 'low-stock'] as const,
};

// ─── Dashboard ────────────────────────────────────────────────
export function useDashboard() {
  return useQuery({
    queryKey: QK.dashboard,
    queryFn: dashboardApi.getKPIs,
    refetchInterval: 30_000,
  });
}

// ─── Products ─────────────────────────────────────────────────
export function useProducts(params?: QueryParams) {
  return useQuery({
    queryKey: QK.products(params),
    queryFn: () => productsApi.list(params),
  });
}

export function useProduct(id: string) {
  return useQuery({
    queryKey: QK.product(id),
    queryFn: () => productsApi.get(id),
    enabled: !!id,
  });
}

export function useCategories() {
  return useQuery({
    queryKey: QK.categories,
    queryFn: categoriesApi.list,
  });
}

export function useCreateProduct() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: productsApi.create,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['products'] }),
  });
}

export function useUpdateProduct() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => productsApi.update(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['products'] }),
  });
}

export function useDeleteProduct() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: productsApi.delete,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['products'] }),
  });
}

// ─── Warehouses ───────────────────────────────────────────────
export function useWarehouses(params?: QueryParams) {
  return useQuery({
    queryKey: QK.warehouses(params),
    queryFn: () => warehousesApi.list(params),
  });
}

export function useWarehouse(id: string) {
  return useQuery({
    queryKey: QK.warehouse(id),
    queryFn: () => warehousesApi.get(id),
    enabled: !!id,
  });
}

export function useCreateWarehouse() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: warehousesApi.create,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['warehouses'] }),
  });
}

export function useLocations(params?: QueryParams) {
  return useQuery({
    queryKey: QK.locations(params),
    queryFn: () => locationsApi.list(params),
  });
}

export function useCreateLocation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: locationsApi.create,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['locations'] }),
  });
}

// ─── Suppliers ────────────────────────────────────────────────
export function useSuppliers(params?: QueryParams) {
  return useQuery({
    queryKey: QK.suppliers(params),
    queryFn: () => suppliersApi.list(params),
  });
}

export function useCreateSupplier() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: suppliersApi.create,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['suppliers'] }),
  });
}

export function useUpdateSupplier() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => suppliersApi.update(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['suppliers'] }),
  });
}

// ─── Operations ───────────────────────────────────────────────
export function useReceipts(params?: QueryParams) {
  return useQuery({
    queryKey: QK.receipts(params),
    queryFn: () => receiptsApi.list(params),
  });
}

export function useCreateReceipt() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: receiptsApi.create,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['receipts'] });
      qc.invalidateQueries({ queryKey: ['dashboard'] });
    },
  });
}

export function useReceiptAction() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, action }: { id: string; action: 'confirm' | 'validate' }) =>
      action === 'confirm' ? receiptsApi.confirm(id) : receiptsApi.validate(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['receipts'] });
      qc.invalidateQueries({ queryKey: ['dashboard'] });
      qc.invalidateQueries({ queryKey: ['inventory'] });
    },
  });
}

export function useDeliveries(params?: QueryParams) {
  return useQuery({
    queryKey: QK.deliveries(params),
    queryFn: () => deliveriesApi.list(params),
  });
}

export function useCreateDelivery() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: deliveriesApi.create,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['deliveries'] });
      qc.invalidateQueries({ queryKey: ['dashboard'] });
    },
  });
}

export function useDeliveryAction() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, action }: { id: string; action: 'pick' | 'pack' | 'ship' }) => {
      if (action === 'pick') return deliveriesApi.pick(id);
      if (action === 'pack') return deliveriesApi.pack(id);
      return deliveriesApi.ship(id);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['deliveries'] });
      qc.invalidateQueries({ queryKey: ['dashboard'] });
      qc.invalidateQueries({ queryKey: ['inventory'] });
    },
  });
}

export function useTransfers(params?: QueryParams) {
  return useQuery({
    queryKey: QK.transfers(params),
    queryFn: () => transfersApi.list(params),
  });
}

export function useCreateTransfer() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: transfersApi.create,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['transfers'] });
      qc.invalidateQueries({ queryKey: ['dashboard'] });
    },
  });
}

export function useTransferAction() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, action }: { id: string; action: 'start' | 'complete' }) =>
      action === 'start' ? transfersApi.start(id) : transfersApi.complete(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['transfers'] });
      qc.invalidateQueries({ queryKey: ['inventory'] });
    },
  });
}

export function useAdjustments(params?: QueryParams) {
  return useQuery({
    queryKey: QK.adjustments(params),
    queryFn: () => adjustmentsApi.list(params),
  });
}

export function useCreateAdjustment() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: adjustmentsApi.create,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['adjustments'] });
      qc.invalidateQueries({ queryKey: ['inventory'] });
    },
  });
}

// ─── Inventory ────────────────────────────────────────────────
export function useStock(params?: QueryParams) {
  return useQuery({
    queryKey: QK.stock(params),
    queryFn: () => inventoryApi.stock(params),
  });
}

export function useLedger(params?: QueryParams) {
  return useQuery({
    queryKey: QK.ledger(params),
    queryFn: () => inventoryApi.ledger(params),
  });
}

export function useLowStock() {
  return useQuery({
    queryKey: QK.lowStock,
    queryFn: inventoryApi.lowStock,
    refetchInterval: 60_000,
  });
}
