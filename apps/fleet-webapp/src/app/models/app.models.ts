import { EntityCollection, EntityDataModuleConfig, EntityMetadata, EntityMetadataMap } from '@ngrx/data';
import { EntityType } from './entity.models';
import { Vehicle } from './vehicle.model';

/**
 * App-specific variables.
 */
export class AppConfig {
  /** Application name to display in header and other places. */
  appName!: string;
  /** Copyright name for display in the footer. */
  copyrightName!: string;
  /** Copyright year for display in the footer. */
  copyrightYear!: string;
}

/**
 * Type-safe entity data config.
 */
export interface AppEntityDataModuleConfig extends EntityDataModuleConfig {
  entityMetadata: AppEntityMetadataMap;
}

/**
 * Type-safe entity metadata map.
 */
export interface AppEntityMetadataMap extends EntityMetadataMap {
  [EntityType.Vehicle]: Partial<EntityMetadata<Vehicle>>;
}

/**
 * Type-safe entity cache.
 */
export interface AppEntityCache {
  [EntityType.Vehicle]: EntityCollection<Vehicle>;
}
