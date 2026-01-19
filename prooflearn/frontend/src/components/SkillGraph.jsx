import React from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';

const SkillGraph = ({ data }) => {
    // Safety check for data
    if (!data) {
        return <div className="text-center text-slate-500 font-mono text-xs">Loading skills...</div>;
    }

    // Transform Map or Object to array for Recharts
    // data format expected: { "React": 10, "Solidity": 20 }
    const chartData = Object.keys(data).map(key => ({
        subject: key,
        A: data[key],
        fullMark: 100,
    }));

    // Default empty state if no skills
    if (chartData.length === 0) {
        return <div className="text-center text-slate-500 font-mono text-xs">No skill data available</div>;
    }

    return (
        <div className="w-full h-[300px] relative">
            <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={chartData}>
                    <PolarGrid stroke="#334155" />
                    <PolarAngleAxis
                        dataKey="subject"
                        tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 'bold' }}
                    />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                    <Radar
                        name="Skills"
                        dataKey="A"
                        stroke="#22d3ee"
                        strokeWidth={2}
                        fill="#22d3ee"
                        fillOpacity={0.2}
                    />
                </RadarChart>
            </ResponsiveContainer>

            {/* Decorative Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-cyan-500/20 blur-[50px] rounded-full pointer-events-none" />
        </div>
    );
};

export default SkillGraph;
