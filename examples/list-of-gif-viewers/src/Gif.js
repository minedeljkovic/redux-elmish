// @flow

import React from 'react';
import type {Dispatch, Effect, PureView} from 'redux-elmish';
import {view, Effects, assertNever} from 'redux-elmish';

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
  { topic, gifUrl: '/assets/waiting.gif' },
  getRandomGif(topic)
];

// UPDATE
export type Action
  = { type: 'MorePlease' }
  | { type: 'FetchSucceed', gifUrl: string }
  | { type: 'FetchFail', error: any }
;

const update = (model: Model, action: Action): [Model, Effect<Action>] => {
  switch (action.type) {
  case 'MorePlease': return [
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
  default: return assertNever(action.type);
  }
}

// VIEW
const imgStyle = url => ({
  display: 'inline-block',
  width: '200px',
  height: '200px',
  backgroundPosition: 'center center',
  backgroundSize: 'cover',
  backgroundImage: 'url(' + url + ')'
});

type Props = {
  model: Model,
  dispatch: Dispatch<Action>
};

export const View: PureView<Props> = view(({ model, dispatch }) => (
  <div>
    <h2>{model.topic}</h2>
    <img style={imgStyle(model.gifUrl)} />
    <button onClick={() => dispatch({ type: 'MorePlease' })}>More Please!</button>
  </div>
));

export default { init, update };
