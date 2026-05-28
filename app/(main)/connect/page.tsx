'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Wallet, Mail, ArrowRight, ShieldCheck, Milestone, UserPlus } from 'lucide-react';
import { useWalletStore } from '@/store/walletStore';
import { useAuthStore } from '@/store/authStore';
import { useRedirectToIntended } from '@/lib/auth/ProtectedRoute';
import { WalletConnectModal } from '@/components/donations/WalletConnectModal';

export default function ConnectPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);
  
  const { address: walletAddress, connect: connectWallet } = useWalletStore();
  const { isAuthenticated } = useAuthStore();
  const { redirect } = useRedirectToIntended();

  const redirectParam = searchParams?.get('redirect') || '';

  // Store the intended destination in sessionStorage on mount/change
  useEffect(() => {
    if (redirectParam) {
      sessionStorage.setItem('intended-destination', redirectParam);
    }
  }, [redirectParam]);

  // If user is already authenticated with JWT, redirect to intended destination
  useEffect(() => {
    if (isAuthenticated) {
      redirect();
    }
  }, [isAuthenticated, redirect]);

  const handleWalletConnect = async (walletType: string) => {
    try {
      if (walletType === 'freighter' && typeof window !== 'undefined' && (window as any).stellar) {
        const stellar = (window as any).stellar;
        const { address } = await stellar.getCurrentAddress();
        if (address) {
          connectWallet(walletType, address);
          setIsWalletModalOpen(false);
          // If already connected/logged in, redirect them
          if (isAuthenticated) {
            redirect();
          }
          return;
        }
      }
    } catch (e) {
      console.warn('Extension connection failed, falling back to mock key', e);
    }
    
    // Fallback to demo key
    const demoAddresses: Record<string, string> = {
      freighter: 'GC2BJMDO7XZ6ST5GD7X3GH25SZ2RR35CY6SZ6SZ6SZ6SZ6SZ6SZ6SZ6',
      albedo: 'GBLSTR7XZ6ST5GD7X3GH25SZ2RR35CY6SZ6SZ6SZ6SZ6SZ6SZ6SZ6SZ6',
      lobstr: 'GDLOBSTRXZ6ST5GD7X3GH25SZ2RR35CY6SZ6SZ6SZ6SZ6SZ6SZ6SZ6SZ',
    };
    const address = demoAddresses[walletType] || 'GDEMO7XZ6ST5GD7X3GH25SZ2RR35CY6SZ6SZ6SZ6SZ6SZ6SZ6SZ6SZ6';
    connectWallet(walletType, address);
    setIsWalletModalOpen(false);
    
    if (isAuthenticated) {
      redirect();
    }
  };

  const loginUrl = redirectParam ? `/auth/login?redirect=${encodeURIComponent(redirectParam)}` : '/auth/login';
  const signupUrl = redirectParam ? `/auth/signup?redirect=${encodeURIComponent(redirectParam)}` : '/auth/signup';

  return (
    <main className="min-h-screen flex flex-col justify-center items-center px-4 bg-gradient-to-br from-[#f0f4fa] via-white to-[#e2ecf8] pt-20 pb-12">
      {/* Outer Card */}
      <div className="w-full max-w-xl bg-card rounded-2xl border border-border shadow-stellar p-8 md:p-10 space-y-8 animate-fade-in">
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="mx-auto w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary shadow-sm">
            <Milestone className="w-6 h-6 animate-pulse" />
          </div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">
            Authentication Required
          </h1>
          <p className="text-sm text-muted-foreground max-w-md mx-auto">
            Secure access to StellarAid. Connect your Stellar wallet or sign in using your account credentials to continue.
          </p>
        </div>

        {/* Connection Options */}
        <div className="grid gap-4 sm:grid-cols-2">
          {/* Stellar Wallet Card */}
          <div className="border border-border rounded-xl bg-background p-5 flex flex-col justify-between hover:border-primary/50 hover:shadow-md transition-all duration-300 group">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-lg bg-yellow-500/10 text-yellow-600 flex items-center justify-center">
                <Wallet className="w-5 h-5" />
              </div>
              <h2 className="font-bold text-base text-foreground">Stellar Wallet</h2>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Connect Freighter, Albedo, or Lobstr. Useful for sign-off, donations, and balance monitoring.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setIsWalletModalOpen(true)}
              className="mt-6 inline-flex items-center justify-center gap-1.5 w-full text-xs font-semibold bg-foreground text-background hover:bg-foreground/90 py-2.5 rounded-lg transition-colors cursor-pointer"
            >
              {walletAddress ? 'Change Wallet' : 'Connect Wallet'}
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>

          {/* Email Account Card */}
          <div className="border border-border rounded-xl bg-background p-5 flex flex-col justify-between hover:border-primary/50 hover:shadow-md transition-all duration-300 group">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                <Mail className="w-5 h-5" />
              </div>
              <h2 className="font-bold text-base text-foreground">Email & Password</h2>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Log in to manage your creator campaign details, view donor logs, or configure your profile.
              </p>
            </div>
            <Link
              href={loginUrl}
              className="mt-6 inline-flex items-center justify-center gap-1.5 w-full text-xs font-semibold bg-primary text-primary-foreground hover:bg-primary/90 py-2.5 rounded-lg transition-colors"
            >
              Sign In
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>
        </div>

        {/* Wallet status message if connected but not logged in */}
        {walletAddress && !isAuthenticated && (
          <div className="p-4 bg-yellow-500/5 rounded-xl border border-yellow-500/10 flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-yellow-600 shrink-0 mt-0.5" />
            <div className="text-xs leading-normal">
              <span className="font-semibold text-yellow-800">Wallet Connected:</span>{' '}
              <code className="text-yellow-900 bg-yellow-500/10 px-1 rounded font-mono break-all">{walletAddress}</code>.
              <p className="mt-1 text-muted-foreground">
                To access private pages (like creating campaigns or viewing profile), please log in with your email account above.
              </p>
            </div>
          </div>
        )}

        {/* Footer Links */}
        <div className="border-t border-border pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <span>Need an account?</span>
          <Link
            href={signupUrl}
            className="inline-flex items-center gap-1 font-semibold text-primary hover:underline"
          >
            <UserPlus className="w-3.5 h-3.5" />
            Create an Account
          </Link>
        </div>
      </div>

      {/* Wallet Modal */}
      <WalletConnectModal
        isOpen={isWalletModalOpen}
        onClose={() => setIsWalletModalOpen(false)}
        onWalletConnect={handleWalletConnect}
      />
    </main>
  );
}
