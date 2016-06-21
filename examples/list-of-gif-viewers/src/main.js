import React from 'react';
import { render } from 'react-dom';
import { createStore, compose } from 'redux';
import { Provider, connect } from 'react-redux';
import { install, hotReducer } from 'redux-elmish';
import { AppContainer } from 'react-hot-loader'

import GifList, {View as GifListView} from './GifList';

const storeFactory = compose(
  install(GifList.init),
  window.devToolsExtension ? window.devToolsExtension() : f => f
)(createStore);

const store = storeFactory(GifList.update);

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

renderApp(GifListView);

if (module.hot) {
  // Enable Webpack hot module replacement for reducers
  module.hot.accept('./GifList.js', () => {
    const nextGifListDefault = require('./GifList.js').default;
    store.replaceReducer(hotReducer(nextGifListDefault.init, nextGifListDefault.update));

    const NextGifListView = require('./GifList.js').View;
    renderApp(NextGifListView);
  });
}
