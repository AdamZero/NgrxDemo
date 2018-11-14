import { Action } from '@ngrx/store';

export enum ActionTypes {
  ADD = '[Count] Add',
  REMOVE = '[Count] Remove',
}

export class CountAdd implements Action {
  readonly type = ActionTypes.ADD;
}

export class CountRemove implements Action {
  readonly type = ActionTypes.REMOVE;
}

export type Actions = CountAdd | CountRemove;
