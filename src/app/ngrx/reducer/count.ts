import * as
  CountActions
  from '../actions/count';

export interface State {
  count: number;
}

const initialState: State = {
  count: 0,
};

export function reducer(
  state: State = initialState,
  action: CountActions.Actions
): State {
  switch (action.type) {
    case CountActions.ActionTypes.ADD:
      return { count: ++state.count };

    case CountActions.ActionTypes.REMOVE:
      return { count: --state.count }

    default:
      return state;
  }
}

export const getCount = (state: State) => state.count;
