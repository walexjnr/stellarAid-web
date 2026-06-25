'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';

export default function AdminLoginPage() {
  const router = useRouter();
  const { login } = useAuthStore();
  const [walletAddress, setWalletAddress] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const connectFreighter = async () => {
    if (typeof window === 'undefined') return null;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const freighter = (window as any).freighter;
    if (!freighter) {
      setError('Freighter wallet not found. Please install the Freighter extension.');
      return null;
    }
    try {
      await freighter.requestAccess();
      const pubKey: string = await freighter.getPublicKey();
      return pubKey;
    } catch {
      setError('Wallet connection cancelled.');
      return null;
    }
  };

  const handleConnect = async () => {
    setError('');
    setIsLoading(true);
    try {
      const pubKey = await connectFreighter();
      if (!pubKey) return;
      setWalletAddress(pubKey);

      const res = await fetch('/api/admin/auth/wallet', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ walletAddress: pubKey }),
      });

      if (res.status === 403) {
        setError('Access Denied: This wallet is not authorized as an admin.');
        return;
      }
      if (!res.ok) throw new Error('Auth failed');

      const { user, token } = await res.json();
      login(user, token);
      router.replace('/admin');
    } catch {
      setError('Authentication failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white rounded-xl shadow-md p-8 w-full max-w-sm">
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-xl bg-[#1a3a6b] flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold text-lg">S</span>
          </div>
          <h1 className="text-xl font-bold text-gray-900">Admin Access</h1>
          <p className="text-sm text-gray-500 mt-1">
            Connect your authorized Stellar wallet to continue
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-700">
            {error}
          </div>
        )}

        {walletAddress && !error && (
          <div className="mb-4 p-3 rounded-lg bg-gray-50 border text-xs font-mono text-gray-600 break-all">
            {walletAddress}
          </div>
        )}

        <button
          onClick={handleConnect}
          disabled={isLoading}
          className="w-full bg-[#1a3a6b] text-white py-2.5 rounded-lg font-medium hover:bg-[#163060] disabled:opacity-60 transition-colors"
        >
          {isLoading ? 'Connecting…' : 'Connect Stellar Wallet'}
        </button>

        <p className="text-xs text-center text-gray-400 mt-4">
          Only pre-authorized wallet addresses can access the admin panel.
        </p>
      </div>
    </div>
  );
}
