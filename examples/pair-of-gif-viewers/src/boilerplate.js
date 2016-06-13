import React from 'react';
import { render } from 'react-dom';
import { createStore, compose } from 'redux';
import { Provider, connect } from 'react-redux';
import { install, loop, Effects } from 'redux-loop';

function toReduxLoopEffect(effect) {
  switch(effect.type) {
    case 'NONE': return Effects.none();
    case 'PROMISE': {
      const factory = () => {
        return effect.factory()
          .then(result => effect.successTagger(result), error => effect.failTagger(error))
      };
      return Effects.promise(factory);
    };
    case 'MAP': {
      return Effects.lift(toReduxLoopEffect(effect.effect), effect.tagger);
    };
    case 'BATCH': {
      return Effects.batch(effect.effects.map(batchedEffect => toReduxLoopEffect(batchedEffect)));
    };
  }
}
function toReduxLoop(reduction) {
  const [newState, effects] = reduction;
  return loop(newState, toReduxLoopEffect(effects));
}

export default (containerDomId, init, update, View) => {
  const initialState = toReduxLoop(init());
  function reducer(state, action) {
    if (action.type === '@@INIT') return state;
    return toReduxLoop(update(state, action));
  }

  const storeFactory = compose(
    install(),
    window.devToolsExtension ? window.devToolsExtension() : f => f
  )(createStore);

  const store = storeFactory(reducer, initialState);

  const ConnectedView = connect(appState => ({
    model: appState
  }))(View);

  render((
    <Provider store={store}>
      <ConnectedView />
    </Provider>
  ), document.getElementById(containerDomId));
}
