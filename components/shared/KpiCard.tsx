'use client';
import type { ReactNode } from 'react';

// ─── KPI Card ─────────────────────────────────────────────────
interface KpiCardProps {
  label: string;
  value: string | number;
  sub?: string;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  icon: ReactNode;
  color?: 'blue' | 'green' | 'amber' | 'red' | 'violet';
  loading?: boolean;
}

const COLOR_MAP = {
  blue:   { bg: 'bg-[#E6F1FB]', text: 'text-[#185FA5]', value: 'text-[#1B3A5C]' },
  green:  { bg: 'bg-emerald-50', text: 'text-emerald-600', value: 'text-emerald-800' },
  amber:  { bg: 'bg-amber-50',   text: 'text-amber-600',   value: 'text-amber-800' },
  red:    { bg: 'bg-red-50',     text: 'text-red-500',     value: 'text-red-700' },
  violet: { bg: 'bg-violet-50',  text: 'text-violet-600',  value: 'text-violet-800' },
};

export function KpiCard({ label, value, sub, trend, trendValue, icon, color = 'blue', loading }: KpiCardProps) {
  const c = COLOR_MAP[color];

  if (loading) {
    return (
      <div className="bg-white rounded-xl border border-stone-200 p-5 animate-pulse">
        <div className="flex items-center justify-between mb-4">
          <div className="h-3 bg-stone-100 rounded w-24" />
          <div className="w-9 h-9 bg-stone-100 rounded-lg" />
        </div>
        <div className="h-7 bg-stone-100 rounded w-16 mb-2" />
        <div className="h-3 bg-stone-100 rounded w-20" />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-stone-200 p-5 hover:border-stone-300 transition-colors group">
      <div className="flex items-center justify-between mb-4">
        <p className="text-xs font-medium text-stone-500 uppercase tracking-wider">{label}</p>
        <div className={`w-9 h-9 rounded-lg ${c.bg} flex items-center justify-center ${c.text}`}>
          {icon}
        </div>
      </div>
      <p className={`text-2xl font-bold tracking-tight ${c.value}`}>{value}</p>
      {(sub || (trend && trendValue)) && (
        <div className="mt-1.5 flex items-center gap-1.5">
          {trend && trendValue && (
            <span className={`flex items-center text-xs font-medium ${
              trend === 'up' ? 'text-emerald-600' : trend === 'down' ? 'text-red-500' : 'text-stone-400'
            }`}>
              {trend === 'up' && '↑'}
              {trend === 'down' && '↓'}
              {trendValue}
            </span>
          )}
          {sub && <span className="text-xs text-stone-400">{sub}</span>}
        </div>
      )}
    </div>
  );
}

// ─── Inventory Mini Card (product stock) ─────────────────────
interface InventoryCardProps {
  productName: string;
  sku: string;
  stock: number;
  reorderLevel: number;
  unit: string;
  location?: string;
}

export function InventoryCard({ productName, sku, stock, reorderLevel, unit, location }: InventoryCardProps) {
  const isLow = stock <= reorderLevel;
  const pct = reorderLevel > 0 ? Math.min((stock / (reorderLevel * 3)) * 100, 100) : 100;

  return (
    <div className={`bg-white rounded-lg border p-4 transition-colors ${
      isLow ? 'border-red-200 bg-red-50/30' : 'border-stone-200'
    }`}>
      <div className="flex items-start justify-between gap-2 mb-3">
        <div className="min-w-0">
          <p className="text-sm font-medium text-stone-800 truncate">{productName}</p>
          <p className="text-xs text-stone-400 font-mono mt-0.5">{sku}</p>
        </div>
        {isLow && (
          <span className="shrink-0 text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full font-medium border border-red-200">
            Low
          </span>
        )}
      </div>
      <div className="flex items-baseline gap-1 mb-2">
        <span className={`text-xl font-bold ${isLow ? 'text-red-600' : 'text-stone-800'}`}>{stock}</span>
        <span className="text-xs text-stone-400">{unit}</span>
      </div>
      <div className="w-full h-1 bg-stone-100 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all ${isLow ? 'bg-red-400' : 'bg-emerald-400'}`}
          style={{ width: `${pct}%` }}
        />
      </div>
      {location && <p className="text-xs text-stone-400 mt-1.5">{location}</p>}
    </div>
  );
}

// ─── Page Header ─────────────────────────────────────────────
interface PageHeaderProps {
  title: string;
  description?: string;
  actions?: ReactNode;
}

export function PageHeader({ title, description, actions }: PageHeaderProps) {
  return (
    <div className="flex items-start justify-between gap-4 mb-6">
      <div>
        <h1 className="text-xl font-bold text-stone-800 tracking-tight">{title}</h1>
        {description && <p className="mt-0.5 text-sm text-stone-500">{description}</p>}
      </div>
      {actions && <div className="flex items-center gap-2 shrink-0">{actions}</div>}
    </div>
  );
}

// ─── Primary Button ───────────────────────────────────────────
interface ButtonProps {
  children: ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit';
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md';
  disabled?: boolean;
  loading?: boolean;
  icon?: ReactNode;
}

const BTN_VARIANTS = {
  primary:   'bg-[#1B3A5C] text-white hover:bg-[#1B3A5C]/90 border-transparent',
  secondary: 'bg-white text-stone-700 border-stone-200 hover:bg-stone-50',
  danger:    'bg-red-600 text-white hover:bg-red-700 border-transparent',
  ghost:     'bg-transparent text-stone-600 border-transparent hover:bg-stone-100',
};

const BTN_SIZES = {
  sm: 'px-3 py-1.5 text-xs',
  md: 'px-4 py-2 text-sm',
};

export function Button({ children, onClick, type = 'button', variant = 'primary', size = 'md', disabled, loading, icon }: ButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`inline-flex items-center gap-1.5 font-medium rounded-lg border transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${BTN_VARIANTS[variant]} ${BTN_SIZES[size]}`}
    >
      {loading ? (
        <svg className="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
        </svg>
      ) : icon}
      {children}
    </button>
  );
}
