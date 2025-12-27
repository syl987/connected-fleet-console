import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, OnDestroy } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { ChartData } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { GenerateVehicleLogsOptions } from '../../../models/vehicle-logs-utils.models';
import { DashboardService } from '../../../services/dashboard.service';
import { TitleBarComponent } from '../../core/title-bar/title-bar.component';

const GENERATE_LOGS_DURATION = 2 * 60 * 1000;
const GENERATE_LOGS_INTERVAL = 2 * 1000;
const GENERATE_LOGS_MAX = 1;

const colors = {
  CRITICAL: 'red',
  ERROR: 'darkorange',
  WARNING: 'gold',
  INFO: 'cornflowerblue',
  DEBUG: 'silver',
};

@Component({
  selector: 'app-dashboard-page',
  imports: [
    CommonModule,
    MatButtonModule,
    MatCardModule,
    MatDividerModule,
    MatIconModule,
    BaseChartDirective,
    TitleBarComponent,
  ],
  templateUrl: './dashboard-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardPageComponent implements OnDestroy {
  private readonly dashboardService = inject(DashboardService);

  readonly summary = toSignal(this.dashboardService.summary$, { requireSync: true });
  readonly severityStats = toSignal(this.dashboardService.severityStats$, { requireSync: true });
  readonly colorStats = toSignal(this.dashboardService.colorStats$, { requireSync: true });

  readonly streaming = toSignal(this.dashboardService.streaming$, { requireSync: true });

  readonly severityChartData = computed<ChartData>(() => {
    const stats = this.severityStats()?.stats ?? [];

    return {
      labels: stats.map(({ severity }) => severity),
      datasets: [
        {
          data: stats.map(({ count }) => count),
          backgroundColor: stats.map(({ severity }) => colors[severity as keyof typeof colors]),
          animation: false,
        },
      ],
    };
  });

  readonly colorChartData = computed<ChartData>(() => {
    const stats = this.colorStats()?.stats.find((s) => s.severity === 'CRITICAL')?.stats ?? [];

    return {
      labels: stats.map(({ color }) => color),
      datasets: [
        {
          data: stats.map(({ count }) => count),
          backgroundColor: stats.map(({ color }) => color.toLowerCase()),
          animation: false,
        },
      ],
    };
  });

  ngOnDestroy(): void {
    this.dashboardService.stopStreamingAnalytics();
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
