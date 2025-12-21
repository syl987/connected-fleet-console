import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { GenerateVehicleLogsOptions } from '../../models/vehicle-log.models';

export const DashboardActions = createActionGroup({
  source: 'Dashboard/API',
  events: {
    startGeneratingLogs: props<{ options: GenerateVehicleLogsOptions }>(),
    startGeneratingLogsSUCCESS: emptyProps(),
    startGeneratingLogsERROR: emptyProps(),

    stopGeneratingLogs: emptyProps(),
    stopGeneratingLogsSUCCESS: emptyProps(),
    stopGeneratingLogsERROR: emptyProps(),
  },
});
