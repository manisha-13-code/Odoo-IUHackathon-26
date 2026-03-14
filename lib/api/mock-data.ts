import type {
  User, Product, Category, Warehouse, Location,
  Supplier, Operation, StockMovement, DashboardKPIs, StockBalance,
} from '@/types'

// ─── Users ───────────────────────────────────────────────────
export const MOCK_USERS: User[] = [
  { id: 'u1', email: 'admin@coreinventory.com', firstName: 'Achman', lastName: 'Maheshwari', role: 'ADMIN', isActive: true, createdAt: '2024-01-10T00:00:00Z' },
  { id: 'u2', email: 'priya@coreinventory.com', firstName: 'Priya', lastName: 'Patel', role: 'INVENTORY_MANAGER', isActive: true, createdAt: '2024-01-15T00:00:00Z' },
  { id: 'u3', email: 'vikram@coreinventory.com', firstName: 'Vikram', lastName: 'Singh', role: 'WAREHOUSE_STAFF', isActive: true, createdAt: '2024-02-01T00:00:00Z' },
]

// ─── Categories ───────────────────────────────────────────────
export const MOCK_CATEGORIES: Category[] = [
  { id: 'cat1', name: 'Fasteners' },
  { id: 'cat2', name: 'Pipes & Fittings' },
  { id: 'cat3', name: 'Electrical' },
  { id: 'cat4', name: 'Safety' },
  { id: 'cat5', name: 'Tools' },
  { id: 'cat6', name: 'Filtration' },
  { id: 'cat7', name: 'Consumables' },
]

// ─── Warehouses ───────────────────────────────────────────────
export const MOCK_WAREHOUSES: Warehouse[] = [
  { id: 'wh1', name: 'Warehouse A — Main', code: 'WH-A', address: 'GIDC Estate, Makarpura', city: 'Vadodara', isActive: true, locationCount: 6, productCount: 187, createdAt: '2024-01-01T00:00:00Z' },
  { id: 'wh2', name: 'Warehouse B — Secondary', code: 'WH-B', address: 'Sachin GIDC', city: 'Surat', isActive: true, locationCount: 4, productCount: 61, createdAt: '2024-01-01T00:00:00Z' },
]

// ─── Locations ────────────────────────────────────────────────
export const MOCK_LOCATIONS: Location[] = [
  { id: 'loc1', warehouseId: 'wh1', warehouse: MOCK_WAREHOUSES[0], name: 'Rack A1', code: 'R-A1', type: 'RACK', createdAt: '2024-01-01T00:00:00Z' },
  { id: 'loc2', warehouseId: 'wh1', warehouse: MOCK_WAREHOUSES[0], name: 'Rack A2', code: 'R-A2', type: 'RACK', createdAt: '2024-01-01T00:00:00Z' },
  { id: 'loc3', warehouseId: 'wh1', warehouse: MOCK_WAREHOUSES[0], name: 'Rack B1', code: 'R-B1', type: 'RACK', createdAt: '2024-01-01T00:00:00Z' },
  { id: 'loc4', warehouseId: 'wh1', warehouse: MOCK_WAREHOUSES[0], name: 'Shelf S1', code: 'S-S1', type: 'SHELF', createdAt: '2024-01-01T00:00:00Z' },
  { id: 'loc5', warehouseId: 'wh2', warehouse: MOCK_WAREHOUSES[1], name: 'Rack C1', code: 'R-C1', type: 'RACK', createdAt: '2024-01-01T00:00:00Z' },
  { id: 'loc6', warehouseId: 'wh2', warehouse: MOCK_WAREHOUSES[1], name: 'Rack C2', code: 'R-C2', type: 'RACK', createdAt: '2024-01-01T00:00:00Z' },
]

// ─── Suppliers ────────────────────────────────────────────────
export const MOCK_SUPPLIERS: Supplier[] = [
  { id: 'sup1', name: 'Asha Traders', code: 'SUP-001', email: 'contact@ashatraders.com', phone: '+91 98765 43210', address: 'Ring Road, Vadodara', isActive: true, createdAt: '2024-01-05T00:00:00Z' },
  { id: 'sup2', name: 'Global Supplies Pvt Ltd', code: 'SUP-002', email: 'orders@globalsupplies.in', phone: '+91 87654 32109', address: 'GIDC, Ankleshwar', isActive: true, createdAt: '2024-01-08T00:00:00Z' },
  { id: 'sup3', name: 'Bharat Parts & Tools', code: 'SUP-003', email: 'sales@bharatparts.com', phone: '+91 76543 21098', address: 'Industrial Estate, Pune', isActive: true, createdAt: '2024-02-01T00:00:00Z' },
  { id: 'sup4', name: 'Sunrise Components', code: 'SUP-004', email: 'info@sunrisecomp.in', phone: '+91 65432 10987', address: 'Surat GIDC', isActive: false, createdAt: '2024-02-15T00:00:00Z' },
]

// ─── Products ─────────────────────────────────────────────────
export const MOCK_PRODUCTS: Product[] = [
  { id: 'p1',  sku: 'SKU-00212', name: 'Bolt M8×20',         unit: 'pcs',   reorderLevel: 50,  category: MOCK_CATEGORIES[0], totalStock: 3,   createdAt: '2024-01-10T00:00:00Z' },
  { id: 'p2',  sku: 'SKU-00087', name: 'Filter Cartridge',   unit: 'pcs',   reorderLevel: 10,  category: MOCK_CATEGORIES[5], totalStock: 1,   createdAt: '2024-01-10T00:00:00Z' },
  { id: 'p3',  sku: 'SKU-00045', name: 'Steel Pipe 2m',      unit: 'pcs',   reorderLevel: 20,  category: MOCK_CATEGORIES[1], totalStock: 124, createdAt: '2024-01-12T00:00:00Z' },
  { id: 'p4',  sku: 'SKU-00301', name: 'Safety Gloves L',    unit: 'pairs', reorderLevel: 20,  category: MOCK_CATEGORIES[3], totalStock: 6,   createdAt: '2024-01-14T00:00:00Z' },
  { id: 'p5',  sku: 'SKU-00198', name: 'Cable Ties 100pc',   unit: 'box',   reorderLevel: 15,  category: MOCK_CATEGORIES[2], totalStock: 10,  createdAt: '2024-01-15T00:00:00Z' },
  { id: 'p6',  sku: 'SKU-00154', name: 'Sealing Tape 50m',   unit: 'roll',  reorderLevel: 25,  category: MOCK_CATEGORIES[6], totalStock: 8,   createdAt: '2024-01-16T00:00:00Z' },
  { id: 'p7',  sku: 'SKU-00077', name: 'Hex Wrench Set',     unit: 'set',   reorderLevel: 10,  category: MOCK_CATEGORIES[4], totalStock: 42,  createdAt: '2024-01-18T00:00:00Z' },
  { id: 'p8',  sku: 'SKU-00133', name: 'PVC Elbow 90°',      unit: 'pcs',   reorderLevel: 30,  category: MOCK_CATEGORIES[1], totalStock: 95,  createdAt: '2024-01-20T00:00:00Z' },
  { id: 'p9',  sku: 'SKU-00290', name: 'Wire 2.5mm 100m',    unit: 'coil',  reorderLevel: 5,   category: MOCK_CATEGORIES[2], totalStock: 18,  createdAt: '2024-02-01T00:00:00Z' },
  { id: 'p10', sku: 'SKU-00341', name: 'Nut M10',            unit: 'pcs',   reorderLevel: 100, category: MOCK_CATEGORIES[0], totalStock: 450, createdAt: '2024-02-05T00:00:00Z' },
  { id: 'p11', sku: 'SKU-00402', name: 'Hard Hat Yellow',    unit: 'pcs',   reorderLevel: 10,  category: MOCK_CATEGORIES[3], totalStock: 22,  createdAt: '2024-02-10T00:00:00Z' },
  { id: 'p12', sku: 'SKU-00055', name: 'Grease Tube 500g',   unit: 'pcs',   reorderLevel: 20,  category: MOCK_CATEGORIES[6], totalStock: 37,  createdAt: '2024-02-12T00:00:00Z' },
]

// ─── Operations (Receipts) ────────────────────────────────────
export const MOCK_RECEIPTS: Operation[] = [
  {
    id: 'rec1', reference: 'REC-0041', type: 'RECEIPT', status: 'DRAFT',
    warehouseId: 'wh1', warehouse: MOCK_WAREHOUSES[0],
    supplierId: 'sup1', supplier: MOCK_SUPPLIERS[0],
    scheduledDate: '2026-03-14T00:00:00Z', notes: 'Urgent restock for fasteners',
    lines: [
      { id: 'rl1', productId: 'p1', product: MOCK_PRODUCTS[0], locationId: 'loc1', location: MOCK_LOCATIONS[0], quantityDemand: 200, quantityDone: 0 },
      { id: 'rl2', productId: 'p10', product: MOCK_PRODUCTS[9], locationId: 'loc1', location: MOCK_LOCATIONS[0], quantityDemand: 500, quantityDone: 0 },
    ],
    createdBy: 'u1', createdAt: '2026-03-12T10:00:00Z',
  },
  {
    id: 'rec2', reference: 'REC-0040', type: 'RECEIPT', status: 'CONFIRMED',
    warehouseId: 'wh1', warehouse: MOCK_WAREHOUSES[0],
    supplierId: 'sup2', supplier: MOCK_SUPPLIERS[1],
    scheduledDate: '2026-03-13T00:00:00Z',
    lines: [
      { id: 'rl3', productId: 'p3', product: MOCK_PRODUCTS[2], locationId: 'loc2', location: MOCK_LOCATIONS[1], quantityDemand: 40, quantityDone: 0 },
    ],
    createdBy: 'u2', createdAt: '2026-03-11T09:00:00Z',
  },
  {
    id: 'rec3', reference: 'REC-0039', type: 'RECEIPT', status: 'RECEIVED',
    warehouseId: 'wh2', warehouse: MOCK_WAREHOUSES[1],
    supplierId: 'sup3', supplier: MOCK_SUPPLIERS[2],
    scheduledDate: '2026-03-12T00:00:00Z',
    lines: [
      { id: 'rl4', productId: 'p7', product: MOCK_PRODUCTS[6], locationId: 'loc5', location: MOCK_LOCATIONS[4], quantityDemand: 20, quantityDone: 20 },
      { id: 'rl5', productId: 'p11', product: MOCK_PRODUCTS[10], locationId: 'loc5', location: MOCK_LOCATIONS[4], quantityDemand: 10, quantityDone: 10 },
    ],
    createdBy: 'u1', createdAt: '2026-03-10T08:00:00Z', completedAt: '2026-03-12T14:00:00Z',
  },
  {
    id: 'rec4', reference: 'REC-0038', type: 'RECEIPT', status: 'RECEIVED',
    warehouseId: 'wh1', warehouse: MOCK_WAREHOUSES[0],
    supplierId: 'sup1', supplier: MOCK_SUPPLIERS[0],
    scheduledDate: '2026-03-11T00:00:00Z',
    lines: [
      { id: 'rl6', productId: 'p8', product: MOCK_PRODUCTS[7], locationId: 'loc3', location: MOCK_LOCATIONS[2], quantityDemand: 50, quantityDone: 50 },
    ],
    createdBy: 'u2', createdAt: '2026-03-09T11:00:00Z', completedAt: '2026-03-11T16:00:00Z',
  },
]

// ─── Deliveries ───────────────────────────────────────────────
export const MOCK_DELIVERIES: Operation[] = [
  {
    id: 'del1', reference: 'DEL-0022', type: 'DELIVERY', status: 'CONFIRMED',
    warehouseId: 'wh1', warehouse: MOCK_WAREHOUSES[0],
    scheduledDate: '2026-03-14T00:00:00Z', notes: 'Metro Infra Ltd — Site delivery',
    lines: [
      { id: 'dl1', productId: 'p3', product: MOCK_PRODUCTS[2], locationId: 'loc2', location: MOCK_LOCATIONS[1], quantityDemand: 10, quantityDone: 0 },
      { id: 'dl2', productId: 'p8', product: MOCK_PRODUCTS[7], locationId: 'loc2', location: MOCK_LOCATIONS[1], quantityDemand: 20, quantityDone: 0 },
    ],
    createdBy: 'u1', createdAt: '2026-03-12T14:00:00Z',
  },
  {
    id: 'del2', reference: 'DEL-0021', type: 'DELIVERY', status: 'PICKING',
    warehouseId: 'wh2', warehouse: MOCK_WAREHOUSES[1],
    scheduledDate: '2026-03-13T00:00:00Z', notes: 'Sunrise Corp — Partial delivery',
    lines: [
      { id: 'dl3', productId: 'p9', product: MOCK_PRODUCTS[8], locationId: 'loc5', location: MOCK_LOCATIONS[4], quantityDemand: 3, quantityDone: 0 },
    ],
    createdBy: 'u2', createdAt: '2026-03-11T10:00:00Z',
  },
  {
    id: 'del3', reference: 'DEL-0020', type: 'DELIVERY', status: 'SHIPPED',
    warehouseId: 'wh1', warehouse: MOCK_WAREHOUSES[0],
    scheduledDate: '2026-03-10T00:00:00Z',
    lines: [
      { id: 'dl4', productId: 'p7', product: MOCK_PRODUCTS[6], locationId: 'loc1', location: MOCK_LOCATIONS[0], quantityDemand: 5, quantityDone: 5 },
    ],
    createdBy: 'u1', createdAt: '2026-03-09T09:00:00Z', completedAt: '2026-03-10T17:00:00Z',
  },
]

// ─── Transfers ────────────────────────────────────────────────
export const MOCK_TRANSFERS: Operation[] = [
  {
    id: 'trf1', reference: 'TRF-0011', type: 'TRANSFER', status: 'DRAFT',
    warehouseId: 'wh1', warehouse: MOCK_WAREHOUSES[0],
    scheduledDate: '2026-03-14T00:00:00Z', notes: 'Move excess stock to Surat',
    lines: [
      { id: 'tl1', productId: 'p3', product: MOCK_PRODUCTS[2], locationId: 'loc2', location: MOCK_LOCATIONS[1], quantityDemand: 30, quantityDone: 0 },
    ],
    createdBy: 'u1', createdAt: '2026-03-13T10:00:00Z',
  },
  {
    id: 'trf2', reference: 'TRF-0010', type: 'TRANSFER', status: 'IN_PROGRESS',
    warehouseId: 'wh1', warehouse: MOCK_WAREHOUSES[0],
    scheduledDate: '2026-03-12T00:00:00Z',
    lines: [
      { id: 'tl2', productId: 'p10', product: MOCK_PRODUCTS[9], locationId: 'loc1', location: MOCK_LOCATIONS[0], quantityDemand: 100, quantityDone: 0 },
    ],
    createdBy: 'u2', createdAt: '2026-03-11T08:00:00Z',
  },
  {
    id: 'trf3', reference: 'TRF-0009', type: 'TRANSFER', status: 'COMPLETED',
    warehouseId: 'wh2', warehouse: MOCK_WAREHOUSES[1],
    scheduledDate: '2026-03-10T00:00:00Z',
    lines: [
      { id: 'tl3', productId: 'p12', product: MOCK_PRODUCTS[11], locationId: 'loc5', location: MOCK_LOCATIONS[4], quantityDemand: 10, quantityDone: 10 },
    ],
    createdBy: 'u1', createdAt: '2026-03-09T07:00:00Z', completedAt: '2026-03-10T15:00:00Z',
  },
]

// ─── Adjustments ─────────────────────────────────────────────
export const MOCK_ADJUSTMENTS: Operation[] = [
  {
    id: 'adj1', reference: 'ADJ-0014', type: 'ADJUSTMENT', status: 'COMPLETED',
    warehouseId: 'wh1', warehouse: MOCK_WAREHOUSES[0],
    notes: 'Physical count discrepancy found during cycle count',
    lines: [
      { id: 'ajl1', productId: 'p1', product: MOCK_PRODUCTS[0], locationId: 'loc2', location: MOCK_LOCATIONS[1], quantityDemand: 10, quantityDone: 3 },
    ],
    createdBy: 'u1', createdAt: '2026-03-14T09:00:00Z', completedAt: '2026-03-14T09:30:00Z',
  },
  {
    id: 'adj2', reference: 'ADJ-0013', type: 'ADJUSTMENT', status: 'COMPLETED',
    warehouseId: 'wh1', warehouse: MOCK_WAREHOUSES[0],
    notes: 'Found extra stock during audit',
    lines: [
      { id: 'ajl2', productId: 'p3', product: MOCK_PRODUCTS[2], locationId: 'loc1', location: MOCK_LOCATIONS[0], quantityDemand: 120, quantityDone: 124 },
    ],
    createdBy: 'u2', createdAt: '2026-03-12T11:00:00Z', completedAt: '2026-03-12T11:15:00Z',
  },
  {
    id: 'adj3', reference: 'ADJ-0012', type: 'ADJUSTMENT', status: 'COMPLETED',
    warehouseId: 'wh2', warehouse: MOCK_WAREHOUSES[1],
    notes: 'Damaged goods removed from inventory',
    lines: [
      { id: 'ajl3', productId: 'p4', product: MOCK_PRODUCTS[3], locationId: 'loc5', location: MOCK_LOCATIONS[4], quantityDemand: 20, quantityDone: 6 },
    ],
    createdBy: 'u1', createdAt: '2026-03-11T14:00:00Z', completedAt: '2026-03-11T14:20:00Z',
  },
]

// ─── Stock Movements (Ledger) ─────────────────────────────────
export const MOCK_MOVEMENTS: StockMovement[] = [
  { id: 'm1', productId: 'p1', product: MOCK_PRODUCTS[0], warehouseId: 'wh1', locationId: 'loc2', quantity: -7, type: 'ADJUSTMENT', referenceId: 'adj1', createdBy: 'u1', createdAt: '2026-03-14T09:30:00Z' },
  { id: 'm2', productId: 'p3', product: MOCK_PRODUCTS[2], warehouseId: 'wh1', locationId: 'loc2', quantity: 40, type: 'RECEIPT', referenceId: 'rec2', createdBy: 'u2', createdAt: '2026-03-13T12:00:00Z' },
  { id: 'm3', productId: 'p4', product: MOCK_PRODUCTS[3], warehouseId: 'wh1', locationId: 'loc1', quantity: -14, type: 'DELIVERY', referenceId: 'del3', createdBy: 'u1', createdAt: '2026-03-12T17:00:00Z' },
  { id: 'm4', productId: 'p12', product: MOCK_PRODUCTS[11], warehouseId: 'wh2', locationId: 'loc5', quantity: 10, type: 'TRANSFER_IN', referenceId: 'trf3', createdBy: 'u1', createdAt: '2026-03-10T15:00:00Z' },
  { id: 'm5', productId: 'p7', product: MOCK_PRODUCTS[6], warehouseId: 'wh2', locationId: 'loc5', quantity: 20, type: 'RECEIPT', referenceId: 'rec3', createdBy: 'u1', createdAt: '2026-03-12T14:00:00Z' },
  { id: 'm6', productId: 'p10', product: MOCK_PRODUCTS[9], warehouseId: 'wh1', locationId: 'loc1', quantity: -50, type: 'DELIVERY', referenceId: 'del2', createdBy: 'u2', createdAt: '2026-03-11T16:00:00Z' },
]

// ─── Dashboard KPIs ───────────────────────────────────────────
export const MOCK_DASHBOARD: DashboardKPIs = {
  totalProducts: 248,
  totalStock: 3892,
  lowStockCount: 4,
  pendingReceipts: 2,
  pendingDeliveries: 2,
  transfersInProgress: 1,
  recentMovements: MOCK_MOVEMENTS.slice(0, 5),
  lowStockProducts: MOCK_PRODUCTS.filter(p => p.totalStock <= p.reorderLevel),
}

// ─── Stock Balances ───────────────────────────────────────────
export const MOCK_STOCK_BALANCES: StockBalance[] = MOCK_PRODUCTS.flatMap(p => [
  {
    productId: p.id, product: p,
    locationId: 'loc1', location: MOCK_LOCATIONS[0],
    warehouseId: 'wh1', warehouse: MOCK_WAREHOUSES[0],
    quantity: Math.floor(p.totalStock * 0.7),
  },
  {
    productId: p.id, product: p,
    locationId: 'loc5', location: MOCK_LOCATIONS[4],
    warehouseId: 'wh2', warehouse: MOCK_WAREHOUSES[1],
    quantity: Math.floor(p.totalStock * 0.3),
  },
])

// ─── Helpers ──────────────────────────────────────────────────
export function paginate<T>(items: T[], page = 1, limit = 20) {
  const start = (page - 1) * limit
  return {
    data: items.slice(start, start + limit),
    meta: { total: items.length, page, limit, totalPages: Math.ceil(items.length / limit) },
  }
}

export function filterBySearch<T extends Record<string, any>>(
  items: T[], search: string, keys: (keyof T)[]
): T[] {
  if (!search) return items
  const q = search.toLowerCase()
  return items.filter(item => keys.some(k => String(item[k] ?? '').toLowerCase().includes(q)))
}
