function promise(
  promiseFactory,
  successTagger,
  failTagger
) {
  return {
    type: 'PROMISE',
    factory: promiseFactory,
    successTagger,
    failTagger
  };
}

function none() {
  return {
    type: 'NONE'
  }
}

function map(
  effect,
  tagger
) {
  return {
    type: 'MAP',
    effect,
    tagger
  };
}

function batch(effects) {
  return {
    type: 'BATCH',
    effects
  }
}

export default {
  promise,
  none,
  map,
  batch
}
