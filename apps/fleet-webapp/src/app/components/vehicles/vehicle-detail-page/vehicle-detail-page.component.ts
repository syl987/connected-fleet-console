import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { VehicleService } from '../../../services/vehicle.service';
import { TitleBarComponent } from '../../core/title-bar/title-bar.component';
import { VehicleCardComponent } from '../vehicle-card/vehicle-card.component';

@Component({
  selector: 'app-vehicles-detail-page',
  imports: [
    RouterModule,
    MatCardModule,
    MatDividerModule,
    MatIconModule,
    MatProgressSpinnerModule,
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
}
