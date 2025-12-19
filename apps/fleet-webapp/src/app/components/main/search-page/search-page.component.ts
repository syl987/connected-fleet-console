import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { logsFeature } from '../../../store/logs/logs.reducer';
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

  readonly logs = this.store.selectSignal(logsFeature.selectAll);
  readonly searching = this.store.selectSignal(logsFeature.selectSearching);
}
