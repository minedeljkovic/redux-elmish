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
  | { type: 'TopCounter', subAction: CounterAction }
  | { type: 'BottomCounter', subAction: CounterAction }
;

function update(model: Model, action: Action): Model {
  switch (action.type) {
  case 'Reset': return init();
  case 'TopCounter': return {...model, topCounter: Counter.update(model.topCounter, action.subAction)};
  case 'BottomCounter': return {...model, bottomCounter: Counter.update(model.bottomCounter, action.subAction)};
  default: throw new Error('Unknown action');
  }
}

// VIEW
type Props = {
  model: Model,
  dispatch: Dispatch<Action>
};


export const View: Class<React$Component<void, Props, void>> = view(({ model, dispatch }: { model: Model, dispatch: Dispatch<Action> }) => (
  <div>
    <CounterView model={model.topCounter} dispatch={forwardTo(dispatch, subAction => ({ type: 'TopCounter', subAction }))} />
    <CounterView model={model.bottomCounter} dispatch={forwardTo(dispatch, subAction => ({ type: 'BottomCounter', subAction }))} />
    <button onClick={() => dispatch({ type: 'Reset' })}>RESET</button>
  </div>
));

export default { init, update };
