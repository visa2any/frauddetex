'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, AlertTriangle, Info, Clock, MapPin, Users } from 'lucide-react';

interface ThreatIntelligenceItem {
  id: string;
  type: 'ip' | 'email_pattern' | 'device_fingerprint' | 'behavioral_pattern';
  title: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  confidence: number;
  timestamp: Date;
  source: string;
  location?: string;
  affectedUsers?: number;
}

export function ThreatIntelligenceFeed() {
  const [threats, setThreats] = useState<ThreatIntelligenceItem[]>([]);
  const [filter, setFilter] = useState<string>('all');

  useEffect(() => {
    // Generate initial threat intelligence data
    const generateThreats = (): ThreatIntelligenceItem[] => {
      const threatTypes = ['ip', 'email_pattern', 'device_fingerprint', 'behavioral_pattern'] as const;
      const severities = ['low', 'medium', 'high', 'critical'] as const;
      const locations = ['São Paulo', 'Rio de Janeiro', 'Belo Horizonte', 'Brasília', 'Global'];
      
      const threatTemplates = [
        {
          type: 'ip' as const,
          title: 'Suspicious IP Range Detected',
          description: 'Multiple fraud attempts from VPN exit nodes'
        },
        {
          type: 'email_pattern' as const,
          title: 'Disposable Email Pattern',
          description: 'New temporary email domain identified'
        },
        {
          type: 'device_fingerprint' as const,
          title: 'Bot-like Device Signature',
          description: 'Automated device characteristics detected'
        },
        {
          type: 'behavioral_pattern' as const,
          title: 'Abnormal Mouse Movement',
          description: 'Non-human interaction patterns identified'
        }
      ];

      return Array.from({ length: 15 }, (_, i) => {
        const template = threatTemplates[Math.floor(Math.random() * threatTemplates.length)];
        const severity = severities[Math.floor(Math.random() * severities.length)];
        
        return {
          id: `threat-${i}`,
          type: template.type,
          title: template.title,
          description: template.description,
          severity,
          confidence: 0.6 + Math.random() * 0.4,
          timestamp: new Date(Date.now() - Math.random() * 86400000 * 7), // Last 7 days
          source: `Community Node ${Math.floor(Math.random() * 100)}`,
          location: locations[Math.floor(Math.random() * locations.length)],
          affectedUsers: Math.floor(Math.random() * 1000) + 10
        };
      }).sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
    };

    setThreats(generateThreats());

    // Simulate new threats coming in
    const interval = setInterval(() => {
      const newThreat = generateThreats()[0];
      newThreat.id = `threat-${Date.now()}`;
      newThreat.timestamp = new Date();
      
      setThreats(prev => [newThreat, ...prev.slice(0, 14)]);
    }, 15000);

    return () => clearInterval(interval);
  }, []);

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical': return <AlertTriangle className="h-4 w-4 text-red-600" />;
      case 'high': return <AlertTriangle className="h-4 w-4 text-orange-600" />;
      case 'medium': return <Shield className="h-4 w-4 text-yellow-600" />;
      case 'low': return <Info className="h-4 w-4 text-blue-600" />;
      default: return <Info className="h-4 w-4 text-gray-600" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'border-red-200 bg-red-50';
      case 'high': return 'border-orange-200 bg-orange-50';
      case 'medium': return 'border-yellow-200 bg-yellow-50';
      case 'low': return 'border-blue-200 bg-blue-50';
      default: return 'border-gray-200 bg-gray-50';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'ip': return <MapPin className="h-3 w-3" />;
      case 'email_pattern': return <Shield className="h-3 w-3" />;
      case 'device_fingerprint': return <Users className="h-3 w-3" />;
      case 'behavioral_pattern': return <AlertTriangle className="h-3 w-3" />;
      default: return <Info className="h-3 w-3" />;
    }
  };

  const filteredThreats = filter === 'all' 
    ? threats 
    : threats.filter(threat => threat.severity === filter);

  return (
    <div className="space-y-4">
      {/* Filter Buttons */}
      <div className="flex space-x-2">
        {['all', 'critical', 'high', 'medium', 'low'].map((filterOption) => (
          <button
            key={filterOption}
            onClick={() => setFilter(filterOption)}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
              filter === filterOption
                ? 'bg-blue-100 text-blue-800 border border-blue-200'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {filterOption === 'all' ? 'Todos' : filterOption}
          </button>
        ))}
      </div>

      {/* Threat Feed */}
      <div className="space-y-3 max-h-96 overflow-y-auto">
        <AnimatePresence>
          {filteredThreats.map((threat, index) => (
            <motion.div
              key={threat.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ delay: index * 0.05 }}
              className={`p-3 rounded-lg border ${getSeverityColor(threat.severity)}`}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center space-x-2">
                  {getSeverityIcon(threat.severity)}
                  <h5 className="font-medium text-sm">{threat.title}</h5>
                  <div className="flex items-center space-x-1 text-gray-500">
                    {getTypeIcon(threat.type)}
                    <span className="text-xs capitalize">{threat.type.replace('_', ' ')}</span>
                  </div>
                </div>
                <div className="text-xs text-gray-500 flex items-center">
                  <Clock className="h-3 w-3 mr-1" />
                  {threat.timestamp.toLocaleTimeString()}
                </div>
              </div>
              
              <p className="text-sm text-gray-700 mb-2">{threat.description}</p>
              
              <div className="flex items-center justify-between text-xs text-gray-500">
                <div className="flex items-center space-x-4">
                  <span>Confiança: {(threat.confidence * 100).toFixed(0)}%</span>
                  {threat.location && (
                    <span className="flex items-center">
                      <MapPin className="h-3 w-3 mr-1" />
                      {threat.location}
                    </span>
                  )}
                  {threat.affectedUsers && (
                    <span className="flex items-center">
                      <Users className="h-3 w-3 mr-1" />
                      {threat.affectedUsers} usuários
                    </span>
                  )}
                </div>
                <span>Fonte: {threat.source}</span>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-4 gap-2 pt-4 border-t">
        {['critical', 'high', 'medium', 'low'].map((severity) => {
          const count = threats.filter(t => t.severity === severity).length;
          return (
            <div key={severity} className="text-center">
              <div className={`text-lg font-bold ${
                severity === 'critical' ? 'text-red-600' :
                severity === 'high' ? 'text-orange-600' :
                severity === 'medium' ? 'text-yellow-600' : 'text-blue-600'
              }`}>
                {count}
              </div>
              <div className="text-xs text-gray-500 capitalize">{severity}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}