import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { RouterModule } from '@angular/router';
import { TitleBarComponent } from '../../../../components/title-bar/title-bar.component';
import { VehicleService } from '../../../../services/vehicle.service';
import { VehicleCardComponent } from '../vehicle-card/vehicle-card.component';

@Component({
  selector: 'app-vehicles-page',
  imports: [
    RouterModule,
    MatCardModule,
    MatDividerModule,
    MatIconModule,
    MatProgressSpinnerModule,
    TitleBarComponent,
    VehicleCardComponent,
  ],
  templateUrl: './vehicles-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VehiclesPageComponent implements OnInit {
  protected readonly service = inject(VehicleService);

  readonly vehicles = toSignal(this.service.filteredEntities$, { requireSync: true });
  readonly loading = toSignal(this.service.loading$, { requireSync: true });

  ngOnInit() {
    this.service.upsertOneInCache({ id: 0, brand: 'Toyota', model: 'Camry', year: 2020, mileage: 15000, vin: '1HGCM82633A123456' } as any);
    this.service.upsertOneInCache({ id: 1, brand: 'Honda', model: 'Civic', year: 2021, mileage: 12000, vin: '2HGCM82633A123457' } as any);
    this.service.upsertOneInCache({ id: 2, brand: 'Ford', model: 'F-150', year: 2019, mileage: 25000, vin: '3HGCM82633A123458' } as any);
    this.service.upsertOneInCache({ id: 3, brand: 'BMW', model: 'X5', year: 2022, mileage: 8000, vin: '4HGCM82633A123459' } as any);
    this.service.upsertOneInCache({ id: 4, brand: 'Tesla', model: 'Model S', year: 2021, mileage: 5000, vin: '5HGCM82633A123460' } as any);
  }
}
