import { createFeature, createReducer, on } from '@ngrx/store';
import { PageIds } from '../../models/entity.models';
import { SearchActions } from './search.actions';

export const searchFeatureKey = 'search';

export interface State extends PageIds {
  loading: boolean;
}

export const initialState: State = {
  ids: [],
  page: 0,
  size: 0,
  total: 0,
  loading: false,
};

export const reducer = createReducer(
  initialState,
  on(SearchActions.searchLogs, (state) => ({
    ...state,
    loading: true,
  })),
  on(SearchActions.searchLogsSUCCESS, (state, { page }) => ({
    ...state,
    ids: page.data.map((log) => log.id),
    page: page.page,
    size: page.size,
    total: page.total,
    loading: false,
  })),
  on(SearchActions.searchLogsERROR, (state) => ({
    ...state,
    loading: false,
  })),
  on(SearchActions.clearLogs, (state) => ({ ...state, ids: [], page: 0, size: 0, total: 0 })),
);

export const searchFeature = createFeature({
  name: searchFeatureKey,
  reducer,
});
