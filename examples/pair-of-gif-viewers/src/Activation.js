// @flow

import React from 'react';
import type {Dispatch, Effect, PureView} from 'redux-elmish';
import {view, Effects, forwardTo} from 'redux-elmish';

// MODEL
export type Model = {
  status: 'INACTIVE' | 'ACTIVE',
  activationText: string,
  innerInit: (text: string) => any,
  inner: any
};

export const init = (innerInit: (text: string) => any): [Model, Effect<Action>] => {
  return [
    { status: 'INACTIVE', activationText: '', innerInit, inner: null },
    Effects.none()
  ];
}

// UPDATE
export type Action
  = { type: 'Activate' }
  | { type: 'ChangeText', text: string }
  | { type: 'Inner', innerAction: any }
;

export const update = (model: Model, action: Action, innerUpdate: (innerModel: any, innerAction: any) => any): [Model, Effect<Action>] => {
  switch(action.type) {
  case 'ChangeText': return [
    { ...model, activationText: action.text },
    Effects.none()
  ];
  case 'Activate': {
    const [inner, innerFx] = model.innerInit(model.activationText);
    return [
      { ...model, status: 'ACTIVE', inner },
      Effects.map(innerFx, innerAction => ({ type: 'Inner', innerAction }))
    ]
  }
  case 'Inner': {
    const [inner, innerFx] = innerUpdate(model.inner, action.innerAction);
    return [
      { ...model, inner },
      Effects.map(innerFx, innerAction => ({ type: 'Inner', innerAction }))
    ];
  }
  default: throw new Error(`Unknown action type ${action.type}`);
  }
}

// VIEW
type Props = {
  model: Model,
  dispatch: Dispatch<Action>,
  inner: any // Component
};


export const View: PureView<Props> = view(({ model, dispatch, inner }) => (
  <div>
  {model.status === 'INACTIVE' &&
    <input
      value={model.activationText}
      onKeyDown={({keyCode}) => keyCode === 13 && dispatch({ type: 'Activate' })}
      onChange={({target}) => dispatch({ type: 'ChangeText', text: target.value })}
    />
  }
  {model.status === 'ACTIVE' &&
    React.createElement(inner, {
      model: model.inner,
      dispatch: forwardTo(dispatch, innerAction => ({ type: 'Inner', innerAction }))
    })
  }
  </div>
));

export default { init, update };
