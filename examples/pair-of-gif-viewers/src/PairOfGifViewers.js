// @flow

import React from 'react';
import type {Dispatch} from './dispatch';
import {forwardTo} from './dispatch';
import view from './view';
import type {Effect} from './effects';
import Effects from './effects';

import type {Model as GifViewerModel, Action as GifViewerAction} from './GifViewer';
import GifViewer, {View as GifViewerView} from './GifViewer';

// MODEL
export type Model = {
  left: GifViewerModel,
  right: GifViewerModel
};

export const init = (leftTopic: string = 'funny cats', rightTopic: string = 'funny dogs'): [Model, Effect<Action>] => {
  const [left, leftFx] = GifViewer.init(leftTopic);
  const [right, rightFx] = GifViewer.init(rightTopic);
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
  = { type: 'Left', leftAction: GifViewerAction }
  | { type: 'Right', rightAction: GifViewerAction }
;

export const update = (model: Model, action: Action): [Model, Effect<Action>] => {
  switch(action.type) {
  case 'Left': {
    const [left, leftFx] = GifViewer.update(model.left, action.leftAction);
    return [
      { ...model, left },
      Effects.map(leftFx, leftAction => ({ type: 'Left', leftAction }))
    ];
  }
  case 'Right': {
    const [right, rightFx] = GifViewer.update(model.right, action.rightAction);
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


export const View: Class<React$Component<void, Props, void>> = view(({ model, dispatch }: Props) => (
  <div style={{display: 'flex'}}>
    <GifViewerView model={model.left} dispatch={forwardTo(dispatch, leftAction => ({ type: 'Left', leftAction }))} />
    <GifViewerView model={model.right} dispatch={forwardTo(dispatch, rightAction => ({ type: 'Right', rightAction }))} />
  </div>
));

export default { init, update };
