import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, effect, inject, viewChild } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Store } from '@ngrx/store';
import { SearchLogsParams, VehicleLog } from '../../../models/vehicle-log.models';
import { SearchActions } from '../../../store/search/search.actions';
import { searchFeature } from '../../../store/search/search.reducer';
import { TitleBarComponent } from '../../core/title-bar/title-bar.component';

const tableColumns = [
  'timestamp',
  'severity',
  'vehicleId',
  'code',
  'message',
];

@Component({
  selector: 'app-search-page',
  imports: [
    ReactiveFormsModule,
    MatButtonModule,
    MatInputModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    MatTableModule,
    TitleBarComponent,
    DatePipe,
  ],
  templateUrl: './search-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchPageComponent {
  protected readonly store = inject(Store);

  readonly form = new FormGroup({
    search: new FormControl<string | null>(''),
    severity: new FormControl<string | null>(''),
    from: new FormControl<string | null>(''),
    to: new FormControl<string | null>(''),
  });

  readonly vehicleLogs = this.store.selectSignal(searchFeature.selectAll);
  readonly page = this.store.selectSignal(searchFeature.selectPage);
  readonly size = this.store.selectSignal(searchFeature.selectSize);
  readonly total = this.store.selectSignal(searchFeature.selectTotal);
  readonly loading = this.store.selectSignal(searchFeature.selectLoading);
  readonly loaded = this.store.selectSignal(searchFeature.selectLoaded);

  readonly paginator = viewChild(MatPaginator);

  readonly tableColumns = tableColumns;
  readonly dataSource = new MatTableDataSource<VehicleLog>([]);

  constructor() {
    effect(() => {
      this.dataSource.data = this.vehicleLogs() || [];
      this.dataSource.paginator = this.paginator();
    });
  }

  search(): void {
    const params: SearchLogsParams = {
      search: this.form.value.search ?? undefined,
      severity: this.form.value.severity ?? undefined,
      from: this.form.value.from ?? undefined,
      to: this.form.value.to ?? undefined,
    };
    this.store.dispatch(SearchActions.searchLogs({ params }));
  }
}
