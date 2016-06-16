// @flow

import React from 'react';
import type {Dispatch, Effect, PureView} from 'redux-elmish';
import {view, Effects, forwardTo} from 'redux-elmish';

import type {Model as GifModel, Action as GifAction} from './Gif';
import Gif, {View as GifView} from './Gif';

// MODEL
export type Model = {
  left: GifModel,
  right: GifModel
};

export const init = (leftTopic: string = 'funny cats', rightTopic: string = 'funny dogs'): [Model, Effect<Action>] => {
  const [left, leftFx] = Gif.init(leftTopic);
  const [right, rightFx] = Gif.init(rightTopic);
  return [
    { left, right },
    Effects.batch([
      Effects.map(leftFx, leftAction => ({ type: 'Left', leftAction })),
      Effects.map(leftFx, rightAction => ({ type: 'Right', rightAction }))
    ])
  ];
}

// UPDATE
export type Action
  = { type: 'Left', leftAction: GifAction }
  | { type: 'Right', rightAction: GifAction }
;

export const update = (model: Model, action: Action): [Model, Effect<Action>] => {
  switch(action.type) {
  case 'Left': {
    const [left, leftFx] = Gif.update(model.left, action.leftAction);
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
    <GifView model={model.left} dispatch={forwardTo(dispatch, leftAction => ({ type: 'Left', leftAction }))} />
    <GifView model={model.right} dispatch={forwardTo(dispatch, rightAction => ({ type: 'Right', rightAction }))} />
  </div>
));

export default { init, update };
