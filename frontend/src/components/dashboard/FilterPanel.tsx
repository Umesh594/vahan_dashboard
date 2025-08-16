import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { CalendarIcon, FilterIcon, RefreshCw } from "lucide-react";
import { manufacturers } from "@/data/vehicleData";

interface FilterPanelProps {
  selectedVehicleType: string;
  selectedManufacturer: string;
  onVehicleTypeChange: (value: string) => void;
  onManufacturerChange: (value: string) => void;
  onReset: () => void;
}

export const FilterPanel = ({
  selectedVehicleType,
  selectedManufacturer,
  onVehicleTypeChange,
  onManufacturerChange,
  onReset
}: FilterPanelProps) => {
  const availableManufacturers = selectedVehicleType === 'ALL' ? 
    Object.values(manufacturers).flat() : 
    manufacturers[selectedVehicleType as keyof typeof manufacturers] || [];

  return (
    <Card className="p-6 bg-gradient-card border-border">
      <div className="flex items-center gap-2 mb-4">
        <FilterIcon className="h-5 w-5 text-primary" />
        <h3 className="text-lg font-semibold text-card-foreground">Filters</h3>
      </div>
      
      <div className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground">Vehicle Type</label>
          <Select value={selectedVehicleType} onValueChange={onVehicleTypeChange}>
            <SelectTrigger className="bg-secondary/50 border-border">
              <SelectValue placeholder="Select vehicle type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Types</SelectItem>
              <SelectItem value="2W">Two Wheeler (2W)</SelectItem>
              <SelectItem value="3W">Three Wheeler (3W)</SelectItem>
              <SelectItem value="4W">Four Wheeler (4W)</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground">Manufacturer</label>
          <Select value={selectedManufacturer} onValueChange={onManufacturerChange}>
            <SelectTrigger className="bg-secondary/50 border-border">
              <SelectValue placeholder="Select manufacturer" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Manufacturers</SelectItem>
              {[...new Set(availableManufacturers)].map(manufacturer => (
                <SelectItem key={manufacturer} value={manufacturer}>
                  {manufacturer}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground">Date Range</label>
          <Button variant="outline" className="w-full justify-start bg-secondary/50 border-border">
            <CalendarIcon className="mr-2 h-4 w-4" />
            Last 3 Years
          </Button>
        </div>
        
        <Button 
          onClick={onReset}
          variant="outline" 
          className="w-full bg-secondary/50 border-border hover:bg-secondary"
        >
          <RefreshCw className="mr-2 h-4 w-4" />
          Reset Filters
        </Button>
      </div>
    </Card>
  );
};