'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ArrowUpRight, PieChart as PieIcon, Users } from 'lucide-react';
import { ProtectedRoute } from '@/lib/auth/ProtectedRoute';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { StatCard } from '@/components/ui/StatCard';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';

interface TrendPoint {
  date: string;
  amount: number;
  donors: number;
}

interface AssetBreakdownPoint {
  asset: string;
  amount: number;
}

interface GeoPoint {
  region: string;
  amount: number;
}

interface DonorRow {
  id: string;
  name: string;
  amount: number;
  asset: string;
  country: string;
}

interface ReferralSource {
  source: string;
  count: number;
}

const DONATION_TREND: TrendPoint[] = [
  { date: 'Apr 01', amount: 4200, donors: 24 },
  { date: 'Apr 05', amount: 5200, donors: 30 },
  { date: 'Apr 09', amount: 3800, donors: 21 },
  { date: 'Apr 13', amount: 6100, donors: 34 },
  { date: 'Apr 17', amount: 7300, donors: 42 },
  { date: 'Apr 21', amount: 6800, donors: 39 },
  { date: 'Apr 25', amount: 8200, donors: 47 },
  { date: 'Apr 29', amount: 7600, donors: 43 },
];

const ASSET_BREAKDOWN: AssetBreakdownPoint[] = [
  { asset: 'XLM', amount: 13800 },
  { asset: 'USDC', amount: 9400 },
  { asset: 'EURT', amount: 4200 },
  { asset: 'WBTC', amount: 1800 },
];

const GEO_DISTRIBUTION: GeoPoint[] = [
  { region: 'North America', amount: 12400 },
  { region: 'Europe', amount: 8800 },
  { region: 'Africa', amount: 5200 },
  { region: 'Asia', amount: 3100 },
  { region: 'Latin America', amount: 2400 },
];

const TOP_DONORS: DonorRow[] = [
  { id: 'd1', name: 'Emma Johnson', amount: 4200, asset: 'USDC', country: 'United States' },
  { id: 'd2', name: 'Luis Martinez', amount: 3200, asset: 'XLM', country: 'Mexico' },
  { id: 'd3', name: 'Amina Yusuf', amount: 2600, asset: 'EURT', country: 'Nigeria' },
  { id: 'd4', name: 'Sophie Dubois', amount: 2100, asset: 'XLM', country: 'France' },
  { id: 'd5', name: 'Ravi Patel', amount: 1900, asset: 'USDC', country: 'India' },
];

const DEFAULT_REFERRAL_SOURCES: ReferralSource[] = [
  { source: 'Twitter', count: 45 },
  { source: 'LinkedIn', count: 28 },
  { source: 'WhatsApp', count: 16 },
  { source: 'Direct', count: 11 },
];

const ASSET_COLORS = ['#2563EB', '#14B8A6', '#F59E0B', '#A855F7'];
const REGION_COLORS = ['#3B82F6', '#22C55E', '#F97316', '#8B5CF6', '#0EA5E9'];
const REFERRAL_COLORS = ['#4F46E5', '#0EA5E9', '#10B981', '#F97316'];

function formatCurrency(value: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

function ChartTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;

  const point = payload[0].payload as TrendPoint;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-3 shadow-lg">
      <p className="text-sm font-medium text-slate-900">{label}</p>
      <p className="mt-2 text-sm text-slate-700">{formatCurrency(point.amount)} donated</p>
      <p className="text-sm text-slate-500">{point.donors} donors</p>
    </div>
  );
}

export default function CampaignAnalyticsPage() {
  const params = useParams();
  const campaignId = params?.id as string | undefined;
  const [referralSources, setReferralSources] = useState<ReferralSource[]>(DEFAULT_REFERRAL_SOURCES);
  const [referralError, setReferralError] = useState<string | null>(null);
  const [isLoadingReferral, setIsLoadingReferral] = useState(false);

  useEffect(() => {
    if (!campaignId) {
      return;
    }

    async function loadReferralSources() {
      setIsLoadingReferral(true);
      setReferralError(null);

      try {
        const res = await fetch(`/api/campaigns/${campaignId}/shares/stats`);
        if (!res.ok) {
          throw new Error(`HTTP ${res.status}`);
        }

        const json = await res.json();
        const shares = json?.data?.shares ?? {};
        const processed: ReferralSource[] = [
          { source: 'Twitter', count: shares.twitter ?? 0 },
          { source: 'LinkedIn', count: shares.linkedin ?? 0 },
          { source: 'WhatsApp', count: shares.whatsapp ?? 0 },
          { source: 'Direct', count: shares.copy ?? 0 },
        ];

        if (processed.some((item) => item.count > 0)) {
          setReferralSources(processed);
        }
      } catch (error) {
        setReferralError('Unable to load referral source data. Showing default breakdown.');
      } finally {
        setIsLoadingReferral(false);
      }
    }

    loadReferralSources();
  }, [campaignId]);

  const totalRaised = useMemo(
    () => DONATION_TREND.reduce((sum, point) => sum + point.amount, 0),
    []
  );

  const totalDonors = useMemo(
    () => DONATION_TREND.reduce((sum, point) => sum + point.donors, 0),
    []
  );

  const totalRegions = GEO_DISTRIBUTION.length;
  const totalReferrals = referralSources.reduce((sum, item) => sum + item.count, 0);

  return (
    <ProtectedRoute requiredRole="creator">
      <div className="min-h-screen bg-[#f4f7fb] p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-sky-700">Campaign analytics</p>
              <h1 className="mt-3 text-3xl font-bold text-slate-950 sm:text-4xl">
                Analytics for campaign {campaignId ?? '—'}
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">
                Review donation velocity, asset mix, regional performance, and referral sources to improve donor outreach.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <Link href="/dashboard">
                <Button variant="outline" className="h-11">
                  Back to Dashboard
                </Button>
              </Link>
              <Button
                variant="primary"
                className="h-11"
                onClick={() => window.location.href = `/dashboard/campaigns/${campaignId}/analytics`}
              >
                Refresh data
              </Button>
            </div>
          </header>

          <div className="grid gap-4 sm:grid-cols-3">
            <StatCard
              title="Total raised"
              value={totalRaised}
              type="currency"
              currency="USD"
              description="Donation volume in selected period"
              icon={<ArrowUpRight className="w-5 h-5 text-sky-700" />}
              iconBg="bg-sky-50"
            />
            <StatCard
              title="Unique donors"
              value={totalDonors}
              type="count"
              description="Engaged contributors"
              icon={<Users className="w-5 h-5 text-emerald-700" />}
              iconBg="bg-emerald-50"
            />
            <StatCard
              title="Referral channels"
              value={totalReferrals}
              type="count"
              description="Tracked share sources"
              icon={<PieIcon className="w-5 h-5 text-violet-700" />}
              iconBg="bg-violet-50"
            />
          </div>

          <div className="grid gap-4 xl:grid-cols-3">
            <Card variant="elevated" padding="lg" className="xl:col-span-2">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-5">
                <div>
                  <p className="text-sm font-semibold text-slate-900">Donations over time</p>
                  <p className="mt-1 text-sm text-slate-500">Line chart of donor activity in the last month.</p>
                </div>
                <span className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-slate-600">
                  30 days
                </span>
              </div>

              <div className="h-[320px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={DONATION_TREND} margin={{ top: 10, right: 20, bottom: 0, left: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                    <XAxis dataKey="date" tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} width={50} />
                    <Tooltip content={<ChartTooltip />} />
                    <Line type="monotone" dataKey="amount" stroke="#2563eb" strokeWidth={3} dot={{ r: 4, fill: '#1d4ed8' }} activeDot={{ r: 6 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </Card>

            <div className="grid gap-4">
              <Card variant="elevated" padding="lg">
                <div className="flex items-center justify-between mb-5">
                  <div>
                    <p className="text-sm font-semibold text-slate-900">Donors by asset</p>
                    <p className="mt-1 text-sm text-slate-500">How contributors split across assets.</p>
                  </div>
                </div>

                <div className="h-[240px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={ASSET_BREAKDOWN}
                        dataKey="amount"
                        nameKey="asset"
                        innerRadius={52}
                        outerRadius={88}
                        paddingAngle={4}
                      >
                        {ASSET_BREAKDOWN.map((entry, index) => (
                          <Cell key={entry.asset} fill={ASSET_COLORS[index % ASSET_COLORS.length]} />
                        ))}
                      </Pie>
                      <Legend verticalAlign="bottom" height={36} iconType="circle" iconSize={8} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                <div className="mt-4 grid gap-2">
                  {ASSET_BREAKDOWN.map((entry, index) => (
                    <div key={entry.asset} className="flex items-center justify-between gap-3 text-sm text-slate-700">
                      <div className="flex items-center gap-2">
                        <span
                          className="h-2.5 w-2.5 rounded-full"
                          style={{ backgroundColor: ASSET_COLORS[index % ASSET_COLORS.length] }}
                        />
                        <span>{entry.asset}</span>
                      </div>
                      <span className="font-medium">{formatCurrency(entry.amount)}</span>
                    </div>
                  ))}
                </div>
              </Card>

              <Card variant="elevated" padding="lg">
                <div className="flex items-center justify-between mb-5">
                  <div>
                    <p className="text-sm font-semibold text-slate-900">Geographic distribution</p>
                    <p className="mt-1 text-sm text-slate-500">Where donations are coming from.</p>
                  </div>
                </div>

                <div className="h-[240px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={GEO_DISTRIBUTION} layout="vertical" margin={{ top: 10, right: 10, bottom: 10, left: 10 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" horizontal={false} />
                      <XAxis type="number" tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} />
                      <YAxis dataKey="region" type="category" tick={{ fill: '#334155', fontSize: 12 }} axisLine={false} tickLine={false} width={110} />
                      <Tooltip formatter={(value: number) => formatCurrency(value)} />
                      <Bar dataKey="amount" fill="#16a34a" radius={[8, 0, 0, 8]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </Card>
            </div>
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <Card variant="elevated" padding="lg" className="overflow-hidden">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <p className="text-sm font-semibold text-slate-900">Top donors</p>
                  <p className="mt-1 text-sm text-slate-500">Highest-value supporters for this campaign.</p>
                </div>
                <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-slate-600">
                  Top 5
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-200 text-sm">
                  <thead className="bg-slate-50 text-slate-500">
                    <tr>
                      <th className="px-4 py-3 text-left font-semibold">Donor</th>
                      <th className="px-4 py-3 text-left font-semibold">Amount</th>
                      <th className="px-4 py-3 text-left font-semibold">Asset</th>
                      <th className="px-4 py-3 text-left font-semibold">Country</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 bg-white">
                    {TOP_DONORS.map((donor) => (
                      <tr key={donor.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-4 py-4 font-medium text-slate-900">{donor.name}</td>
                        <td className="px-4 py-4 text-slate-700">{formatCurrency(donor.amount)}</td>
                        <td className="px-4 py-4 text-slate-700">{donor.asset}</td>
                        <td className="px-4 py-4 text-slate-700">{donor.country}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>

            <Card variant="elevated" padding="lg">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <p className="text-sm font-semibold text-slate-900">Referral source tracking</p>
                  <p className="mt-1 text-sm text-slate-500">Most active channels driving campaign shares.</p>
                </div>
                <div className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-slate-600">
                  {isLoadingReferral ? 'Loading' : 'Live'}
                </div>
              </div>

              <div className="space-y-4">
                {referralSources.map((item, index) => {
                  const percentage = totalReferrals ? Math.round((item.count / totalReferrals) * 100) : 0;
                  return (
                    <div key={item.source} className="space-y-2">
                      <div className="flex items-center justify-between text-sm font-medium text-slate-900">
                        <span>{item.source}</span>
                        <span>{item.count} shares</span>
                      </div>
                      <div className="h-2 rounded-full bg-slate-200 overflow-hidden">
                        <div
                          className="h-full rounded-full"
                          style={{ width: `${percentage}%`, backgroundColor: REFERRAL_COLORS[index % REFERRAL_COLORS.length] }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>

              {referralError && (
                <p className="mt-4 rounded-2xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
                  {referralError}
                </p>
              )}
            </Card>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
