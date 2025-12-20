import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { mapResponse } from '@ngrx/operators';
import { switchMap } from 'rxjs';
import { SearchDataService } from '../../services/data/search-data.service';
import { ToastService } from '../../services/toast.service';
import { VehicleLogService } from '../../services/vehicle-log.service';
import { SearchActions } from './search.actions';

@Injectable()
export class SearchEffects {
  protected readonly actions = inject(Actions);
  protected readonly toastService = inject(ToastService);
  protected readonly searchDataService = inject(SearchDataService);
  protected readonly vehicleLogService = inject(VehicleLogService);

  readonly search = createEffect(() => {
    return this.actions.pipe(
      ofType(SearchActions.searchLogs),
      switchMap(({ params }) =>
        this.searchDataService.search(params).pipe(
          mapResponse({
            next: (page) => {
              this.vehicleLogService.upsertManyInCache(page.data);
              return SearchActions.searchLogsSUCCESS({ page });
            },
            error: () => {
              this.toastService.showErrorToast('Error loading vehicle logs.');
              return SearchActions.searchLogsERROR();
            },
          }),
        )),
    );
  });
}
