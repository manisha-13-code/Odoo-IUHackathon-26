// Mock API — no backend required
// Every function simulates a real API call with a small delay

import {
  MOCK_DASHBOARD, MOCK_PRODUCTS, MOCK_CATEGORIES, MOCK_WAREHOUSES,
  MOCK_LOCATIONS, MOCK_SUPPLIERS, MOCK_RECEIPTS, MOCK_DELIVERIES,
  MOCK_TRANSFERS, MOCK_ADJUSTMENTS, MOCK_MOVEMENTS, MOCK_STOCK_BALANCES,
  MOCK_USERS, paginate, filterBySearch,
} from './mock-data'
import type {
  AuthTokens, Product, Warehouse, Location, Supplier,
  Operation, OperationStatus, QueryParams,
} from '@/types'

// In-memory mutable state so creates/updates persist during the session
let products = [...MOCK_PRODUCTS]
let warehouses = [...MOCK_WAREHOUSES]
let locations = [...MOCK_LOCATIONS]
let suppliers = [...MOCK_SUPPLIERS]
let receipts = [...MOCK_RECEIPTS]
let deliveries = [...MOCK_DELIVERIES]
let transfers = [...MOCK_TRANSFERS]
let adjustments = [...MOCK_ADJUSTMENTS]

const delay = (ms = 400) => new Promise(r => setTimeout(r, ms))
let idCounter = 100

function makeId() { return `mock-${++idCounter}` }
function makeRef(prefix: string) { return `${prefix}-${String(Math.floor(Math.random() * 9000) + 1000)}` }

// ─── Token management (no-op in mock) ────────────────────────
export function setAccessToken(_token: string | null) {}
export function getAccessToken() { return 'mock-token' }

// ─── Auth ─────────────────────────────────────────────────────
export const authApi = {
  login: async (email: string, _password: string): Promise<AuthTokens> => {
    await delay(600)
    const user = MOCK_USERS.find(u => u.email === email) || MOCK_USERS[0]
    return { accessToken: 'mock-access', refreshToken: 'mock-refresh', user }
  },
  signup: async (data: any): Promise<AuthTokens> => {
    await delay(600)
    const user = { id: makeId(), ...data, role: 'INVENTORY_MANAGER' as const, isActive: true, createdAt: new Date().toISOString() }
    return { accessToken: 'mock-access', refreshToken: 'mock-refresh', user }
  },
  refresh: async (): Promise<AuthTokens> => {
    return { accessToken: 'mock-access', refreshToken: 'mock-refresh', user: MOCK_USERS[0] }
  },
  logout: async () => { await delay(200) },
  forgotPassword: async () => { await delay(400) },
  resetPassword: async () => { await delay(400) },
}

// ─── Dashboard ────────────────────────────────────────────────
export const dashboardApi = {
  getKPIs: async () => { await delay(300); return MOCK_DASHBOARD },
}

// ─── Products ─────────────────────────────────────────────────
export const productsApi = {
  list: async (params?: QueryParams) => {
    await delay(300)
    let items = [...products]
    if (params?.search) items = filterBySearch(items, params.search, ['name', 'sku'])
    if (params?.filter?.categoryId) items = items.filter(p => p.category?.id === params.filter!.categoryId)
    if (params?.filter?.status === 'low') items = items.filter(p => p.totalStock <= p.reorderLevel)
    if (params?.sort === 'name') items.sort((a, b) => a.name.localeCompare(b.name))
    if (params?.sort === 'totalStock') items.sort((a, b) => a.totalStock - b.totalStock)
    return paginate(items, params?.page, params?.limit)
  },
  get: async (id: string) => { await delay(200); return products.find(p => p.id === id)! },
  create: async (data: Partial<Product>) => {
    await delay(500)
    const item = { id: makeId(), totalStock: 0, createdAt: new Date().toISOString(), ...data } as Product
    products = [...products, item]
    return item
  },
  update: async (id: string, data: Partial<Product>) => {
    await delay(400)
    products = products.map(p => p.id === id ? { ...p, ...data } : p)
    return products.find(p => p.id === id)!
  },
  delete: async (id: string) => { await delay(400); products = products.filter(p => p.id !== id) },
  getMovements: async (_id: string, params?: QueryParams) => {
    await delay(300); return paginate(MOCK_MOVEMENTS, params?.page, params?.limit)
  },
}

export const categoriesApi = {
  list: async () => { await delay(200); return MOCK_CATEGORIES },
  create: async (name: string) => { await delay(300); return { id: makeId(), name } },
}

// ─── Warehouses ───────────────────────────────────────────────
export const warehousesApi = {
  list: async (params?: QueryParams) => {
    await delay(300)
    let items = [...warehouses]
    if (params?.search) items = filterBySearch(items, params.search, ['name', 'code', 'city'])
    return paginate(items, params?.page, params?.limit)
  },
  get: async (id: string) => { await delay(200); return warehouses.find(w => w.id === id)! },
  create: async (data: Partial<Warehouse>) => {
    await delay(500)
    const item = { id: makeId(), isActive: true, locationCount: 0, productCount: 0, createdAt: new Date().toISOString(), ...data } as Warehouse
    warehouses = [...warehouses, item]
    return item
  },
  update: async (id: string, data: Partial<Warehouse>) => {
    await delay(400)
    warehouses = warehouses.map(w => w.id === id ? { ...w, ...data } : w)
    return warehouses.find(w => w.id === id)!
  },
  getStock: async () => { await delay(300); return MOCK_STOCK_BALANCES },
}

export const locationsApi = {
  list: async (params?: QueryParams) => {
    await delay(300)
    let items = [...locations]
    if (params?.search) items = filterBySearch(items, params.search, ['name', 'code'])
    if (params?.filter?.warehouseId) items = items.filter(l => l.warehouseId === params.filter!.warehouseId)
    return paginate(items, params?.page, params?.limit)
  },
  create: async (data: Partial<Location>) => {
    await delay(500)
    const wh = warehouses.find(w => w.id === data.warehouseId)
    const item = { id: makeId(), createdAt: new Date().toISOString(), warehouse: wh, ...data } as Location
    locations = [...locations, item]
    return item
  },
}

// ─── Suppliers ────────────────────────────────────────────────
export const suppliersApi = {
  list: async (params?: QueryParams) => {
    await delay(300)
    let items = [...suppliers]
    if (params?.search) items = filterBySearch(items, params.search, ['name', 'code', 'email'])
    if (params?.filter?.isActive === 'true') items = items.filter(s => s.isActive)
    if (params?.filter?.isActive === 'false') items = items.filter(s => !s.isActive)
    return paginate(items, params?.page, params?.limit)
  },
  create: async (data: Partial<Supplier>) => {
    await delay(500)
    const item = { id: makeId(), isActive: true, createdAt: new Date().toISOString(), ...data } as Supplier
    suppliers = [...suppliers, item]
    return item
  },
  update: async (id: string, data: Partial<Supplier>) => {
    await delay(400)
    suppliers = suppliers.map(s => s.id === id ? { ...s, ...data } : s)
    return suppliers.find(s => s.id === id)!
  },
}

// ─── Operations helpers ───────────────────────────────────────
function enrichOp(op: Operation): Operation {
  return {
    ...op,
    warehouse: warehouses.find(w => w.id === op.warehouseId) || op.warehouse,
    supplier: op.supplierId ? suppliers.find(s => s.id === op.supplierId) || op.supplier : undefined,
  }
}

function advanceStatus(current: OperationStatus, action: string): OperationStatus {
  const map: Record<string, OperationStatus> = {
    confirm: 'CONFIRMED', validate: 'RECEIVED',
    pick: 'PICKING', pack: 'PACKED', ship: 'SHIPPED',
    start: 'IN_PROGRESS', complete: 'COMPLETED',
  }
  return map[action] || current
}

// ─── Receipts ─────────────────────────────────────────────────
export const receiptsApi = {
  list: async (params?: QueryParams) => {
    await delay(300)
    let items = receipts.map(enrichOp)
    if (params?.search) items = filterBySearch(items, params.search, ['reference'])
    if (params?.filter?.status) items = items.filter(o => o.status === params.filter!.status)
    return paginate(items, params?.page, params?.limit)
  },
  create: async (data: any) => {
    await delay(500)
    const op: Operation = {
      id: makeId(), reference: makeRef('REC'), type: 'RECEIPT', status: 'DRAFT',
      warehouseId: data.warehouseId, warehouse: warehouses.find(w => w.id === data.warehouseId)!,
      supplierId: data.supplierId, supplier: suppliers.find(s => s.id === data.supplierId),
      scheduledDate: data.scheduledDate, notes: data.notes, lines: [],
      createdBy: 'u1', createdAt: new Date().toISOString(),
    }
    receipts = [...receipts, op]
    return op
  },
  confirm: async (id: string) => {
    await delay(400)
    receipts = receipts.map(r => r.id === id ? { ...r, status: 'CONFIRMED' as OperationStatus } : r)
    return enrichOp(receipts.find(r => r.id === id)!)
  },
  validate: async (id: string) => {
    await delay(400)
    receipts = receipts.map(r => r.id === id ? { ...r, status: 'RECEIVED' as OperationStatus, completedAt: new Date().toISOString() } : r)
    return enrichOp(receipts.find(r => r.id === id)!)
  },
}

// ─── Deliveries ───────────────────────────────────────────────
export const deliveriesApi = {
  list: async (params?: QueryParams) => {
    await delay(300)
    let items = deliveries.map(enrichOp)
    if (params?.search) items = filterBySearch(items, params.search, ['reference'])
    if (params?.filter?.status) items = items.filter(o => o.status === params.filter!.status)
    return paginate(items, params?.page, params?.limit)
  },
  create: async (data: any) => {
    await delay(500)
    const op: Operation = {
      id: makeId(), reference: makeRef('DEL'), type: 'DELIVERY', status: 'DRAFT',
      warehouseId: data.warehouseId, warehouse: warehouses.find(w => w.id === data.warehouseId)!,
      scheduledDate: data.scheduledDate, notes: data.notes, lines: [],
      createdBy: 'u1', createdAt: new Date().toISOString(),
    }
    deliveries = [...deliveries, op]
    return op
  },
  pick: async (id: string) => {
    await delay(400)
    deliveries = deliveries.map(d => d.id === id ? { ...d, status: 'PICKING' as OperationStatus } : d)
    return enrichOp(deliveries.find(d => d.id === id)!)
  },
  pack: async (id: string) => {
    await delay(400)
    deliveries = deliveries.map(d => d.id === id ? { ...d, status: 'PACKED' as OperationStatus } : d)
    return enrichOp(deliveries.find(d => d.id === id)!)
  },
  ship: async (id: string) => {
    await delay(400)
    deliveries = deliveries.map(d => d.id === id ? { ...d, status: 'SHIPPED' as OperationStatus, completedAt: new Date().toISOString() } : d)
    return enrichOp(deliveries.find(d => d.id === id)!)
  },
}

// ─── Transfers ────────────────────────────────────────────────
export const transfersApi = {
  list: async (params?: QueryParams) => {
    await delay(300)
    let items = transfers.map(enrichOp)
    if (params?.search) items = filterBySearch(items, params.search, ['reference'])
    if (params?.filter?.status) items = items.filter(o => o.status === params.filter!.status)
    return paginate(items, params?.page, params?.limit)
  },
  create: async (data: any) => {
    await delay(500)
    const op: Operation = {
      id: makeId(), reference: makeRef('TRF'), type: 'TRANSFER', status: 'DRAFT',
      warehouseId: data.fromWarehouseId, warehouse: warehouses.find(w => w.id === data.fromWarehouseId)!,
      scheduledDate: data.scheduledDate, notes: data.notes, lines: [],
      createdBy: 'u1', createdAt: new Date().toISOString(),
    }
    transfers = [...transfers, op]
    return op
  },
  start: async (id: string) => {
    await delay(400)
    transfers = transfers.map(t => t.id === id ? { ...t, status: 'IN_PROGRESS' as OperationStatus } : t)
    return enrichOp(transfers.find(t => t.id === id)!)
  },
  complete: async (id: string) => {
    await delay(400)
    transfers = transfers.map(t => t.id === id ? { ...t, status: 'COMPLETED' as OperationStatus, completedAt: new Date().toISOString() } : t)
    return enrichOp(transfers.find(t => t.id === id)!)
  },
}

// ─── Adjustments ─────────────────────────────────────────────
export const adjustmentsApi = {
  list: async (params?: QueryParams) => {
    await delay(300)
    let items = adjustments.map(enrichOp)
    if (params?.search) items = filterBySearch(items, params.search, ['reference'])
    if (params?.filter?.status) items = items.filter(o => o.status === params.filter!.status)
    return paginate(items, params?.page, params?.limit)
  },
  create: async (data: any) => {
    await delay(500)
    const product = products.find(p => p.id === data.productId)
    const location = locations.find(l => l.id === data.locationId)
    const op: Operation = {
      id: makeId(), reference: makeRef('ADJ'), type: 'ADJUSTMENT', status: 'COMPLETED',
      warehouseId: data.warehouseId, warehouse: warehouses.find(w => w.id === data.warehouseId)!,
      notes: data.notes,
      lines: [{
        id: makeId(), productId: data.productId, product: product!,
        locationId: data.locationId, location: location!,
        quantityDemand: Number(data.systemQty), quantityDone: Number(data.physicalQty),
      }],
      createdBy: 'u1', createdAt: new Date().toISOString(), completedAt: new Date().toISOString(),
    }
    adjustments = [...adjustments, op]
    // update product stock
    if (product) {
      const delta = Number(data.physicalQty) - Number(data.systemQty)
      products = products.map(p => p.id === data.productId ? { ...p, totalStock: Math.max(0, p.totalStock + delta) } : p)
    }
    return op
  },
}

// ─── Inventory ────────────────────────────────────────────────
export const inventoryApi = {
  stock: async (params?: QueryParams) => {
    await delay(300); return paginate(MOCK_STOCK_BALANCES, params?.page, params?.limit)
  },
  ledger: async (params?: QueryParams) => {
    await delay(300); return paginate(MOCK_MOVEMENTS, params?.page, params?.limit)
  },
  lowStock: async () => {
    await delay(200); return products.filter(p => p.totalStock <= p.reorderLevel)
  },
}

// ─── operationsApi (generic) ──────────────────────────────────
export const operationsApi = {
  list: async (params?: QueryParams) => {
    await delay(300)
    const all = [...receipts, ...deliveries, ...transfers, ...adjustments].map(enrichOp)
    return paginate(all, params?.page, params?.limit)
  },
  get: async (id: string) => {
    await delay(200)
    const all = [...receipts, ...deliveries, ...transfers, ...adjustments]
    return enrichOp(all.find(o => o.id === id)!)
  },
}
