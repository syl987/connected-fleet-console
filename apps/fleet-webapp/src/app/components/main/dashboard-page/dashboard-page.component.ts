import { AsyncPipe, DatePipe, DecimalPipe, JsonPipe, KeyValuePipe } from '@angular/common';
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
import {
  LogSummary,
  SeverityDistribution,
  TopError,
  TrendData,
  VehicleHealth,
  VehicleLogsAnalyticsService,
} from '../../../services/vehicle-logs-analytics.service';
import { TitleBarComponent } from '../../core/title-bar/title-bar.component';

@Component({
  selector: 'app-dashboard-page',
  imports: [
    AsyncPipe,
    DatePipe,
    DecimalPipe,
    JsonPipe,
    KeyValuePipe,
    MatButtonModule,
    MatCardModule,
    MatChipsModule,
    MatDividerModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatTableModule,
    MatTooltipModule,
    TitleBarComponent,
  ],
  templateUrl: './dashboard-page.component.html',
  styleUrl: './dashboard-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardPageComponent implements OnInit {
  private readonly dashboardService = inject(DashboardService);
  private readonly analyticsService = inject(VehicleLogsAnalyticsService);

  readonly summary = signal<LogSummary | null>(null);
  readonly severityDistribution = signal<SeverityDistribution[]>([]);
  readonly topErrors = signal<TopError[]>([]);
  readonly vehicleHealth = signal<VehicleHealth[]>([]);
  readonly trends = signal<TrendData | null>(null);
  readonly loading = signal(false);

  readonly topErrorColumns = [
    'code',
    'severity',
    'count',
    'affectedVehicles',
    'lastOccurrence',
  ];
  readonly vehicleHealthColumns = [
    'vehicle',
    'status',
    'healthScore',
    'critical',
    'error',
    'warning',
    'total',
  ];

  ngOnInit(): void {
    this.loadAnalytics();
  }

  loadAnalytics(): void {
    this.loading.set(true);

    this.analyticsService.getSummary().subscribe({
      next: (data) => this.summary.set(data),
      error: (err) => console.error('Error loading summary:', err),
    });

    this.analyticsService.getSeverityDistribution().subscribe({
      next: (data) => this.severityDistribution.set(data),
      error: (err) => console.error('Error loading severity distribution:', err),
    });

    this.analyticsService.getTopErrors({ limit: 10 }).subscribe({
      next: (data) => this.topErrors.set(data),
      error: (err) => console.error('Error loading top errors:', err),
    });

    this.analyticsService.getVehicleHealth().subscribe({
      next: (data) => this.vehicleHealth.set(data.slice(0, 10)),
      error: (err) => console.error('Error loading vehicle health:', err),
    });

    this.analyticsService.getTrends({ days: 7 }).subscribe({
      next: (data) => this.trends.set(data),
      error: (err) => console.error('Error loading trends:', err),
      complete: () => this.loading.set(false),
    });
  }

  getSeverityColor(severity: string): string {
    switch (severity?.toUpperCase()) {
      case 'CRITICAL':
        return 'warn';
      case 'ERROR':
        return 'accent';
      case 'WARNING':
        return 'primary';
      default:
        return '';
    }
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'critical':
        return 'warn';
      case 'warning':
        return 'accent';
      case 'healthy':
        return 'primary';
      default:
        return '';
    }
  }

  getStatusIcon(status: string): string {
    switch (status) {
      case 'critical':
        return 'error';
      case 'warning':
        return 'warning';
      case 'healthy':
        return 'check_circle';
      default:
        return 'help';
    }
  }

  getTrendIcon(trend: string): string {
    switch (trend) {
      case 'increasing':
        return 'trending_up';
      case 'decreasing':
        return 'trending_down';
      default:
        return 'trending_flat';
    }
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
