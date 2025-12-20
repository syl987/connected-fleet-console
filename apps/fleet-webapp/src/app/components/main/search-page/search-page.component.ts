import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { SearchLogsParams } from '../../../models/log.models';
import { SearchActions } from '../../../store/search/search.actions';
import { searchFeature } from '../../../store/search/search.reducer';
import { TitleBarComponent } from '../../core/title-bar/title-bar.component';

@Component({
  selector: 'app-search-page',
  imports: [ReactiveFormsModule, TitleBarComponent],
  templateUrl: './search-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchPageComponent {
  protected readonly store = inject(Store);

  readonly form = new FormGroup({
    query: new FormControl<string | null>(''),
    severity: new FormControl<string | null>(''),
    from: new FormControl<string | null>(''),
    to: new FormControl<string | null>(''),
  });

  readonly vehicleLogs = this.store.selectSignal(searchFeature.selectAll);
  readonly page = this.store.selectSignal(searchFeature.selectPage);
  readonly size = this.store.selectSignal(searchFeature.selectSize);
  readonly total = this.store.selectSignal(searchFeature.selectTotal);
  readonly loading = this.store.selectSignal(searchFeature.selectLoading);

  search(): void {
    const params: SearchLogsParams = {
      search: this.form.value.query ?? undefined,
      severity: this.form.value.severity ?? undefined,
      from: this.form.value.from ?? undefined,
      to: this.form.value.to ?? undefined,
    };
    this.store.dispatch(SearchActions.searchLogs({ params }));
  }
}
