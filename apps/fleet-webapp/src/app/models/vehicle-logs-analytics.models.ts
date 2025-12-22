export interface VehicleLogsSummary {
  totalLogs: number;
  earliestDate: string;
  latestDate: string;
  highestMileage: number;
  latestYear: number;
}

interface SeverityStats {
  severity: string;
  count: number;
  vehicles: number;
}

export interface VehicleLogsSeverityStats {
  totalLogs: number;
  stats: SeverityStats[];
}

interface ColorStats {
  color: string;
  count: number;
  vehicles: number;
}

interface SeverityColorStats {
  totalLogs: number;
  severity: string;
  stats: ColorStats[];
}

export interface VehicleLogsColorStats {
  totalLogs: number;
  stats: SeverityColorStats[];
}
