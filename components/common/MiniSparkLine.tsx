'use client';

import { Line, LineChart, Bar, BarChart, Area, AreaChart, ResponsiveContainer } from 'recharts';

interface MiniSparklineProps {
  data: { value: number }[];
  strokeColor: string;
  type: 'line' | 'bar' | 'area';
  id: string; 
}

export function MiniSparkline({ data, strokeColor, type, id }: MiniSparklineProps) {
  return (
    <div className="h-12 w-20 sm:w-24 ml-auto flex items-end">
      <ResponsiveContainer width="100%" height="100%">
        {type === 'line' ? (
          <LineChart data={data} margin={{ top: 4, right: 4, left: 4, bottom: 4 }}>
            <Line
              type="monotone"
              dataKey="value"
              stroke={strokeColor}
              strokeWidth={2.5}
              dot={(props) => {
                const { cx, cy, index } = props;
                if (index === data.length - 1) {
                  return <circle cx={cx} cy={cy} r={3} fill={strokeColor} stroke="white" strokeWidth={1} />;
                }
                return null;
              }}
              animationDuration={1000}
            />
          </LineChart>
        ) : type === 'bar' ? (
          <BarChart data={data} margin={{ top: 4, right: 2, left: 2, bottom: 0 }} barGap={2}>
            <defs>
              <linearGradient id={`barGrad-${id}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={strokeColor} stopOpacity={1} />
                <stop offset="100%" stopColor={strokeColor} stopOpacity={0.1} />
              </linearGradient>
            </defs>
            <Bar 
              dataKey="value" 
              fill={`url(#barGrad-${id})`} 
              radius={[3, 3, 0, 0]} 
              maxBarSize={8}
              animationDuration={1000} 
            />
          </BarChart>
        ) : (
          <AreaChart data={data} margin={{ top: 4, right: 2, left: 2, bottom: 0 }}>
            <defs>
              <linearGradient id={`areaGrad-${id}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={strokeColor} stopOpacity={0.4} />
                <stop offset="100%" stopColor={strokeColor} stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <Area
              type="monotone"
              dataKey="value"
              stroke={strokeColor}
              strokeWidth={2}
              fill={`url(#areaGrad-${id})`}
              dot={false}
              animationDuration={1000}
            />
          </AreaChart>
        )}
      </ResponsiveContainer>
    </div>
  );
}