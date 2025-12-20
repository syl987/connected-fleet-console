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
  page?: number;
  size?: number;
  search?: string;
  mileage?: number;
  year?: number;
  vehicle?: number;
  severity?: string;
  code?: string;
  from?: string;
  to?: string;
}
