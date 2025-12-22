import { CommonModule } from '@angular/common';
import { AfterViewInit, ChangeDetectionStrategy, Component, inject, OnDestroy } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { GenerateVehicleLogsOptions } from '../../../models/vehicle-log.models';
import { DashboardService } from '../../../services/dashboard.service';
import { TitleBarComponent } from '../../core/title-bar/title-bar.component';

const GENERATE_LOGS_DURATION = 2 * 60 * 1000;
const GENERATE_LOGS_INTERVAL = 5 * 1000;
const GENERATE_LOGS_MAX = 5;

@Component({
  selector: 'app-dashboard-page',
  imports: [
    CommonModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    TitleBarComponent,
  ],
  templateUrl: './dashboard-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardPageComponent implements AfterViewInit, OnDestroy {
  private readonly dashboardService = inject(DashboardService);

  readonly summary = toSignal(this.dashboardService.summary$, { requireSync: true });
  readonly streaming = toSignal(this.dashboardService.streaming$, { requireSync: true });

  ngAfterViewInit(): void {
    this.streamSummary();
  }

  ngOnDestroy(): void {
    this.stopStreamingSummary();
  }

  streamSummary(): void {
    this.dashboardService.streamSummary();
  }

  stopStreamingSummary(): void {
    this.dashboardService.stopStreamingSummary();
  }

  startGeneratingLogs(): void {
    const options: GenerateVehicleLogsOptions = {
      duration: GENERATE_LOGS_DURATION,
      interval: GENERATE_LOGS_INTERVAL,
      max: GENERATE_LOGS_MAX,
    };
    this.dashboardService.startGeneratingLogs(options);
  }

  stopGeneratingLogs(): void {
    this.dashboardService.stopGeneratingLogs();
  }
}
