import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TitleBarComponent } from '../../core/title-bar/title-bar.component';

@Component({
  selector: 'app-welcome-page',
  imports: [TitleBarComponent],
  templateUrl: './welcome-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WelcomePageComponent {}
