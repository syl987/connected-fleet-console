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
  version: number;
  brand: string;
  model: string;
  year: number;
  vin: string;
  mileage: number;
  color?: string;
  fuelType: FuelType;
  image?: any; // not implemented yet
}
