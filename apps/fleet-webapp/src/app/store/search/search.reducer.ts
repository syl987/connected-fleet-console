import { EntityAdapter, EntityState, createEntityAdapter } from '@ngrx/entity';
import { createFeature, createReducer, on } from '@ngrx/store';
import { SearchActions } from './search.actions';
import { Search } from './search.model';

export const searchesFeatureKey = 'searches';

export type State = EntityState<Search>;

export const adapter: EntityAdapter<Search> = createEntityAdapter<Search>();

export const initialState: State = adapter.getInitialState({
  // additional entity state properties
});

export const reducer = createReducer(
  initialState,
  on(SearchActions.searchLogs, (state, { params }) => ({
    ...state,
    pagination: { page: params.page, size: params.size },
    loading: true,
  })),
  on(SearchActions.searchLogsSUCCESS, (state, { page }) =>
    adapter.upsertMany(page.data, {
      ...state,
      currentIds: page.data.map((log) => log.id),
      loading: false,
    })),
  on(SearchActions.searchLogsERROR, (state) => ({
    ...state,
    loading: false,
  })),
  on(SearchActions.clearLogs, (state) => adapter.removeAll(state)),
);

export const searchesFeature = createFeature({
  name: searchesFeatureKey,
  reducer,
  extraSelectors: ({ selectSearchesState }) => ({
    ...adapter.getSelectors(selectSearchesState),
  }),
});

export const { selectIds, selectEntities, selectAll, selectTotal } = searchesFeature;
