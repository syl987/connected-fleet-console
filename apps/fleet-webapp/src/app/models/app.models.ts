import { InjectionToken } from '@angular/core';
import { EntityCollection, EntityDataModuleConfig, EntityMetadata, EntityMetadataMap } from '@ngrx/data';
import { EntityType } from './entity.models';
import { Vehicle } from './vehicle.model';

/**
 * App-specific variables.
 */
export interface AppOptions {
  /** Application name to display in header and other places. */
  readonly applicationName: string;
  /** Name of the legal copyright holder for display in the footer. */
  readonly copyrightName: string;
  /** Year of the last update for display in the footer. */
  readonly copyrightYear: number;
}

export const APP_OPTIONS = new InjectionToken<AppOptions>('APP_OPTIONS');

/**
 * App-specific router link.
 */
export interface AppLink {
  /** Display name. */
  readonly label: string;
  /** Router path. */
  readonly path: string;
  /** Display icon. Used in the sidenav. */
  readonly icon: string;
}

/**
 * App-specific router links.
 */
export type AppLinks = readonly AppLink[];

export const APP_LINKS = new InjectionToken<AppLinks>('APP_LINKS');

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
