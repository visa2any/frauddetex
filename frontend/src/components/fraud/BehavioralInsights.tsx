'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface BehavioralData {
  mouseVelocity: { name: string; value: number; color: string }[];
  keystrokeRhythm: { name: string; value: number }[];
  deviceTypes: { name: string; value: number; color: string }[];
  anomalies: { type: string; count: number; severity: 'low' | 'medium' | 'high' }[];
}

export function BehavioralInsights() {
  const [data, setData] = useState<BehavioralData | null>(null);

  useEffect(() => {
    // Generate realistic behavioral data
    const generateData = (): BehavioralData => ({
      mouseVelocity: [
        { name: 'Normal', value: 78, color: '#10B981' },
        { name: 'Rápido', value: 15, color: '#F59E0B' },
        { name: 'Muito Rápido', value: 7, color: '#EF4444' }
      ],
      keystrokeRhythm: [
        { name: 'Consistente', value: 65 },
        { name: 'Variável', value: 25 },
        { name: 'Irregular', value: 10 }
      ],
      deviceTypes: [
        { name: 'Desktop', value: 62, color: '#3B82F6' },
        { name: 'Mobile', value: 28, color: '#8B5CF6' },
        { name: 'Tablet', value: 10, color: '#06B6D4' }
      ],
      anomalies: [
        { type: 'Mouse Bot-like', count: 12, severity: 'high' },
        { type: 'Velocity Spike', count: 8, severity: 'medium' },
        { type: 'Pattern Repeat', count: 23, severity: 'low' },
        { type: 'Touch Anomaly', count: 5, severity: 'medium' }
      ]
    });

    setData(generateData());

    // Update data periodically
    const interval = setInterval(() => {
      setData(generateData());
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  if (!data) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Mouse Velocity Distribution */}
      <div>
        <h4 className="text-sm font-medium mb-3">Distribuição de Velocidade do Mouse</h4>
        <ResponsiveContainer width="100%" height={120}>
          <PieChart>
            <Pie
              data={data.mouseVelocity}
              cx="50%"
              cy="50%"
              innerRadius={20}
              outerRadius={50}
              paddingAngle={2}
              dataKey="value"
            >
              {data.mouseVelocity.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
        <div className="flex justify-center space-x-4 mt-2">
          {data.mouseVelocity.map((item, index) => (
            <div key={index} className="flex items-center text-xs">
              <div 
                className="w-3 h-3 rounded-full mr-1" 
                style={{ backgroundColor: item.color }}
              ></div>
              <span>{item.name}: {item.value}%</span>
            </div>
          ))}
        </div>
      </div>

      {/* Keystroke Rhythm */}
      <div>
        <h4 className="text-sm font-medium mb-3">Padrão de Digitação</h4>
        <ResponsiveContainer width="100%" height={120}>
          <BarChart data={data.keystrokeRhythm}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" tick={{ fontSize: 10 }} />
            <YAxis hide />
            <Tooltip />
            <Bar dataKey="value" fill="#8B5CF6" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Device Types */}
      <div>
        <h4 className="text-sm font-medium mb-3">Tipos de Dispositivo</h4>
        <div className="space-y-2">
          {data.deviceTypes.map((device, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center">
                <div 
                  className="w-3 h-3 rounded-full mr-2" 
                  style={{ backgroundColor: device.color }}
                ></div>
                <span className="text-sm">{device.name}</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-16 bg-gray-200 rounded-full h-2">
                  <motion.div
                    className="h-2 rounded-full"
                    style={{ backgroundColor: device.color }}
                    initial={{ width: 0 }}
                    animate={{ width: `${device.value}%` }}
                    transition={{ duration: 1, delay: index * 0.2 }}
                  />
                </div>
                <span className="text-sm font-medium w-8">{device.value}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Anomalies Detected */}
      <div>
        <h4 className="text-sm font-medium mb-3">Anomalias Detectadas</h4>
        <div className="space-y-2">
          {data.anomalies.map((anomaly, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center justify-between p-2 bg-gray-50 rounded"
            >
              <div className="flex items-center space-x-2">
                <span className={`px-2 py-1 rounded-full text-xs ${getSeverityColor(anomaly.severity)}`}>
                  {anomaly.severity}
                </span>
                <span className="text-sm">{anomaly.type}</span>
              </div>
              <div className="text-sm font-medium">
                {anomaly.count}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 gap-4 pt-4 border-t">
        <div className="text-center">
          <div className="text-lg font-bold text-blue-600">
            {data.anomalies.reduce((sum, a) => sum + a.count, 0)}
          </div>
          <div className="text-xs text-gray-500">Total Anomalias</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-bold text-green-600">
            {data.anomalies.filter(a => a.severity === 'high').length}
          </div>
          <div className="text-xs text-gray-500">Alta Severidade</div>
        </div>
      </div>
    </div>
  );
}