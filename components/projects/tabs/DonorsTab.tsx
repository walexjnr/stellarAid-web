import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, UserCircle2 } from 'lucide-react';
import type { DonorLeaderboardEntry, Project } from '@/types/api';

interface DonorsTabProps {
  project: Project;
}

const ITEMS_PER_PAGE = 20;

function formatAddress(address: string) {
  if (!address || address.length < 10) return address;
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

function formatDate(value: string) {
  return new Date(value).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

function formatMoney(value: string | number, currencyCode: string = 'USD') {
  const numericValue = Number(value || 0);
  try {
    return numericValue.toLocaleString(undefined, {
      style: 'currency',
      currency: currencyCode,
      maximumFractionDigits: 0,
    });
  } catch (e) {
    return `${numericValue.toLocaleString(undefined, { maximumFractionDigits: 0 })} ${currencyCode}`;
  }
}

export function DonorsTab({ project }: DonorsTabProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const donors = project.donorsList || [];
  
  const totalPages = Math.max(1, Math.ceil(donors.length / ITEMS_PER_PAGE));
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentDonors = donors.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-neutral-200 bg-white p-5 shadow-sm">
        <div>
          <h2 className="text-xl font-bold text-neutral-900">Top Donors</h2>
          <p className="text-sm text-neutral-500">A huge thank you to everyone supporting this campaign.</p>
        </div>
        <div className="rounded-lg bg-primary-50 px-4 py-2 text-center">
          <span className="block text-2xl font-extrabold text-primary-700">{donors.length.toLocaleString()}</span>
          <span className="text-xs font-bold uppercase text-primary-600">Total Donors</span>
        </div>
      </div>

      <div className="rounded-xl border border-neutral-200 bg-white shadow-sm overflow-hidden">
        {donors.length === 0 ? (
          <div className="p-8 text-center border-dashed border-2 border-neutral-200 m-6 rounded-xl">
            <p className="text-sm font-medium text-neutral-500">No donations have been made yet. Be the first!</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-neutral-600">
              <thead className="bg-neutral-50 text-xs uppercase text-neutral-500 border-b border-neutral-200">
                <tr>
                  <th scope="col" className="px-6 py-4 font-bold">Rank</th>
                  <th scope="col" className="px-6 py-4 font-bold">Donor</th>
                  <th scope="col" className="px-6 py-4 font-bold">Amount</th>
                  <th scope="col" className="px-6 py-4 font-bold hidden sm:table-cell">Asset</th>
                  <th scope="col" className="px-6 py-4 font-bold hidden md:table-cell">Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 bg-white">
                {currentDonors.map((donor, index) => {
                  const rank = startIndex + index + 1;
                  return (
                    <tr key={donor.id} className="transition-colors hover:bg-neutral-50/50">
                      <td className="whitespace-nowrap px-6 py-4 font-bold text-neutral-900">
                        #{rank}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <UserCircle2 className="h-8 w-8 text-neutral-300" />
                          <div>
                            <p className="font-semibold text-neutral-900">
                              {donor.isAnonymous ? 'Anonymous' : (donor.donorName || 'Generous Donor')}
                            </p>
                            {!donor.isAnonymous && (
                              <p className="text-xs text-neutral-500 font-mono">
                                {formatAddress(donor.walletAddress)}
                              </p>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 font-extrabold text-success-600">
                        {formatMoney(donor.amount, project.currency)}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 hidden sm:table-cell">
                        <span className="inline-flex items-center rounded-md bg-neutral-100 px-2 py-1 text-xs font-medium text-neutral-600">
                          {donor.asset}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-xs text-neutral-500 hidden md:table-cell">
                        {formatDate(donor.timestamp)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-neutral-200 bg-white px-6 py-3">
            <p className="text-sm text-neutral-500">
              Showing <span className="font-medium text-neutral-900">{startIndex + 1}</span> to <span className="font-medium text-neutral-900">{Math.min(startIndex + ITEMS_PER_PAGE, donors.length)}</span> of <span className="font-medium text-neutral-900">{donors.length}</span> results
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="inline-flex h-8 w-8 items-center justify-center rounded border border-neutral-200 bg-white text-neutral-500 hover:bg-neutral-50 disabled:opacity-50 disabled:pointer-events-none"
                aria-label="Previous page"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="inline-flex h-8 w-8 items-center justify-center rounded border border-neutral-200 bg-white text-neutral-500 hover:bg-neutral-50 disabled:opacity-50 disabled:pointer-events-none"
                aria-label="Next page"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
