// @flow

import React from 'react';
import type {Dispatch, Effect, PureView} from 'redux-elmish';
import {view, Effects, forwardTo} from 'redux-elmish';

import type {Model as CounterModel, Action as CounterAction} from './Counter';
import Counter, {View as CounterView}  from './Counter';

// MODEL
export type Model = {
  counters: IndexedCounter[],
  uid: number
};

type IndexedCounter = {
  id: number,
  model: CounterModel
};

const init = (): Model => {
  return {
    counters: [],
    uid: 0
  };
}

// UPDATE
export type Action
  = { type: 'Insert' }
  | { type: 'Remove' }
  | { type: 'Modify', id: number, counterAction: CounterAction }
;

const updateHelp = (targetId: number, action: CounterAction) => {
  return (indexedCounter: IndexedCounter): IndexedCounter => {
    const {id} = indexedCounter;
    return (targetId === id) ? { id, model: Counter.update(indexedCounter.model, action) } : indexedCounter;
  }
}

const update = (model: Model, action: Action): Model => {
  const {counters, uid} = model;
  switch (action.type) {
  case 'Insert': return {
    ...model,
    counters: [...counters, { model: Counter.init(0), id: uid }],
    uid: uid + 1
  };
  case 'Remove': return {
    ...model,
    counters: counters.slice(0, counters.length - 1)
  };
  case 'Modify': return {
    ...model,
    counters: counters.map(updateHelp(action.id, action.counterAction))
  };
  default: throw new Error(`Unknown action type ${action.type}`);
  }
}

// VIEW
type Props = {
  model: Model,
  dispatch: Dispatch<Action>
};

const CounterItem = ({id, model, dispatch}) => (
  <CounterView
    model={model}
    dispatch={forwardTo(dispatch, counterAction => ({ type: 'Modify', id, counterAction }))}
  />
);

export const View: PureView<Props> = view(({ model, dispatch }: Props) => {
  return (
    <div>
      <button onClick={() => dispatch({ type: 'Remove' })}>Remove</button>
      <button onClick={() => dispatch({ type: 'Insert' })}>Insert</button>
      {model.counters.map(counter => <CounterItem key={counter.id} id={counter.id} model={counter.model} dispatch={dispatch} />)}
    </div>
  );
});

export default { init, update };
