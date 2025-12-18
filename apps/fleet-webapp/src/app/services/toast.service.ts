import { inject, Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig, MatSnackBarRef, TextOnlySnackBar } from '@angular/material/snack-bar';

type TextOnlySnackBarConfig = Pick<MatSnackBarConfig<never>, 'duration'>;

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  protected readonly snackbar = inject(MatSnackBar);

  showSuccessToast(message: string, options?: TextOnlySnackBarConfig): MatSnackBarRef<TextOnlySnackBar> {
    return this.snackbar.open(message, undefined, { duration: 3000, ...options, panelClass: 'success' });
  }

  showErrorToast(message: string, options?: TextOnlySnackBarConfig): MatSnackBarRef<TextOnlySnackBar> {
    return this.snackbar.open(message, undefined, { duration: 5000, ...options, panelClass: 'error' });
  }

  showInfoToast(message: string, options?: TextOnlySnackBarConfig): MatSnackBarRef<TextOnlySnackBar> {
    return this.snackbar.open(message, undefined, { duration: 6000, ...options, panelClass: 'info' });
  }
}
