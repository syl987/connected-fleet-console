import { inject, Injectable } from '@angular/core';
import { EntityAction, EntityOp, ofEntityOp } from '@ngrx/data';
import { Actions, createEffect } from '@ngrx/effects';
import { tap } from 'rxjs';
import { ToastService } from '../../services/toast.service';

function getSuccessMessage(entityName: string, entityOp: EntityOp): string {
  switch (entityOp) {
    case EntityOp.SAVE_ADD_ONE_SUCCESS:
      return `${entityName} successfully created.`;
    case EntityOp.SAVE_UPDATE_ONE_SUCCESS:
      return `${entityName} successfully updated.`;
    case EntityOp.SAVE_UPSERT_ONE_SUCCESS:
      return `${entityName} successfully saved.`;
    case EntityOp.SAVE_DELETE_ONE_SUCCESS:
      return `${entityName} successfully deleted.`;
    default:
      return `Operation successful.`; // should not happen
  }
}

function getErrorMessage(entityName: string, entityOp: EntityOp): string {
  switch (entityOp) {
    case EntityOp.SAVE_ADD_ONE_ERROR:
      return `Error creating ${entityName}.`;
    case EntityOp.SAVE_UPDATE_ONE_ERROR:
      return `Error updating ${entityName}.`;
    case EntityOp.SAVE_UPSERT_ONE_ERROR:
      return `Error saving ${entityName}.`;
    case EntityOp.SAVE_DELETE_ONE_ERROR:
      return `Error deleting ${entityName}.`;
    case EntityOp.QUERY_BY_KEY_ERROR:
      return `Error loading ${entityName}.`;
    case EntityOp.QUERY_ALL_ERROR:
    case EntityOp.QUERY_MANY_ERROR:
    case EntityOp.QUERY_LOAD_ERROR:
      return `Error loading ${entityName}s.`;
    default:
      return `Unknown Error.`; // should not happen
  }
}

@Injectable()
export class ToastEffects {
  protected readonly actions = inject<Actions<EntityAction>>(Actions);
  protected readonly toastService = inject(ToastService);

  readonly showEntitySuccessToast$ = createEffect(
    () =>
      this.actions.pipe(
        ofEntityOp([
          EntityOp.SAVE_ADD_ONE_SUCCESS,
          EntityOp.SAVE_UPDATE_ONE_SUCCESS,
          EntityOp.SAVE_UPSERT_ONE_SUCCESS,
          EntityOp.SAVE_DELETE_ONE_SUCCESS,
          EntityOp.SAVE_ADD_MANY_SUCCESS,
          EntityOp.SAVE_UPDATE_MANY_SUCCESS,
          EntityOp.SAVE_UPSERT_MANY_SUCCESS,
          EntityOp.SAVE_DELETE_MANY_SUCCESS,
        ]),
        tap(({ payload }) => this.toastService.showSuccessToast(getSuccessMessage(payload.entityName, payload.entityOp))),
      ),
    { dispatch: false },
  );

  readonly showEntityErrorToast$ = createEffect(
    () =>
      this.actions.pipe(
        ofEntityOp([
          EntityOp.SAVE_ADD_ONE_ERROR,
          EntityOp.SAVE_UPDATE_ONE_ERROR,
          EntityOp.SAVE_UPSERT_ONE_ERROR,
          EntityOp.SAVE_DELETE_ONE_ERROR,
          EntityOp.SAVE_ADD_MANY_ERROR,
          EntityOp.SAVE_UPDATE_MANY_ERROR,
          EntityOp.SAVE_UPSERT_MANY_ERROR,
          EntityOp.SAVE_DELETE_MANY_ERROR,
          EntityOp.QUERY_BY_KEY_ERROR,
          EntityOp.QUERY_ALL_ERROR,
          EntityOp.QUERY_MANY_ERROR,
          EntityOp.QUERY_LOAD_ERROR,
        ]),
        tap(({ payload }) => this.toastService.showErrorToast(getErrorMessage(payload.entityName, payload.entityOp))),
      ),
    { dispatch: false },
  );
}
