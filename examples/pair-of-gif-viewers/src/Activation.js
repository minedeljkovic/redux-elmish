// @flow

import React from 'react';
import type {Dispatch, Effect, PureView} from 'redux-elmish';
import {view, Effects, forwardTo} from 'redux-elmish';

// MODEL
type InactiveModel = { status: 'INACTIVE', activationText: string };
type ActiveModel<InnerModel> = { status: 'ACTIVE', inner: InnerModel };
export type Model<InnerModel> = InactiveModel | ActiveModel<InnerModel>;

export const init = (): [InactiveModel, Effect<Action>] => {
  return [
    { status: 'INACTIVE', activationText: '' },
    Effects.none()
  ];
}

// UPDATE
export type Action<InnerAction>
  = { type: 'Activate' }
  | { type: 'ChangeText', text: string }
  | { type: 'Inner', innerAction: InnerAction }
;

export type InnerComponent<Model, Action> = {
  init(activationText: string): [Model, Effect<Action>];
  update(model: Model, action: Action): [Model, Effect<Action>]
}

export function update<InnerModel, InnerAction>(model: Model, action: Action, component: InnerComponent<InnerModel, InnerAction>): [Model<InnerModel>, Effect<Action>] {
  switch(action.type) {
  case 'ChangeText': {
    if (model.status === 'ACTIVE') {
      return [
        model,
        Effects.none()
      ];
    }

    return [
      { ...model, activationText: action.text },
      Effects.none()
    ];
  }
  case 'Activate': {
    if (model.status === 'ACTIVE') {
      return [
        model,
        Effects.none()
      ];
    }

    const [inner, innerFx] = component.init(model.activationText);
    return [
      { status: 'ACTIVE', inner },
      Effects.map(innerFx, innerAction => ({ type: 'Inner', innerAction }))
    ]
  }
  case 'Inner': {
    if (model.status === 'INACTIVE') {
      return [
        model,
        Effects.none()
      ];
    }

    const [inner, innerFx] = component.update(model.inner, action.innerAction);
    return [
      { ...model, inner },
      Effects.map(innerFx, innerAction => ({ type: 'Inner', innerAction }))
    ];
  }
  default: throw new Error(`Unknown action type ${action.type}`);
  }
}

// VIEW
type Props<InnerModel, InnerAction> = {
  model: Model<InnerModel>,
  dispatch: Dispatch<Action<InnerAction>>,
  inner: Class<React$Component<void, {model: InnerModel, dispatch: InnerAction}, void>>
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
