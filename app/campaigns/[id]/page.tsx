'use client';

import { useEffect, useState } from 'react';
import type { Metadata } from 'next';
import { projectsApi } from '@/lib/api/projects';
import type { Project } from '@/types/api';
import { RelatedCampaigns } from '@/components/campaigns/RelatedCampaigns';

const TABS = ['About', 'Milestones', 'Donors', 'Updates', 'Contract Info'] as const;

interface CampaignDetailPageProps {
  params: { id: string };
}

export default function CampaignDetailPage({ params }: CampaignDetailPageProps) {
  const [campaign, setCampaign] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadCampaign = async () => {
      try {
        const response = await projectsApi.getProjectById(params.id);
        setCampaign(response.data);
      } catch (error) {
        console.error('Failed to load campaign:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadCampaign();
  }, [params.id]);

  const pct =
    campaign && parseFloat(campaign.targetAmount) > 0
      ? Math.min(
          100,
          (parseFloat(campaign.currentAmount) / parseFloat(campaign.targetAmount)) * 100
        )
      : 0;

  if (isLoading) {
    return (
      <main className="min-h-screen bg-background">
        <div className="relative h-64 w-full bg-muted animate-pulse" />
        <div className="mx-auto max-w-6xl px-4 py-8">
          <div className="h-8 w-1/3 bg-muted rounded animate-pulse" />
        </div>
      </main>
    );
  }

  if (!campaign) {
    return (
      <main className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Campaign not found</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background">
      {/* Hero */}
      <div className="relative h-64 w-full bg-muted">
        {campaign.imageUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={campaign.imageUrl}
            alt={campaign.title}
            className="h-full w-full object-cover"
          />
        )}
        <div className="absolute inset-0 flex items-end p-6 bg-gradient-to-t from-black/50 to-transparent">
          <h1 className="text-3xl font-bold text-white drop-shadow">
            {campaign.title}
          </h1>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 py-8 lg:flex lg:gap-8">
        {/* Main content */}
        <div className="flex-1">
          {/* Creator info */}
          {campaign.creator && (
            <div className="mb-6 flex items-center gap-3">
              {campaign.creator.avatar ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={campaign.creator.avatar}
                  alt={campaign.creator.name}
                  className="h-10 w-10 rounded-full object-cover"
                />
              ) : (
                <div className="h-10 w-10 rounded-full bg-primary/20" />
              )}
              <div>
                <p className="text-sm text-muted-foreground">Created by</p>
                <p className="font-medium">{campaign.creator.name || 'Creator'}</p>
              </div>
            </div>
          )}

          {/* Tabs */}
          <div className="mb-6 flex gap-1 border-b">
            {TABS.map((tab) => (
              <button
                key={tab}
                className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground first:text-foreground first:border-b-2 first:border-primary"
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Description */}
          <div className="space-y-4">
            <p className="text-foreground">{campaign.description}</p>
            {campaign.story && (
              <div className="prose prose-sm max-w-none">
                <p>{campaign.story}</p>
              </div>
            )}
          </div>

          {/* Related Campaigns Section */}
          <RelatedCampaigns
            currentCampaignId={campaign.id}
            category={campaign.category}
          />
        </div>

        {/* Sidebar */}
        <aside className="mt-8 w-full lg:mt-0 lg:w-80 shrink-0">
          <div className="rounded-xl border bg-card p-6 shadow-sm space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">Raised</p>
              <p className="text-2xl font-bold">
                {parseFloat(campaign.currentAmount).toLocaleString()} {campaign.currency || 'XLM'}
              </p>
              <p className="text-sm text-muted-foreground">
                of {parseFloat(campaign.targetAmount).toLocaleString()} {campaign.currency || 'XLM'} goal
              </p>
            </div>
            <div className="h-2 w-full rounded-full bg-muted">
              <div
                className="h-2 rounded-full bg-primary transition-all"
                style={{ width: `${pct}%` }}
              />
            </div>
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>{campaign.donorCount || campaign.donors || 0} donors</span>
              <span>
                {campaign.daysRemaining && campaign.daysRemaining > 0
                  ? `${campaign.daysRemaining}d left`
                  : 'Ended'}
              </span>
            </div>
            <button className="w-full rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90">
              Donate Now
            </button>
          </div>
        </aside>
      </div>
    </main>
  );
}
