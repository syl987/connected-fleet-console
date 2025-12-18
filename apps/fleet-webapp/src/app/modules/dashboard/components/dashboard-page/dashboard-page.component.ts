import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { TitleBarComponent } from '../../../../components/title-bar/title-bar.component';

@Component({
  selector: 'app-dashboard-page',
  imports: [MatCardModule, TitleBarComponent],
  templateUrl: './dashboard-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardPageComponent {}
