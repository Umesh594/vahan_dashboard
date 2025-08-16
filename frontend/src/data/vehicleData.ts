export interface VehicleRegistration {
  date: string; // FastAPI returns "YYYY-MM-DD"
  vehicleType: '2W' | '3W' | '4W';
  manufacturer: string;
  registrations: number;
  quarter: number;
  year: number;
}

export interface GrowthMetrics {
  yoyGrowth: number;
  qoqGrowth: number;
  totalRegistrations: number;
}

export const manufacturers = {
  '2W': ['Hero MotoCorp', 'Honda', 'TVS', 'Bajaj', 'Yamaha', 'Royal Enfield'],
  '3W': ['Bajaj', 'Mahindra', 'Piaggio', 'Force Motors', 'Atul Auto'],
  '4W': ['Maruti Suzuki', 'Hyundai', 'Tata Motors', 'Mahindra', 'Toyota', 'Kia']
};

// Fetch from backend
export async function fetchVehicleData(): Promise<VehicleRegistration[]> {
  const response = await fetch("https://vahan-dashboard-qzl6.onrender.com/vehicle-data/");
  if (!response.ok) throw new Error("Failed to fetch vehicle data");
  const data: VehicleRegistration[] = await response.json();

  // Ensure date is string
  return data.map(d => ({
    ...d,
    date: d.date.toString()
  }));
}

// Growth calculation
export const calculateGrowthMetrics = (
  data: VehicleRegistration[],
  vehicleType?: string,
  manufacturer?: string
): GrowthMetrics => {
  let filteredData = data;
  if (vehicleType && vehicleType !== 'ALL') filteredData = filteredData.filter(d => d.vehicleType === vehicleType);
  if (manufacturer && manufacturer !== 'ALL') filteredData = filteredData.filter(d => d.manufacturer === manufacturer);

  const currentYear = new Date().getFullYear();
  const currentQuarter = Math.ceil((new Date().getMonth() + 1) / 3);

  const currentYearTotal = filteredData.filter(d => d.year === currentYear).reduce((sum, d) => sum + d.registrations, 0);
  const previousYearTotal = filteredData.filter(d => d.year === currentYear - 1).reduce((sum, d) => sum + d.registrations, 0);
  const yoyGrowth = previousYearTotal > 0 ? ((currentYearTotal - previousYearTotal) / previousYearTotal) * 100 : 0;

  const currentQuarterTotal = filteredData.filter(d => d.year === currentYear && d.quarter === currentQuarter).reduce((sum, d) => sum + d.registrations, 0);
  const previousQuarterTotal = filteredData.filter(d => d.year === currentYear && d.quarter === currentQuarter - 1).reduce((sum, d) => sum + d.registrations, 0);
  const qoqGrowth = previousQuarterTotal > 0 ? ((currentQuarterTotal - previousQuarterTotal) / previousQuarterTotal) * 100 : 0;

  return { yoyGrowth, qoqGrowth, totalRegistrations: currentYearTotal };
};

// Growth per manufacturer
export const calculateGrowthPerManufacturer = (data: VehicleRegistration[]): Record<string, GrowthMetrics> => {
  const grouped: Record<string, VehicleRegistration[]> = {};
  data.forEach(d => { if (!grouped[d.manufacturer]) grouped[d.manufacturer] = []; grouped[d.manufacturer].push(d); });

  const results: Record<string, GrowthMetrics> = {};
  Object.keys(grouped).forEach(m => { results[m] = calculateGrowthMetrics(grouped[m]); });
  return results;
};
