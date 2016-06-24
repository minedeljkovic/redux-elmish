const isEffectSymbol = Symbol('isEffect');

export function isEffect(object) {
  return object ? object[isEffectSymbol] : false;
}

function promise(
  promiseFactory,
  successTagger,
  failTagger
) {
  return {
    type: 'PROMISE',
    factory: promiseFactory,
    successTagger,
    failTagger,
    [isEffectSymbol]: true
  };
}

function none() {
  return {
    type: 'NONE',
    [isEffectSymbol]: true
  }
}

function map(
  effect,
  tagger
) {
  return {
    type: 'MAP',
    effect,
    tagger,
    [isEffectSymbol]: true
  };
}

function batch(effects) {
  return {
    type: 'BATCH',
    effects,
    [isEffectSymbol]: true
  }
}

export default {
  promise,
  none,
  map,
  batch
}
