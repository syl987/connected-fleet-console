export enum FuelType {
  GAS = 'GAS',
  DIESEL = 'DIESEL',
  ELECTRIC = 'ELECTRIC',
  HYBRID = 'HYBRID',
}

export interface Vehicle {
  id: number;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
  version: number;
  brand: string;
  model: string;
  year: number;
  vin: string;
  mileage: number;
  color?: string;
  fuelType: FuelType;
}

export interface VehicleLogIds {
  vehicleId: number;
  logIds: number[];
}
