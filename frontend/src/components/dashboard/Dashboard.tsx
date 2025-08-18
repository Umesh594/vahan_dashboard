import { useState, useMemo, useEffect } from 'react';
import { MetricCard } from '@/components/dashboard/MetricCard';
import { VehicleChart } from '@/components/dashboard/VehicleChart';
import { FilterPanel } from '@/components/dashboard/FilterPanel';
import {
  fetchVehicleData,
  calculateGrowthMetrics,
  VehicleRegistration,
  calculateGrowthPerManufacturer,
  GrowthMetrics
} from '@/data/vehicleData';
import { Car, Truck, Bike, TrendingUp } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { DatePicker } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
dayjs.extend(customParseFormat);

const { RangePicker } = DatePicker;

export const Dashboard = () => {
  const [selectedVehicleType, setSelectedVehicleType] = useState('ALL');
  const [selectedManufacturer, setSelectedManufacturer] = useState('ALL');
  const [dateRange, setDateRange] = useState<[Dayjs, Dayjs] | null>(null);
  const [vehicleData, setVehicleData] = useState<VehicleRegistration[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchVehicleData();
        setVehicleData(data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };
    fetchData();
    const interval = setInterval(fetchData, 60000);
    return () => clearInterval(interval);
  }, []);

  const filteredData = useMemo(() => {
    let data = vehicleData;
    if (selectedVehicleType !== 'ALL') {
      data = data.filter(d => d.vehicleType === selectedVehicleType);
    }
    if (selectedManufacturer !== 'ALL') {
      data = data.filter(d => d.manufacturer === selectedManufacturer);
    }
    if (dateRange) {
      const [start, end] = dateRange;
      data = data.filter(d => {
        const month = (d.quarter - 1) * 3 + 1;
        const recordDate = dayjs(`${d.year}-${month}-01`, 'YYYY-M-D');
        return recordDate.isAfter(start) && recordDate.isBefore(end.add(1, 'day'));
      });
    }
    return data;
  }, [vehicleData, selectedVehicleType, selectedManufacturer, dateRange]);

  // Corrected metrics
  const overallMetrics = calculateGrowthMetrics(vehicleData);
  const vehicleTypeMetrics = {
    '2W': calculateGrowthMetrics(vehicleData.filter(d => d.vehicleType === '2W')),
    '3W': calculateGrowthMetrics(vehicleData.filter(d => d.vehicleType === '3W')),
    '4W': calculateGrowthMetrics(vehicleData.filter(d => d.vehicleType === '4W'))
  };
  const filteredMetrics = calculateGrowthMetrics(filteredData);
  const perManufacturerMetrics = calculateGrowthPerManufacturer(filteredData);

  const handleReset = () => {
    setSelectedVehicleType('ALL');
    setSelectedManufacturer('ALL');
    setDateRange(null);
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  const topManufacturers = useMemo(() => {
    const totals: Record<string, number> = {};
    vehicleData.forEach(item => {
      totals[item.manufacturer] = (totals[item.manufacturer] || 0) + item.registrations;
    });
    return Object.entries(totals)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10)
      .map(([name, total]) => ({ name, total }));
  }, [vehicleData]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg">Loading real-time data...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            Vehicle Registration Dashboard
          </h1>
          <p className="text-muted-foreground text-lg">
            Investor Analytics • Real-time Vehicle Registration Data
          </p>
        </div>

        <Separator className="bg-border" />

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1 space-y-4">
            <FilterPanel
              selectedVehicleType={selectedVehicleType}
              selectedManufacturer={selectedManufacturer}
              onVehicleTypeChange={setSelectedVehicleType}
              onManufacturerChange={setSelectedManufacturer}
              onReset={handleReset}
            />
            <div className="p-4 bg-secondary/20 rounded-lg">
              <p className="mb-2 font-medium">Select Date Range</p>
              <RangePicker
                onChange={dates => setDateRange(dates ? [dates[0], dates[1]] : null)}
                value={dateRange || null}
              />
            </div>
          </div>

          <div className="lg:col-span-3 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
              <MetricCard
                title="Total Registrations"
                value={formatNumber(overallMetrics.totalRegistrations)}
                change={overallMetrics.yoyGrowth}
                changeType="yoy"
                icon={<TrendingUp className="h-6 w-6" />}
                gradient="gradient-primary"
              />
              <MetricCard
                title="Two Wheelers"
                value={formatNumber(vehicleTypeMetrics['2W'].totalRegistrations)}
                change={vehicleTypeMetrics['2W'].yoyGrowth}
                changeType="yoy"
                icon={<Bike className="h-6 w-6" />}
                gradient="gradient-primary"
              />
              <MetricCard
                title="Three Wheelers"
                value={formatNumber(vehicleTypeMetrics['3W'].totalRegistrations)}
                change={vehicleTypeMetrics['3W'].yoyGrowth}
                changeType="yoy"
                icon={<Truck className="h-6 w-6" />}
                gradient="gradient-success"
              />
              <MetricCard
                title="Four Wheelers"
                value={formatNumber(vehicleTypeMetrics['4W'].totalRegistrations)}
                change={vehicleTypeMetrics['4W'].yoyGrowth}
                changeType="yoy"
                icon={<Car className="h-6 w-6" />}
                gradient="gradient-warning"
              />
            </div>

            {(selectedVehicleType !== 'ALL' || selectedManufacturer !== 'ALL' || dateRange) && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <MetricCard
                  title="Filtered Results (YoY)"
                  value={formatNumber(filteredMetrics.totalRegistrations)}
                  change={filteredMetrics.yoyGrowth}
                  changeType="yoy"
                  gradient="gradient-card"
                />
                <MetricCard
                  title="Quarter Growth"
                  value={formatNumber(filteredMetrics.totalRegistrations)}
                  change={filteredMetrics.qoqGrowth}
                  changeType="qoq"
                  gradient="gradient-card"
                />
              </div>
            )}

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              <VehicleChart
                data={filteredData}
                type="line"
                title="Registration Trends (Quarterly)"
              />
              <VehicleChart
                data={filteredData}
                type="bar"
                title="Quarterly Comparison"
              />
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              <VehicleChart
                data={filteredData}
                type="pie"
                title="Vehicle Type Distribution"
              />
              <div className="bg-gradient-card p-6 rounded-lg border border-border">
                <h3 className="text-lg font-semibold mb-4 text-card-foreground">
                  Top Manufacturers
                </h3>
                <div className="space-y-3">
                  {topManufacturers.map((m, i) => (
                    <div key={m.name} className="flex items-center justify-between p-3 bg-secondary/20 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold text-sm">
                          {i + 1}
                        </div>
                        <span className="font-medium text-card-foreground">{m.name}</span>
                      </div>
                      <span className="text-muted-foreground font-mono">
                        {formatNumber(m.total)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};
