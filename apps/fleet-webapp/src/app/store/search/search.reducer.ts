import { createFeature, createReducer, on } from '@ngrx/store';
import { PageIds } from '../../models/entity.models';
import { SearchActions } from './search.actions';

export const searchFeatureKey = 'search';

export interface State {
  pageIds?: PageIds;
  loading: boolean;
}

export const initialState: State = {
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
    pageIds: {
      ids: page.data.map((log) => log.id),
      page: page.page,
      size: page.size,
      total: page.total,
    },
    loading: false,
  })),
  on(SearchActions.searchLogsERROR, (state) => ({
    ...state,
    loading: false,
  })),
  on(SearchActions.clearLogs, (state) => ({ ...state, pageIds: undefined })),
);

export const searchFeature = createFeature({
  name: searchFeatureKey,
  reducer,
  extraSelectors: (state) => ({
    selectPageIds: state.selectors.selectState((s) => s.pageIds),
  }),
});
