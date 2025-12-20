import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, effect, inject, viewChild } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { RouterModule } from '@angular/router';
import { Store } from '@ngrx/store';
import { VehicleLog } from '../../../models/vehicle-log.models';
import { VehicleLogService } from '../../../services/vehicle-log.service';
import { VehicleService } from '../../../services/vehicle.service';
import { vehicleLogsFeature } from '../../../store/vehicle-logs/vehicle-log.reducer';
import { TitleBarComponent } from '../../core/title-bar/title-bar.component';
import { VehicleCardComponent } from '../vehicle-card/vehicle-card.component';

const tableColumns = [
  'timestamp',
  'severity',
  'code',
  'message',
];

@Component({
  selector: 'app-vehicles-detail-page',
  imports: [
    RouterModule,
    MatCardModule,
    MatDividerModule,
    MatIconModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    MatTableModule,
    TitleBarComponent,
    VehicleCardComponent,
    DatePipe,
  ],
  templateUrl: './vehicle-detail-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VehicleDetailPageComponent {
  protected readonly store = inject(Store);
  protected readonly vehicleService = inject(VehicleService);
  protected readonly vehicleLogService = inject(VehicleLogService);

  readonly vehicle = toSignal(this.vehicleService.entityByRouteId$, { requireSync: true });
  readonly vehicleLoading = toSignal(this.vehicleService.loading$, { requireSync: true });

  readonly vehicleLogs = toSignal(this.vehicleLogService.entitiesByRouteId$, { requireSync: true });
  readonly vehicleLogsLoading = this.store.selectSignal(vehicleLogsFeature.selectLoading);

  readonly paginator = viewChild(MatPaginator);

  readonly tableColumns = tableColumns;
  readonly dataSource = new MatTableDataSource<VehicleLog>([]);

  constructor() {
    effect(() => {
      this.dataSource.data = this.vehicleLogs();
      this.dataSource.paginator = this.paginator();
    });
  }
}
