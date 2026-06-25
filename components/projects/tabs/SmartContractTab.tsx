import React from 'react';
import { Clock, Code2, ExternalLink, ListChecks } from 'lucide-react';
import type { Project, ProjectContract, ContractABISummaryItem, ContractTransaction } from '@/types/api';
import { ContractExplorer } from '@/components/projects/ContractExplorer';

interface SmartContractTabProps {
  project: Project;
}

function formatMoney(value: string | number | undefined, currencyCode = 'USD') {
  const numericValue = Number(value || 0);
  if (!Number.isFinite(numericValue)) {
    return `0 ${currencyCode}`;
  }
  return numericValue.toLocaleString(undefined, {
    style: 'currency',
    currency: currencyCode,
    maximumFractionDigits: 0,
  });
}

function getNetworkLabel(network: ProjectContract['network']) {
  switch (network) {
    case 'public':
      return 'Mainnet';
    case 'futurenet':
      return 'FutureNet';
    default:
      return 'Testnet';
  }
}

function getExplorerBase(network: ProjectContract['network']) {
  return network === 'public'
    ? 'https://stellar.expert/explorer/public'
    : 'https://stellar.expert/explorer/testnet';
}

function buildAbiSummary(project: Project): ContractABISummaryItem[] {
  if (project.contract?.abiSummary?.length) {
    return project.contract.abiSummary;
  }

  if (!project.milestones?.length) {
    return [];
  }

  return project.milestones.map((milestone) => ({
    id: milestone.id,
    title: milestone.title,
    amount: formatMoney(milestone.targetAmount, project.currency || 'USD'),
    condition: milestone.description,
  }));
}

function buildTransactionHistory(project: Project): ContractTransaction[] {
  if (project.contract?.transactionHistory?.length) {
    return project.contract.transactionHistory;
  }

  return project.milestones?.filter((milestone) => milestone.txHash).map((milestone) => ({
    id: milestone.id,
    txHash: milestone.txHash as string,
    event: `${milestone.title} release`,
    amount: project.currency ? `${formatMoney(milestone.targetAmount, project.currency)}` : undefined,
    timestamp: milestone.dueDate,
    status: milestone.status === 'Released' ? 'confirmed' : 'pending',
  })) ?? [];
}

export function SmartContractTab({ project }: SmartContractTabProps) {
  const contract = project.contract;
  const abiSummary = buildAbiSummary(project);
  const transactionHistory = buildTransactionHistory(project);
  const explorerBase = contract ? getExplorerBase(contract.network) : 'https://stellar.expert/explorer';
  const contractLink = contract ? `${explorerBase}/contract/${contract.contractId}` : undefined;
  const addressValue = contract?.sorobanAddress || contract?.contractId;

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-neutral-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-bold text-neutral-900">Smart Contract Details</h2>
            <p className="mt-2 text-sm leading-6 text-neutral-500">
              View the deployed Soroban contract and on-chain release conditions for this campaign.
            </p>
          </div>
          <div className="inline-flex items-center gap-2 rounded-full bg-secondary-50 px-3 py-1 text-xs font-semibold uppercase text-secondary-700">
            <Code2 className="h-4 w-4" />
            {contract ? getNetworkLabel(contract.network) : 'No contract data'}
          </div>
        </div>

        {contract ? (
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-4">
              <p className="text-xs uppercase tracking-[0.24em] text-neutral-500">Contract ID</p>
              <a
                href={contractLink}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 block text-sm font-semibold text-primary-700 underline-offset-2 transition hover:text-primary-800"
              >
                {contract.contractId}
              </a>
              <div className="mt-3 flex items-center gap-1 text-xs text-neutral-500">
                <ExternalLink className="h-3.5 w-3.5" />
                View on Stellar Expert
              </div>
            </div>

            <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-4">
              <p className="text-xs uppercase tracking-[0.24em] text-neutral-500">Soroban contract address</p>
              <p className="mt-2 break-words text-sm font-semibold text-neutral-900">{addressValue}</p>
              {contract.deployedAt && (
                <p className="mt-3 text-xs text-neutral-500">Deployed: {new Date(contract.deployedAt).toLocaleDateString()}</p>
              )}
            </div>
          </div>
        ) : (
          <div className="mt-6 rounded-xl border border-dashed border-neutral-300 bg-neutral-50 p-6 text-center">
            <p className="text-sm font-medium text-neutral-600">No smart contract metadata is available for this campaign yet.</p>
          </div>
        )}
      </div>

      {contract && (
        <ContractExplorer
          contractId={contract.contractId}
          network={contract.network === 'public' ? 'public' : 'testnet'}
          functions={contract.abiSummary?.map((item) => ({
            name: item.title,
            description: item.description || item.condition || '',
          }))}
        />
      )}

      <div className="rounded-xl border border-neutral-200 bg-white p-6 shadow-sm">
        <div className="flex items-center gap-3">
          <ListChecks className="h-5 w-5 text-primary-600" />
          <div>
            <h3 className="text-lg font-bold text-neutral-900">ABI Summary</h3>
            <p className="text-sm text-neutral-500">Milestone amounts and release conditions are shown below for independent verification.</p>
          </div>
        </div>

        {abiSummary.length > 0 ? (
          <div className="mt-6 space-y-4">
            {abiSummary.map((item) => (
              <div key={item.id} className="rounded-xl border border-neutral-200 bg-neutral-50 p-4">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <p className="text-sm font-semibold text-neutral-900">{item.title}</p>
                    {item.condition && <p className="mt-2 text-sm leading-6 text-neutral-600">{item.condition}</p>}
                  </div>
                  {item.amount && <p className="text-sm font-semibold text-neutral-900">{item.amount}</p>}
                </div>
                {item.description && <p className="mt-3 text-sm text-neutral-500">{item.description}</p>}
              </div>
            ))}
          </div>
        ) : (
          <div className="mt-6 rounded-xl border border-dashed border-neutral-300 bg-neutral-50 p-6 text-center">
            <p className="text-sm font-medium text-neutral-600">ABI summary is not defined for this contract.</p>
          </div>
        )}
      </div>

      <div className="rounded-xl border border-neutral-200 bg-white p-6 shadow-sm">
        <div className="flex items-center gap-3">
          <Clock className="h-5 w-5 text-primary-600" />
          <div>
            <h3 className="text-lg font-bold text-neutral-900">Transaction History</h3>
            <p className="text-sm text-neutral-500">Review on-chain actions that affected this contract.</p>
          </div>
        </div>

        {transactionHistory.length > 0 ? (
          <div className="mt-6 overflow-x-auto">
            <table className="min-w-full divide-y divide-neutral-200 text-left text-sm text-neutral-700">
              <thead>
                <tr>
                  <th className="px-3 py-3 font-semibold uppercase text-neutral-500">Event</th>
                  <th className="px-3 py-3 font-semibold uppercase text-neutral-500">Amount</th>
                  <th className="px-3 py-3 font-semibold uppercase text-neutral-500">Date</th>
                  <th className="px-3 py-3 font-semibold uppercase text-neutral-500">Transaction</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200">
                {transactionHistory.map((tx) => (
                  <tr key={tx.id}>
                    <td className="px-3 py-4 font-semibold text-neutral-900">{tx.event}</td>
                    <td className="px-3 py-4">{tx.amount || '-'}</td>
                    <td className="px-3 py-4">{tx.timestamp ? new Date(tx.timestamp).toLocaleDateString() : '-'}</td>
                    <td className="px-3 py-4">
                      <a
                        href={`${explorerBase}/tx/${tx.txHash}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-sm font-semibold text-primary-600 hover:text-primary-800"
                      >
                        View
                        <ExternalLink className="h-3.5 w-3.5" />
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="mt-6 rounded-xl border border-dashed border-neutral-300 bg-neutral-50 p-6 text-center">
            <p className="text-sm font-medium text-neutral-600">No contract transactions have been recorded yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}
