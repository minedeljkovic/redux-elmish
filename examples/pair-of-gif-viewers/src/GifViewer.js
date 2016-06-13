// @flow

import React from 'react';
import type {Dispatch} from './dispatch';
import view from './view';
import type {Effect} from './effects';
import Effects from './effects';

// MODEL
export type Model = {
  topic: string,
  gifUrl: string
};

const decodeGifUrl = (json) => {
  return (json.data.image_url: string);
}

const getRandomGif = (topic) => {
  const url = `//api.giphy.com/v1/gifs/random?api_key=dc6zaTOxFJmzC&tag=${topic}`;
  return Effects.promise(
    () => fetch(url).then(response => response.json()).then(decodeGifUrl),
    gifUrl => ({ type: 'FetchSucceed', gifUrl }),
    error => ({ type: 'FetchFail', error })
  );
}

const init = (topic: string = 'cats'): [Model, Effect<Action>] => [
  {
    topic,
    gifUrl: "waiting.gif"
  },
  getRandomGif(topic)
];

// UPDATE
export type Action
  = { type: 'LoadAnother' }
  | { type: 'FetchSucceed', gifUrl: string }
  | { type: 'FetchFail', error: any }
;

const update = (model: Model, action: Action): [Model, Effect<Action>] => {
  switch (action.type) {
  case 'LoadAnother': return [
    model,
    getRandomGif(model.topic)
  ];
  case 'FetchSucceed': return [
    { ...model, gifUrl: action.gifUrl },
    Effects.none()
  ]
  case 'FetchFail': return [
    model,
    Effects.none()
  ]
  default: throw new Error('Unknown action')
  }
}

// VIEW
type Props = {
  model: Model,
  dispatch: Dispatch<Action>
};

export const View: Class<React$Component<void, Props, void>> = view(({ model, dispatch }: Props) => (
  <div style={{ width: '200px' }}>
    <h2 style={{ width: '200px', textAlign: 'center' }}>{model.topic}</h2>
    <img role="presentation" src={model.gifUrl} width="200" height="200" />
    <button onClick={() => dispatch({ type: 'LoadAnother' })}>More Please!</button>
  </div>
));

export default { init, update };
