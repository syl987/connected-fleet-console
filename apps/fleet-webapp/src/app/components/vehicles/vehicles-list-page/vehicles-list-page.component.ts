import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { RouterModule } from '@angular/router';
import { VehicleService } from '../../../services/vehicle.service';
import { TitleBarComponent } from '../../core/title-bar/title-bar.component';
import { VehicleCardComponent } from '../vehicle-card/vehicle-card.component';

@Component({
  selector: 'app-vehicles-list-page',
  imports: [
    RouterModule,
    MatCardModule,
    MatDividerModule,
    MatIconModule,
    MatProgressSpinnerModule,
    TitleBarComponent,
    VehicleCardComponent,
  ],
  templateUrl: './vehicles-list-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VehiclesListPageComponent {
  protected readonly vehicleService = inject(VehicleService);

  readonly vehicles = toSignal(this.vehicleService.filteredEntities$, { requireSync: true });
  readonly loading = toSignal(this.vehicleService.loading$, { requireSync: true });
}
