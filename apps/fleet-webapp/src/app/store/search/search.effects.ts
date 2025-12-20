import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { mapResponse } from '@ngrx/operators';
import { switchMap } from 'rxjs';
import { LogsDataService } from '../../services/data/logs-data.service';
import { SearchActions } from './search.actions';

@Injectable()
export class SearchEffects {
  protected readonly actions = inject(Actions);
  protected readonly service = inject(LogsDataService);

  readonly search = createEffect(() => {
    return this.actions.pipe(
      ofType(SearchActions.searchLogs),
      switchMap(({ params }) =>
        this.service.search(params).pipe(
          mapResponse({
            next: (page) => SearchActions.searchLogsSUCCESS({ page }),
            error: () => SearchActions.searchLogsERROR(),
          }),
        )),
    );
  });
}
