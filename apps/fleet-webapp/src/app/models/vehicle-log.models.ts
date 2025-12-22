import { Vehicle } from './vehicle.models';

export interface VehicleLog {
  id: number;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
  version: number;
  timestamp: string;
  code: string;
  severity: string;
  message: string;
  vehicle: Vehicle;
}

export interface VehicleLogsSummary {
  totalLogs: number;
  earliestDate: string;
  latestDate: string;
  highestMileage: number;
  latestYear: number;
}

export interface GenerateVehicleLogsOptions {
  duration: number;
  interval: number;
  max: number;
}
