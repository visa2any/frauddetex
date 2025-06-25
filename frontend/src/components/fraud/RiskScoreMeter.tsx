'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface RiskScoreMeterProps {
  score: number;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  className?: string;
}

export function RiskScoreMeter({ 
  score, 
  size = 'md', 
  showLabel = true, 
  className 
}: RiskScoreMeterProps) {
  // Clamp score between 0 and 100
  const normalizedScore = Math.max(0, Math.min(100, score));
  
  // Calculate rotation angle (180 degrees for semicircle)
  const rotation = (normalizedScore / 100) * 180;
  
  // Determine color based on score
  const getScoreColor = (score: number) => {
    if (score < 30) return { color: '#10B981', label: 'Baixo Risco' };
    if (score < 70) return { color: '#F59E0B', label: 'Médio Risco' };
    return { color: '#EF4444', label: 'Alto Risco' };
  };

  const { color, label } = getScoreColor(normalizedScore);

  // Size configurations
  const sizeConfig = {
    sm: {
      width: 80,
      height: 40,
      strokeWidth: 6,
      radius: 30,
      fontSize: 'text-xs',
      labelSize: 'text-xs'
    },
    md: {
      width: 120,
      height: 60,
      strokeWidth: 8,
      radius: 45,
      fontSize: 'text-sm',
      labelSize: 'text-sm'
    },
    lg: {
      width: 160,
      height: 80,
      strokeWidth: 10,
      radius: 60,
      fontSize: 'text-lg',
      labelSize: 'text-base'
    }
  };

  const config = sizeConfig[size];
  const circumference = Math.PI * config.radius;
  const strokeOffset = circumference - (normalizedScore / 100) * circumference;

  return (
    <div className={cn('flex flex-col items-center', className)}>
      <div className="relative" style={{ width: config.width, height: config.height }}>
        <svg 
          width={config.width} 
          height={config.height} 
          viewBox={`0 0 ${config.width} ${config.height}`}
          className="transform -rotate-90"
        >
          {/* Background arc */}
          <path
            d={`M ${config.strokeWidth} ${config.height - config.strokeWidth} A ${config.radius} ${config.radius} 0 0 1 ${config.width - config.strokeWidth} ${config.height - config.strokeWidth}`}
            fill="none"
            stroke="#E5E7EB"
            strokeWidth={config.strokeWidth}
            strokeLinecap="round"
          />
          
          {/* Animated progress arc */}
          <motion.path
            d={`M ${config.strokeWidth} ${config.height - config.strokeWidth} A ${config.radius} ${config.radius} 0 0 1 ${config.width - config.strokeWidth} ${config.height - config.strokeWidth}`}
            fill="none"
            stroke={color}
            strokeWidth={config.strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeOffset}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: strokeOffset }}
            transition={{ duration: 1.5, ease: 'easeInOut' }}
          />
          
          {/* Score indicator dot */}
          <motion.circle
            cx={config.width / 2 + Math.cos((rotation - 90) * Math.PI / 180) * config.radius}
            cy={config.height - config.strokeWidth + Math.sin((rotation - 90) * Math.PI / 180) * config.radius}
            r={config.strokeWidth / 2}
            fill={color}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1, duration: 0.5 }}
          />
        </svg>
        
        {/* Score text in center */}
        <div className="absolute inset-0 flex items-end justify-center pb-1">
          <motion.div 
            className="text-center"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            <div className={cn('font-bold', config.fontSize)} style={{ color }}>
              {Math.round(normalizedScore)}
            </div>
            {size !== 'sm' && (
              <div className="text-xs text-gray-500 -mt-1">%</div>
            )}
          </motion.div>
        </div>
      </div>
      
      {/* Risk level label */}
      {showLabel && (
        <motion.div 
          className={cn('mt-2 text-center', config.labelSize)}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.3 }}
        >
          <div className="font-medium" style={{ color }}>
            {label}
          </div>
          {size === 'lg' && (
            <div className="text-xs text-gray-500 mt-1">
              Score: {normalizedScore.toFixed(1)}
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
}

interface RiskScoreBarProps {
  score: number;
  className?: string;
  showPercentage?: boolean;
}

export function RiskScoreBar({ score, className, showPercentage = true }: RiskScoreBarProps) {
  const normalizedScore = Math.max(0, Math.min(100, score));
  const { color } = (() => {
    if (normalizedScore < 30) return { color: '#10B981' };
    if (normalizedScore < 70) return { color: '#F59E0B' };
    return { color: '#EF4444' };
  })();

  return (
    <div className={cn('w-full', className)}>
      <div className="flex justify-between items-center mb-1">
        <span className="text-sm font-medium">Risk Score</span>
        {showPercentage && (
          <span className="text-sm font-bold" style={{ color }}>
            {Math.round(normalizedScore)}%
          </span>
        )}
      </div>
      <div className="w-full bg-gray-200 rounded-full h-3 relative overflow-hidden">
        <motion.div
          className="h-full rounded-full relative"
          style={{ backgroundColor: color }}
          initial={{ width: 0 }}
          animate={{ width: `${normalizedScore}%` }}
          transition={{ duration: 1, ease: 'easeOut' }}
        >
          {/* Animated glow effect */}
          <motion.div
            className="absolute inset-0 rounded-full opacity-50"
            style={{ backgroundColor: color }}
            animate={{ 
              opacity: [0.3, 0.7, 0.3],
              scale: [1, 1.02, 1]
            }}
            transition={{ 
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut'
            }}
          />
        </motion.div>
        
        {/* Risk zone indicators */}
        <div className="absolute inset-0 flex">
          <div className="w-[30%] border-r border-white border-opacity-50" />
          <div className="w-[40%] border-r border-white border-opacity-50" />
          <div className="w-[30%]" />
        </div>
      </div>
      
      {/* Zone labels */}
      <div className="flex justify-between text-xs text-gray-500 mt-1">
        <span>Baixo</span>
        <span>Médio</span>
        <span>Alto</span>
      </div>
    </div>
  );
}

interface RiskScoreIndicatorProps {
  score: number;
  threshold?: number;
  className?: string;
}

export function RiskScoreIndicator({ 
  score, 
  threshold = 50, 
  className 
}: RiskScoreIndicatorProps) {
  const normalizedScore = Math.max(0, Math.min(100, score));
  const isHighRisk = normalizedScore >= threshold;
  
  const pulseColor = isHighRisk ? 'bg-red-500' : normalizedScore >= 30 ? 'bg-yellow-500' : 'bg-green-500';
  const bgColor = isHighRisk ? 'bg-red-100' : normalizedScore >= 30 ? 'bg-yellow-100' : 'bg-green-100';

  return (
    <div className={cn('flex items-center space-x-2', className)}>
      <div className={`relative w-3 h-3 rounded-full ${bgColor}`}>
        <motion.div
          className={`absolute inset-0 rounded-full ${pulseColor}`}
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.7, 1, 0.7]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut'
          }}
        />
      </div>
      <span className="text-sm font-medium">
        {Math.round(normalizedScore)}% Risk
      </span>
    </div>
  );
}