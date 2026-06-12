import React from 'react';

interface ChartData {
  name: string;
  value: number;
  color: string;
}

interface TaskChartProps {
  data: ChartData[];
  title: string;
}

export default function TaskChart({ data, title }: TaskChartProps) {
  const total = data.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className="rounded-2xl border border-border/80 bg-card p-6 shadow-sm">
      <h3 className="text-base font-semibold text-foreground mb-6">{title}</h3>
      
      <div className="space-y-5">
        {data.map((item) => {
          const percentage = total > 0 ? Math.round((item.value / total) * 100) : 0;
          
          return (
            <div key={item.name} className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center space-x-2">
                  <span className={`h-2.5 w-2.5 rounded-full`} style={{ backgroundColor: item.color }} />
                  <span className="font-medium text-foreground">{item.name}</span>
                </div>
                <div className="flex items-center space-x-2 text-muted-foreground font-semibold">
                  <span>{item.value}</span>
                  <span className="text-xs text-muted-foreground/60">({percentage}%)</span>
                </div>
              </div>
              
              {/* Progress Bar Container */}
              <div className="h-2 w-full rounded-full bg-muted/30 overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500 ease-out"
                  style={{
                    backgroundColor: item.color,
                    width: `${percentage}%`
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {total === 0 && (
        <div className="mt-4 text-center text-xs text-muted-foreground">
          No metrics available.
        </div>
      )}
    </div>
  );
}
