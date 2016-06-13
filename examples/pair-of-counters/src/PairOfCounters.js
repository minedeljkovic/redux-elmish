// @flow

import React from 'react';
import type {Dispatch} from './dispatch';
import {forwardTo} from './dispatch';
import view from './view';

import type {Model as CounterModel, Action as CounterAction} from './Counter';
import Counter, {View as CounterView}  from './Counter';

// MODEL
export type Model = {
  topCounter: CounterModel,
  bottomCounter: CounterModel
};

function init(topCount: number = 0, bottomCount: number = 0): Model {
  return {
    topCounter: Counter.init(topCount),
    bottomCounter: Counter.init(bottomCount)
  };
}

// UPDATE
export type Action
  = { type: 'Reset' }
  | { type: 'Top', topAction: CounterAction }
  | { type: 'Bottom', bottomAction: CounterAction }
;

function update(model: Model, action: Action): Model {
  switch (action.type) {
  case 'Reset': return init(0, 0);
  case 'Top': return {...model, topCounter: Counter.update(model.topCounter, action.topAction)};
  case 'Bottom': return {...model, bottomCounter: Counter.update(model.bottomCounter, action.bottomAction)};
  default: throw new Error(`Unknown action type ${action.type}`);
  }
}

// VIEW
type Props = {
  model: Model,
  dispatch: Dispatch<Action>
};


export const View: Class<React$Component<void, Props, void>> = view(({ model, dispatch }: Props) => (
  <div>
    <CounterView model={model.topCounter} dispatch={forwardTo(dispatch, topAction => ({ type: 'Top', topAction }))} />
    <CounterView model={model.bottomCounter} dispatch={forwardTo(dispatch, bottomAction => ({ type: 'Bottom', bottomAction }))} />
    <button onClick={() => dispatch({ type: 'Reset' })}>RESET</button>
  </div>
));

export default { init, update };
