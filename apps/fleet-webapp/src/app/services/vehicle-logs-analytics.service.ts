import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface LogSummary {
  totalLogs: number;
  bySeverity: Record<string, number>;
  uniqueVehicles: number;
  uniqueCodes: number;
  dateRange: {
    earliest: string;
    latest: string;
  };
}

export interface SeverityDistribution {
  severity: string;
  count: number;
  percentage: number;
}

export interface TopError {
  code: number;
  count: number;
  severity: string;
  lastOccurrence: string;
  affectedVehicles: number;
}

export interface TimelineData {
  period: string;
  count: number;
  bySeverity: Record<string, number>;
}

export interface VehicleHealth {
  vehicleId: number;
  vehicleName: string;
  vin: string;
  totalLogs: number;
  criticalCount: number;
  errorCount: number;
  warningCount: number;
  healthScore: number;
  status: 'healthy' | 'warning' | 'critical';
  lastLogTimestamp: string;
}

export interface TrendData {
  overallTrend: 'increasing' | 'decreasing' | 'stable';
  changeRate: number;
  anomalies: Array<{
    date: string;
    count: number;
    expected: number;
    deviation: number;
  }>;
  predictions: {
    nextDay: number;
    nextWeek: number;
  };
}

@Injectable({ providedIn: 'root' })
export class VehicleLogsAnalyticsService {
  protected readonly http = inject(HttpClient);

  readonly apiBaseUrl = typeof window !== 'undefined' ? (window as any)['apiBaseUrl'] || '' : '';

  readonly baseUrl = `${this.apiBaseUrl}/api/logs/analytics/vehicles`;

  getSummary(): Observable<LogSummary> {
    return this.http.get<LogSummary>(`${this.baseUrl}/summary`);
  }

  getSeverityDistribution(params?: { from?: Date; to?: Date; vehicle?: number }): Observable<SeverityDistribution[]> {
    return this.http.get<SeverityDistribution[]>(`${this.baseUrl}/severity-distribution`, {
      params: params as any,
    });
  }

  getTopErrors(params?: { limit?: number; severity?: string; from?: Date; to?: Date }): Observable<TopError[]> {
    return this.http.get<TopError[]>(`${this.baseUrl}/top-errors`, {
      params: params as any,
    });
  }

  getTimeline(params?: {
    groupBy?: 'hour' | 'day' | 'month';
    from?: Date;
    to?: Date;
    severity?: string;
    vehicle?: number;
  }): Observable<TimelineData[]> {
    return this.http.get<TimelineData[]>(`${this.baseUrl}/timeline`, {
      params: params as any,
    });
  }

  getVehicleHealth(params?: { from?: Date; to?: Date }): Observable<VehicleHealth[]> {
    return this.http.get<VehicleHealth[]>(`${this.baseUrl}/vehicle-health`, {
      params: params as any,
    });
  }

  getTrends(params?: { days?: number; severity?: string }): Observable<TrendData> {
    return this.http.get<TrendData>(`${this.baseUrl}/trends`, {
      params: params as any,
    });
  }
}
