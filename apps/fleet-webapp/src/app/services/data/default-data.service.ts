import { HttpClient } from '@angular/common/http';
import { Injectable, Optional } from '@angular/core';
import {
  DefaultDataService,
  DefaultDataServiceConfig,
  DefaultDataServiceFactory,
  EntityCollectionDataService,
  HttpOptions,
  HttpUrlGenerator,
  QueryParams,
} from '@ngrx/data';
import { map, Observable } from 'rxjs';
import { Page } from '../../models/entity.models';

export class AppDefaultDataService<T> extends DefaultDataService<T> {
  constructor(
    entityName: string,
    http: HttpClient,
    httpUrlGenerator: HttpUrlGenerator,
    config?: DefaultDataServiceConfig,
  ) {
    super(entityName, http, httpUrlGenerator, config);
  }

  override getAll(): Observable<T[]> {
    const httpParams = { fromObject: { size: Number.MIN_SAFE_INTEGER } };
    // casting to Page<T> - expecting a paginated response from the API
    return (super.getAll({ httpParams }) as unknown as Observable<Page<T>>).pipe(
      map(({ data }) => data), // unwrap data property from paginated API response
    );
  }

  override getWithQuery(queryParams: QueryParams | string | undefined, options?: HttpOptions): Observable<T[]> {
    const httpParams = { fromObject: { size: Number.MIN_SAFE_INTEGER } };
    // casting to Page<T> - expecting a paginated response from the API
    // TODO kick queryParams with the next major ngrx release
    return (super.getWithQuery(queryParams, { httpParams, ...options }) as unknown as Observable<Page<T>>).pipe(
      map(({ data }) => data), // unwrap data property from paginated API response
    );
  }
}

@Injectable()
export class AppDefaultDataServiceFactory extends DefaultDataServiceFactory {
  // eslint-disable-next-line @angular-eslint/prefer-inject
  constructor(http: HttpClient, httpUrlGenerator: HttpUrlGenerator, @Optional() config?: DefaultDataServiceConfig) {
    super(http, httpUrlGenerator, config);
  }

  override create<T>(entityName: string): EntityCollectionDataService<T> {
    return new AppDefaultDataService<T>(entityName, this.http, this.httpUrlGenerator, this.config);
  }
}
