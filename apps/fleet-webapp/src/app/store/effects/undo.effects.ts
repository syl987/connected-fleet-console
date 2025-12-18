import { inject, Injectable } from '@angular/core';
import { EntityAction, EntityActionFactory, EntityOp, ofEntityOp } from '@ngrx/data';
import { Actions, createEffect } from '@ngrx/effects';
import { map } from 'rxjs';

@Injectable()
export class UndoEffects {
  protected readonly actions = inject<Actions<EntityAction>>(Actions);
  protected readonly f = inject(EntityActionFactory);

  readonly undoOne$ = createEffect(() =>
    this.actions.pipe(
      ofEntityOp(EntityOp.SAVE_ADD_ONE_ERROR, EntityOp.SAVE_UPDATE_ONE_ERROR, EntityOp.SAVE_UPSERT_ONE_ERROR, EntityOp.SAVE_DELETE_ONE_ERROR),
      map(action => this.f.createFromAction(action, { entityOp: EntityOp.UNDO_ONE, data: action.payload.data.originalAction.payload.data })),
    ));

  readonly undoMany$ = createEffect(() =>
    this.actions.pipe(
      ofEntityOp(EntityOp.SAVE_ADD_MANY_ERROR, EntityOp.SAVE_UPDATE_MANY_ERROR, EntityOp.SAVE_UPSERT_MANY_ERROR, EntityOp.SAVE_DELETE_MANY_ERROR),
      map(action => this.f.createFromAction(action, { entityOp: EntityOp.UNDO_MANY, data: action.payload.data.originalAction.payload.data })), // not tested
    ));
}
