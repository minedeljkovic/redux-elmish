import React from 'react';
import { render } from 'react-dom';
import { createStore, compose } from 'redux';
import { Provider, connect } from 'react-redux';
import t from 'tcomb';
import fromJSON from 'tcomb/lib/fromJSON';

function fromDevToolsFriendly(action, Msg) {
  const msg = {};
  let splitIndex = action.type.indexOf('.');
  const type = action.type.substring(0, (splitIndex != -1) ? splitIndex : undefined);
  let typeRest = action.type.substring(splitIndex + 1);
  const tag = Msg.meta.types.find(t => t.meta.name === type);
  msg.type = tag.meta.name;
  // TODO: payload
  tag.meta.types.forEach((t, index) => {
    if (t.meta.kind === 'union' && t.meta.isMsg) {
      msg[`_${index}`] = fromDevToolsFriendly({...action, type: typeRest}, t);
    } else {
      splitIndex = typeRest.indexOf('.');
      const value = typeRest.substring(0, (splitIndex != -1) ? splitIndex : undefined);
      typeRest = typeRest.substring(splitIndex + 1);
      msg[`_${index}`] = fromJSON(JSON.parse(value), t);
    }
  })
  return msg;
}
const isSubmsg = (x) => {
  // TODO: primenjen je hack za razlucivanje da li je submsg, tako sto se gleda da ima svojstvo type
  // to nije dovoljno dobro, jer obican payload moze da ima to svojstvo!
  // mora se u ovo ukljuciti definicija message-a
  return x.type !== undefined;
}
const hasSubmsg = (msg) => {
  return Object.keys(msg).some(key => isSubmsg(msg[key]));
};
function toDevToolsFriendly(msg) {
  if (hasSubmsg(msg) === false) {
    return Object.keys(msg).reduce((memo, key) => {
      if (key === '_0') {
        memo.payload = msg[key];
      } else if (key === '_1') {
        delete memo.payload;
        memo.p0 = msg['_0'];
        memo.p1 = msg[key];
      } else if (key.startsWith('_')) {
        memo[`p${key.substring(1)}`];
      }

      return memo;
    }, msg);
  }

  let friendlyType = msg.type;
  let friendlyMessage;
  Object.keys(msg).forEach((key) => {
    if (isSubmsg(msg[key])) {
      friendlyType = friendlyType.concat(`.${msg[key].type}`);
      friendlyMessage = {
        ...msg[key],
        type: friendlyType
      }
    } else if (key !== 'type') {
      friendlyType = friendlyType.concat(`.${JSON.stringify(msg[key])}`);
    }
  });
  return toDevToolsFriendly(friendlyMessage);
}

export default (containerDomId, init, update, View, Msg) => {
  
  const reducer = (state, action) => {
    if (state == undefined) return init();
    if (process.env.NODE_ENV !== 'production') {
      action = fromDevToolsFriendly(action, Msg);
    }
    return update(state, action);
  }

  const mapDispatchToAddress = (dispatch) => ({
    address: (msg) => {
      if (process.env.NODE_ENV !== 'production') {
        msg = toDevToolsFriendly(msg);
      }
      dispatch(msg);
    }
  });

  const storeFactory = compose(
    window.devToolsExtension ? window.devToolsExtension() : f => f
  )(createStore);

  const store = storeFactory(reducer);

  const ConnectedView = connect(appState => ({
    model: appState
  }), mapDispatchToAddress)(View);

  render((
    <Provider store={store}>
      <ConnectedView />
    </Provider>
  ), document.getElementById(containerDomId));
}
