import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { DashboardService } from '../services/dashboard.service';

export const streamVehicleLogsSummaryResolver: ResolveFn<void> = () => {
  inject(DashboardService).streamSummary();
  return; // return void to avoid blocking navigation
};
