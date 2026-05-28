import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type { WalletStore } from '@/types';

const fetchBalance = async (address: string, set: any) => {
  try {
    const res = await fetch(`https://horizon-testnet.stellar.org/accounts/${address}`);
    if (res.ok) {
      const data = await res.json();
      const native = data.balances.find((b: any) => b.asset_type === 'native');
      set({ balance: native ? native.balance : '0.0000000' });
    } else {
      set({ balance: '0.0000000' });
    }
  } catch (err) {
    console.error('Error fetching balance:', err);
    set({ balance: '0.0000000' });
  }
};

export const useWalletStore = create<WalletStore>()(
  devtools(
    (set) => ({
      // Initial State
      connectedWallet: null,
      address: null,
      balance: null,
      isConnecting: false,
      error: null,

      // Actions
      connect: (wallet, address) => {
        set({
          connectedWallet: wallet,
          address: address,
          isConnecting: false,
          error: null,
        });
        fetchBalance(address, set);
      },

      disconnect: () =>
        set({
          connectedWallet: null,
          address: null,
          balance: null,
          isConnecting: false,
          error: null,
        }),

      setBalance: (balance) => set({ balance }),

      setConnecting: (connecting) => set({ isConnecting: connecting }),

      setError: (error) => set({ error }),
    }),
    {
      name: 'WalletStore',
    }
  )
);
