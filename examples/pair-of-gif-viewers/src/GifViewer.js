// @flow

import React from 'react';
import type {Dispatch} from './dispatch';
import view from './view';
import type {Effect} from './effects';
import {promiseEffect} from './effects';

// MODEL
export type Model = {
  topic: string,
  gifUrl: string
};

const decodeGifUrl = (json: any): string => {
  return json.data.image_url;
}

const getRandomGif = (topic: string): Promise<string> => {
  const url = `//api.giphy.com/v1/gifs/random?api_key=dc6zaTOxFJmzC&tag=${topic}`;
  return fetch(url).then(response => response.json()).then(decodeGifUrl);
}

const testEffect = promiseEffect(
  () => getRandomGif('cats'),
  gifUrl => ({ type: 'FetchSucceed', gifUrl }: Action),
  error => ({ type: 'FetchFail', error }: Action)
);

const a = testEffect;

const init = (topic: string = 'cats'): [Model, Effect<Action>] => [
  {
    topic,
    gifUrl: "waiting.gif"
  },
  promiseEffect(
    () => getRandomGif(topic),
    gifUrl => ({ type: 'FetchSucceed', gifUrl }: Action),
    error => ({ type: 'FetchFail', error }: Action)
  )
];

// UPDATE
export type Action
  = { type: 'LoadAnother' }
  | { type: 'FetchSucceed', gifUrl: string }
  | { type: 'FetchFail', error: any }
;

export type TestAction
  = { type: 'Test' }
;

/*
const update = (model: Model, action: Action): Model => {
  switch (action.type) {
  case 'Increment': return model + 1;
  case 'Decrement': return model - 1;
  default: throw new Error('Unknown action')
  }
}

// VIEW
const countStyle = {
  fontSize: '20px',
  fontFamily: 'monospace',
  display: 'inline-block',
  width: '50px',
  textAlign: 'center'
};

type Props = {
  model: Model,
  dispatch: Dispatch<Action>
};

export const View: Class<React$Component<void, Props, void>> = view(({ model, dispatch }: Props) => (
  <div>
    <button onClick={() => dispatch({ type: 'Decrement' })}>-</button>
    <div style={countStyle}>{model}</div>
    <button onClick={() => dispatch({ type: 'Increment' })}>+</button>
  </div>
));

export default { init, update };
*/

/*
export const View = ({ model, dispatch }: Props) => (
  <div>
    <button onClick={() => dispatch({ type: 'Increment' })}>-</button>
    <div style={countStyle}>{model}</div>
    <button onClick={() => dispatch({ type: 'Decrement' })}>+</button>
  </div>
);
*/

/*
export class View extends React.Component {
  props: Props;

  render() {
    const {model, dispatch} = this.props;
    <div>
      <button onClick={() => dispatch({ type: 'Increment' })}>-</button>
      <div style={countStyle}>{model}</div>
      <button onClick={() => dispatch({ type: 'Decrement' })}>+</button>
    </div>
  }
}
*/

/*
class Counter extends React.Component {
  props: Props;

  render() {
    const {model, dispatch} = this.props;
    <div>
      <button onClick={() => dispatch({ type: 'Increment' })}>-</button>
      <div style={countStyle}>{model}</div>
      <button onClick={() => dispatch({ type: 'Decrement' })}>+</button>
    </div>
  }
}

class Counter1 extends React.Component {
  props: {};

  render() {
    <div>Bla</div>
  }
}

export const View = view(Counter1);
*/
