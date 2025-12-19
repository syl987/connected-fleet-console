import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { Vehicle } from '../../../models/vehicle.models';

@Component({
  selector: 'app-vehicle-card',
  imports: [MatCardModule, MatDividerModule],
  templateUrl: './vehicle-card.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VehicleCardComponent {
  readonly data = input.required<Vehicle>();
}
