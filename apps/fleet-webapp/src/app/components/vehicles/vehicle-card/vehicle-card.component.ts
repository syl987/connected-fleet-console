import { CommonModule, LowerCasePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { Vehicle } from '../../../models/vehicle.models';

@Component({
  selector: 'app-vehicle-card',
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatDividerModule,
    LowerCasePipe,
  ],
  templateUrl: './vehicle-card.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VehicleCardComponent {
  readonly data = input.required<Vehicle>();

  get color(): string {
    return this.data().color ?? '#828b9bff'; // Default to gray if no color is set
  }
}
