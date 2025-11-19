import { Card } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

const performanceData = [
  { epoch: 1, train: 0.45, val: 0.48 },
  { epoch: 2, train: 0.38, val: 0.42 },
  { epoch: 3, train: 0.32, val: 0.39 },
  { epoch: 4, train: 0.28, val: 0.35 },
  { epoch: 5, train: 0.25, val: 0.33 },
  { epoch: 6, train: 0.22, val: 0.31 },
  { epoch: 7, train: 0.20, val: 0.30 },
  { epoch: 8, train: 0.18, val: 0.29 },
];

const Performance = () => {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Model Performance</h1>
        <p className="text-muted-foreground mt-2">
          Training metrics and evaluation results
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 shadow-sm border-border">
          <h4 className="font-semibold text-foreground mb-2">RMSE</h4>
          <p className="text-3xl font-bold text-primary">0.289</p>
          <p className="text-sm text-metric-positive mt-1">↓ 12% improvement</p>
        </Card>
        <Card className="p-6 shadow-sm border-border">
          <h4 className="font-semibold text-foreground mb-2">WRMSSE</h4>
          <p className="text-3xl font-bold text-primary">0.512</p>
          <p className="text-sm text-metric-positive mt-1">↓ 8% improvement</p>
        </Card>
        <Card className="p-6 shadow-sm border-border">
          <h4 className="font-semibold text-foreground mb-2">R² Score</h4>
          <p className="text-3xl font-bold text-primary">0.924</p>
          <p className="text-sm text-metric-positive mt-1">↑ 3% improvement</p>
        </Card>
      </div>

      <Card className="p-6 shadow-sm border-border">
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-foreground">Training History</h3>
          <p className="text-sm text-muted-foreground">Loss progression over epochs</p>
        </div>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={performanceData}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis 
              dataKey="epoch" 
              stroke="hsl(var(--muted-foreground))"
              label={{ value: 'Epoch', position: 'insideBottom', offset: -5 }}
            />
            <YAxis 
              stroke="hsl(var(--muted-foreground))"
              label={{ value: 'Loss', angle: -90, position: 'insideLeft' }}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'hsl(var(--card))', 
                border: '1px solid hsl(var(--border))',
                borderRadius: '0.5rem'
              }} 
            />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="train" 
              stroke="hsl(var(--chart-primary))" 
              strokeWidth={2}
              name="Training Loss"
            />
            <Line 
              type="monotone" 
              dataKey="val" 
              stroke="hsl(var(--chart-secondary))" 
              strokeWidth={2}
              name="Validation Loss"
            />
          </LineChart>
        </ResponsiveContainer>
      </Card>
    </div>
  );
};

export default Performance;
