'use client';
import { useEffect, useRef, type ReactNode } from 'react';
import { useForm, type RegisterOptions, type FieldValues, type Path } from 'react-hook-form';

// ─── Modal ────────────────────────────────────────────────────
interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  footer?: ReactNode;
}

const SIZE_MAP = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-2xl',
};

export function Modal({ open, onClose, title, description, children, size = 'md', footer }: ModalProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    if (open) document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [open, onClose]);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      aria-modal="true"
      role="dialog"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/30 backdrop-blur-[2px]"
        onClick={onClose}
      />
      {/* Panel */}
      <div
        ref={ref}
        className={`relative bg-white rounded-2xl shadow-xl border border-stone-200 w-full ${SIZE_MAP[size]} flex flex-col max-h-[90vh]`}
        style={{ animation: 'modalIn 0.15s ease-out' }}
      >
        {/* Header */}
        <div className="flex items-start justify-between p-6 border-b border-stone-100">
          <div>
            <h2 className="text-base font-semibold text-stone-800">{title}</h2>
            {description && <p className="mt-0.5 text-sm text-stone-500">{description}</p>}
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-stone-400 hover:text-stone-600 hover:bg-stone-100 transition-colors -mr-1 -mt-1"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>
        {/* Body */}
        <div className="overflow-y-auto flex-1 p-6">{children}</div>
        {/* Footer */}
        {footer && (
          <div className="px-6 py-4 border-t border-stone-100 flex items-center justify-end gap-2">
            {footer}
          </div>
        )}
      </div>
      <style>{`@keyframes modalIn { from { opacity: 0; transform: scale(0.97) translateY(4px); } to { opacity: 1; transform: scale(1) translateY(0); } }`}</style>
    </div>
  );
}

// ─── Confirm Dialog ───────────────────────────────────────────
interface ConfirmDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmLabel?: string;
  danger?: boolean;
  loading?: boolean;
}

export function ConfirmDialog({ open, onClose, onConfirm, title, message, confirmLabel = 'Confirm', danger = false, loading }: ConfirmDialogProps) {
  return (
    <Modal open={open} onClose={onClose} title={title} size="sm"
      footer={
        <>
          <button onClick={onClose} className="px-4 py-2 text-sm text-stone-600 hover:bg-stone-100 rounded-lg transition-colors">
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors disabled:opacity-50 ${
              danger
                ? 'bg-red-600 text-white hover:bg-red-700'
                : 'bg-[#1B3A5C] text-white hover:bg-[#1B3A5C]/90'
            }`}
          >
            {loading ? 'Loading…' : confirmLabel}
          </button>
        </>
      }
    >
      <p className="text-sm text-stone-600">{message}</p>
    </Modal>
  );
}

// ─── Form Builder ─────────────────────────────────────────────
export type FieldType = 'text' | 'email' | 'password' | 'number' | 'select' | 'textarea' | 'date';

export interface FormField<T extends FieldValues = FieldValues> {
  name: Path<T>;
  label: string;
  type: FieldType;
  placeholder?: string;
  required?: boolean;
  rules?: RegisterOptions;
  options?: { value: string; label: string }[];
  hint?: string;
  span?: 'full' | 'half';
}

interface FormBuilderProps<T extends FieldValues> {
  fields: FormField<T>[];
  onSubmit: (data: T) => void | Promise<void>;
  defaultValues?: Partial<T>;
  submitLabel?: string;
  loading?: boolean;
  className?: string;
  children?: ReactNode;
}

export function FormBuilder<T extends FieldValues>({
  fields, onSubmit, defaultValues, submitLabel = 'Save', loading, className, children,
}: FormBuilderProps<T>) {
  const { register, handleSubmit, formState: { errors } } = useForm<T>({ defaultValues: defaultValues as any });

  const renderField = (field: FormField<T>) => {
    const error = errors[field.name];
    const baseClass = `w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1B3A5C]/20 focus:border-[#1B3A5C]/40 text-stone-700 placeholder:text-stone-400 transition-colors ${
      error ? 'border-red-300 focus:ring-red-200 focus:border-red-400' : 'border-stone-200'
    }`;

    const rules: RegisterOptions = {
      ...(field.required ? { required: `${field.label} is required` } : {}),
      ...field.rules,
    };

    if (field.type === 'select') {
      return (
        <select {...register(field.name, rules)} className={baseClass}>
          <option value="">{field.placeholder || `Select ${field.label}`}</option>
          {field.options?.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      );
    }

    if (field.type === 'textarea') {
      return (
        <textarea
          {...register(field.name, rules)}
          placeholder={field.placeholder}
          rows={3}
          className={`${baseClass} resize-none`}
        />
      );
    }

    return (
      <input
        {...register(field.name, rules)}
        type={field.type}
        placeholder={field.placeholder}
        className={baseClass}
      />
    );
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={className}>
      <div className="grid grid-cols-2 gap-4">
        {fields.map((field) => (
          <div key={String(field.name)} className={field.span === 'half' ? 'col-span-1' : 'col-span-2'}>
            <label className="block text-xs font-medium text-stone-600 mb-1.5">
              {field.label}
              {field.required && <span className="text-red-500 ml-0.5">*</span>}
            </label>
            {renderField(field)}
            {field.hint && !errors[field.name] && (
              <p className="mt-1 text-xs text-stone-400">{field.hint}</p>
            )}
            {errors[field.name] && (
              <p className="mt-1 text-xs text-red-500">{String((errors[field.name] as any)?.message)}</p>
            )}
          </div>
        ))}
      </div>
      {children}
      <div className="mt-6">
        <button
          type="submit"
          disabled={loading}
          className="w-full py-2.5 px-4 bg-[#1B3A5C] text-white text-sm font-medium rounded-lg hover:bg-[#1B3A5C]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
              </svg>
              Saving…
            </span>
          ) : submitLabel}
        </button>
      </div>
    </form>
  );
}
