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
  vehicleId: number;
}

export interface SearchLogsParams {
  query?: string;
  severity?: string;
  from?: string;
  to?: string;
}
