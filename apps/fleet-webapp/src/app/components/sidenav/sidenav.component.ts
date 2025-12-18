import { ChangeDetectionStrategy, Component, inject, output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { Router, RouterModule } from '@angular/router';
import { APP_LINKS, APP_OPTIONS } from '../../models/app.models';

@Component({
  selector: 'app-sidenav',
  imports: [
    RouterModule,
    MatButtonModule,
    MatIconModule,
    MatListModule,
  ],
  templateUrl: './sidenav.component.html',
  styleUrl: './sidenav.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SidenavComponent {
  protected readonly router = inject(Router);

  readonly options = inject(APP_OPTIONS);
  readonly links = inject(APP_LINKS);

  readonly navigated = output();
}
