import { AsyncPipe, CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { EntityCollectionServiceFactory } from '@ngrx/data';
import { VehicleService } from '../../../../services/vehicle.service';

@Component({
  selector: 'app-vehicles-page',
  imports: [CommonModule, AsyncPipe],
  templateUrl: './vehicles-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VehiclesPageComponent implements OnInit {
  protected readonly factory = inject(EntityCollectionServiceFactory);
  protected readonly service = inject(VehicleService);

  readonly vehicles$ = this.service.entities$;

  ngOnInit() {
    this.service.upsertOneInCache({ id: 0, brand: 'Toyota', model: 'Camry', year: 2020, mileage: 15000, vin: '1HGCM82633A123456' } as any);
  }

  reload() {
    this.service.getAll();
  }
}
