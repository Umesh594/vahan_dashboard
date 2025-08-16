import { Card } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { VehicleRegistration } from "@/data/vehicleData";

interface VehicleChartProps {
  data: VehicleRegistration[];
  type: 'line' | 'bar' | 'pie';
  title: string;
  dataKey?: string;
}

const COLORS = {
  '2W': 'hsl(262 83% 58%)',
  '3W': 'hsl(142 76% 36%)',
  '4W': 'hsl(38 92% 50%)'
};

export const VehicleChart = ({ data, type, title, dataKey = 'registrations' }: VehicleChartProps) => {
  // Group data by quarter for line/bar charts
  const quarterlyData = data.reduce((acc, item) => {
    const key = item.quarter;
    if (!acc[key]) {
      acc[key] = { quarter: key, '2W': 0, '3W': 0, '4W': 0 };
    }
    acc[key][item.vehicleType] += item.registrations;
    return acc;
  }, {} as Record<string, any>);

  const chartData = Object.values(quarterlyData);

  // For pie chart, aggregate by vehicle type
  const pieData = Object.entries(
    data.reduce((acc, item) => {
      acc[item.vehicleType] = (acc[item.vehicleType] || 0) + item.registrations;
      return acc;
    }, {} as Record<string, number>)
  ).map(([name, value]) => ({ name, value }));

  const renderChart = () => {
    switch (type) {
      case 'line':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="quarter" stroke="hsl(var(--muted-foreground))" />
              <YAxis stroke="hsl(var(--muted-foreground))" />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px'
                }}
              />
              <Line 
                type="monotone" 
                dataKey="2W" 
                stroke={COLORS['2W']} 
                strokeWidth={3}
                dot={{ fill: COLORS['2W'], strokeWidth: 2, r: 4 }}
              />
              <Line 
                type="monotone" 
                dataKey="3W" 
                stroke={COLORS['3W']} 
                strokeWidth={3}
                dot={{ fill: COLORS['3W'], strokeWidth: 2, r: 4 }}
              />
              <Line 
                type="monotone" 
                dataKey="4W" 
                stroke={COLORS['4W']} 
                strokeWidth={3}
                dot={{ fill: COLORS['4W'], strokeWidth: 2, r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        );
      
      case 'bar':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="quarter" stroke="hsl(var(--muted-foreground))" />
              <YAxis stroke="hsl(var(--muted-foreground))" />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px'
                }}
              />
              <Bar dataKey="2W" fill={COLORS['2W']} radius={[4, 4, 0, 0]} />
              <Bar dataKey="3W" fill={COLORS['3W']} radius={[4, 4, 0, 0]} />
              <Bar dataKey="4W" fill={COLORS['4W']} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        );
      
      case 'pie':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[entry.name as keyof typeof COLORS]} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px'
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        );
      
      default:
        return null;
    }
  };

  return (
    <Card className="p-6 bg-gradient-card border-border">
      <h3 className="text-lg font-semibold mb-4 text-card-foreground">{title}</h3>
      {renderChart()}
    </Card>
  );
};