import React from 'react';
import { render } from 'react-dom';
import { createStore, compose } from 'redux';
import { Provider, connect } from 'react-redux';
import { install, hotReducer, Effects } from 'redux-elmish';
import { AppContainer } from 'react-hot-loader'

import CounterList, {View as CounterListView} from './CounterList';

const initWithFx = (init) => () => [init(), Effects.none()];
const updateWithFx = (update) => (state, action) => [update(state, action), Effects.none()];
const storeFactory = compose(
  install(initWithFx(CounterList.init)),
  window.devToolsExtension ? window.devToolsExtension() : f => f
)(createStore);
const store = storeFactory(updateWithFx(CounterList.update));
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
renderApp(CounterListView);
if (module.hot) {
  // Enable Webpack hot module replacement for reducers
  module.hot.accept('./CounterList.js', () => {
    const nextDefault = require('./CounterList.js').default;
    store.replaceReducer(hotReducer(initWithFx(nextDefault.init), updateWithFx(nextDefault.update)));
    const NextView = require('./CounterList.js').View;
    renderApp(NextView);
  });
}
