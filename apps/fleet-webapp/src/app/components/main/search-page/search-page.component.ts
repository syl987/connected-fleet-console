import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, effect, inject, viewChild } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { SearchVehicleLogsParams } from '../../../models/search.models';
import { VehicleLog } from '../../../models/vehicle-log.models';
import { SearchService } from '../../../services/search.service';
import { TitleBarComponent } from '../../core/title-bar/title-bar.component';

const tableColumns = [
  'timestamp',
  'severity',
  'code',
  'brand',
  'model',
  'year',
  'message',
];

@Component({
  selector: 'app-search-page',
  imports: [
    ReactiveFormsModule,
    MatButtonModule,
    MatCardModule,
    MatDatepickerModule,
    MatInputModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    MatSelectModule,
    MatTableModule,
    MatTabsModule,
    TitleBarComponent,
    DatePipe,
  ],
  templateUrl: './search-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchPageComponent {
  protected readonly searchService = inject(SearchService);

  readonly form = new FormGroup({
    search: new FormControl<string | null>(null),
    vehicle: new FormControl<string | null>(null),
    mileage: new FormControl<string | null>(null),
    year: new FormControl<string | null>(null),
    severity: new FormControl<string | null>(null),
    code: new FormControl<string | null>(null),
    from: new FormControl<string | null>(null),
    to: new FormControl<string | null>(null),
  });

  readonly vehicleLogs = toSignal(this.searchService.vehicleLogs$, { requireSync: true });
  readonly page = toSignal(this.searchService.page$, { requireSync: true });
  readonly size = toSignal(this.searchService.size$, { requireSync: true });
  readonly total = toSignal(this.searchService.total$, { requireSync: true });
  readonly loading = toSignal(this.searchService.loading$, { requireSync: true });
  readonly loaded = toSignal(this.searchService.loaded$, { requireSync: true });

  readonly paginator = viewChild(MatPaginator);

  readonly tableColumns = tableColumns;
  readonly dataSource = new MatTableDataSource<VehicleLog>([]);

  constructor() {
    effect(() => {
      this.dataSource.data = this.vehicleLogs();
    });
  }

  search(options?: { page?: number; size?: number }): void {
    const params: SearchVehicleLogsParams = {
      search: this.form.value.search || undefined,
      vehicle: this.form.value.vehicle || undefined,
      mileage: this.form.value.mileage || undefined,
      year: this.form.value.year || undefined,
      severity: this.form.value.severity || undefined,
      code: this.form.value.code || undefined,
      from: this.form.value.from || undefined,
      to: this.form.value.to || undefined,

      page: options?.page ?? 1,
      size: options?.size ?? this.paginator()?.pageSize ?? 5,
    };
    this.searchService.search(params);
  }

  clearVehicleLogs(): void {
    this.searchService.clearVehicleLogs();
  }
}
