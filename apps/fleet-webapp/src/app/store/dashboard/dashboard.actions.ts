import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { GenerateVehicleLogsOptions, VehicleLogsSummary } from '../../models/vehicle-log.models';

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
    streamAnalyticsNEXT: props<{ summary: VehicleLogsSummary }>(),
    streamAnalyticsERROR: emptyProps(),
    streamAnalyticsSTOP: emptyProps(),
  },
});
