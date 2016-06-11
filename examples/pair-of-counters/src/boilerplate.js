import React from 'react';
import { render } from 'react-dom';
import { createStore, compose } from 'redux';
import { Provider, connect } from 'react-redux';

export default (containerDomId, init, update, View) => {
  function reducer(state, action) {
    if (state === undefined) return init();
    return update(state, action);
  }

  const storeFactory = compose(
    window.devToolsExtension ? window.devToolsExtension() : f => f
  )(createStore);

  const store = storeFactory(reducer);

  const ConnectedView = connect(appState => ({
    model: appState
  }))(View);

  render((
    <Provider store={store}>
      <ConnectedView />
    </Provider>
  ), document.getElementById(containerDomId));
}
