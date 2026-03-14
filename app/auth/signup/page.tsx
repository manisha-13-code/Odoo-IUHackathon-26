'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '@/stores/auth';
import { authApi } from '@/lib/api/client';

export default function SignupPage() {
  const router = useRouter();
  const { setAuth } = useAuthStore();
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', password: '', confirmPassword: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const update = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (form.password !== form.confirmPassword) { setError('Passwords do not match'); return; }
    if (form.password.length < 8) { setError('Password must be at least 8 characters'); return; }
    setLoading(true);
    try {
      const tokens = await authApi.signup({
        firstName: form.firstName, lastName: form.lastName,
        email: form.email, password: form.password,
      });
      setAuth(tokens.user, tokens.accessToken, tokens.refreshToken);
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const fields = [
    { key: 'firstName',       label: 'First name',      type: 'text',     placeholder: 'Rahul',       half: true },
    { key: 'lastName',        label: 'Last name',       type: 'text',     placeholder: 'Sharma',      half: true },
    { key: 'email',           label: 'Email address',   type: 'email',    placeholder: 'you@company.com', half: false },
    { key: 'password',        label: 'Password',        type: 'password', placeholder: 'Min. 8 characters', half: true },
    { key: 'confirmPassword', label: 'Confirm password', type: 'password', placeholder: '••••••••',   half: true },
  ] as const;

  return (
    <div className="min-h-screen bg-stone-50 flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="flex items-center gap-2 mb-8">
          <div className="w-7 h-7 bg-[#1B3A5C] rounded-lg flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 16 16">
              <path d="M2 2h5v5H2V2zm7 0h5v5H9V2zM2 9h5v5H2V9zm7 0h5v5H9V9z"/>
            </svg>
          </div>
          <span className="font-semibold text-stone-800">CoreInventory</span>
        </div>

        <div className="bg-white rounded-2xl border border-stone-200 p-8">
          <h1 className="text-xl font-bold text-stone-800 mb-1">Create account</h1>
          <p className="text-sm text-stone-500 mb-6">Join your team on CoreInventory</p>

          {error && (
            <div className="mb-4 flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
              <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-2 gap-4">
              {fields.map((field) => (
                <div key={field.key} className={field.half ? 'col-span-1' : 'col-span-2'}>
                  <label className="block text-xs font-medium text-stone-600 mb-1.5">{field.label}</label>
                  <input
                    type={field.type}
                    value={form[field.key]}
                    onChange={update(field.key)}
                    required
                    placeholder={field.placeholder}
                    className="w-full px-3 py-2 text-sm border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1B3A5C]/20 focus:border-[#1B3A5C]/40 text-stone-700 placeholder:text-stone-400"
                  />
                </div>
              ))}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-6 w-full py-2.5 bg-[#1B3A5C] text-white text-sm font-medium rounded-lg hover:bg-[#1B3A5C]/90 transition-colors disabled:opacity-50"
            >
              {loading ? 'Creating account…' : 'Create account'}
            </button>
          </form>

          <p className="mt-5 text-center text-sm text-stone-500">
            Already have an account?{' '}
            <Link href="/auth/login" className="text-[#185FA5] font-medium hover:underline">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
