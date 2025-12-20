import { InjectionToken } from '@angular/core';
import {
  DefaultDataServiceConfig,
  EntityCollection,
  EntityDataModuleConfig,
  EntityMetadata,
  HttpResourceUrls,
} from '@ngrx/data';
import { EntityType } from './entity.models';
import { VehicleLog } from './vehicle-log.models';
import { Vehicle } from './vehicle.models';

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
  entityMetadata: {
    [EntityType.Vehicle]: Partial<EntityMetadata<Vehicle>>;
    [EntityType.VehicleLog]: Partial<EntityMetadata<VehicleLog>>;
  };
  pluralNames?: {
    [EntityType.Vehicle]?: string;
    [EntityType.VehicleLog]?: string;
  };
}

/**
 * Type-safe default data service config.
 */
export interface AppDefaultDataServiceConfig extends DefaultDataServiceConfig {
  entityHttpResourceUrls: {
    [EntityType.Vehicle]?: HttpResourceUrls;
    [EntityType.VehicleLog]?: HttpResourceUrls;
  };
}

/**
 * Type-safe entity cache.
 */
export interface AppEntityCache {
  [EntityType.Vehicle]?: EntityCollection<Vehicle>;
  [EntityType.VehicleLog]?: EntityCollection<VehicleLog>;
}

/**
 * Tech-stack item.
 */
export interface AppTechStackItem {
  /** Display name. */
  readonly title: string;
  /** Short description. */
  readonly subtitle: string;
  /** Block description. */
  readonly description: string;
  /** Image URL. */
  readonly image: string;
  /** Image element classes. Intended for layout adjustments. */
  readonly imageClass?: string;
}
