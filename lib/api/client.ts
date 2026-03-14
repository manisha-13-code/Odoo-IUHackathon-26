import type {
  AuthTokens, User, Product, Warehouse, Location, Supplier,
  Operation, StockBalance, StockMovement, DashboardKPIs,
  PaginatedResponse, QueryParams, Category,
} from '@/types';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';

// ─── Token management ─────────────────────────────────────────
let accessToken: string | null = null;

export function setAccessToken(token: string | null) {
  accessToken = token;
}

export function getAccessToken() {
  return accessToken;
}

// ─── Core fetch wrapper ───────────────────────────────────────
async function apiFetch<T>(
  path: string,
  options: RequestInit = {},
  retry = true,
): Promise<T> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> || {}),
  };

  if (accessToken) {
    headers['Authorization'] = `Bearer ${accessToken}`;
  }

  const res = await fetch(`${BASE_URL}${path}`, { ...options, headers });

  if (res.status === 401 && retry) {
    const refreshed = await refreshTokens();
    if (refreshed) return apiFetch<T>(path, options, false);
    window.location.href = '/auth/login';
    throw new Error('Unauthorized');
  }

  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: 'Request failed' }));
    throw new Error(err.message || 'Request failed');
  }

  return res.json();
}

function buildQuery(params: QueryParams = {}): string {
  const p = new URLSearchParams();
  if (params.page) p.set('page', String(params.page));
  if (params.limit) p.set('limit', String(params.limit));
  if (params.search) p.set('search', params.search);
  if (params.sort) p.set('sort', params.sort);
  if (params.order) p.set('order', params.order);
  if (params.filter) {
    Object.entries(params.filter).forEach(([k, v]) => { if (v) p.set(k, v); });
  }
  const s = p.toString();
  return s ? `?${s}` : '';
}

// ─── Auth ─────────────────────────────────────────────────────
export const authApi = {
  login: (email: string, password: string) =>
    apiFetch<AuthTokens>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),

  signup: (data: { email: string; password: string; firstName: string; lastName: string }) =>
    apiFetch<AuthTokens>('/auth/signup', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  refresh: (refreshToken: string) =>
    apiFetch<AuthTokens>('/auth/refresh', {
      method: 'POST',
      body: JSON.stringify({ refreshToken }),
    }),

  logout: (refreshToken: string) =>
    apiFetch<void>('/auth/logout', {
      method: 'POST',
      body: JSON.stringify({ refreshToken }),
    }),

  forgotPassword: (email: string) =>
    apiFetch<void>('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    }),

  resetPassword: (token: string, otp: string, password: string) =>
    apiFetch<void>('/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({ token, otp, password }),
    }),
};

async function refreshTokens(): Promise<boolean> {
  try {
    const rt = localStorage.getItem('refreshToken');
    if (!rt) return false;
    const tokens = await authApi.refresh(rt);
    setAccessToken(tokens.accessToken);
    localStorage.setItem('refreshToken', tokens.refreshToken);
    return true;
  } catch {
    return false;
  }
}

// ─── Dashboard ────────────────────────────────────────────────
export const dashboardApi = {
  getKPIs: () => apiFetch<DashboardKPIs>('/dashboard'),
};

// ─── Products ─────────────────────────────────────────────────
export const productsApi = {
  list: (params?: QueryParams) =>
    apiFetch<PaginatedResponse<Product>>(`/products${buildQuery(params)}`),

  get: (id: string) => apiFetch<Product>(`/products/${id}`),

  create: (data: Partial<Product>) =>
    apiFetch<Product>('/products', { method: 'POST', body: JSON.stringify(data) }),

  update: (id: string, data: Partial<Product>) =>
    apiFetch<Product>(`/products/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),

  delete: (id: string) =>
    apiFetch<void>(`/products/${id}`, { method: 'DELETE' }),

  getMovements: (id: string, params?: QueryParams) =>
    apiFetch<PaginatedResponse<StockMovement>>(`/products/${id}/movements${buildQuery(params)}`),
};

export const categoriesApi = {
  list: () => apiFetch<Category[]>('/categories'),
  create: (name: string) =>
    apiFetch<Category>('/categories', { method: 'POST', body: JSON.stringify({ name }) }),
};

// ─── Warehouses ───────────────────────────────────────────────
export const warehousesApi = {
  list: (params?: QueryParams) =>
    apiFetch<PaginatedResponse<Warehouse>>(`/warehouses${buildQuery(params)}`),

  get: (id: string) => apiFetch<Warehouse>(`/warehouses/${id}`),

  create: (data: Partial<Warehouse>) =>
    apiFetch<Warehouse>('/warehouses', { method: 'POST', body: JSON.stringify(data) }),

  update: (id: string, data: Partial<Warehouse>) =>
    apiFetch<Warehouse>(`/warehouses/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),

  getStock: (id: string) =>
    apiFetch<StockBalance[]>(`/warehouses/${id}/stock`),
};

export const locationsApi = {
  list: (params?: QueryParams) =>
    apiFetch<PaginatedResponse<Location>>(`/locations${buildQuery(params)}`),

  create: (data: Partial<Location>) =>
    apiFetch<Location>('/locations', { method: 'POST', body: JSON.stringify(data) }),
};

// ─── Suppliers ────────────────────────────────────────────────
export const suppliersApi = {
  list: (params?: QueryParams) =>
    apiFetch<PaginatedResponse<Supplier>>(`/suppliers${buildQuery(params)}`),

  create: (data: Partial<Supplier>) =>
    apiFetch<Supplier>('/suppliers', { method: 'POST', body: JSON.stringify(data) }),

  update: (id: string, data: Partial<Supplier>) =>
    apiFetch<Supplier>(`/suppliers/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
};

// ─── Operations ───────────────────────────────────────────────
export const operationsApi = {
  list: (params?: QueryParams) =>
    apiFetch<PaginatedResponse<Operation>>(`/operations${buildQuery(params)}`),

  get: (id: string) => apiFetch<Operation>(`/operations/${id}`),
};

export const receiptsApi = {
  list: (params?: QueryParams) =>
    apiFetch<PaginatedResponse<Operation>>(`/receipts${buildQuery(params)}`),

  create: (data: Partial<Operation>) =>
    apiFetch<Operation>('/receipts', { method: 'POST', body: JSON.stringify(data) }),

  confirm: (id: string) =>
    apiFetch<Operation>(`/receipts/${id}/confirm`, { method: 'POST' }),

  validate: (id: string) =>
    apiFetch<Operation>(`/receipts/${id}/validate`, { method: 'POST' }),
};

export const deliveriesApi = {
  list: (params?: QueryParams) =>
    apiFetch<PaginatedResponse<Operation>>(`/deliveries${buildQuery(params)}`),

  create: (data: Partial<Operation>) =>
    apiFetch<Operation>('/deliveries', { method: 'POST', body: JSON.stringify(data) }),

  pick: (id: string) =>
    apiFetch<Operation>(`/deliveries/${id}/pick`, { method: 'POST' }),

  pack: (id: string) =>
    apiFetch<Operation>(`/deliveries/${id}/pack`, { method: 'POST' }),

  ship: (id: string) =>
    apiFetch<Operation>(`/deliveries/${id}/ship`, { method: 'POST' }),
};

export const transfersApi = {
  list: (params?: QueryParams) =>
    apiFetch<PaginatedResponse<Operation>>(`/transfers${buildQuery(params)}`),

  create: (data: Partial<Operation>) =>
    apiFetch<Operation>('/transfers', { method: 'POST', body: JSON.stringify(data) }),

  start: (id: string) =>
    apiFetch<Operation>(`/transfers/${id}/start`, { method: 'POST' }),

  complete: (id: string) =>
    apiFetch<Operation>(`/transfers/${id}/complete`, { method: 'POST' }),
};

export const adjustmentsApi = {
  list: (params?: QueryParams) =>
    apiFetch<PaginatedResponse<Operation>>(`/adjustments${buildQuery(params)}`),

  create: (data: Partial<Operation>) =>
    apiFetch<Operation>('/adjustments', { method: 'POST', body: JSON.stringify(data) }),
};

// ─── Inventory ────────────────────────────────────────────────
export const inventoryApi = {
  stock: (params?: QueryParams) =>
    apiFetch<PaginatedResponse<StockBalance>>(`/inventory/stock${buildQuery(params)}`),

  ledger: (params?: QueryParams) =>
    apiFetch<PaginatedResponse<StockMovement>>(`/inventory/ledger${buildQuery(params)}`),

  lowStock: () => apiFetch<Product[]>('/inventory/low-stock'),
};
