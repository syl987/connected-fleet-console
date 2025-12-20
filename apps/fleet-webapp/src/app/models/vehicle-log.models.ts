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
