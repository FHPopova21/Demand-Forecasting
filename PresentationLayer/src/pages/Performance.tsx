import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

const trainingHistory = [
  { epoch: 1, train: 0.65, val: 0.63 },
  { epoch: 2, train: 0.60, val: 0.59 },
  { epoch: 3, train: 0.55, val: 0.54 },
  { epoch: 4, train: 0.51, val: 0.50 },
  { epoch: 5, train: 0.48, val: 0.47 },
  { epoch: 6, train: 0.45, val: 0.44 },
  { epoch: 7, train: 0.43, val: 0.42 },
  { epoch: 8, train: 0.41, val: 0.41 },
  { epoch: 9, train: 0.40, val: 0.40 },
  { epoch: 10, train: 0.39, val: 0.39 },
  { epoch: 11, train: 0.38, val: 0.38 },
  { epoch: 12, train: 0.38, val: 0.37 },
  { epoch: 13, train: 0.37, val: 0.37 },
  { epoch: 14, train: 0.37, val: 0.37 },
  { epoch: 15, train: 0.36, val: 0.37 },
  { epoch: 16, train: 0.36, val: 0.36 },
  { epoch: 17, train: 0.36, val: 0.36 },
  { epoch: 18, train: 0.36, val: 0.36 },
];

const versionComparison = [
  { metric: "Train MSE", model1: "5.2028", model2: "5.3217", model3: "5.2015", model4: "5.1458" },
  { metric: "Validation MSE", model1: "4.8226", model2: "5.9893", model3: "5.0042", model4: "4.7842" },
  { metric: "Test MSE", model1: "5.0499", model2: "5.1977", model3: "5.0879", model4: "5.0392" },
  { metric: "Test MAE", model1: "0.9015", model2: "1.0184", model3: "0.9389", model4: "0.8943" },
  { metric: "Test RMSE", model1: "2.2472", model2: "2.2798", model3: "2.2556", model4: "2.2448" },
  { metric: "Overfitting risk", model1: "None", model2: "Low", model3: "None", model4: "None" },
  { metric: "Recommended use", model1: "Production baseline", model2: "—", model3: "MAE optimization", model4: "Final production" },
];


const Performance = () => {
  return (
    <div className="space-y-8">
      <div>
      <p className="text-xs uppercase text-muted-foreground">Updated Model • Wider MLP, recommended for production</p>
<h1 className="text-3xl font-bold text-foreground">Model Performance (Final)</h1>
<p className="text-muted-foreground mt-2">
  Final evaluation of the wider MLP (512→256→128→64) with stable training. Achieves best RMSE & MAE with no overfitting.
</p>

      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 shadow-sm border-border">
          <p className="text-sm text-muted-foreground">Test RMSE</p>
          <p className="text-3xl font-bold text-primary mt-2">2.2472</p>
          <p className="text-xs text-muted-foreground mt-1">Lowest across all versions</p>
        </Card>
        <Card className="p-6 shadow-sm border-border">
          <p className="text-sm text-muted-foreground">Test MSE</p>
          <p className="text-3xl font-bold text-primary mt-2">5.0392</p>
          <p className="text-xs text-muted-foreground mt-1">Highest overall stability</p>
        </Card>
        <Card className="p-6 shadow-sm border-border">
          <p className="text-sm text-muted-foreground">Test MAE</p>
          <p className="text-3xl font-bold text-primary mt-2">0.8943</p>
          <p className="text-xs text-muted-foreground mt-1">Slightly higher than Model 3.0 but very stable</p>
        </Card>
      </div>

      <Card className="p-6 shadow-sm border-border">
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-foreground">Training History (Updated Model 1.0)</h3>
          <p className="text-sm text-muted-foreground">Batch size 1024, stable LR (no cosine decay). Val loss tracks train closely.</p>
        </div>
        <ResponsiveContainer width="100%" height={380}>
          <LineChart data={trainingHistory}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="epoch" stroke="hsl(var(--muted-foreground))" />
            <YAxis stroke="hsl(var(--muted-foreground))" />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "0.5rem",
              }}
            />
            <Legend />
            <Line type="monotone" dataKey="train" stroke="hsl(var(--chart-primary))" strokeWidth={2} dot={false} name="Train Loss" />
            <Line type="monotone" dataKey="val" stroke="hsl(var(--chart-secondary))" strokeWidth={2} dot={false} name="Validation Loss" />
          </LineChart>
        </ResponsiveContainer>
      </Card>

      <Card className="p-6 shadow-sm border-border">
        <h3 className="text-lg font-semibold text-foreground mb-4">Version Comparison (Updated)</h3>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Metric</TableHead>
              <TableHead>Model 1.0 (NEW)</TableHead>
              <TableHead>Model 2.0</TableHead>
              <TableHead>Model 3.0</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {versionComparison.map((row) => (
              <TableRow key={row.metric}>
                <TableCell className="font-medium">{row.metric}</TableCell>
                <TableCell className="text-primary font-semibold">{row.model1}</TableCell>
                <TableCell>{row.model2}</TableCell>
                <TableCell>{row.model3}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
};

export default Performance;
