import { createActionGroup, emptyProps, props } from '@ngrx/store';
import {
  VehicleLogsColorStats,
  VehicleLogsSeverityStats,
  VehicleLogsSummary,
} from '../../models/vehicle-logs-analytics.models';
import { GenerateVehicleLogsOptions } from '../../models/vehicle-logs-utils.models';

export const DashboardActions = createActionGroup({
  source: 'VehicleLogs/API',
  events: {
    startGeneratingLogs: props<{ options: GenerateVehicleLogsOptions }>(),
    startGeneratingLogsSUCCESS: emptyProps(),
    startGeneratingLogsERROR: emptyProps(),

    stopGeneratingLogs: emptyProps(),
    stopGeneratingLogsSUCCESS: emptyProps(),
    stopGeneratingLogsERROR: emptyProps(),

    streamAnalytics: emptyProps(),
    streamAnalyticsNEXT: props<{
      summary: VehicleLogsSummary;
      severityStats: VehicleLogsSeverityStats;
      colorStats: VehicleLogsColorStats;
    }>(),
    streamAnalyticsERROR: emptyProps(),
    streamAnalyticsSTOP: emptyProps(),
  },
});
