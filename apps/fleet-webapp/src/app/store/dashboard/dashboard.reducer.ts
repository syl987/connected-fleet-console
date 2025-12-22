import { createFeature, createReducer, on } from '@ngrx/store';
import { VehicleLogsSummary } from '../../models/vehicle-log.models';
import { DashboardActions } from './dashboard.actions';

export const dashboardFeatureKey = 'dashboard';

export interface State {
  summary: VehicleLogsSummary | null;
  streaming: boolean;
}

export const initialState: State = {
  summary: null,
  streaming: false,
};

export const reducer = createReducer(
  initialState,
  on(DashboardActions.streamAnalytics, (state) => ({ ...state, streaming: true })),
  on(DashboardActions.streamAnalyticsNEXT, (state, { summary }) => ({ ...state, summary })),
  on(DashboardActions.streamAnalyticsERROR, (state) => ({ ...state, streaming: false })),
  on(DashboardActions.streamAnalyticsSTOP, (state) => ({ ...state, streaming: false })),
);

export const dashboardFeature = createFeature({
  name: dashboardFeatureKey,
  reducer,
});
