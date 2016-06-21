import React from 'react';
import { render } from 'react-dom';
import { createStore, compose } from 'redux';
import { Provider, connect } from 'react-redux';
import { install, hotReducer } from 'redux-elmish';
import { AppContainer } from 'react-hot-loader'

import GifPair, {View as GifPairView} from './GifPair';

const storeFactory = compose(
  install(GifPair.init),
  window.devToolsExtension ? window.devToolsExtension() : f => f
)(createStore);
const store = storeFactory(GifPair.update);

const renderApp = (View) => {
  const ConnectedView = connect(appState => ({ model: appState }))(View);

  render((
    <AppContainer>
      <Provider store={store}>
        <ConnectedView />
      </Provider>
    </AppContainer>
  ), document.getElementById('app'));
}
renderApp(GifPairView);

if (module.hot) {
  // Enable Webpack hot module replacement for reducers
  module.hot.accept('./GifPair.js', () => {
    const nextDefault = require('./GifPair.js').default;
    store.replaceReducer(hotReducer(nextDefault.init, nextDefault.update));
    const NextView = require('./GifPair.js').View;
    renderApp(NextView);
  });
}
