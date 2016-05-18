import React from 'react';
import { render } from 'react-dom';
import { createStore, compose } from 'redux';
import { Provider, connect } from 'react-redux';
import { install, mapDispatchToAddress } from 'tcomb-redux-elm';

export default (containerDomId, init, update, View, Msg) => {
  const storeFactory = compose(
    install(init, Msg, {devToolsMsg: true}),
    window.devToolsExtension ? window.devToolsExtension() : f => f
  )(createStore);

  const store = storeFactory(update);

  const ConnectedView = connect(appState => ({
    model: appState
  }), mapDispatchToAddress)(View);

  render((
    <Provider store={store}>
      <ConnectedView />
    </Provider>
  ), document.getElementById(containerDomId));
}
