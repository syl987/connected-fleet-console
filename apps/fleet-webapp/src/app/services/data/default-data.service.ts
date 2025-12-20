import { HttpClient } from '@angular/common/http';
import { DefaultDataService, DefaultDataServiceConfig, HttpOptions, HttpUrlGenerator, QueryParams } from '@ngrx/data';
import { map, Observable } from 'rxjs';
import { Page } from '../../models/entity.models';

export class AppDefaultDataService<T> extends DefaultDataService<T> {
  constructor(entityName: string, http: HttpClient, generator: HttpUrlGenerator, config?: DefaultDataServiceConfig) {
    super(entityName, http, generator, config);
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
    return (super.getWithQuery(queryParams, { httpParams, ...options }) as unknown as Observable<Page<T>>).pipe(
      map(({ data }) => data), // unwrap data property from paginated API response
    );
  }
}
