import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TitleBarComponent } from '../../core/title-bar/title-bar.component';

@Component({
  selector: 'app-documentation-page',
  imports: [TitleBarComponent],
  templateUrl: './documentation-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DocumentationPageComponent {}
