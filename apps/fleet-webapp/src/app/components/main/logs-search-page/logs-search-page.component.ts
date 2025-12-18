import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TitleBarComponent } from '../../core/title-bar/title-bar.component';

@Component({
  selector: 'app-logs-search-page',
  imports: [TitleBarComponent],
  templateUrl: './logs-search-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LogsSearchPageComponent {}
