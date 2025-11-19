import { Card } from "@/components/ui/card";
import { TrendingUp, Package, Store, Calendar } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";

const forecastData = [
  { date: "Week 1", actual: 120, predicted: 118 },
  { date: "Week 2", actual: 135, predicted: 132 },
  { date: "Week 3", actual: 148, predicted: 145 },
  { date: "Week 4", actual: 142, predicted: 148 },
  { date: "Week 5", predicted: 155 },
  { date: "Week 6", predicted: 162 },
];

const hierarchyData = [
  { level: "Total", value: 85 },
  { level: "State", value: 72 },
  { level: "Store", value: 68 },
  { level: "Category", value: 75 },
  { level: "Department", value: 81 },
  { level: "Item", value: 88 },
];

const StatCard = ({ title, value, change, icon: Icon }: any) => (
  <Card className="p-6 shadow-sm border-border hover:shadow-md transition-shadow">
    <div className="flex items-start justify-between">
      <div>
        <p className="text-sm text-muted-foreground">{title}</p>
        <h3 className="text-2xl font-semibold mt-1 text-foreground">{value}</h3>
        <p className={`text-xs mt-2 ${change >= 0 ? 'text-metric-positive' : 'text-metric-negative'}`}>
          {change >= 0 ? '↑' : '↓'} {Math.abs(change)}% vs last period
        </p>
      </div>
      <div className="p-3 bg-primary/10 rounded-lg">
        <Icon className="h-5 w-5 text-primary" />
      </div>
    </div>
  </Card>
);

const Dashboard = () => {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Hierarchical Demand Forecasting</h1>
        <p className="text-muted-foreground mt-2">
          M5 Forecasting Competition — Predicting demand across hierarchical product and store structures
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Items" value="3,049" change={2.4} icon={Package} />
        <StatCard title="Stores" value="10" change={0} icon={Store} />
        <StatCard title="Forecast Accuracy" value="92.3%" change={1.8} icon={TrendingUp} />
        <StatCard title="Days Forecasted" value="28" change={0} icon={Calendar} />
      </div>

      {/* Main Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Forecast Visualization */}
        <Card className="p-6 shadow-sm border-border">
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-foreground">Demand Forecast Overview</h3>
            <p className="text-sm text-muted-foreground">Historical vs Predicted Sales</p>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={forecastData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" />
              <YAxis stroke="hsl(var(--muted-foreground))" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--card))', 
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '0.5rem'
                }} 
              />
              <Line 
                type="monotone" 
                dataKey="actual" 
                stroke="hsl(var(--chart-primary))" 
                strokeWidth={2}
                dot={{ fill: 'hsl(var(--chart-primary))' }}
              />
              <Line 
                type="monotone" 
                dataKey="predicted" 
                stroke="hsl(var(--chart-secondary))" 
                strokeWidth={2}
                strokeDasharray="5 5"
                dot={{ fill: 'hsl(var(--chart-secondary))' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        {/* Hierarchy Accuracy */}
        <Card className="p-6 shadow-sm border-border">
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-foreground">Hierarchy Level Accuracy</h3>
            <p className="text-sm text-muted-foreground">Forecast accuracy by aggregation level</p>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={hierarchyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="level" stroke="hsl(var(--muted-foreground))" />
              <YAxis stroke="hsl(var(--muted-foreground))" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--card))', 
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '0.5rem'
                }} 
              />
              <Bar dataKey="value" fill="hsl(var(--primary))" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Hierarchy Tree Visualization */}
      <Card className="p-6 shadow-sm border-border">
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-foreground">Hierarchical Structure</h3>
          <p className="text-sm text-muted-foreground">Product and store hierarchy levels</p>
        </div>
        <div className="flex items-center justify-center py-8">
          <div className="space-y-4 w-full max-w-2xl">
            <div className="flex justify-center">
              <div className="px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium">
                Total
              </div>
            </div>
            <div className="flex justify-center gap-8">
              <div className="px-5 py-2 bg-accent/20 text-accent-foreground rounded-lg border-2 border-accent">
                State (3)
              </div>
            </div>
            <div className="flex justify-center gap-4">
              <div className="px-4 py-2 bg-secondary rounded-lg border border-border">Store (10)</div>
              <div className="px-4 py-2 bg-secondary rounded-lg border border-border">Category (3)</div>
            </div>
            <div className="flex justify-center gap-3">
              <div className="px-3 py-1.5 bg-muted rounded text-sm border border-border">Dept (7)</div>
              <div className="px-3 py-1.5 bg-muted rounded text-sm border border-border">Items (3,049)</div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Dashboard;
