'use client';
import { useState, useCallback } from 'react';
import type { ReactNode } from 'react';

// ─── Types ────────────────────────────────────────────────────
export interface Column<T> {
  key: string;
  header: string;
  cell: (row: T) => ReactNode;
  sortable?: boolean;
  width?: string;
}

export interface FilterOption {
  key: string;
  label: string;
  options: { value: string; label: string }[];
}

export interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  total: number;
  page: number;
  limit: number;
  loading?: boolean;
  searchPlaceholder?: string;
  filters?: FilterOption[];
  onSearch?: (value: string) => void;
  onFilter?: (key: string, value: string) => void;
  onPageChange?: (page: number) => void;
  onSort?: (key: string, order: 'asc' | 'desc') => void;
  emptyMessage?: string;
  actions?: ReactNode;
}

// ─── Search Input ─────────────────────────────────────────────
function SearchInput({ placeholder, onChange }: { placeholder: string; onChange: (v: string) => void }) {
  const [value, setValue] = useState('');
  return (
    <div className="relative">
      <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
      </svg>
      <input
        value={value}
        onChange={(e) => { setValue(e.target.value); onChange(e.target.value); }}
        placeholder={placeholder}
        className="pl-9 pr-4 py-2 text-sm bg-white border border-stone-200 rounded-lg w-64 focus:outline-none focus:ring-2 focus:ring-[#1B3A5C]/20 focus:border-[#1B3A5C]/40 placeholder:text-stone-400 text-stone-700"
      />
    </div>
  );
}

// ─── Filter Select ────────────────────────────────────────────
function FilterSelect({ filter, onChange }: { filter: FilterOption; onChange: (key: string, value: string) => void }) {
  return (
    <select
      onChange={(e) => onChange(filter.key, e.target.value)}
      className="px-3 py-2 text-sm bg-white border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1B3A5C]/20 focus:border-[#1B3A5C]/40 text-stone-700"
    >
      <option value="">{filter.label}</option>
      {filter.options.map((opt) => (
        <option key={opt.value} value={opt.value}>{opt.label}</option>
      ))}
    </select>
  );
}

// ─── Pagination ───────────────────────────────────────────────
function Pagination({ page, total, limit, onChange }: {
  page: number; total: number; limit: number; onChange: (p: number) => void;
}) {
  const totalPages = Math.ceil(total / limit);
  const from = (page - 1) * limit + 1;
  const to = Math.min(page * limit, total);

  if (totalPages <= 1) return null;

  const pages = Array.from({ length: Math.min(7, totalPages) }, (_, i) => {
    if (totalPages <= 7) return i + 1;
    if (page <= 4) return i + 1;
    if (page >= totalPages - 3) return totalPages - 6 + i;
    return page - 3 + i;
  });

  return (
    <div className="flex items-center justify-between px-4 py-3 border-t border-stone-100">
      <p className="text-xs text-stone-500">
        Showing {from}–{to} of {total} results
      </p>
      <div className="flex items-center gap-1">
        <button
          onClick={() => onChange(page - 1)}
          disabled={page === 1}
          className="p-1.5 rounded-md text-stone-500 hover:bg-stone-100 disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7"/>
          </svg>
        </button>
        {pages.map((p) => (
          <button
            key={p}
            onClick={() => onChange(p)}
            className={`w-7 h-7 rounded-md text-xs font-medium transition-colors ${
              p === page
                ? 'bg-[#1B3A5C] text-white'
                : 'text-stone-600 hover:bg-stone-100'
            }`}
          >
            {p}
          </button>
        ))}
        <button
          onClick={() => onChange(page + 1)}
          disabled={page === totalPages}
          className="p-1.5 rounded-md text-stone-500 hover:bg-stone-100 disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/>
          </svg>
        </button>
      </div>
    </div>
  );
}

// ─── Skeleton ─────────────────────────────────────────────────
function TableSkeleton({ cols, rows = 6 }: { cols: number; rows?: number }) {
  return (
    <>
      {Array.from({ length: rows }).map((_, i) => (
        <tr key={i} className="border-b border-stone-100">
          {Array.from({ length: cols }).map((_, j) => (
            <td key={j} className="px-4 py-3">
              <div className="h-4 bg-stone-100 rounded animate-pulse" style={{ width: `${60 + Math.random() * 30}%` }} />
            </td>
          ))}
        </tr>
      ))}
    </>
  );
}

// ─── Main DataTable ───────────────────────────────────────────
export function DataTable<T extends { id: string }>({
  data, columns, total, page, limit, loading,
  searchPlaceholder = 'Search…',
  filters = [],
  onSearch, onFilter, onPageChange, onSort,
  emptyMessage = 'No records found.',
  actions,
}: DataTableProps<T>) {
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const handleSort = useCallback((key: string) => {
    const newOrder = sortKey === key && sortOrder === 'asc' ? 'desc' : 'asc';
    setSortKey(key);
    setSortOrder(newOrder);
    onSort?.(key, newOrder);
  }, [sortKey, sortOrder, onSort]);

  return (
    <div className="bg-white rounded-xl border border-stone-200 overflow-hidden">
      {/* Toolbar */}
      <div className="flex items-center justify-between gap-3 p-4 border-b border-stone-100 flex-wrap">
        <div className="flex items-center gap-2 flex-wrap">
          {onSearch && (
            <SearchInput placeholder={searchPlaceholder} onChange={onSearch} />
          )}
          {filters.map((f) => (
            <FilterSelect key={f.key} filter={f} onChange={(k, v) => onFilter?.(k, v)} />
          ))}
        </div>
        {actions && <div className="flex items-center gap-2">{actions}</div>}
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-stone-50 border-b border-stone-200">
              {columns.map((col) => (
                <th
                  key={col.key}
                  style={{ width: col.width }}
                  onClick={() => col.sortable && handleSort(col.key)}
                  className={`px-4 py-3 text-left text-xs font-semibold text-stone-500 uppercase tracking-wider whitespace-nowrap ${
                    col.sortable ? 'cursor-pointer hover:text-stone-700 select-none' : ''
                  }`}
                >
                  <span className="flex items-center gap-1">
                    {col.header}
                    {col.sortable && sortKey === col.key && (
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        {sortOrder === 'asc'
                          ? <path strokeLinecap="round" strokeWidth={2} d="M5 15l7-7 7 7"/>
                          : <path strokeLinecap="round" strokeWidth={2} d="M19 9l-7 7-7-7"/>}
                      </svg>
                    )}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100">
            {loading ? (
              <TableSkeleton cols={columns.length} />
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-4 py-16 text-center">
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-10 h-10 rounded-full bg-stone-100 flex items-center justify-center">
                      <svg className="w-5 h-5 text-stone-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0H4"/>
                      </svg>
                    </div>
                    <p className="text-sm text-stone-500">{emptyMessage}</p>
                  </div>
                </td>
              </tr>
            ) : (
              data.map((row) => (
                <tr key={row.id} className="hover:bg-stone-50/60 transition-colors">
                  {columns.map((col) => (
                    <td key={col.key} className="px-4 py-3 text-stone-700">
                      {col.cell(row)}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <Pagination page={page} total={total} limit={limit} onChange={(p) => onPageChange?.(p)} />
    </div>
  );
}
