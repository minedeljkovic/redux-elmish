import { install as loopInstall, loop, Effects } from 'redux-loop';

function isReduxAction(action) {
  return (action.type != null) && (action.type.indexOf('@@redux/') === 0 || action.type === '@@INIT'); // eslint-disable-line max-len
}

function toReduxLoopEffect(effect) { // eslint-disable-line consistent-return
  switch (effect.type) { // eslint-disable-line default-case
    case 'NONE': return Effects.none();
    case 'PROMISE': {
      const factory = () => { // eslint-disable-line arrow-body-style
        return effect.factory()
          .then(result => effect.successTagger(result), error => effect.failTagger(error));
      };
      return Effects.promise(factory);
    }
    case 'MAP': {
      return Effects.lift(toReduxLoopEffect(effect.effect), effect.tagger);
    }
    case 'BATCH': {
      return Effects.batch(effect.effects.map(batchedEffect => toReduxLoopEffect(batchedEffect)));
    }
  }
}

function toReduxLoop(reduction) {
  const [newState, effects] = reduction;
  return loop(newState, toReduxLoopEffect(effects));
}

export function hotReducer(init, update) {
  return (state, action) => {
    if (isReduxAction(action)) return toReduxLoop(init());
    return toReduxLoop(update(state, action));
  };
}

export default function install(init) {
  return (createStore) => (update, initialState, enhancer) => {
    initialState = initialState || toReduxLoop(init()); // eslint-disable-line no-param-reassign
    function reducer(state, action) {
      if (isReduxAction(action)) return state;
      return toReduxLoop(update(state, action));
    }

    const loopEnhancer = loopInstall();
    return loopEnhancer(createStore)(reducer, initialState, enhancer);
  };
}
