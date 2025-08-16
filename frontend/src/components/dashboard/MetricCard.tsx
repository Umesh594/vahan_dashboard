import { Card } from "@/components/ui/card";
import { TrendingUp, TrendingDown } from "lucide-react";

interface MetricCardProps {
  title: string;
  value: string;
  change: number;
  changeType: 'yoy' | 'qoq';
  icon?: React.ReactNode;
  gradient?: string;
}

export const MetricCard = ({ title, value, change, changeType, icon, gradient = "gradient-primary" }: MetricCardProps) => {
  const isPositive = change >= 0;
  const changeText = changeType === 'yoy' ? 'YoY' : 'QoQ';
  
  return (
    <Card className={`relative overflow-hidden bg-${gradient} p-6 text-card-foreground border-0 hover:scale-105 transition-transform duration-300`}>
      <div className="absolute inset-0 bg-black/20"></div>
      <div className="relative z-10">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <p className="text-sm font-medium opacity-90">{title}</p>
            <p className="text-2xl font-bold">{value}</p>
          </div>
          {icon && (
            <div className="h-12 w-12 rounded-lg bg-white/10 flex items-center justify-center">
              {icon}
            </div>
          )}
        </div>
        <div className="mt-4 flex items-center gap-2">
          {isPositive ? (
            <TrendingUp className="h-4 w-4 text-success" />
          ) : (
            <TrendingDown className="h-4 w-4 text-destructive" />
          )}
          <span className={`text-sm font-medium ${isPositive ? 'text-success' : 'text-destructive'}`}>
            {isPositive ? '+' : ''}{change.toFixed(1)}% {changeText}
          </span>
        </div>
      </div>
    </Card>
  );
};