import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { mapResponse } from '@ngrx/operators';
import { switchMap } from 'rxjs';
import { LogsDataService } from '../../services/data/logs-data.service';
import { LogsActions } from './logs.actions';

@Injectable()
export class LogsEffects {
  protected readonly actions = inject(Actions);
  protected readonly service = inject(LogsDataService);

  readonly search = createEffect(() => {
    return this.actions.pipe(
      ofType(LogsActions.search),
      switchMap(({ params }) =>
        this.service.search(params).pipe(
          mapResponse({
            next: logs => LogsActions.searchSUCCESS({ logs }),
            error: () => LogsActions.searchERROR(),
          }),
        )),
    );
  });
}
