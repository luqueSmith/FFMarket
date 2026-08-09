/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { TrendingUp, Users, DollarSign, Calendar } from 'lucide-react';

interface ChartProps {
  title: string;
  data: number[];
  labels: string[];
  type?: 'revenue' | 'users' | 'sales';
}

export const InteractiveChart: React.FC<ChartProps> = ({ title, data, labels, type = 'revenue' }) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const maxValue = Math.max(...data, 1);
  const chartHeight = 120;
  const chartWidth = 500;
  const padding = 20;

  // Generate SVG coordinates
  const points = data.map((val, idx) => {
    const x = padding + (idx * (chartWidth - padding * 2)) / (data.length - 1);
    const y = chartHeight - padding - (val / maxValue) * (chartHeight - padding * 2);
    return { x, y, value: val, label: labels[idx] };
  });

  // Create path command
  const pathD = points.reduce((acc, p, idx) => {
    return acc + (idx === 0 ? `M ${p.x} ${p.y}` : ` L ${p.x} ${p.y}`);
  }, "");

  // Create filled area path
  const areaD = pathD
    ? `${pathD} L ${points[points.length - 1].x} ${chartHeight - padding} L ${points[0].x} ${chartHeight - padding} Z`
    : "";

  const strokeColor = type === 'revenue' ? '#00d2ff' : type === 'users' ? '#9d4edd' : '#ff007f';
  const fillColorId = `grad_${type}_${Date.now()}`;

  return (
    <div id={`chart_${type}`} className="glass-panel rounded-xl p-4 border border-white/5 bg-[#111111]">
      <div className="flex items-center justify-between mb-4">
        <div>
          <span className="text-[10px] uppercase tracking-widest text-gray-400 font-bold flex items-center space-x-1">
            <Calendar className="h-3.5 w-3.5 mr-1" />
            <span>Métricas Semanales</span>
          </span>
          <h3 className="text-sm font-bold text-white mt-1">{title}</h3>
        </div>
        <div className="flex items-center space-x-1.5 bg-white/5 px-2.5 py-1 rounded text-xs text-neon-blue">
          {type === 'revenue' && <DollarSign className="h-3.5 w-3.5 text-neon-blue" />}
          {type === 'users' && <Users className="h-3.5 w-3.5 text-neon-purple" />}
          {type === 'sales' && <TrendingUp className="h-3.5 w-3.5 text-neon-pink" />}
          <span className="font-bold text-gray-200">
            {type === 'revenue' 
              ? `$${data.reduce((a, b) => a + b, 0).toLocaleString()}` 
              : data.reduce((a, b) => a + b, 0).toLocaleString()}
          </span>
        </div>
      </div>

      <div className="relative">
        <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="w-full h-auto overflow-visible">
          <defs>
            <linearGradient id={fillColorId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={strokeColor} stopOpacity="0.4" />
              <stop offset="100%" stopColor={strokeColor} stopOpacity="0.0" />
            </linearGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>

          {/* Grid lines */}
          {[0, 0.25, 0.5, 0.75, 1].map((ratio, idx) => {
            const y = padding + ratio * (chartHeight - padding * 2);
            return (
              <line
                key={idx}
                x1={padding}
                y1={y}
                x2={chartWidth - padding}
                y2={y}
                stroke="rgba(255,255,255,0.03)"
                strokeDasharray="4,4"
              />
            );
          })}

          {/* Fill Area */}
          {areaD && <path d={areaD} fill={`url(#${fillColorId})`} />}

          {/* Line Path */}
          {pathD && (
            <path
              d={pathD}
              fill="none"
              stroke={strokeColor}
              strokeWidth="2.5"
              filter="url(#glow)"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          )}

          {/* Interactive Dots */}
          {points.map((p, idx) => (
            <g key={idx}>
              <circle
                cx={p.x}
                cy={p.y}
                r={hoveredIndex === idx ? 6 : 4}
                fill={hoveredIndex === idx ? '#ffffff' : strokeColor}
                stroke={hoveredIndex === idx ? strokeColor : '#090909'}
                strokeWidth={hoveredIndex === idx ? 3 : 2}
                className="transition-all duration-150 cursor-pointer"
                onMouseEnter={() => setHoveredIndex(idx)}
                onMouseLeave={() => setHoveredIndex(null)}
              />
            </g>
          ))}
        </svg>

        {/* Hover Information overlay */}
        {hoveredIndex !== null && (
          <div 
            className="absolute bg-[#090909]/95 border border-white/10 rounded px-2.5 py-1.5 shadow-xl text-center pointer-events-none z-10"
            style={{
              left: `${(points[hoveredIndex].x / chartWidth) * 100}%`,
              bottom: '80%',
              transform: 'translateX(-50%)'
            }}
          >
            <p className="text-[9px] text-gray-500 font-bold uppercase">{points[hoveredIndex].label}</p>
            <p className="text-xs font-bold text-white">
              {type === 'revenue' ? `$${points[hoveredIndex].value.toFixed(2)}` : points[hoveredIndex].value}
            </p>
          </div>
        )}
      </div>

      {/* Axis Labels */}
      <div className="flex justify-between mt-2 px-1 text-[9px] font-bold text-gray-500 uppercase tracking-widest">
        {labels.map((lbl, idx) => (
          <span key={idx}>{lbl}</span>
        ))}
      </div>
    </div>
  );
};
