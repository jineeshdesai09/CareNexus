"use client";

import React from 'react';

interface VitalData {
    date: string;
    value: number | null;
}

interface VitalsChartProps {
    data: VitalData[];
    label: string;
    color: string;
    unit: string;
}

export default function VitalsChart({ data, label, color, unit }: VitalsChartProps) {
    const validData = data.filter(d => d.value !== null) as { date: string, value: number }[];
    
    if (validData.length < 2) {
        return (
            <div className="h-32 flex items-center justify-center border border-dashed border-slate-200 rounded-xl bg-slate-50/50">
                <p className="text-xs text-slate-400 font-medium italic">Insuffient data for {label} trend</p>
            </div>
        );
    }

    const values = validData.map(d => d.value);
    const minVal = Math.min(...values) * 0.95;
    const maxVal = Math.max(...values) * 1.05;
    const range = maxVal - minVal;

    const width = 400;
    const height = 120;
    const padding = 20;

    const points = validData.map((d, i) => {
        const x = (i / (validData.length - 1)) * (width - 2 * padding) + padding;
        const y = height - ((d.value - minVal) / range) * (height - 2 * padding) - padding;
        return { x, y, value: d.value, date: d.date };
    });

    const pathD = points.map((p, i) => (i === 0 ? `M ${p.x} ${p.y}` : `L ${p.x} ${p.y}`)).join(' ');

    return (
        <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
            <div className="flex justify-between items-end mb-4">
                <div>
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">{label}</h4>
                    <div className="flex items-baseline gap-1">
                        <span className="text-2xl font-black text-slate-800">{validData[validData.length - 1].value}</span>
                        <span className="text-xs font-bold text-slate-400">{unit}</span>
                    </div>
                </div>
                <div className="text-right">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${validData.length > 1 && validData[validData.length-1].value > validData[validData.length-2].value ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>
                        {validData.length > 1 ? (validData[validData.length-1].value > validData[validData.length-2].value ? '↑ Up' : '↓ Down') : 'Stable'}
                    </span>
                </div>
            </div>
            
            <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-24 overflow-visible">
                {/* Horizontal Guidelines */}
                <line x1={padding} y1={padding} x2={width-padding} y2={padding} stroke="#f1f5f9" strokeWidth="1" strokeDasharray="4 4" />
                <line x1={padding} y1={height-padding} x2={width-padding} y2={height-padding} stroke="#f1f5f9" strokeWidth="1" strokeDasharray="4 4" />
                
                {/* Main Trend Line */}
                <path
                    d={pathD}
                    fill="none"
                    stroke={color}
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
                
                {/* Data Points */}
                {points.map((p, i) => (
                    <g key={i} className="group">
                        <circle
                            cx={p.x}
                            cy={p.y}
                            r="4"
                            fill="white"
                            stroke={color}
                            strokeWidth="2"
                            className="transition-all group-hover:r-6 cursor-pointer"
                        />
                        <title>{`${p.date}: ${p.value}${unit}`}</title>
                    </g>
                ))}
            </svg>
            
            <div className="flex justify-between mt-2">
                <span className="text-[10px] font-bold text-slate-300 uppercase">{validData[0].date}</span>
                <span className="text-[10px] font-bold text-slate-300 uppercase">{validData[validData.length - 1].date}</span>
            </div>
        </div>
    );
}
