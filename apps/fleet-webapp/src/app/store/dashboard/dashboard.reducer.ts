import { createFeature, createReducer } from '@ngrx/store';

export const dashboardFeatureKey = 'dashboard';

export interface State {}

export const initialState: State = {};

export const reducer = createReducer(initialState);

export const dashboardFeature = createFeature({
  name: dashboardFeatureKey,
  reducer,
});
