/**
 * Entity base for regular data objects.
 */
export interface EntityBaseDTO {
  id: number;
  createdAt: string; // date
  updatedAt: string; // date
  version: number;
}

/**
 * Enum representing entity types that are used within the entity cache.
 */
export enum EntityType {
  Vehicle = 'Vehicle',
}
