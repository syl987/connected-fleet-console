import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { GenerateVehicleLogsOptions } from '../../../models/vehicle-log.models';
import { DashboardService } from '../../../services/dashboard.service';
import { TitleBarComponent } from '../../core/title-bar/title-bar.component';

@Component({
  selector: 'app-dashboard-page',
  imports: [MatButtonModule, MatCardModule, TitleBarComponent],
  templateUrl: './dashboard-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardPageComponent {
  private readonly dashboardService = inject(DashboardService);

  startGeneratingLogs(): void {
    const options: GenerateVehicleLogsOptions = {
      duration: 5 * 60 * 1000, // for 5 minutes
      interval: 2 * 1000, // every 2 seconds
      max: 5, // maximum 5 logs per interval
    };
    this.dashboardService.startGeneratingLogs(options);
  }

  stopGeneratingLogs(): void {
    this.dashboardService.stopGeneratingLogs();
  }
}
