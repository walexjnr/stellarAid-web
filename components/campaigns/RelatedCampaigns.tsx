'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { CampaignCard, CampaignCardSkeleton } from '@/components/campaigns/CampaignCard';
import { fetchCampaigns } from '@/hooks/useCampaigns';
import type { Project } from '@/types/api';

interface RelatedCampaignsProps {
  currentCampaignId: string;
  category?: string;
}

export function RelatedCampaigns({
  currentCampaignId,
  category,
}: RelatedCampaignsProps) {
  const [campaigns, setCampaigns] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!category) {
      setIsLoading(false);
      return;
    }

    const loadRelatedCampaigns = async () => {
      try {
        setIsLoading(true);
        const data = await fetchCampaigns(1, 10, '', [category], 'newest');
        
        // Filter out the current campaign and limit to 3
        const filtered = data.items
          .filter((campaign) => campaign.id !== currentCampaignId)
          .slice(0, 3);
        
        setCampaigns(filtered);
      } catch (err) {
        console.error('Failed to fetch related campaigns:', err);
        setError('Failed to load related campaigns');
      } finally {
        setIsLoading(false);
      }
    };

    loadRelatedCampaigns();
  }, [currentCampaignId, category]);

  if (!category) {
    return null;
  }

  if (error) {
    return null;
  }

  if (isLoading) {
    return (
      <section className="mt-16 py-8">
        <h2 className="text-2xl font-bold mb-6">Related Campaigns</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <CampaignCardSkeleton key={i} />
          ))}
        </div>
      </section>
    );
  }

  if (campaigns.length === 0) {
    return null;
  }

  return (
    <section className="mt-16 py-8">
      <h2 className="text-2xl font-bold mb-6">Related Campaigns in {category}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {campaigns.map((campaign) => (
          <Link
            key={campaign.id}
            href={`/campaigns/${campaign.id}`}
            className="no-underline"
          >
            <CampaignCard
              title={campaign.title}
              coverImage={campaign.imageUrl || campaign.imageUrls?.[0]}
              description={campaign.description}
              goalAmount={parseFloat(campaign.targetAmount) || 0}
              raisedAmount={parseFloat(campaign.currentAmount) || 0}
              currency={campaign.currency || 'XLM'}
              endDate={campaign.deadline || new Date().toISOString()}
              donorCount={campaign.donors || campaign.donorCount || 0}
              creatorAddress={campaign.creatorId || 'Unknown'}
              isVerified={campaign.isVerified}
            />
          </Link>
        ))}
      </div>
    </section>
  );
}
