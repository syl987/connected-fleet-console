import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { MarkdownModule } from 'ngx-markdown';
import { TitleBarComponent } from '../../core/title-bar/title-bar.component';

@Component({
  selector: 'app-documentation-page',
  imports: [MatTabsModule, MarkdownModule, TitleBarComponent],
  templateUrl: './documentation-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DocumentationPageComponent {}
