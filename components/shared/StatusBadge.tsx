'use client';
import type { OperationStatus, MovementType } from '@/types';

const STATUS_CONFIG: Record<string, { label: string; className: string }> = {
  DRAFT:       { label: 'Draft',        className: 'bg-stone-100 text-stone-600 border-stone-200' },
  CONFIRMED:   { label: 'Confirmed',    className: 'bg-blue-50 text-blue-700 border-blue-200' },
  PICKING:     { label: 'Picking',      className: 'bg-amber-50 text-amber-700 border-amber-200' },
  PACKED:      { label: 'Packed',       className: 'bg-violet-50 text-violet-700 border-violet-200' },
  IN_PROGRESS: { label: 'In Progress',  className: 'bg-amber-50 text-amber-700 border-amber-200' },
  RECEIVED:    { label: 'Received',     className: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  SHIPPED:     { label: 'Shipped',      className: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  COMPLETED:   { label: 'Completed',    className: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  CANCELLED:   { label: 'Cancelled',    className: 'bg-red-50 text-red-600 border-red-200' },
  // movement types
  RECEIPT:     { label: 'Receipt',      className: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  DELIVERY:    { label: 'Delivery',     className: 'bg-amber-50 text-amber-700 border-amber-200' },
  TRANSFER_IN: { label: 'Transfer In',  className: 'bg-blue-50 text-blue-700 border-blue-200' },
  TRANSFER_OUT:{ label: 'Transfer Out', className: 'bg-violet-50 text-violet-700 border-violet-200' },
  ADJUSTMENT:  { label: 'Adjustment',   className: 'bg-rose-50 text-rose-700 border-rose-200' },
  // general
  LOW:         { label: 'Low Stock',    className: 'bg-red-50 text-red-600 border-red-200' },
  OK:          { label: 'OK',           className: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  ACTIVE:      { label: 'Active',       className: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  INACTIVE:    { label: 'Inactive',     className: 'bg-stone-100 text-stone-500 border-stone-200' },
};

interface StatusBadgeProps {
  status: string;
  label?: string;
}

export function StatusBadge({ status, label }: StatusBadgeProps) {
  const config = STATUS_CONFIG[status] || {
    label: status,
    className: 'bg-stone-100 text-stone-600 border-stone-200',
  };

  return (
    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-xs font-medium border ${config.className}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-current opacity-70" />
      {label || config.label}
    </span>
  );
}
