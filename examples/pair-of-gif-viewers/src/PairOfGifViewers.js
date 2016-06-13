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
      Effects.map(leftFx, subAction => ({ type: 'Left', subAction })),
      Effects.map(leftFx, subAction => ({ type: 'Right', subAction }))
    ])
  ];
}

// UPDATE
export type Action
  = { type: 'Left', subAction: GifViewerAction }
  | { type: 'Right', subAction: GifViewerAction }
;

export const update = (model: Model, action: Action): [Model, Effect<Action>] => {
  switch(action.type) {
  case 'Left': {
    const [left, leftFx] = GifViewer.update(model.left, action.subAction);
    return [
      { ...model, left },
      Effects.map(leftFx, subAction => ({ type: 'Left', subAction }))
    ];
  }
  case 'Right': {
    const [right, rightFx] = GifViewer.update(model.right, action.subAction);
    return [
      { ...model, right },
      Effects.map(rightFx, subAction => ({ type: 'Right', subAction }))
    ];
  }
  default: throw new Error('Unknown action');
  }
}

// VIEW
type Props = {
  model: Model,
  dispatch: Dispatch<Action>
};


export const View: Class<React$Component<void, Props, void>> = view(({ model, dispatch }: Props) => (
  <div style={{display: 'flex'}}>
    <GifViewerView model={model.left} dispatch={forwardTo(dispatch, subAction => ({ type: 'Left', subAction }))} />
    <GifViewerView model={model.right} dispatch={forwardTo(dispatch, subAction => ({ type: 'Right', subAction }))} />
  </div>
));

export default { init, update };
