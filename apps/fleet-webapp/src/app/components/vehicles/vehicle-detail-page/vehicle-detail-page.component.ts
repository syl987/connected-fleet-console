import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, effect, inject, viewChild } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { Log } from '../../../models/log.models';
import { VehicleService } from '../../../services/vehicle.service';
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
  protected readonly service = inject(VehicleService);
  protected readonly route = inject(ActivatedRoute);

  readonly vehicle = toSignal(this.service.entityByRouteId$, { requireSync: true });
  readonly loading = toSignal(this.service.loading$, { requireSync: true });

  readonly paginator = viewChild(MatPaginator);

  readonly tableColumns = tableColumns;
  readonly dataSource = new MatTableDataSource<Log>([]);

  constructor() {
    effect(() => {
      this.dataSource.data = this.vehicle()?.logs || [];
      this.dataSource.paginator = this.paginator();
    });
  }
}
