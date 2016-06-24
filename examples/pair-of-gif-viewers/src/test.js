import React from 'react';
import { render } from 'react-dom';
import { createStore, compose } from 'redux';
import { Provider, connect } from 'react-redux';
import { install, hotReducer } from 'redux-elmish';
import { AppContainer } from 'react-hot-loader'

import Tester, {View as TesterView} from './tester';

const storeFactory = compose(
  install(Tester.init),
  window.devToolsExtension ? window.devToolsExtension() : f => f
)(createStore);
const store = storeFactory(Tester.update);

const renderApp = (View) => {
  const ConnectedView = connect(appState => ({ model: appState }))(View);

  render((
    <AppContainer>
      <Provider store={store}>
        <div>
          <ConnectedView />
        </div>
      </Provider>
    </AppContainer>
  ), document.getElementById('app'));
}
renderApp(TesterView);

if (module.hot) {
  // Enable Webpack hot module replacement for reducers
  module.hot.accept('./tester', () => {
    const nextDefault = require('./tester').default;
    store.replaceReducer(hotReducer(nextDefault.init, nextDefault.update));
    const NextView = require('./tester').View;
    renderApp(NextView);
  });
}
