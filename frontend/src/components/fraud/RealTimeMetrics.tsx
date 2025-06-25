'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface MetricData {
  timestamp: string;
  requests: number;
  fraudDetected: number;
  averageLatency: number;
  accuracy: number;
}

export function RealTimeMetrics() {
  const [metrics, setMetrics] = useState<MetricData[]>([]);

  useEffect(() => {
    // Generate initial data
    const initialData: MetricData[] = [];
    const now = Date.now();
    
    for (let i = 29; i >= 0; i--) {
      const timestamp = new Date(now - i * 60000).toLocaleTimeString();
      initialData.push({
        timestamp,
        requests: Math.floor(Math.random() * 100) + 50,
        fraudDetected: Math.floor(Math.random() * 5),
        averageLatency: 40 + Math.random() * 20,
        accuracy: 90 + Math.random() * 8
      });
    }
    
    setMetrics(initialData);

    // Simulate real-time updates
    const interval = setInterval(() => {
      setMetrics(prev => {
        const newMetrics = [...prev.slice(1)];
        newMetrics.push({
          timestamp: new Date().toLocaleTimeString(),
          requests: Math.floor(Math.random() * 100) + 50,
          fraudDetected: Math.floor(Math.random() * 5),
          averageLatency: 40 + Math.random() * 20,
          accuracy: 90 + Math.random() * 8
        });
        return newMetrics;
      });
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-6">
      {/* Requests per Minute */}
      <div>
        <h4 className="text-sm font-medium mb-2">Requests por Minuto</h4>
        <ResponsiveContainer width="100%" height={120}>
          <LineChart data={metrics}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="timestamp" hide />
            <YAxis hide />
            <Tooltip />
            <Line 
              type="monotone" 
              dataKey="requests" 
              stroke="#3B82F6" 
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Latency */}
      <div>
        <h4 className="text-sm font-medium mb-2">Latência (ms)</h4>
        <ResponsiveContainer width="100%" height={120}>
          <LineChart data={metrics}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="timestamp" hide />
            <YAxis hide />
            <Tooltip />
            <Line 
              type="monotone" 
              dataKey="averageLatency" 
              stroke="#10B981" 
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Accuracy */}
      <div>
        <h4 className="text-sm font-medium mb-2">Precisão (%)</h4>
        <ResponsiveContainer width="100%" height={120}>
          <LineChart data={metrics}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="timestamp" hide />
            <YAxis hide />
            <Tooltip />
            <Line 
              type="monotone" 
              dataKey="accuracy" 
              stroke="#8B5CF6" 
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Current Stats */}
      <div className="grid grid-cols-2 gap-4 pt-4 border-t">
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-600">
            {metrics[metrics.length - 1]?.requests || 0}
          </div>
          <div className="text-xs text-gray-500">Requests/min</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-green-600">
            {metrics[metrics.length - 1]?.averageLatency.toFixed(0) || 0}ms
          </div>
          <div className="text-xs text-gray-500">Latência</div>
        </div>
      </div>
    </div>
  );
}