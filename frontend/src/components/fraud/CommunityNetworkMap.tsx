'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface NetworkNode {
  id: string;
  x: number;
  y: number;
  reputation: number;
  connections: string[];
  isActive: boolean;
}

export function CommunityNetworkMap() {
  const [nodes, setNodes] = useState<NetworkNode[]>([]);

  useEffect(() => {
    // Generate network nodes
    const generateNodes = (): NetworkNode[] => {
      const nodeCount = 12;
      const generatedNodes: NetworkNode[] = [];
      
      for (let i = 0; i < nodeCount; i++) {
        const angle = (i / nodeCount) * 2 * Math.PI;
        const radius = 80 + Math.random() * 40;
        
        generatedNodes.push({
          id: `node-${i}`,
          x: 150 + Math.cos(angle) * radius,
          y: 150 + Math.sin(angle) * radius,
          reputation: 50 + Math.random() * 50,
          connections: [],
          isActive: Math.random() > 0.3
        });
      }
      
      // Add random connections
      generatedNodes.forEach(node => {
        const connectionCount = Math.floor(Math.random() * 3) + 1;
        for (let i = 0; i < connectionCount; i++) {
          const targetNode = generatedNodes[Math.floor(Math.random() * generatedNodes.length)];
          if (targetNode.id !== node.id && !node.connections.includes(targetNode.id)) {
            node.connections.push(targetNode.id);
          }
        }
      });
      
      return generatedNodes;
    };

    setNodes(generateNodes());

    // Simulate network activity
    const interval = setInterval(() => {
      setNodes(prev => prev.map(node => ({
        ...node,
        isActive: Math.random() > 0.7,
        reputation: Math.max(0, Math.min(100, node.reputation + (Math.random() - 0.5) * 5))
      })));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const getNodeColor = (reputation: number) => {
    if (reputation >= 80) return '#10B981'; // Green
    if (reputation >= 60) return '#F59E0B'; // Yellow
    if (reputation >= 40) return '#EF4444'; // Red
    return '#6B7280'; // Gray
  };

  return (
    <div className="relative w-full h-80 bg-gray-50 rounded-lg overflow-hidden">
      <svg width="100%" height="100%" viewBox="0 0 300 300">
        {/* Render connections */}
        {nodes.map(node => 
          node.connections.map(targetId => {
            const targetNode = nodes.find(n => n.id === targetId);
            if (!targetNode) return null;
            
            return (
              <motion.line
                key={`${node.id}-${targetId}`}
                x1={node.x}
                y1={node.y}
                x2={targetNode.x}
                y2={targetNode.y}
                stroke="#E5E7EB"
                strokeWidth="1"
                opacity={node.isActive && targetNode.isActive ? 0.8 : 0.3}
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 2 }}
              />
            );
          })
        )}
        
        {/* Render nodes */}
        {nodes.map(node => (
          <g key={node.id}>
            {/* Node glow effect for active nodes */}
            {node.isActive && (
              <motion.circle
                cx={node.x}
                cy={node.y}
                r="12"
                fill={getNodeColor(node.reputation)}
                opacity="0.3"
                animate={{
                  r: [8, 16, 8],
                  opacity: [0.3, 0.1, 0.3]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
            )}
            
            {/* Main node */}
            <motion.circle
              cx={node.x}
              cy={node.y}
              r="6"
              fill={getNodeColor(node.reputation)}
              stroke="#FFFFFF"
              strokeWidth="2"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: Math.random() * 2 }}
              className="cursor-pointer"
            />
            
            {/* Node label */}
            <text
              x={node.x}
              y={node.y + 20}
              textAnchor="middle"
              fontSize="8"
              fill="#6B7280"
            >
              {node.reputation.toFixed(0)}
            </text>
          </g>
        ))}
        
        {/* Central hub */}
        <motion.circle
          cx="150"
          cy="150"
          r="8"
          fill="#3B82F6"
          stroke="#FFFFFF"
          strokeWidth="3"
          animate={{
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <text
          x="150"
          y="140"
          textAnchor="middle"
          fontSize="10"
          fill="#3B82F6"
          fontWeight="bold"
        >
          HUB
        </text>
      </svg>
      
      {/* Legend */}
      <div className="absolute bottom-2 right-2 bg-white p-2 rounded text-xs">
        <div className="flex items-center space-x-1 mb-1">
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          <span>Alta Rep.</span>
        </div>
        <div className="flex items-center space-x-1 mb-1">
          <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
          <span>Média Rep.</span>
        </div>
        <div className="flex items-center space-x-1">
          <div className="w-2 h-2 bg-red-500 rounded-full"></div>
          <span>Baixa Rep.</span>
        </div>
      </div>
      
      {/* Network stats */}
      <div className="absolute top-2 left-2 bg-white p-2 rounded text-xs">
        <div>Nós Ativos: {nodes.filter(n => n.isActive).length}</div>
        <div>Total: {nodes.length}</div>
        <div>Conexões: {nodes.reduce((sum, n) => sum + n.connections.length, 0)}</div>
      </div>
    </div>
  );
}