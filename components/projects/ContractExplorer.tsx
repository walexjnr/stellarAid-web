import { ExternalLink, Code2 } from 'lucide-react';

interface ContractFunction {
  name: string;
  description: string;
}

interface ContractExplorerProps {
  contractId: string;
  network?: 'testnet' | 'public';
  functions?: ContractFunction[];
}

const DEFAULT_FUNCTIONS: ContractFunction[] = [
  { name: 'donate(amount, asset)', description: 'Accepts a donation in XLM or any Stellar asset.' },
  { name: 'release_milestone(index)', description: 'Releases funds for a completed milestone to the creator.' },
  { name: 'get_balance()', description: 'Returns the current locked balance of the contract.' },
  { name: 'get_milestones()', description: 'Returns the list of milestones and their status.' },
];

export function ContractExplorer({ contractId, network = 'testnet', functions }: ContractExplorerProps) {
  const explorerBase =
    network === 'public'
      ? 'https://stellar.expert/explorer/public'
      : 'https://stellar.expert/explorer/testnet';

  const contractUrl = `${explorerBase}/contract/${contractId}`;
  const contractFns = functions ?? DEFAULT_FUNCTIONS;

  return (
    <div className="rounded-xl border border-neutral-200 bg-white p-6 shadow-sm space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <Code2 className="h-5 w-5 text-primary-600" aria-hidden="true" />
          <div>
            <h3 className="text-lg font-bold text-neutral-900">Contract Explorer</h3>
            <p className="text-sm text-neutral-500">
              Verify how funds are managed by this Soroban smart contract.
            </p>
          </div>
        </div>
        <a
          href={contractUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-lg bg-[#1a3a6b] px-4 py-2 text-sm font-semibold text-white hover:bg-[#163060] transition-colors"
          aria-label="Verify this contract on Stellar Expert"
        >
          Verify Contract
          <ExternalLink className="h-4 w-4" aria-hidden="true" />
        </a>
      </div>

      {/* Contract ID */}
      <div className="rounded-lg bg-neutral-50 border border-neutral-200 p-4">
        <p className="text-xs font-semibold uppercase tracking-widest text-neutral-400 mb-1">
          Soroban Contract ID
        </p>
        <a
          href={contractUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm font-mono font-semibold text-primary-700 hover:underline break-all"
        >
          {contractId}
        </a>
      </div>

      {/* Function List */}
      <div>
        <h4 className="text-sm font-semibold text-neutral-700 mb-3 uppercase tracking-widest">
          Contract Functions
        </h4>
        <div className="space-y-2">
          {contractFns.map((fn) => (
            <div key={fn.name} className="rounded-lg border border-neutral-200 bg-neutral-50 px-4 py-3">
              <p className="text-sm font-mono font-semibold text-neutral-900">{fn.name}</p>
              <p className="text-xs text-neutral-500 mt-0.5">{fn.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
