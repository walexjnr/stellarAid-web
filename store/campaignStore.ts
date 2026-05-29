import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

export interface Campaign {
  id: string;
  title: string;
  description: string;
  goalAmount: number;
  raisedAmount: number;
  creatorAddress: string;
  isActive: boolean;
}

interface CampaignState {
  campaigns: Campaign[];
  selectedCampaign: Campaign | null;
  isLoading: boolean;
  error: string | null;
  setCampaigns: (campaigns: Campaign[]) => void;
  selectCampaign: (campaign: Campaign | null) => void;
  addCampaign: (campaign: Campaign) => void;
  updateCampaign: (id: string, updates: Partial<Campaign>) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useCampaignStore = create<CampaignState>()(
  devtools(
    (set) => ({
      campaigns: [],
      selectedCampaign: null,
      isLoading: false,
      error: null,

      setCampaigns: (campaigns) => set({ campaigns }),
      selectCampaign: (campaign) => set({ selectedCampaign: campaign }),
      addCampaign: (campaign) =>
        set((state) => ({ campaigns: [...state.campaigns, campaign] })),
      updateCampaign: (id, updates) =>
        set((state) => ({
          campaigns: state.campaigns.map((c) =>
            c.id === id ? { ...c, ...updates } : c,
          ),
        })),
      setLoading: (isLoading) => set({ isLoading }),
      setError: (error) => set({ error }),
    }),
    { name: 'CampaignStore' },
  ),
);