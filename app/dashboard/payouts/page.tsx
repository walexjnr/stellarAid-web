"use client";

import React, { useState, useEffect } from "react";
import { useAuthStore } from "@/store/authStore";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

type Payout = {
  id: string;
  milestone: string;
  amount: string;
  asset: string;
  date: string;
  txHash: string;
};

export default function PayoutsPage() {
  const { user } = useAuthStore();
  const [payouts, setPayouts] = useState<Payout[]>([]);
  const [totalReceived, setTotalReceived] = useState(0);

  useEffect(() => {
    // Mock data for payouts
    const mockPayouts: Payout[] = [
      {
        id: "1",
        milestone: "Phase 1: Setup",
        amount: "500",
        asset: "XLM",
        date: "2023-10-01",
        txHash: "a1b2c3d4e5f6g7h8i9j0",
      },
      {
        id: "2",
        milestone: "Phase 2: Development",
        amount: "1500",
        asset: "XLM",
        date: "2023-11-15",
        txHash: "0j9i8h7g6f5e4d3c2b1a",
      },
    ];
    setPayouts(mockPayouts);

    const total = mockPayouts.reduce(
      (sum, p) => sum + parseFloat(p.amount),
      0
    );
    setTotalReceived(total);
  }, []);

  const exportToCSV = () => {
    const headers = ["Milestone", "Amount", "Asset", "Date", "Tx Hash"];
    const csvRows = [headers.join(",")];

    payouts.forEach((p) => {
      const row = [p.milestone, p.amount, p.asset, p.date, p.txHash];
      csvRows.push(row.join(","));
    });

    const csvString = csvRows.join("\n");
    const blob = new Blob([csvString], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "payouts.csv";
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Payouts</h1>
          <p className="text-gray-500">View and manage your received payouts.</p>
        </div>
        <Button onClick={exportToCSV}>Export to CSV</Button>
      </div>

      <Card className="mb-6 p-6">
        <h2 className="text-lg font-semibold mb-2">Total Received</h2>
        <p className="text-3xl font-bold text-green-600">{totalReceived} XLM</p>
      </Card>

      <Card className="overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-4 font-semibold text-gray-600">Milestone</th>
              <th className="p-4 font-semibold text-gray-600">Amount</th>
              <th className="p-4 font-semibold text-gray-600">Asset</th>
              <th className="p-4 font-semibold text-gray-600">Date</th>
              <th className="p-4 font-semibold text-gray-600">Tx Hash</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {payouts.length > 0 ? (
              payouts.map((p) => (
                <tr key={p.id} className="hover:bg-gray-50">
                  <td className="p-4">{p.milestone}</td>
                  <td className="p-4 font-medium">{p.amount}</td>
                  <td className="p-4">{p.asset}</td>
                  <td className="p-4 text-gray-500">{p.date}</td>
                  <td className="p-4 font-mono text-sm text-blue-600">
                    {p.txHash.substring(0, 8)}...
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="p-8 text-center text-gray-500">
                  No payouts found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
