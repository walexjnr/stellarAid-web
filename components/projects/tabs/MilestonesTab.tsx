import React from 'react';
import { CheckCircle2, ExternalLink, Lock, Unlock } from 'lucide-react';
import { clsx } from 'clsx';
import type { Milestone, Project } from '@/types/api';

interface MilestonesTabProps {
  project: Project;
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

function getStatusBadge(status: Milestone['status']) {
  switch (status) {
    case 'Released':
      return {
        icon: <CheckCircle2 className="h-4 w-4" />,
        className: 'bg-success-50 text-success-700 border-success-200',
        label: 'Funds Released',
      };
    case 'Unlocked':
      return {
        icon: <Unlock className="h-4 w-4" />,
        className: 'bg-primary-50 text-primary-700 border-primary-200',
        label: 'Goal Unlocked',
      };
    case 'Locked':
    default:
      return {
        icon: <Lock className="h-4 w-4" />,
        className: 'bg-neutral-100 text-neutral-600 border-neutral-200',
        label: 'Locked',
      };
  }
}

export function MilestonesTab({ project }: MilestonesTabProps) {
  const milestones = project.milestones || [];

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-neutral-200 bg-white p-5 shadow-sm">
        <h2 className="text-xl font-bold text-neutral-900">Campaign Milestones</h2>
        <p className="mt-1 text-sm text-neutral-500">
          This campaign uses milestone-based funding. Funds are released to the creator as specific goals are met, ensuring transparency and accountability.
        </p>
      </div>

      <div className="rounded-xl border border-neutral-200 bg-white p-6 shadow-sm">
        {milestones.length === 0 ? (
          <div className="rounded-xl border border-dashed border-neutral-300 p-8 text-center">
            <p className="text-sm font-medium text-neutral-500">No milestones have been defined for this campaign.</p>
          </div>
        ) : (
          <div className="relative border-l-2 border-neutral-100 pl-6 ml-3 space-y-10">
            {milestones.map((milestone, index) => {
              const badge = getStatusBadge(milestone.status);
              
              return (
                <div key={milestone.id} className="relative">
                  {/* Timeline dot */}
                  <div 
                    className={clsx(
                      "absolute -left-[35px] flex h-6 w-6 items-center justify-center rounded-full border-2 bg-white",
                      milestone.status === 'Released' ? 'border-success-500 text-success-500' :
                      milestone.status === 'Unlocked' ? 'border-primary-500 text-primary-500' :
                      'border-neutral-300 text-neutral-400'
                    )}
                  >
                    <div className={clsx(
                      "h-2 w-2 rounded-full",
                      milestone.status === 'Released' ? 'bg-success-500' :
                      milestone.status === 'Unlocked' ? 'bg-primary-500' :
                      'bg-neutral-300'
                    )} />
                  </div>

                  <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-5">
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-3">
                          <h3 className="text-lg font-bold text-neutral-900">{milestone.title}</h3>
                          <span className={clsx("inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold uppercase", badge.className)}>
                            {badge.icon}
                            {badge.label}
                          </span>
                        </div>
                        <p className="mt-2 text-sm leading-6 text-neutral-700">{milestone.description}</p>
                      </div>
                      <div className="text-right">
                        <span className="block text-sm font-medium text-neutral-500">Target Amount</span>
                        <span className="text-xl font-extrabold text-neutral-900">
                          {formatMoney(milestone.targetAmount, project.currency)}
                        </span>
                      </div>
                    </div>

                    {milestone.txHash && (
                      <div className="mt-4 border-t border-neutral-200 pt-4">
                        <a 
                          href={`https://stellar.expert/explorer/public/tx/${milestone.txHash}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary-600 hover:text-primary-700"
                        >
                          <ExternalLink className="h-4 w-4" />
                          View Smart Contract Release
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
