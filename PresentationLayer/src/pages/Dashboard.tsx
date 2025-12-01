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
      <div className="space-y-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Hierarchical Demand Forecasting</h1>
          <p className="text-muted-foreground mt-2">
            A practical control room for exploring demand signals across the M5 hierarchy (items → departments → states).
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <Card className="p-5 border-border shadow-sm">
            <h2 className="text-lg font-semibold text-foreground">Какво представлява платформата?</h2>
            <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
            Платформата обединява оперативни данни, интерактивни визуализации и формуляри за прогноза на едно място. С Forecast Form можеш да предвиждаш дневните продажби, с Data Explorer да разглеждаш историческите серии, а с Performance да оценяваш точността на прогнозите, за да планираш по-добре стоките и промоциите.
            </p>
          </Card>
          <Card className="p-5 border-border shadow-sm">
            <h2 className="text-lg font-semibold text-foreground">Как работи моделът?</h2>
            <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
              Нашата платформа използва модерен MLP модел, разработен да ви даде моментална и прецизна прогноза за всеки продукт, магазин и ситуация. 
              Вместо стандартни прогнози тип „един хоризонт за всички“, моделът симулира точно това, което ви интересува – каква ще бъде продажбата при зададените от вас условия.
              Променете цена, събитие, ден от седмицата или активност на SNAP – и веднага виждате как тези фактори влияят върху търсенето. 
              Така получавате мощен инструмент за планиране, оптимизация и бързи бизнес решения, базирани на интелигентна и адаптивна прогноза.
            </p>
          </Card>
        </div>
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

    </div>
  );
};

export default Dashboard;
