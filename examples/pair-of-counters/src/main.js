import React from 'react';
import { render } from 'react-dom';
import { createStore, compose } from 'redux';
import { Provider, connect } from 'react-redux';
import { install, hotReducer, Effects } from 'redux-elmish';
import { AppContainer } from 'react-hot-loader'

import CounterPair, {View as CounterPairView} from './CounterPair';

const initWithFx = (init) => () => [init(), Effects.none()];
const updateWithFx = (update) => (state, action) => [update(state, action), Effects.none()];

const storeFactory = compose(
  install(initWithFx(CounterPair.init)),
  window.devToolsExtension ? window.devToolsExtension() : f => f
)(createStore);
const store = storeFactory(updateWithFx(CounterPair.update));

const renderApp = (View) => {
  render((
    <AppContainer>
      <Provider store={store}>
        {React.createElement(connect(appState => ({
          model: appState
        }))(View))}
      </Provider>
    </AppContainer>
  ), document.getElementById('app'));
}
renderApp(CounterPairView);

if (module.hot) {
  // Enable Webpack hot module replacement for reducers
  module.hot.accept('./CounterPair.js', () => {
    const nextDefault = require('./CounterPair.js').default;
    store.replaceReducer(hotReducer(initWithFx(nextDefault.init), updateWithFx(nextDefault.update)));
    const NextView = require('./CounterPair.js').View;
    renderApp(NextView);
  });
}
