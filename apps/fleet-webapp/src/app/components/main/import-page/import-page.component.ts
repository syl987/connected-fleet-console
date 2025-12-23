import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, effect, inject, viewChild } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { VehicleLog } from '../../../models/vehicle-log.models';
import { ImportService } from '../../../services/import.service';
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
  selector: 'app-import-page',
  imports: [
    CommonModule,
    MatButtonModule,
    MatCardModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    MatTableModule,
    TitleBarComponent,
  ],
  templateUrl: './import-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ImportPageComponent {
  private readonly importService = inject(ImportService);

  readonly vehicleLogs = toSignal(this.importService.vehicleLogs$, { requireSync: true });
  readonly loading = toSignal(this.importService.loading$, { requireSync: true });
  readonly loaded = toSignal(this.importService.loaded$, { requireSync: true });

  readonly paginator = viewChild(MatPaginator);

  readonly tableColumns = tableColumns;
  readonly dataSource = new MatTableDataSource<VehicleLog>([]);

  constructor() {
    effect(() => {
      this.dataSource.data = this.vehicleLogs();
      this.dataSource.paginator = this.paginator();
    });
  }

  import(file: File): void {
    this.importService.import(file);
  }

  clearVehicleLogs(): void {
    this.importService.clearVehicleLogs();
  }
}
