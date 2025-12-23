import { JsonPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { ImportService } from '../../../services/import.service';
import { TitleBarComponent } from '../../core/title-bar/title-bar.component';

@Component({
  selector: 'app-import-page',
  imports: [MatButtonModule, TitleBarComponent, JsonPipe],
  templateUrl: './import-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ImportPageComponent {
  private readonly importService = inject(ImportService);

  readonly vehicleLogs = toSignal(this.importService.vehicleLogs$, { requireSync: true });
  readonly loading = toSignal(this.importService.loading$, { requireSync: true });
  readonly loaded = toSignal(this.importService.loaded$, { requireSync: true });

  import(file: File): void {
    this.importService.import(file);
  }

  clearVehicleLogs(): void {
    this.importService.clearVehicleLogs();
  }
}
