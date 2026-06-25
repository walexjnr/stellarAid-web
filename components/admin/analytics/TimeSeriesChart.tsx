
'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

const TimeSeriesChart = () => {
  const [timeframe, setTimeframe] = useState('7d');

  const handleTimeframeChange = (newTimeframe: string) => {
    setTimeframe(newTimeframe);
    // Logic to fetch and update chart data based on the new timeframe
  };

  return (
    <Card>
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold">Activity Over Time</h3>
        <div className="flex space-x-2">
          <Button variant={timeframe === '7d' ? 'default' : 'outline'} onClick={() => handleTimeframeChange('7d')}>7d</Button>
          <Button variant={timeframe === '30d' ? 'default' : 'outline'} onClick={() => handleTimeframeChange('30d')}>30d</Button>
          <Button variant={timeframe === '90d' ? 'default' : 'outline'} onClick={() => handleTimeframeChange('90d')}>90d</Button>
        </div>
      </div>
      {/* Placeholder for the chart */}
      <div className="h-64 bg-gray-200 rounded-md flex items-center justify-center">
        <p className="text-gray-500">Time-series chart will be here</p>
      </div>
    </Card>
  );
};

export default TimeSeriesChart;