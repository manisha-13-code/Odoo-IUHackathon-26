'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '@/stores/auth';
import { authApi } from '@/lib/api/client';

export default function LoginPage() {
  const router = useRouter();
  const { setAuth } = useAuthStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const tokens = await authApi.login(email, password);
      setAuth(tokens.user, tokens.accessToken, tokens.refreshToken);
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-stone-50 flex">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-[420px] bg-[#0F1F33] flex-col justify-between p-10">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-[#185FA5] rounded-lg flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 16 16">
              <path d="M2 2h5v5H2V2zm7 0h5v5H9V2zM2 9h5v5H2V9zm7 0h5v5H9V9z"/>
            </svg>
          </div>
          <span className="text-white font-semibold tracking-tight">CoreInventory</span>
        </div>

        <div>
          <div className="mb-8">
            {[
              { n: '248', label: 'Products tracked' },
              { n: '3,892', label: 'Stock movements this month' },
              { n: '2', label: 'Warehouses connected' },
            ].map((stat) => (
              <div key={stat.n} className="flex items-center gap-3 mb-4">
                <span className="text-2xl font-bold text-white">{stat.n}</span>
                <span className="text-sm text-white/40">{stat.label}</span>
              </div>
            ))}
          </div>
          <p className="text-white/20 text-xs">CoreInventory v1.0 · Production</p>
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-sm">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-2 mb-8">
            <div className="w-7 h-7 bg-[#1B3A5C] rounded-lg flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 16 16">
                <path d="M2 2h5v5H2V2zm7 0h5v5H9V2zM2 9h5v5H2V9zm7 0h5v5H9V9z"/>
              </svg>
            </div>
            <span className="font-semibold text-stone-800">CoreInventory</span>
          </div>

          <h1 className="text-2xl font-bold text-stone-800 mb-1">Sign in</h1>
          <p className="text-sm text-stone-500 mb-7">Enter your credentials to access the system</p>

          {error && (
            <div className="mb-4 flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
              <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-stone-600 mb-1.5">Email address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                placeholder="you@company.com"
                className="w-full px-3 py-2.5 text-sm border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1B3A5C]/20 focus:border-[#1B3A5C]/40 text-stone-700 placeholder:text-stone-400"
              />
            </div>
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-medium text-stone-600">Password</label>
                <Link href="/auth/forgot-password" className="text-xs text-[#185FA5] hover:underline">
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                  placeholder="••••••••"
                  className="w-full px-3 py-2.5 pr-10 text-sm border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1B3A5C]/20 focus:border-[#1B3A5C]/40 text-stone-700 placeholder:text-stone-400"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    {showPassword
                      ? <><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19"/><line strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} x1="1" y1="1" x2="23" y2="23"/></>
                      : <><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle strokeLinecap="round" strokeWidth={1.8} cx="12" cy="12" r="3"/></>
                    }
                  </svg>
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-[#1B3A5C] text-white text-sm font-medium rounded-lg hover:bg-[#1B3A5C]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-2"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                  </svg>
                  Signing in…
                </span>
              ) : 'Sign in'}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-stone-500">
            Don&apos;t have an account?{' '}
            <Link href="/auth/signup" className="text-[#185FA5] font-medium hover:underline">
              Request access
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
