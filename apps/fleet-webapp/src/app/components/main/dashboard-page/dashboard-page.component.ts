import { DecimalPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { GenerateVehicleLogsOptions } from '../../../models/vehicle-log.models';
import { DashboardService } from '../../../services/dashboard.service';
import { LogSummary, VehicleLogsAnalyticsService } from '../../../services/vehicle-logs-analytics.service';
import { TitleBarComponent } from '../../core/title-bar/title-bar.component';

@Component({
  selector: 'app-dashboard-page',
  imports: [
    MatButtonModule,
    MatCardModule,
    MatChipsModule,
    MatDividerModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatTableModule,
    MatTooltipModule,
    TitleBarComponent,
    DecimalPipe,
  ],
  templateUrl: './dashboard-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardPageComponent implements OnInit {
  private readonly dashboardService = inject(DashboardService);
  private readonly analyticsService = inject(VehicleLogsAnalyticsService);

  readonly summary = signal<LogSummary | null>(null);
  readonly loading = signal(false);

  ngOnInit(): void {
    this.loadAnalytics();
  }

  loadAnalytics(): void {
    this.loading.set(true);

    this.analyticsService.getSummary().subscribe({
      next: (data) => this.summary.set(data),
      error: (err) => console.error('Error loading summary:', err),
    });
  }

  startGeneratingLogs(): void {
    const options: GenerateVehicleLogsOptions = {
      duration: 2 * 60 * 1000, // for 2 minutes
      interval: 2 * 1000, // every 2 seconds
      max: 2, // maximum 2 logs per interval
    };
    this.dashboardService.startGeneratingLogs(options);
    // Reload analytics after a short delay
    setTimeout(() => this.loadAnalytics(), 3000);
  }

  stopGeneratingLogs(): void {
    this.dashboardService.stopGeneratingLogs();
    this.loadAnalytics();
  }
}
