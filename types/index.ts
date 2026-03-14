// ─── Auth ─────────────────────────────────────────────────────
export type Role = 'ADMIN' | 'INVENTORY_MANAGER' | 'WAREHOUSE_STAFF';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: Role;
  isActive: boolean;
  createdAt: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  user: User;
}

// ─── Products ─────────────────────────────────────────────────
export interface Category {
  id: string;
  name: string;
}

export interface Product {
  id: string;
  sku: string;
  name: string;
  description?: string;
  unit: string;
  reorderLevel: number;
  category?: Category;
  totalStock: number;
  createdAt: string;
  deletedAt?: string;
}

// ─── Warehouse ────────────────────────────────────────────────
export interface Warehouse {
  id: string;
  name: string;
  code: string;
  address?: string;
  city?: string;
  isActive: boolean;
  locationCount: number;
  productCount: number;
  createdAt: string;
}

export interface Location {
  id: string;
  warehouseId: string;
  warehouse?: Warehouse;
  name: string;
  code: string;
  type: 'RACK' | 'SHELF' | 'BIN' | 'ZONE';
  createdAt: string;
}

// ─── Suppliers ────────────────────────────────────────────────
export interface Supplier {
  id: string;
  name: string;
  code: string;
  email?: string;
  phone?: string;
  address?: string;
  isActive: boolean;
  createdAt: string;
}

// ─── Inventory ────────────────────────────────────────────────
export type MovementType = 'RECEIPT' | 'DELIVERY' | 'TRANSFER_IN' | 'TRANSFER_OUT' | 'ADJUSTMENT';

export interface StockBalance {
  productId: string;
  product: Product;
  locationId: string;
  location: Location;
  warehouseId: string;
  warehouse: Warehouse;
  quantity: number;
}

export interface StockMovement {
  id: string;
  productId: string;
  product: Product;
  warehouseId: string;
  locationId: string;
  quantity: number;
  type: MovementType;
  referenceId: string;
  createdBy: string;
  createdAt: string;
}

// ─── Operations ───────────────────────────────────────────────
export type OperationType = 'RECEIPT' | 'DELIVERY' | 'TRANSFER' | 'ADJUSTMENT';
export type OperationStatus =
  | 'DRAFT' | 'CONFIRMED' | 'PICKING' | 'PACKED'
  | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED' | 'RECEIVED' | 'SHIPPED';

export interface OperationLine {
  id: string;
  productId: string;
  product: Product;
  locationId: string;
  location: Location;
  quantityDemand: number;
  quantityDone: number;
}

export interface Operation {
  id: string;
  reference: string;
  type: OperationType;
  status: OperationStatus;
  warehouseId: string;
  warehouse: Warehouse;
  supplierId?: string;
  supplier?: Supplier;
  scheduledDate?: string;
  completedAt?: string;
  notes?: string;
  lines: OperationLine[];
  createdBy: string;
  createdAt: string;
}

// ─── Dashboard ────────────────────────────────────────────────
export interface DashboardKPIs {
  totalProducts: number;
  totalStock: number;
  lowStockCount: number;
  pendingReceipts: number;
  pendingDeliveries: number;
  transfersInProgress: number;
  recentMovements: StockMovement[];
  lowStockProducts: Product[];
}

// ─── API ──────────────────────────────────────────────────────
export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface ApiError {
  message: string;
  statusCode: number;
  error?: string;
}

export interface QueryParams {
  page?: number;
  limit?: number;
  search?: string;
  filter?: Record<string, string>;
  sort?: string;
  order?: 'asc' | 'desc';
}
