// @flow

import React from 'react';
import type {Dispatch, Effect, PureView} from 'redux-elmish';
import {view, Effects, forwardTo} from 'redux-elmish';

import type {Model as GifModel, Action as GifAction} from './Gif';
import Gif, {View as GifView} from './Gif';

import type {Model as ActivationModel, Action as ActivationAction} from './Activation';
import Activation, {View as ActivationView} from './Activation';

// MODEL
export type Model = {
  left: ActivationModel<GifModel>,
  right: GifModel
};

export const init = (leftTopic: ?string, rightTopic: string = 'funny dogs'): [Model, Effect<Action>] => {
  const [left, leftFx] = Activation.init();
  const [right, rightFx] = Gif.init(rightTopic);
  return [
    { left, right },
    Effects.batch([
      Effects.map(leftFx, leftAction => ({ type: 'Left', leftAction })),
      Effects.map(rightFx, rightAction => ({ type: 'Right', rightAction }))
    ])
  ];
}

// UPDATE
export type Action
  = { type: 'Left', leftAction: ActivationAction<GifAction> }
  | { type: 'Right', rightAction: GifAction }
;

export const update = (model: Model, action: Action): [Model, Effect<Action>] => {
  switch(action.type) {
  case 'Left': {
    const [left, leftFx] = Activation.update(model.left, action.leftAction, Gif);
    return [
      { ...model, left },
      Effects.map(leftFx, leftAction => ({ type: 'Left', leftAction }))
    ];
  }
  case 'Right': {
    const [right, rightFx] = Gif.update(model.right, action.rightAction);
    return [
      { ...model, right },
      Effects.map(rightFx, rightAction => ({ type: 'Right', rightAction }))
    ];
  }
  default: throw new Error(`Unknown action type ${action.type}`);
  }
}

// VIEW
type Props = {
  model: Model,
  dispatch: Dispatch<Action>
};


export const View: PureView<Props> = view(({ model, dispatch }) => (
  <div style={{display: 'flex'}}>
    <ActivationView model={model.left} dispatch={forwardTo(dispatch, leftAction => ({ type: 'Left', leftAction }))} inner={GifView} />
    <GifView model={model.right} dispatch={forwardTo(dispatch, rightAction => ({ type: 'Right', rightAction }))} />
  </div>
));

export default { init, update };
