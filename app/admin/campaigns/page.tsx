'use client';

import { useEffect, useState } from 'react';

type Campaign = {
  id: string;
  title: string;
  status: 'ACTIVE' | 'PENDING' | 'SUSPENDED' | 'REMOVED';
  creatorName: string;
  creatorEmail: string;
  flagCount: number;
  createdAt: string;
};

const PAGE_SIZE = 10;

export default function AdminCampaignsPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [filtered, setFiltered] = useState<Campaign[]>([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [flagModal, setFlagModal] = useState<{ id: string; action: 'SUSPEND' | 'REMOVE' } | null>(null);
  const [flagReason, setFlagReason] = useState('');

  const fetchCampaigns = async () => {
    try {
      setIsLoading(true);
      const res = await fetch('/api/admin/campaigns');
      if (!res.ok) throw new Error('Failed to fetch');
      const data = await res.json();
      setCampaigns(data);
      setFiltered(data);
    } catch {
      // fallback: show empty
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchCampaigns(); }, []);

  useEffect(() => {
    let temp = [...campaigns];
    if (search) {
      temp = temp.filter(
        (c) =>
          c.title.toLowerCase().includes(search.toLowerCase()) ||
          c.creatorName.toLowerCase().includes(search.toLowerCase()),
      );
    }
    if (statusFilter) temp = temp.filter((c) => c.status === statusFilter);
    setFiltered(temp);
    setPage(1);
  }, [search, statusFilter, campaigns]);

  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);

  const updateStatus = async (id: string, status: string, reason?: string) => {
    try {
      await fetch(`/api/admin/campaigns/${id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, reason }),
      });
      await fetchCampaigns();
    } catch {
      alert('Action failed');
    }
  };

  const handleFlagSubmit = async () => {
    if (!flagModal || !flagReason.trim()) return;
    await updateStatus(flagModal.id, flagModal.action, flagReason);
    setFlagModal(null);
    setFlagReason('');
  };

  if (isLoading) {
    return (
      <div className="p-6 animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-1/4 mb-4" />
        <div className="h-64 bg-gray-200 rounded" />
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Campaign Management</h1>

      <div className="flex flex-wrap gap-3 mb-6">
        <input
          placeholder="Search campaigns or creator..."
          className="border p-2 rounded w-full md:w-1/3"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          className="border p-2 rounded"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="">All Status</option>
          <option value="ACTIVE">Active</option>
          <option value="PENDING">Pending</option>
          <option value="SUSPENDED">Suspended</option>
          <option value="REMOVED">Removed</option>
        </select>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border border-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {['Title', 'Status', 'Creator', 'Flags', 'Created', 'Actions'].map((h) => (
                <th key={h} className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {paginated.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-gray-400">
                  No campaigns found.
                </td>
              </tr>
            ) : (
              paginated.map((c) => (
                <tr key={c.id} className="hover:bg-gray-50">
                  <td className="px-4 py-4 font-medium">{c.title}</td>
                  <td className="px-4 py-4">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      c.status === 'ACTIVE' ? 'bg-green-100 text-green-800' :
                      c.status === 'SUSPENDED' ? 'bg-yellow-100 text-yellow-800' :
                      c.status === 'REMOVED' ? 'bg-red-100 text-red-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {c.status}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <div className="text-sm">{c.creatorName}</div>
                    <div className="text-xs text-gray-400">{c.creatorEmail}</div>
                  </td>
                  <td className="px-4 py-4 text-sm">{c.flagCount}</td>
                  <td className="px-4 py-4 text-sm">
                    {new Date(c.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex gap-2 flex-wrap">
                      {c.status !== 'ACTIVE' && (
                        <button
                          onClick={() => updateStatus(c.id, 'ACTIVE')}
                          className="text-green-600 hover:text-green-800 text-sm"
                        >
                          Approve
                        </button>
                      )}
                      {c.status !== 'SUSPENDED' && c.status !== 'REMOVED' && (
                        <button
                          onClick={() => setFlagModal({ id: c.id, action: 'SUSPEND' })}
                          className="text-yellow-600 hover:text-yellow-800 text-sm"
                        >
                          Suspend
                        </button>
                      )}
                      {c.status !== 'REMOVED' && (
                        <button
                          onClick={() => setFlagModal({ id: c.id, action: 'REMOVE' })}
                          className="text-red-600 hover:text-red-800 text-sm"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex justify-between items-center mt-6">
          <button
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
            className="px-4 py-2 border rounded disabled:opacity-50 hover:bg-gray-50"
          >
            Previous
          </button>
          <span className="text-sm text-gray-600">
            Page {page} of {totalPages} ({filtered.length} campaigns)
          </span>
          <button
            disabled={page === totalPages}
            onClick={() => setPage((p) => p + 1)}
            className="px-4 py-2 border rounded disabled:opacity-50 hover:bg-gray-50"
          >
            Next
          </button>
        </div>
      )}

      {flagModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-96 mx-4">
            <h2 className="text-lg font-bold mb-4">
              {flagModal.action === 'SUSPEND' ? 'Suspend Campaign' : 'Remove Campaign'}
            </h2>
            <p className="text-sm text-gray-600 mb-4">
              A reason is required for this action. The creator will be notified.
            </p>
            <textarea
              className="border rounded w-full p-2 text-sm mb-4"
              rows={3}
              placeholder="Enter reason..."
              value={flagReason}
              onChange={(e) => setFlagReason(e.target.value)}
            />
            <div className="flex gap-3">
              <button
                onClick={handleFlagSubmit}
                disabled={!flagReason.trim()}
                className="flex-1 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 disabled:opacity-50"
              >
                Confirm
              </button>
              <button
                onClick={() => { setFlagModal(null); setFlagReason(''); }}
                className="flex-1 bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
